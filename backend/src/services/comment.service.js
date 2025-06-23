const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const createCommentService = async (
  user_id,
  post_id,
  content,
  parent_comment_id = null
) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra nội dung bình luận
    if (!content || content.trim().length === 0) {
      return { message: "Nội dung bình luận không hợp lệ", EC: 1 };
    }

    // Nếu là bình luận trả lời, kiểm tra bình luận cha
    if (parent_comment_id) {
      const parentComment = await Comment.findById(parent_comment_id);
      if (
        !parentComment ||
        parentComment.post_id.toString() !== post_id.toString()
      ) {
        return {
          message: "Bình luận cha không tồn tại hoặc không thuộc bài viết này",
          EC: 1,
        };
      }
    }

    // Tạo bình luận mới
    const comment = await Comment.create({
      post_id,
      user_id,
      parent_comment_id,
      content,
    });

    return {
      message: "Tạo bình luận thành công",
      EC: 0,
      data: comment,
    };
  } catch (error) {
    console.error("Error in createCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteCommentService = async (user_id, comment_id) => {
  try {
    // Kiểm tra bình luận có tồn tại và thuộc về người dùng không
    const comment = await Comment.findOne({ _id: comment_id, user_id });
    if (!comment) {
      return {
        message: "Bình luận không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    // Xóa bình luận và các bình luận con
    await Comment.deleteMany({
      $or: [{ _id: comment_id }, { parent_comment_id: comment_id }],
    });

    return {
      message: "Xóa bình luận thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getCommentsByPostService = async (post_id, query) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách bình luận cấp 1 (không có parent_comment_id)
    const comments = await Comment.find({ post_id, parent_comment_id: null })
      .populate("user_id", "full_name avatar_url")
      .select("user_id content createdAt parent_comment_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Lấy tổng số bình luận cấp 1
    const total = await Comment.countDocuments({
      post_id,
      parent_comment_id: null,
    });

    // Lấy bình luận con cho mỗi bình luận cấp 1
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parent_comment_id: comment._id })
          .populate("user_id", "full_name avatar_url")
          .select("user_id content createdAt parent_comment_id")
          .sort({ createdAt: 1 });
        return { ...comment._doc, replies };
      })
    );

    return {
      message: "Lấy danh sách bình luận thành công",
      EC: 0,
      data: {
        comments: commentsWithReplies,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getCommentsByPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getCommentByIdService = async (comment_id) => {
  try {
    // Lấy chi tiết bình luận
    const comment = await Comment.findById(comment_id)
      .populate("user_id", "full_name avatar_url")
      .populate("post_id", "title user_id")
      .select("user_id post_id content createdAt parent_comment_id");
    if (!comment) {
      return { message: "Bình luận không tồn tại", EC: 1 };
    }

    // Lấy bình luận con nếu có
    const replies = await Comment.find({ parent_comment_id: comment_id })
      .populate("user_id", "full_name avatar_url")
      .select("user_id content createdAt parent_comment_id")
      .sort({ createdAt: 1 });

    return {
      message: "Lấy thông tin bình luận thành công",
      EC: 0,
      data: { ...comment._doc, replies },
    };
  } catch (error) {
    console.error("Error in getCommentByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createCommentService,
  deleteCommentService,
  getCommentsByPostService,
  getCommentByIdService,
};
