const Post = require("../models/post.model");

const createPostService = async (postData) => {
  try {
    const post = await Post.create(postData);
    const populatedPost = await Post.findById(post._id)
      .populate("user_id", "username avatar_url")
      .populate("subject_id", "subject_name");
    return {
      message: "Tạo bài đăng thành công",
      data: populatedPost,
    };
  } catch (error) {
    throw new Error("Không thể tạo bài đăng: " + error.message);
  }
};

const getPostsService = async () => {
  try {
    const posts = await Post.find({})
      .populate("user_id", "username avatar_url")
      .populate("subject_id", "subject_name");
    return {
      message: "Lấy danh sách bài đăng thành công",
      data: posts,
    };
  } catch (error) {
    throw new Error("Không thể lấy danh sách bài đăng: " + error.message);
  }
};

const getPostByIdService = async (id) => {
  try {
    const post = await Post.findById(id)
      .populate("user_id", "username avatar_url")
      .populate("subject_id", "subject_name");
    if (!post) {
      return {
        message: "Bài đăng không tồn tại",
        data: null,
      };
    }
    return {
      message: "Lấy bài đăng thành công",
      data: post,
    };
  } catch (error) {
    throw new Error("Không thể lấy bài đăng: " + error.message);
  }
};

const updatePostService = async (id, updateData, user) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return {
        message: "Bài đăng không tồn tại",
        data: null,
      };
    }
    // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin có thể cập nhật
    if (post.user_id.toString() !== user.id && user.role !== "admin") {
      return {
        message: "Bạn không có quyền cập nhật bài đăng này",
        data: null,
      };
    }
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("user_id", "username avatar_url")
      .populate("subject_id", "subject_name");
    return {
      message: "Cập nhật bài đăng thành công",
      data: updatedPost,
    };
  } catch (error) {
    throw new Error("Không thể cập nhật bài đăng: " + error.message);
  }
};

const deletePostService = async (id, user) => {
  try {
    const post = await Post.findById(id);
    if (!post) {
      return {
        message: "Bài đăng không tồn tại",
        data: null,
      };
    }
    // Kiểm tra quyền: chỉ chủ sở hữu hoặc admin có thể xóa
    if (post.user_id.toString() !== user.id && user.role !== "admin") {
      return {
        message: "Bạn không có quyền xóa bài đăng này",
        data: null,
      };
    }
    await Post.findByIdAndDelete(id);
    return {
      message: "Xóa bài đăng thành công",
      data: { id },
    };
  } catch (error) {
    throw new Error("Không thể xóa bài đăng: " + error.message);
  }
};

module.exports = {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
};
