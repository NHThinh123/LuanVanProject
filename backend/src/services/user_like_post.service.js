const User_Like_Post = require("../models/user_like_post.model");
const Post = require("../models/post.model");
const User = require("../models/user.model");

const likePostService = async (user_id, post_id) => {
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài đăng không tồn tại", EC: 1 };
    }

    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    const existingLike = await User_Like_Post.findOne({ user_id, post_id });
    if (existingLike) {
      return { message: "Bạn đã thích bài đăng này", EC: 1 };
    }

    const like = await User_Like_Post.create({ user_id, post_id });
    return {
      message: "Thích bài đăng thành công",
      EC: 0,
      data: like,
    };
  } catch (error) {
    console.error("Error in likePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const unlikePostService = async (user_id, post_id) => {
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài đăng không tồn tại", EC: 1 };
    }

    const like = await User_Like_Post.findOneAndDelete({ user_id, post_id });
    if (!like) {
      return { message: "Bạn chưa thích bài đăng này", EC: 1 };
    }

    return {
      message: "Bỏ thích bài đăng thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in unlikePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getLikesByPostService = async (post_id) => {
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài đăng không tồn tại", EC: 1 };
    }

    const likes = await User_Like_Post.find({ post_id })
      .populate("user_id", "full_name avatar_url") // Loại bỏ username
      .select("user_id createdAt");

    return {
      message: "Lấy danh sách lượt thích thành công",
      EC: 0,
      data: likes,
    };
  } catch (error) {
    console.error("Error in getLikesByPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const checkUserLikedPostService = async (user_id, post_id) => {
  try {
    const like = await User_Like_Post.findOne({ user_id, post_id });
    return {
      message: "Kiểm tra trạng thái thích thành công",
      EC: 0,
      data: { liked: !!like },
    };
  } catch (error) {
    console.error("Error in checkUserLikedPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  likePostService,
  unlikePostService,
  getLikesByPostService,
  checkUserLikedPostService,
};
