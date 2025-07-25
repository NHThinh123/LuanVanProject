require("dotenv").config();
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Category = require("../models/category.model");
const User_Like_Post = require("../models/user_like_post.model");
const UserFollow = require("../models/user_follow.model");
const SearchHistory = require("../models/search_history.model");
const Post_Tag = require("../models/post_tag.model");
const Document = require("../models/document.model");
const Comment = require("../models/comment.model");
const { getDocumentsByPostService } = require("./document.service");
const { getTagsByPostService } = require("./post_tag.service");
const { checkUserFollowService } = require("./user_follow.service");
const { getCommentsByPostService } = require("./comment.service");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const cheerio = require("cheerio");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const removeImagesFromContent = (htmlContent) => {
  if (!htmlContent) return "";
  try {
    const $ = cheerio.load(htmlContent);
    $("img").remove();
    return $.html("body").replace(/^<body>|<\/body>$/g, "");
  } catch (error) {
    console.error("Error removing <img> tags from content:", error);
    return htmlContent;
  }
};

const createPostService = async (user_id, postData) => {
  try {
    const { course_id, category_id, title, content, imageUrls = [] } = postData;

    const user = await User.findById(user_id);
    if (!user) {
      return { message: "User not found", EC: 1 };
    }

    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Course not found", EC: 1 };
      }
    }

    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Category not found", EC: 1 };
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

    let moderationData;
    try {
      const cleanedText = moderationResult.text
        .replace(/```json\n|```/g, "")
        .replace(/`/g, "")
        .trim();
      moderationData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Error parsing JSON from moderationResult:", parseError);
      moderationData = {
        status: "pending",
        reason: "Unable to parse moderation result",
      };
    }

    status = moderationData.status;
    reason = moderationData.reason || "";

    if (!["accepted", "pending"].includes(status)) {
      status = "pending";
      reason = reason || "Invalid moderation result";
    }

    const post = await Post.create({
      user_id,
      course_id,
      category_id,
      title,
      content,
      summary,
      status,
      reason,
    });

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
          ? "Post created successfully"
          : "Post created but pending approval",
      EC: 0,
      data: { ...post._doc, reason },
      ...(status === "pending" && { reason }),
    };
  } catch (error) {
    console.error("Error in createPostService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const updatePostService = async (user_id, post_id, postData) => {
  try {
    const {
      course_id,
      category_id,
      title,
      content,
      imageUrls = [],
      status,
      tag_ids = [],
    } = postData;

    const user = await User.findById(user_id);
    if (!user) {
      return { message: "User not found", EC: 1 };
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Post not found", EC: 1 };
    }

    const isAdmin = user.role == "admin";

    if (!isAdmin && post.user_id.toString() !== user_id) {
      return {
        message: "You are not authorized to edit this post",
        EC: 2,
      };
    }

    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Course not found", EC: 1 };
      }
    }

    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Category not found", EC: 1 };
      }
    }

    let newStatus = post.status;
    let reason = post.reason || "";
    if (isAdmin && status) {
      if (!["accepted", "pending", "rejected"].includes(status)) {
        return { message: "Invalid status", EC: 1 };
      }
      newStatus = status;
    } else if (!isAdmin && (title || content)) {
      const wordCount = (content || post.content).split(/\s/).length;
      if (wordCount > 100) {
        const summaryPrompt = `Tóm tắt bài viết sau thành 30-50 từ:\nTiêu đề: ${
          title || post.title
        }\nNội dung: ${content || post.content}`;
        const summaryResult = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: summaryPrompt,
        });
        post.summary = summaryResult.text || "";
      } else {
        post.summary = "";
      }

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
      const moderationResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: moderationPrompt,
      });

      let moderationData;
      try {
        const cleanedText = moderationResult.text
          .replace(/```json\n|```/g, "")
          .replace(/`/g, "")
          .trim();
        moderationData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error("Error parsing JSON from moderationResult:", parseError);
        moderationData = {
          status: "pending",
          reason: "Unable to parse moderation result",
        };
      }

      newStatus = moderationData.status || "pending";
      reason = moderationData.reason || "";

      if (!["accepted", "pending"].includes(newStatus)) {
        newStatus = "pending";
        reason = reason || "Invalid moderation result";
      }
    }

    post.course_id = course_id || post.course_id;
    post.category_id = category_id || post.category_id;
    post.title = title || post.title;
    post.content = content || post.content;
    post.status = newStatus;
    post.reason = reason;

    if (tag_ids.length > 0) {
      await Post_Tag.deleteMany({ post_id: post._id });
      const postTags = tag_ids.map((tag_id) => ({
        post_id: post._id,
        tag_id,
      }));
      await Post_Tag.insertMany(postTags);
    }

    if (imageUrls.length > 0) {
      await Document.deleteMany({ post_id: post._id, type: "image" });
      const documents = imageUrls.map((url) => ({
        post_id: post._id,
        type: "image",
        document_url: url,
      }));
      await Document.insertMany(documents);
    }

    await post.save();

    return {
      message:
        newStatus === "accepted"
          ? "Post updated successfully"
          : "Post updated but pending approval",
      EC: 0,
      data: { ...post._doc, reason },
      ...(newStatus === "pending" && { reason }),
    };
  } catch (error) {
    console.error("Error in updatePostService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const deletePostService = async (user_id, post_id) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "User not found", EC: 1 };
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Post not found", EC: 1 };
    }

    if (user.role !== "admin" && post.user_id.toString() !== user_id) {
      return {
        message: "You are not authorized to delete this post",
        EC: 2,
      };
    }

    await Post.findByIdAndDelete(post_id);
    await Document.deleteMany({ post_id });
    await Post_Tag.deleteMany({ post_id });

    return {
      message: "Post deleted successfully",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deletePostService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const getPostsService = async (query) => {
  const startTime = Date.now();
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
      post_id,
    } = query;
    const filter = {};

    if (user_id) filter.user_id = user_id;
    if (course_id) filter.course_id = course_id;
    if (category_id) filter.category_id = category_id;
    if (status) filter.status = status;
    if ($or) filter.$or = $or;
    if (post_id) {
      if (Array.isArray(post_id)) {
        filter._id = {
          $in: post_id.map((id) => new mongoose.Types.ObjectId(id)),
        };
      } else {
        filter._id = new mongoose.Types.ObjectId(post_id);
      }
    }

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

    const postIds = posts.map((post) => post._id);

    const [
      allDocuments,
      allTags,
      allLikes,
      allCommentCounts,
      allLikeStatuses,
      allFollowersCounts,
      allFollowStatuses,
    ] = await Promise.all([
      Document.find({ post_id: { $in: postIds } }).select(
        "post_id type document_url"
      ),
      Post_Tag.find({ post_id: { $in: postIds } }).populate("tag_id"),
      User_Like_Post.find({ post_id: { $in: postIds } }).select(
        "post_id user_id"
      ),
      Comment.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? User_Like_Post.find({
            user_id: current_user_id,
            post_id: { $in: postIds },
          }).select("post_id")
        : [],
      UserFollow.aggregate([
        {
          $match: { user_follow_id: { $in: posts.map((p) => p.user_id._id) } },
        },
        { $group: { _id: "$user_follow_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? UserFollow.find({
            user_id: current_user_id,
            user_follow_id: { $in: posts.map((p) => p.user_id._id) },
          }).select("user_follow_id")
        : [],
    ]);

    const postsWithDetails = posts.map((post) => {
      const documents = allDocuments.filter(
        (doc) => doc.post_id.toString() === post._id.toString()
      );
      const tags = allTags
        .filter((tag) => tag.post_id.toString() === post._id.toString())
        .map((tag) => ({ _id: tag.tag_id._id, tag_name: tag.tag_id.tag_name }));
      const likes = allLikes.filter(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const commentCount =
        allCommentCounts.find((c) => c._id.toString() === post._id.toString())
          ?.count || 0;
      const likeStatus = allLikeStatuses.find(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const followersCount =
        allFollowersCounts.find(
          (fc) => fc._id.toString() === post.user_id._id.toString()
        )?.count || 0;
      const followStatus = allFollowStatuses.find(
        (fs) => fs.user_follow_id.toString() === post.user_id._id.toString()
      );

      const image =
        documents.length > 0
          ? documents.find((doc) => doc.type === "image")?.document_url ||
            "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
          : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

      return {
        ...post._doc,
        reason: post.reason || "",
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? !!followStatus
              : false,
        },
        image,
        tags,
        likeCount: likes.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount,
      };
    });

    console.log(`getPostsService took ${Date.now() - startTime}ms`);

    return {
      message: "Posts retrieved successfully",
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
    return { message: "Server error", EC: -1 };
  }
};

const getPostByIdService = async (post_id, current_user_id) => {
  const startTime = Date.now();
  try {
    const post = await Post.findById(post_id)
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name");

    if (!post) {
      return { message: "Post not found", EC: 1 };
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
      User_Like_Post.find({ post_id }).select("user_id"),
      getCommentsByPostService(
        post_id,
        { page: 1, limit: 10 },
        current_user_id
      ),
      current_user_id
        ? User_Like_Post.findOne({ user_id: current_user_id, post_id }).select(
            "_id"
          )
        : null,
      UserFollow.countDocuments({ user_follow_id: post.user_id._id }),
      current_user_id && current_user_id !== post.user_id._id.toString()
        ? checkUserFollowService(current_user_id, post.user_id._id)
        : null,
    ]);

    console.log(`getPostByIdService took ${Date.now() - startTime}ms`);

    return {
      message: "Post retrieved successfully",
      EC: 0,
      data: {
        ...post._doc,
        reason: post.reason || "",
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? followStatus?.EC === 0
                ? followStatus.data.following
                : false
              : false,
        },
        documents: documentsResult.EC === 0 ? documentsResult.data : [],
        tags:
          tagsResult.EC === 0
            ? tagsResult.data.map((tag) => ({
                _id: tag.tag_id._id,
                tag_name: tag.tag_id.tag_name,
              }))
            : [],
        likeCount: likesResult.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount:
          commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        comments: commentsResult.EC === 0 ? commentsResult.data.comments : [],
      },
    };
  } catch (error) {
    console.error("Error in getPostByIdService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const updatePostStatusService = async (post_id, status, admin_id) => {
  try {
    const admin = await User.findById(admin_id);
    if (!admin || admin.role !== "admin") {
      return { message: "Not authorized to perform this action", EC: 2 };
    }

    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Post not found", EC: 1 };
    }

    if (!["accepted", "rejected"].includes(status)) {
      return { message: "Invalid status", EC: 1 };
    }

    post.status = status;
    post.reason = status === "rejected" ? "Admin rejected the post" : "";
    await post.save();

    return {
      message: `Post status updated to ${status} successfully`,
      EC: 0,
      data: { ...post._doc, reason: post.reason || "" },
    };
  } catch (error) {
    console.error("Error in updatePostStatusService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const getRecommendedPostsService = async (query) => {
  const startTime = Date.now();
  try {
    const { user_id, page = 1, limit = 10, current_user_id } = query;

    const response = await axios.get(
      `http://localhost:8000/recommendations/surprise/${user_id}?page=${page}&limit=${limit}`
    );
    const {
      user_id: response_user_id,
      recommendations,
      pagination: apiPagination,
      debug_info,
    } = response.data;

    if (response_user_id !== user_id) {
      console.error(
        `User ID mismatch: requested=${user_id}, received=${response_user_id}`
      );
      return { message: "User ID mismatch", EC: -1 };
    }

    if (recommendations.length === 0) {
      const searchHistory = await SearchHistory.find({ user_id })
        .sort({ createdAt: -1 })
        .limit(3);
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
          surprise_score: null,
          keyword_score: null,
          following_score: null,
          course_score: null,
          combined_score: null,
          reason: post.reason || "",
        }));

        console.log(
          `getRecommendedPostsService (search history) took ${
            Date.now() - startTime
          }ms`
        );

        return {
          message: "Posts retrieved based on search history successfully",
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
        post_id: randomPosts.map((p) => p._id),
        status: "accepted",
        current_user_id,
      });

      const result = [
        ...popularPosts.data.posts.map((post) => ({
          ...post,
          surprise_score: null,
          keyword_score: null,
          following_score: null,
          course_score: null,
          combined_score: null,
          reason: post.reason || "",
        })),
        ...randomPostsResult.data.posts.map((post) => ({
          ...post,
          surprise_score: null,
          keyword_score: null,
          following_score: null,
          course_score: null,
          combined_score: null,
          reason: post.reason || "",
        })),
      ].slice(0, limit);

      console.log(
        `getRecommendedPostsService (popular/random) took ${
          Date.now() - startTime
        }ms`
      );

      return {
        message: "Popular and random posts retrieved successfully",
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
      post_id: postIds,
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
          surprise_score: item.surprise_score,
          keyword_score: item.keyword_score,
          following_score: item.following_score,
          course_score: item.course_score,
          combined_score: item.combined_score,
          reason: post.reason || "",
        };
      })
      .filter((post) => post !== null);

    console.log(`getRecommendedPostsService took ${Date.now() - startTime}ms`);

    return {
      message: "Recommended posts retrieved successfully",
      EC: 0,
      data: {
        posts: postsWithScores,
        pagination: apiPagination,
      },
      user_id,
      debug_info,
    };
  } catch (error) {
    console.error("Error in getRecommendedPostsService:", error);
    return { message: "Server error", EC: -1 };
  }
};

const searchPostsService = async ({
  keyword,
  page = 1,
  limit = 10,
  current_user_id,
}) => {
  const startTime = Date.now();
  try {
    const skip = (page - 1) * limit;
    const filter = { status: "accepted" };

    const course = await Course.findOne({ course_code: keyword });
    if (course) {
      filter.course_id = course._id;
    } else {
      filter.$text = { $search: keyword };
    }

    const posts = await Post.find(filter)
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort(
        filter.$text
          ? { score: { $meta: "textScore" }, createdAt: -1 }
          : { createdAt: -1 }
      )
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    const postIds = posts.map((post) => post._id);

    const [
      allDocuments,
      allTags,
      allLikes,
      allCommentCounts,
      allLikeStatuses,
      allFollowersCounts,
      allFollowStatuses,
    ] = await Promise.all([
      Document.find({ post_id: { $in: postIds } }).select(
        "post_id type document_url"
      ),
      Post_Tag.find({ post_id: { $in: postIds } }).populate("tag_id"),
      User_Like_Post.find({ post_id: { $in: postIds } }).select(
        "post_id user_id"
      ),
      Comment.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? User_Like_Post.find({
            user_id: current_user_id,
            post_id: { $in: postIds },
          }).select("post_id")
        : [],
      UserFollow.aggregate([
        {
          $match: { user_follow_id: { $in: posts.map((p) => p.user_id._id) } },
        },
        { $group: { _id: "$user_follow_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? UserFollow.find({
            user_id: current_user_id,
            user_follow_id: { $in: posts.map((p) => p.user_id._id) },
          }).select("user_follow_id")
        : [],
    ]);

    const postsWithDetails = posts.map((post) => {
      const documents = allDocuments.filter(
        (doc) => doc.post_id.toString() === post._id.toString()
      );
      const tags = allTags
        .filter((tag) => tag.post_id.toString() === post._id.toString())
        .map((tag) => ({ _id: tag.tag_id._id, tag_name: tag.tag_id.tag_name }));
      const likes = allLikes.filter(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const commentCount =
        allCommentCounts.find((c) => c._id.toString() === post._id.toString())
          ?.count || 0;
      const likeStatus = allLikeStatuses.find(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const followersCount =
        allFollowersCounts.find(
          (fc) => fc._id.toString() === post.user_id._id.toString()
        )?.count || 0;
      const followStatus = allFollowStatuses.find(
        (fs) => fs.user_follow_id.toString() === post.user_id._id.toString()
      );

      const image =
        documents.length > 0
          ? documents.find((doc) => doc.type === "image")?.document_url ||
            "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
          : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

      return {
        ...post._doc,
        reason: post.reason || "",
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? !!followStatus
              : false,
        },
        image,
        tags,
        likeCount: likes.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount,
      };
    });

    console.log(`searchPostsService took ${Date.now() - startTime}ms`);

    return {
      message: "Search results retrieved successfully",
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
    return { message: "Server error", EC: -1 };
  }
};

const getPostsByTagService = async ({
  tag_id,
  page = 1,
  limit = 10,
  current_user_id,
}) => {
  const startTime = Date.now();
  try {
    const skip = (page - 1) * limit;

    const postTags = await Post_Tag.find({ tag_id }).skip(skip).limit(limit);

    if (!postTags || postTags.length === 0) {
      return {
        message: "No posts found for this tag",
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

    const [
      allDocuments,
      allTags,
      allLikes,
      allCommentCounts,
      allLikeStatuses,
      allFollowersCounts,
      allFollowStatuses,
    ] = await Promise.all([
      Document.find({ post_id: { $in: postIds } }).select(
        "post_id type document_url"
      ),
      Post_Tag.find({ post_id: { $in: postIds } }).populate("tag_id"),
      User_Like_Post.find({ post_id: { $in: postIds } }).select(
        "post_id user_id"
      ),
      Comment.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? User_Like_Post.find({
            user_id: current_user_id,
            post_id: { $in: postIds },
          }).select("post_id")
        : [],
      UserFollow.aggregate([
        {
          $match: { user_follow_id: { $in: posts.map((p) => p.user_id._id) } },
        },
        { $group: { _id: "$user_follow_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? UserFollow.find({
            user_id: current_user_id,
            user_follow_id: { $in: posts.map((p) => p.user_id._id) },
          }).select("user_follow_id")
        : [],
    ]);

    const postsWithDetails = posts.map((post) => {
      const documents = allDocuments.filter(
        (doc) => doc.post_id.toString() === post._id.toString()
      );
      const tags = allTags
        .filter((tag) => tag.post_id.toString() === post._id.toString())
        .map((tag) => ({ _id: tag.tag_id._id, tag_name: tag.tag_id.tag_name }));
      const likes = allLikes.filter(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const commentCount =
        allCommentCounts.find((c) => c._id.toString() === post._id.toString())
          ?.count || 0;
      const likeStatus = allLikeStatuses.find(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const followersCount =
        allFollowersCounts.find(
          (fc) => fc._id.toString() === post.user_id._id.toString()
        )?.count || 0;
      const followStatus = allFollowStatuses.find(
        (fs) => fs.user_follow_id.toString() === post.user_id._id.toString()
      );

      const image =
        documents.length > 0
          ? documents.find((doc) => doc.type === "image")?.document_url ||
            "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
          : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

      return {
        ...post._doc,
        reason: post.reason || "",
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? !!followStatus
              : false,
        },
        image,
        tags,
        likeCount: likes.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount,
      };
    });

    console.log(`getPostsByTagService took ${Date.now() - startTime}ms`);

    return {
      message: "Posts by tag retrieved successfully",
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
    return { message: "Server error", EC: -1 };
  }
};

const getFollowingPostsService = async ({
  current_user_id,
  page = 1,
  limit = 4,
}) => {
  const startTime = Date.now();
  try {
    const skip = (page - 1) * limit;

    const following = await UserFollow.find({
      user_id: current_user_id,
    }).select("user_follow_id");
    const followingIds = following.map((f) => f.user_follow_id);

    if (!followingIds || followingIds.length === 0) {
      return {
        message: "You are not following anyone or no posts from followed users",
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

    const postIds = posts.map((post) => post._id);

    const [
      allDocuments,
      allTags,
      allLikes,
      allCommentCounts,
      allLikeStatuses,
      allFollowersCounts,
      allFollowStatuses,
    ] = await Promise.all([
      Document.find({ post_id: { $in: postIds } }).select(
        "post_id type document_url"
      ),
      Post_Tag.find({ post_id: { $in: postIds } }).populate("tag_id"),
      User_Like_Post.find({ post_id: { $in: postIds } }).select(
        "post_id user_id"
      ),
      Comment.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? User_Like_Post.find({
            user_id: current_user_id,
            post_id: { $in: postIds },
          }).select("post_id")
        : [],
      UserFollow.aggregate([
        {
          $match: { user_follow_id: { $in: posts.map((p) => p.user_id._id) } },
        },
        { $group: { _id: "$user_follow_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? UserFollow.find({
            user_id: current_user_id,
            user_follow_id: { $in: posts.map((p) => p.user_id._id) },
          }).select("user_follow_id")
        : [],
    ]);

    const postsWithDetails = posts.map((post) => {
      const documents = allDocuments.filter(
        (doc) => doc.post_id.toString() === post._id.toString()
      );
      const tags = allTags
        .filter((tag) => tag.post_id.toString() === post._id.toString())
        .map((tag) => ({ _id: tag.tag_id._id, tag_name: tag.tag_id.tag_name }));
      const likes = allLikes.filter(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const commentCount =
        allCommentCounts.find((c) => c._id.toString() === post._id.toString())
          ?.count || 0;
      const likeStatus = allLikeStatuses.find(
        (like) => like.post_id.toString() === post._id.toString()
      );
      const followersCount =
        allFollowersCounts.find(
          (fc) => fc._id.toString() === post.user_id._id.toString()
        )?.count || 0;
      const followStatus = allFollowStatuses.find(
        (fs) => fs.user_follow_id.toString() === post.user_id._id.toString()
      );

      const image =
        documents.length > 0
          ? documents.find((doc) => doc.type === "image")?.document_url ||
            "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
          : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

      return {
        ...post._doc,
        reason: post.reason || "",
        user_id: {
          ...post.user_id._doc,
          followers_count: followersCount,
          isFollowing:
            current_user_id && current_user_id !== post.user_id._id.toString()
              ? !!followStatus
              : false,
        },
        image,
        tags,
        likeCount: likes.length,
        isLiked: current_user_id ? !!likeStatus : false,
        commentCount,
      };
    });

    console.log(`getFollowingPostsService took ${Date.now() - startTime}ms`);

    return {
      message: "Following posts retrieved successfully",
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
    return { message: "Server error", EC: -1 };
  }
};

const getPopularPostsService = async ({
  page = 1,
  limit = 10,
  current_user_id,
}) => {
  const startTime = Date.now();
  try {
    const skip = (page - 1) * limit;

    const posts = await Post.find({ status: "accepted" })
      .populate({
        path: "user_id",
        select: "full_name avatar_url",
      })
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ status: "accepted" });

    const postIds = posts.map((post) => post._id);

    const [
      allDocuments,
      allTags,
      allLikes,
      allCommentCounts,
      allLikeStatuses,
      allFollowersCounts,
      allFollowStatuses,
      likeCounts,
    ] = await Promise.all([
      Document.find({ post_id: { $in: postIds } }).select(
        "post_id type document_url"
      ),
      Post_Tag.find({ post_id: { $in: postIds } }).populate("tag_id"),
      User_Like_Post.find({ post_id: { $in: postIds } }).select(
        "post_id user_id"
      ),
      Comment.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? User_Like_Post.find({
            user_id: current_user_id,
            post_id: { $in: postIds },
          }).select("post_id")
        : [],
      UserFollow.aggregate([
        {
          $match: { user_follow_id: { $in: posts.map((p) => p.user_id._id) } },
        },
        { $group: { _id: "$user_follow_id", count: { $sum: 1 } } },
      ]),
      current_user_id
        ? UserFollow.find({
            user_id: current_user_id,
            user_follow_id: { $in: posts.map((p) => p.user_id._id) },
          }).select("user_follow_id")
        : [],
      User_Like_Post.aggregate([
        { $match: { post_id: { $in: postIds } } },
        { $group: { _id: "$post_id", count: { $sum: 1 } } },
      ]),
    ]);

    const postsWithDetails = posts
      .map((post) => {
        const documents = allDocuments.filter(
          (doc) => doc.post_id.toString() === post._id.toString()
        );
        const tags = allTags
          .filter((tag) => tag.post_id.toString() === post._id.toString())
          .map((tag) => ({
            _id: tag.tag_id._id,
            tag_name: tag.tag_id.tag_name,
          }));
        const likes = allLikes.filter(
          (like) => like.post_id.toString() === post._id.toString()
        );
        const commentCount =
          allCommentCounts.find((c) => c._id.toString() === post._id.toString())
            ?.count || 0;
        const likeStatus = allLikeStatuses.find(
          (like) => like.post_id.toString() === post._id.toString()
        );
        const followersCount =
          allFollowersCounts.find(
            (fc) => fc._id.toString() === post.user_id._id.toString()
          )?.count || 0;
        const followStatus = allFollowStatuses.find(
          (fs) => fs.user_follow_id.toString() === post.user_id._id.toString()
        );
        const likeCount =
          likeCounts.find((lc) => lc._id.toString() === post._id.toString())
            ?.count || 0;

        const image =
          documents.length > 0
            ? documents.find((doc) => doc.type === "image")?.document_url ||
              "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          reason: post.reason || "",
          user_id: {
            ...post.user_id._doc,
            followers_count: followersCount,
            isFollowing:
              current_user_id && current_user_id !== post.user_id._id.toString()
                ? !!followStatus
                : false,
          },
          image,
          tags,
          likeCount,
          isLiked: current_user_id ? !!likeStatus : false,
          commentCount,
        };
      })
      .sort((a, b) => b.likeCount - a.likeCount); // Sắp xếp theo likeCount giảm dần

    console.log(`getPopularPostsService took ${Date.now() - startTime}ms`);

    return {
      message: "Popular posts retrieved successfully",
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
    console.error("Error in getPopularPostsService:", error);
    return { message: "Server error", EC: -1 };
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
  getPopularPostsService,
};
