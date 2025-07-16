require("dotenv").config();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Category = require("../models/category.model");
const User_Like_Post = require("../models/user_like_post.model");
const UserFollow = require("../models/user_follow.model");
const SearchHistory = require("../models/search_history.model");
const { getDocumentsByPostService } = require("./document.service");
const { getCommentsByPostService } = require("./comment.service");
const { getTagsByPostService } = require("./post_tag.service");
const { checkUserFollowService } = require("./user_follow.service");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const createPostService = async (user_id, postData) => {
  try {
    const { course_id, category_id, title, content } = postData;

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

    // Count words in content
    const wordCount = content.split(/\s+/).length;
    let summary = "";
    let status = "pending";

    // Generate summary if content is longer than 100 words
    if (wordCount > 100) {
      const summaryResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Tóm tắt bài viết sau thành 50-60 từ để review ngắn gọn nội dung bài viết để người dùng xem trước, kết qảu trả về là tiếng Việt :\nTiêu đề: ${title}\nNội dung: ${content}`,
      });
      summary = summaryResult.text;
    }

    // Check content against community standards

    const moderationResult = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
      Kiểm tra bài viết sau và xác định xem nội dung có phù hợp với tiêu chuẩn cộng đồng không. 
      Nội dung không được chứa bạo lực, ngôn từ phản cảm, nội dung chính trị, hoặc bất kỳ nội dung không phù hợp nào.
      Trả về chỉ một từ: "accepted" nếu phù hợp, hoặc "pending" nếu không phù hợp.
      Tiêu đề: ${title}
      Nội dung: ${content}`,
    });
    status = moderationResult.text;
    console.log("Moderation Result:", moderationResult.text);

    // Validate status
    if (!["accepted", "pending"].includes(status)) {
      status = "pending"; // Default to pending if moderation result is invalid
    }

    const post = await Post.create({
      user_id,
      course_id,
      category_id,
      title,
      content,
      summary, // Store the summary
      status, // Set status based on moderation
    });

    return {
      message: "Tạo bài viết thành công",
      EC: 0,
      data: post,
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

    // Update summary and status if content or title is updated
    if (title || content) {
      const wordCount = (content || post.content).split(/\s+/).length;
      if (wordCount > 100) {
        const summaryPrompt = `Tóm tắt bài viết sau thành 30-40 từ:\nTiêu đề: ${
          title || post.title
        }\nNội dung: ${content || post.content}`;
        const summaryResult = await model.generateContent(summaryPrompt);
        post.summary = summaryResult.response.text().trim();
      } else {
        post.summary = "";
      }

      const moderationPrompt = `
        Kiểm tra bài viết sau và xác định xem nội dung có phù hợp với tiêu chuẩn cộng đồng không. 
        Nội dung không được chứa bạo lực, ngôn từ phản cảm, nội dung chính trị, hoặc bất kỳ nội dung không phù hợp nào.
        Trả về chỉ một từ: "accepted" nếu phù hợp, hoặc "pending" nếu không phù hợp.
        Tiêu đề: ${title || post.title}
        Nội dung: ${content || post.content}
      `;
      const moderationResult = await model.generateContent(moderationPrompt);
      post.status = moderationResult.response.text().trim();

      if (!["accepted", "pending"].includes(post.status)) {
        post.status = "pending";
      }
    }

    post.course_id = course_id || post.course_id;
    post.category_id = category_id || post.category_id;
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    return {
      message: "Cập nhật bài viết thành công",
      EC: 0,
      data: post,
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

    // Gọi API Python để lấy danh sách đề xuất
    const response = await axios.get(
      `http://localhost:8000/recommendations/surprise/${user_id}?n=${limit}`
    );
    const {
      user_id: response_user_id,
      recommendations,
      debug_info,
    } = response.data;

    // Kiểm tra user_id có khớp không
    if (response_user_id !== user_id) {
      console.error(
        `User ID mismatch: requested=${user_id}, received=${response_user_id}`
      );
      return { message: "User ID không khớp", EC: -1 };
    }

    if (recommendations.length === 0) {
      // Cold start: lấy bài viết dựa trên lịch sử tìm kiếm
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

      // Nếu không có lịch sử tìm kiếm, lấy bài viết phổ biến hoặc ngẫu nhiên
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

    // Lấy chi tiết bài viết từ MongoDB
    const postIds = recommendations.map((item) => item.post_id);

    const postsResult = await getPostsService({
      post_id: { $in: postIds },
      status: "accepted",
      current_user_id,
    });

    // Kết hợp điểm số với chi tiết bài viết
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

    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
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
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
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

module.exports = {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
  getRecommendedPostsService,
  searchPostsService,
};
