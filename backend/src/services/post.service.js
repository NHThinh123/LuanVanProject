require("dotenv").config();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Category = require("../models/category.model");
const User_Like_Post = require("../models/user_like_post.model");
const UserFollow = require("../models/user_follow.model");
const SearchHistory = require("../models/search_history.model");
const Post_Tag = require("../models/post_tag.model");
const Document = require("../models/document.model");
const { getDocumentsByPostService } = require("./document.service");
const { getCommentsByPostService } = require("./comment.service");
const { getTagsByPostService } = require("./post_tag.service");
const { checkUserFollowService } = require("./user_follow.service");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const cheerio = require("cheerio");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Hàm loại bỏ thẻ <img> khỏi chuỗi HTML bằng cheerio
const removeImagesFromContent = (htmlContent) => {
  if (!htmlContent) return "";
  try {
    const $ = cheerio.load(htmlContent);
    $("img").remove();
    return $.html("body").replace(/^<body>|<\/body>$/g, "");
  } catch (error) {
    console.error("Lỗi khi loại bỏ thẻ <img> khỏi content:", error);
    return htmlContent; // Trả về nội dung gốc nếu có lỗi
  }
};

const createPostService = async (user_id, postData) => {
  try {
    const { course_id, category_id, title, content, imageUrls = [] } = postData;

    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Khóa học không tồn tại", EC: 1 };
      }
    }

    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Danh mục không tồn tại", EC: 1 };
      }
    }

    const wordCount = content.split(/\s+/).length;
    let summary = "";
    let status = "pending";
    let reason = "";

    if (wordCount > 100) {
      const summaryResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Tóm tắt bài viết sau thành 50-60 từ để review ngắn gọn nội dung bài viết để người dùng xem trước, kết quả trả về là tiếng Việt:\nTiêu đề: ${title}\nNội dung: ${content}`,
      });
      summary = summaryResult.text;
    }

    // Loại bỏ thẻ <img> khỏi content trước khi kiểm duyệt
    const cleanedContent = removeImagesFromContent(content);

    const moderationPrompt = `
      Kiểm tra nội dung văn bản của bài viết sau và xác định xem có phù hợp với tiêu chuẩn cộng đồng không. 
      Chỉ kiểm duyệt nội dung văn bản, bỏ qua bất kỳ liên kết, liên kết hình ảnh hoặc nội dung đa phương tiện.
      Nội dung không được chứa bạo lực, ngôn từ phản cảm, nội dung chính trị, hoặc bất kỳ nội dung không phù hợp nào.
      Trả về định dạng JSON thuần túy, không sử dụng markdown hoặc ký tự đặc biệt như \`\`\`:
      {
        "status": "accepted" hoặc "pending",
        "reason": "Lý do từ chối nếu status là pending, nếu không thì để trống"
      }
      Tiêu đề: ${title}
      Nội dung văn bản: ${cleanedContent}
    `;
    const moderationResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: moderationPrompt,
    });

    // Debug: Log toàn bộ nội dung trả về từ API
    console.log("Raw moderationResult.text:", moderationResult.text);

    let moderationData;
    try {
      // Loại bỏ markdown hoặc ký tự không mong muốn
      const cleanedText = moderationResult.text
        .replace(/```json\n|```/g, "") // Xóa ```json và ```
        .replace(/`/g, "") // Xóa dấu nháy ngược
        .trim();
      moderationData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Lỗi khi phân tích JSON từ moderationResult:", parseError);
      console.error("Nội dung gốc:", moderationResult.text);
      moderationData = {
        status: "pending",
        reason: "Không thể phân tích kết quả kiểm duyệt",
      };
    }

    status = moderationData.status;
    reason = moderationData.reason || "";

    if (!["accepted", "pending"].includes(status)) {
      status = "pending";
      reason = reason || "Kết quả kiểm duyệt không hợp lệ";
    }

    if (status === "pending") {
      console.log(`Lý do từ chối bài viết (user_id: ${user_id}): ${reason}`);
    }

    const post = await Post.create({
      user_id,
      course_id,
      category_id,
      title,
      content, // Lưu content gốc, bao gồm thẻ <img>
      summary,
      status,
    });

    // Tạo các bản ghi Document cho các ảnh
    if (imageUrls.length > 0) {
      const documents = imageUrls.map((url) => ({
        post_id: post._id,
        type: "image",
        document_url: url,
      }));
      await Document.insertMany(documents);
    }

    return {
      message:
        status === "accepted"
          ? "Tạo bài viết thành công"
          : "Bài viết đã được tạo nhưng đang chờ duyệt",
      EC: 0,
      data: post,
      ...(status === "pending" && { reason }),
    };
  } catch (error) {
    console.error("Error in createPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updatePostService = async (user_id, post_id, postData) => {
  try {
    const { course_id, category_id, title, content } = postData;

    const post = await Post.findOne({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Khóa học không tồn tại", EC: 1 };
      }
    }

    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Danh mục không tồn tại", EC: 1 };
      }
    }

    if (title || content) {
      const wordCount = (content || post.content).split(/\s+/).length;
      if (wordCount > 100) {
        const summaryPrompt = `Tóm tắt bài viết sau thành 30-40 từ:\nTiêu đề: ${
          title || post.title
        }\nNội dung: ${content || post.content}`;
        const summaryResult = await ai.models.generateContent(summaryPrompt);
        post.summary = summaryResult.text;
      } else {
        post.summary = "";
      }

      // Loại bỏ thẻ <img> khỏi content trước khi kiểm duyệt
      const cleanedContent = removeImagesFromContent(content || post.content);

      const moderationPrompt = `
        Kiểm tra nội dung văn bản của bài viết sau và xác định xem có phù hợp với tiêu chuẩn cộng đồng không. 
        Chỉ kiểm duyệt nội dung văn bản, bỏ qua bất kỳ liên kết hình ảnh hoặc nội dung đa phương tiện.
        Nội dung không được chứa bạo lực, ngôn từ phản cảm, nội dung chính trị, hoặc bất kỳ nội dung không phù hợp nào.
        Trả về định dạng JSON thuần túy, không sử dụng markdown hoặc ký tự đặc biệt như \`\`\`:
        {
          "status": "accepted" hoặc "pending",
          "reason": "Lý do từ chối nếu status là pending, nếu không thì để trống"
        }
        Tiêu đề: ${title || post.title}
        Nội dung văn bản: ${cleanedContent}
      `;
      const moderationResult = await ai.models.generateContent(
        moderationPrompt
      );

      // Debug: Log toàn bộ nội dung trả về từ API
      console.log("Raw moderationResult.text:", moderationResult.text);

      let moderationData;
      try {
        // Loại bỏ markdown hoặc ký tự không mong muốn
        const cleanedText = moderationResult.text
          .replace(/```json\n|```/g, "") // Xóa ```json và ```
          .replace(/`/g, "") // Xóa dấu nháy ngược
          .trim();
        moderationData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error(
          "Lỗi khi phân tích JSON từ moderationResult:",
          parseError
        );
        console.error("Nội dung gốc:", moderationResult.text);
        moderationData = {
          status: "pending",
          reason: "Không thể phân tích kết quả kiểm duyệt",
        };
      }

      post.status = moderationData.status;
      reason = moderationData.reason || "";

      if (!["accepted", "pending"].includes(post.status)) {
        post.status = "pending";
        reason = reason || "Kết quả kiểm duyệt không hợp lệ";
      }

      if (post.status === "pending") {
        console.log(
          `Lý do từ chối bài viết (post_id: ${post_id}, user_id: ${user_id}): ${reason}`
        );
      }
    }

    post.course_id = course_id || post.course_id;
    post.category_id = category_id || post.category_id;
    post.title = title || post.title;
    post.content = content || post.content; // Lưu content gốc, bao gồm thẻ <img>
    await post.save();

    return {
      message:
        post.status === "accepted"
          ? "Cập nhật bài viết thành công"
          : "Bài viết đã được cập nhật nhưng đang chờ duyệt",
      EC: 0,
      data: post,
      ...(post.status === "pending" && { reason }),
    };
  } catch (error) {
    console.error("Error in updatePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deletePostService = async (user_id, post_id) => {
  try {
    const post = await Post.findOneAndDelete({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    return {
      message: "Xóa bài viết thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deletePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostsService = async (query) => {
  try {
    const {
      user_id,
      course_id,
      category_id,
      status,
      page = 1,
      limit = 10,
      current_user_id,
      $or,
    } = query;
    const filter = {};

    if (user_id) filter.user_id = user_id;
    if (course_id) filter.course_id = course_id;
    if (category_id) filter.category_id = category_id;
    if (status) filter.status = status;
    if ($or) filter.$or = $or;

    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [
          documentsResult,
          tagsResult,
          likesResult,
          commentsResult,
          likeStatus,
          followersCount,
          followStatus,
        ] = await Promise.all([
          getDocumentsByPostService(post._id),
          getTagsByPostService(post._id),
          User_Like_Post.find({ post_id: post._id }),
          getCommentsByPostService(post._id, { page: 1, limit: 0 }),
          current_user_id
            ? User_Like_Post.findOne({
                user_id: current_user_id,
                post_id: post._id,
              })
            : null,
          UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
          current_user_id && current_user_id !== post.user_id._id.toString()
            ? checkUserFollowService(current_user_id, post.user_id._id)
            : null,
        ]);
        const image =
          documentsResult.EC === 0 && documentsResult.data.length > 0
            ? documentsResult.data.find((doc) => doc.type === "image")
                ?.document_url ||
              "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          user_id: {
            ...post.user_id._doc,
            followers_count: followersCount,
            isFollowing:
              current_user_id && current_user_id !== post.user_id._id.toString()
                ? followStatus.EC === 0
                  ? followStatus.data.following
                  : false
                : false,
          },
          image,
          tags:
            tagsResult.EC === 0
              ? tagsResult.data.map((tag) => tag.tag_id.tag_name)
              : [],
          likeCount: likesResult.length,
          isLiked: current_user_id ? !!likeStatus : false,
          commentCount:
            commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        };
      })
    );

    return {
      message: "Lấy danh sách bài viết thành công",
      EC: 0,
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getPostsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostByIdService = async (post_id, current_user_id) => {
  try {
    const post = await Post.findById(post_id)
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name");

    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    const [
      documentsResult,
      tagsResult,
      likesResult,
      commentsResult,
      likeStatus,
      followersCount,
      followStatus,
    ] = await Promise.all([
      getDocumentsByPostService(post_id),
      getTagsByPostService(post_id),
      User_Like_Post.find({ post_id }),
      getCommentsByPostService(post_id, { page: 1, limit: 0 }),
      current_user_id
        ? User_Like_Post.findOne({ user_id: current_user_id, post_id })
        : null,
      UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
      current_user_id && current_user_id !== post.user_id._id.toString()
        ? checkUserFollowService(current_user_id, post.user_id._id)
        : null,
    ]);

    return {
      message: "Lấy thông tin bài viết thành công",
      EC: 0,
      data: {
        ...post._doc,
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? followStatus.EC === 0
                ? followStatus.data.following
                : false
              : false,
        },
        documents: documentsResult.EC === 0 ? documentsResult.data : [],
        tags:
          tagsResult.EC === 0
            ? tagsResult.data.map((tag) => tag.tag_id.tag_name)
            : [],
        likeCount: likesResult.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount:
          commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
      },
    };
  } catch (error) {
    console.error("Error in getPostByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updatePostStatusService = async (post_id, status, admin_id) => {
  try {
    const admin = await User.findById(admin_id);
    if (!admin || admin.role !== "admin") {
      return { message: "Không có quyền thực hiện hành động này", EC: 1 };
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    if (!["accepted", "rejected"].includes(status)) {
      return { message: "Trạng thái không hợp lệ", EC: 1 };
    }

    post.status = status;
    await post.save();

    return {
      message: `Cập nhật trạng thái bài viết thành ${status} thành công`,
      EC: 0,
      data: post,
    };
  } catch (error) {
    console.error("Error in updatePostStatusService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getRecommendedPostsService = async (query) => {
  try {
    const { user_id, page = 1, limit = 10, current_user_id } = query;

    const response = await axios.get(
      `http://localhost:8000/recommendations/surprise/${user_id}?n=${limit}`
    );
    const {
      user_id: response_user_id,
      recommendations,
      debug_info,
    } = response.data;

    if (response_user_id !== user_id) {
      console.error(
        `User ID mismatch: requested=${user_id}, received=${response_user_id}`
      );
      return { message: "User ID không khớp", EC: -1 };
    }

    if (recommendations.length === 0) {
      const searchHistory = await SearchHistory.find({ user_id })
        .sort({ createdAt: -1 })
        .limit(5);
      if (searchHistory.length > 0) {
        const keywords = searchHistory.map((item) => item.keyword);

        const postsResult = await getPostsService({
          status: "accepted",
          page,
          limit,
          current_user_id,
          $or: [
            { title: { $regex: keywords.join("|"), $options: "i" } },
            { content: { $regex: keywords.join("|"), $options: "i" } },
          ],
        });
        const result = postsResult.data.posts.map((post) => ({
          ...post,
          score: null,
        }));
        return {
          message:
            "Lấy danh sách bài viết dựa trên lịch sử tìm kiếm thành công",
          EC: 0,
          data: {
            posts: result,
            pagination: postsResult.data.pagination,
          },
          debug_info: {
            all_posts: [],
            keywords,
          },
        };
      }

      const popularPosts = await getPostsService({
        status: "accepted",
        page,
        limit: Math.ceil(limit / 2),
        current_user_id,
      });

      const randomPosts = await Post.aggregate([
        { $match: { status: "accepted" } },
        { $sample: { size: Math.floor(limit / 2) } },
      ]);
      const randomPostsResult = await getPostsService({
        post_id: { $in: randomPosts.map((p) => p._id) },
        status: "accepted",
        current_user_id,
      });

      const result = [
        ...popularPosts.data.posts.map((post) => ({ ...post, score: null })),
        ...randomPostsResult.data.posts.map((post) => ({
          ...post,
          score: null,
        })),
      ].slice(0, limit);

      return {
        message: "Lấy danh sách bài viết phổ biến và ngẫu nhiên thành công",
        EC: 0,
        data: {
          posts: result,
          pagination: {
            page,
            limit,
            total: result.length,
            totalPages: Math.ceil(result.length / limit),
          },
        },
        debug_info: {
          all_posts: [],
          keywords: [],
        },
      };
    }

    const postIds = recommendations.map((item) => item.post_id);

    const postsResult = await getPostsService({
      post_id: { $in: postIds },
      status: "accepted",
      current_user_id,
    });

    const postsWithScores = recommendations
      .map((item) => {
        const post = postsResult.data.posts.find(
          (p) => p._id.toString() === item.post_id
        );
        if (!post) {
          return null;
        }
        return {
          ...post,
          score: item.combined_score,
          surprise_score: item.surprise_score,
          keyword_score: item.keyword_score,
        };
      })
      .filter((post) => post !== null);

    return {
      message: "Lấy danh sách bài viết đề xuất thành công",
      EC: 0,
      data: {
        posts: postsWithScores,
        pagination: {
          page,
          limit,
          total: postsWithScores.length,
          totalPages: Math.ceil(postsWithScores.length / limit),
        },
      },
      user_id,
      debug_info,
    };
  } catch (error) {
    console.error("Error in getRecommendedPostsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const searchPostsService = async ({
  keyword,
  page = 1,
  limit = 10,
  current_user_id,
}) => {
  try {
    const skip = (page - 1) * limit;

    const posts = await Post.find(
      {
        $text: { $search: keyword },
        status: "accepted",
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, createdAt: -1 })
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      $text: { $search: keyword },
      status: "accepted",
    });

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [
          documentsResult,
          tagsResult,
          likesResult,
          commentsResult,
          likeStatus,
          followersCount,
          followStatus,
        ] = await Promise.all([
          getDocumentsByPostService(post._id),
          getTagsByPostService(post._id),
          User_Like_Post.find({ post_id: post._id }),
          getCommentsByPostService(post._id, { page: 1, limit: 0 }),
          current_user_id
            ? User_Like_Post.findOne({
                user_id: current_user_id,
                post_id: post._id,
              })
            : null,
          UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
          current_user_id && current_user_id !== post.user_id._id.toString()
            ? checkUserFollowService(current_user_id, post.user_id._id)
            : null,
        ]);
        const image =
          documentsResult.EC === 0 && documentsResult.data.length > 0
            ? documentsResult.data.find((doc) => doc.type === "image")
                ?.document_url
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          user_id: {
            ...post.user_id._doc,
            followers_count: followersCount,
            isFollowing:
              current_user_id && current_user_id !== post.user_id._id.toString()
                ? followStatus.EC === 0
                  ? followStatus.data.following
                  : false
                : false,
          },
          image,
          tags:
            tagsResult.EC === 0
              ? tagsResult.data.map((tag) => tag.tag_id.tag_name)
              : [],
          likeCount: likesResult.length,
          isLiked: current_user_id ? !!likeStatus : false,
          commentCount:
            commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        };
      })
    );

    return {
      message: "Tìm kiếm bài viết thành công",
      EC: 0,
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in searchPostsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostsByTagService = async ({
  tag_id,
  page = 1,
  limit = 10,
  current_user_id,
}) => {
  try {
    const skip = (page - 1) * limit;

    const postTags = await Post_Tag.find({ tag_id }).skip(skip).limit(limit);

    if (!postTags || postTags.length === 0) {
      return {
        message: "Không tìm thấy bài viết nào cho thẻ này",
        EC: 1,
        data: {
          posts: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
      };
    }

    const postIds = postTags.map((pt) => pt.post_id);

    const posts = await Post.find({
      _id: { $in: postIds },
      status: "accepted",
    })
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort({ createdAt: -1 });

    const total = await Post_Tag.countDocuments({ tag_id });

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [
          documentsResult,
          tagsResult,
          likesResult,
          commentsResult,
          likeStatus,
          followersCount,
          followStatus,
        ] = await Promise.all([
          getDocumentsByPostService(post._id),
          getTagsByPostService(post._id),
          User_Like_Post.find({ post_id: post._id }),
          getCommentsByPostService(post._id, { page: 1, limit: 0 }),
          current_user_id
            ? User_Like_Post.findOne({
                user_id: current_user_id,
                post_id: post._id,
              })
            : null,
          UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
          current_user_id && current_user_id !== post.user_id._id.toString()
            ? checkUserFollowService(current_user_id, post.user_id._id)
            : null,
        ]);
        const image =
          documentsResult.EC === 0 && documentsResult.data.length > 0
            ? documentsResult.data.find((doc) => doc.type === "image")
                ?.document_url ||
              "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          user_id: {
            ...post.user_id._doc,
            followers_count: followersCount,
            isFollowing:
              current_user_id && current_user_id !== post.user_id._id.toString()
                ? followStatus.EC === 0
                  ? followStatus.data.following
                  : false
                : false,
          },
          image,
          tags:
            tagsResult.EC === 0
              ? tagsResult.data.map((tag) => tag.tag_id.tag_name)
              : [],
          likeCount: likesResult.length,
          isLiked: current_user_id ? !!likeStatus : false,
          commentCount:
            commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        };
      })
    );

    return {
      message: "Lấy danh sách bài viết theo thẻ thành công",
      EC: 0,
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getPostsByTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getFollowingPostsService = async ({
  current_user_id,
  page = 1,
  limit = 10,
}) => {
  try {
    const skip = (page - 1) * limit;

    const following = await UserFollow.find({
      user_id: current_user_id,
    }).select("user_follow_id");
    const followingIds = following.map((f) => f.user_follow_id);

    if (!followingIds || followingIds.length === 0) {
      return {
        message:
          "Bạn chưa theo dõi ai hoặc không có bài viết nào từ người bạn theo dõi",
        EC: 1,
        data: {
          posts: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
      };
    }

    const posts = await Post.find({
      user_id: { $in: followingIds },
      status: "accepted",
    })
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      user_id: { $in: followingIds },
      status: "accepted",
    });

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [
          documentsResult,
          tagsResult,
          likesResult,
          commentsResult,
          likeStatus,
          followersCount,
          followStatus,
        ] = await Promise.all([
          getDocumentsByPostService(post._id),
          getTagsByPostService(post._id),
          User_Like_Post.find({ post_id: post._id }),
          getCommentsByPostService(post._id, { page: 1, limit: 0 }),
          current_user_id
            ? User_Like_Post.findOne({
                user_id: current_user_id,
                post_id: post._id,
              })
            : null,
          UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
          current_user_id && current_user_id !== post.user_id._id.toString()
            ? checkUserFollowService(current_user_id, post.user_id._id)
            : null,
        ]);
        const image =
          documentsResult.EC === 0 && documentsResult.data.length > 0
            ? documentsResult.data.find((doc) => doc.type === "image")
                ?.document_url ||
              "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          user_id: {
            ...post.user_id._doc,
            followers_count: followersCount,
            isFollowing:
              current_user_id && current_user_id !== post.user_id._id.toString()
                ? followStatus.EC === 0
                  ? followStatus.data.following
                  : false
                : false,
          },
          image,
          tags:
            tagsResult.EC === 0
              ? tagsResult.data.map((tag) => tag.tag_id.tag_name)
              : [],
          likeCount: likesResult.length,
          isLiked: current_user_id ? !!likeStatus : false,
          commentCount:
            commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        };
      })
    );

    return {
      message: "Lấy danh sách bài viết từ người dùng đang theo dõi thành công",
      EC: 0,
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getFollowingPostsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
  getRecommendedPostsService,
  searchPostsService,
  getPostsByTagService,
  getFollowingPostsService,
};
