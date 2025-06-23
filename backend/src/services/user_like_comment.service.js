const User_Like_Comment = require("../models/user_like_comment.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

const likeCommentService = async (user_id, comment_id) => {
  try {
    // Kiểm tra bình luận có tồn tại không
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return { message: "Bình luận không tồn tại", EC: 1 };
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra xem người dùng đã thích bình luận chưa
    const existingLike = await User_Like_Comment.findOne({
      user_id,
      comment_id,
    });
    if (existingLike) {
      return { message: "Bạn đã thích bình luận này", EC: 1 };
    }

    // Tạo lượt thích mới
    const like = await User_Like_Comment.create({ user_id, comment_id });
    return {
      message: "Thích bình luận thành công",
      EC: 0,
      data: like,
    };
  } catch (error) {
    console.error("Error in likeCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const unlikeCommentService = async (user_id, comment_id) => {
  try {
    // Kiểm tra bình luận có tồn tại không
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return { message: "Bình luận không tồn tại", EC: 1 };
    }

    // Kiểm tra lượt thích có tồn tại không
    const like = await User_Like_Comment.findOneAndDelete({
      user_id,
      comment_id,
    });
    if (!like) {
      return { message: "Bạn chưa thích bình luận này", EC: 1 };
    }

    return {
      message: "Bỏ thích bình luận thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in unlikeCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getLikesByCommentService = async (comment_id) => {
  try {
    // Kiểm tra bình luận có tồn tại không
    const comment = await Comment.findById(comment_id);
    if (!comment) {
      return { message: "Bình luận không tồn tại", EC: 1 };
    }

    // Lấy danh sách lượt thích
    const likes = await User_Like_Comment.find({ comment_id })
      .populate("user_id", "full_name avatar_url")
      .select("user_id createdAt");

    return {
      message: "Lấy danh sách lượt thích thành công",
      EC: 0,
      data: likes,
    };
  } catch (error) {
    console.error("Error in getLikesByCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const checkUserLikedCommentService = async (user_id, comment_id) => {
  try {
    const like = await User_Like_Comment.findOne({ user_id, comment_id });
    return {
      message: "Kiểm tra trạng thái thích thành công",
      EC: 0,
      data: { liked: !!like },
    };
  } catch (error) {
    console.error("Error in checkUserLikedCommentService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  likeCommentService,
  unlikeCommentService,
  getLikesByCommentService,
  checkUserLikedCommentService,
};
