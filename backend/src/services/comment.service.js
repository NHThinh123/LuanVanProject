const Comment = require("../models/comment.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const User_Like_Comment = require("../models/user_like_comment.model");

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
      data: { ...comment._doc, likeCount: 0, isLiked: false },
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

    // Xóa các lượt thích liên quan
    await User_Like_Comment.deleteMany({ comment_id });

    return {
      message: "Xóa bình luận thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getCommentsByPostService = async (post_id, query, user_id) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách bình luận cấp 1
    const comments = await Comment.find({ post_id, parent_comment_id: null })
      .populate("user_id", "full_name avatar_url")
      .select("user_id content createdAt parent_comment_id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy tổng số bình luận cấp 1
    const total = await Comment.countDocuments({
      post_id,
      parent_comment_id: null,
    });

    // Thêm likeCount và isLiked cho mỗi bình luận
    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await User_Like_Comment.countDocuments({
          comment_id: comment._id,
        });
        const isLiked = user_id
          ? !!(await User_Like_Comment.findOne({
              user_id,
              comment_id: comment._id,
            }))
          : false;
        const replyCount = await Comment.countDocuments({
          parent_comment_id: comment._id,
        });
        return { ...comment._doc, likeCount, isLiked, replyCount };
      })
    );

    return {
      message: "Lấy danh sách bình luận thành công",
      EC: 0,
      data: {
        comments: commentsWithDetails,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
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

const getCommentByIdService = async (comment_id, user_id) => {
  try {
    // Lấy chi tiết bình luận
    const comment = await Comment.findById(comment_id)
      .populate("user_id", "full_name avatar_url")
      .populate("post_id", "title user_id")
      .select("user_id post_id content createdAt parent_comment_id");
    if (!comment) {
      return { message: "Bình luận không tồn tại", EC: 1 };
    }

    // Đếm số lượt thích và kiểm tra trạng thái thích
    const likeCount = await User_Like_Comment.countDocuments({
      comment_id,
    });
    const isLiked = user_id
      ? !!(await User_Like_Comment.findOne({ user_id, comment_id }))
      : false;
    const replyCount = await Comment.countDocuments({
      parent_comment_id: comment_id,
    });

    return {
      message: "Lấy thông tin bình luận thành công",
      EC: 0,
      data: { ...comment._doc, likeCount, isLiked, replyCount },
    };
  } catch (error) {
    console.error("Error in getCommentByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getRepliesByCommentService = async (comment_id, query, user_id) => {
  try {
    // Kiểm tra bình luận cha có tồn tại không
    const parentComment = await Comment.findById(comment_id);
    if (!parentComment) {
      return { message: "Bình luận cha không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách phản hồi
    const comments = await Comment.find({ parent_comment_id: comment_id })
      .populate("user_id", "full_name avatar_url")
      .select("user_id content createdAt parent_comment_id")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy tổng số phản hồi
    const total = await Comment.countDocuments({
      parent_comment_id: comment_id,
    });

    // Thêm likeCount và isLiked cho mỗi phản hồi
    const commentsWithDetails = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await User_Like_Comment.countDocuments({
          comment_id: comment._id,
        });
        const isLiked = user_id
          ? !!(await User_Like_Comment.findOne({
              user_id,
              comment_id: comment._id,
            }))
          : false;
        const replyCount = await Comment.countDocuments({
          parent_comment_id: comment._id,
        });
        return { ...comment._doc, likeCount, isLiked, replyCount };
      })
    );

    return {
      message: "Lấy danh sách phản hồi thành công",
      EC: 0,
      data: {
        comments: commentsWithDetails,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getRepliesByCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createCommentService,
  deleteCommentService,
  getCommentsByPostService,
  getCommentByIdService,
  getRepliesByCommentService,
};
