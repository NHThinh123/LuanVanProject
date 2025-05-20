const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const createCommentService = async (commentData) => {
  try {
    // Kiểm tra xem post_id có tồn tại
    const post = await Post.findById(commentData.post_id);
    if (!post) {
      return {
        message: "Bài đăng không tồn tại",
        data: null,
      };
    }
    // Nếu có parent_comment_id, kiểm tra xem bình luận cha có tồn tại
    if (commentData.parent_comment_id) {
      const parentComment = await Comment.findById(
        commentData.parent_comment_id
      );
      if (!parentComment) {
        return {
          message: "Bình luận cha không tồn tại",
          data: null,
        };
      }
    }
    const comment = await Comment.create(commentData);
    const populatedComment = await Comment.findById(comment._id)
      .populate("user_id", "username avatar_url")
      .populate("post_id", "title")
      .populate("parent_comment_id", "content user_id");
    return {
      message: "Tạo bình luận thành công",
      data: populatedComment,
    };
  } catch (error) {
    throw new Error("Không thể tạo bình luận: " + error.message);
  }
};

const getCommentsByPostService = async (post_id) => {
  try {
    // Kiểm tra xem post_id có tồn tại
    const post = await Post.findById(post_id);
    if (!post) {
      return {
        message: "Bài đăng không tồn tại",
        data: null,
      };
    }
    const comments = await Comment.find({ post_id })
      .populate("user_id", "username avatar_url")
      .populate("post_id", "title")
      .populate("parent_comment_id", "content user_id");
    return {
      message: "Lấy danh sách bình luận thành công",
      data: comments,
    };
  } catch (error) {
    throw new Error("Không thể lấy danh sách bình luận: " + error.message);
  }
};

const getCommentByIdService = async (id) => {
  try {
    const comment = await Comment.findById(id)
      .populate("user_id", "username avatar_url")
      .populate("post_id", "title")
      .populate("parent_comment_id", "content user_id");
    if (!comment) {
      return {
        message: "Bình luận không tồn tại",
        data: null,
      };
    }
    return {
      message: "Lấy bình luận thành công",
      data: comment,
    };
  } catch (error) {
    throw new Error("Không thể lấy bình luận: " + error.message);
  }
};

const updateCommentService = async (id, updateData, user) => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return {
        message: "Bình luận không tồn tại",
        data: null,
      };
    }
    // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin có thể cập nhật
    if (comment.user_id.toString() !== user.id && user.role !== "admin") {
      return {
        message: "Bạn không có quyền cập nhật bình luận này",
        data: null,
      };
    }
    const updatedComment = await Comment.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user_id", "username avatar_url")
      .populate("post_id", "title")
      .populate("parent_comment_id", "content user_id");
    return {
      message: "Cập nhật bình luận thành công",
      data: updatedComment,
    };
  } catch (error) {
    throw new Error("Không thể cập nhật bình luận: " + error.message);
  }
};

const deleteCommentService = async (id, user) => {
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return {
        message: "Bình luận không tồn tại",
        data: null,
      };
    }
    // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin có thể xóa
    if (comment.user_id.toString() !== user.id && user.role !== "admin") {
      return {
        message: "Bạn không có quyền xóa bình luận này",
        data: null,
      };
    }
    // Xóa các bình luận con (nếu có)
    await Comment.deleteMany({ parent_comment_id: id });
    await Comment.findByIdAndDelete(id);
    return {
      message: "Xóa bình luận thành công",
      data: { id },
    };
  } catch (error) {
    throw new Error("Không thể xóa bình luận: " + error.message);
  }
};

module.exports = {
  createCommentService,
  getCommentsByPostService,
  getCommentByIdService,
  updateCommentService,
  deleteCommentService,
};
