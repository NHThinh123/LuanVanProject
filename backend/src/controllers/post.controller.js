const {
  createPostService,
  getPostsService,
  getPostByIdService,
  updatePostService,
  deletePostService,
} = require("../services/post.service");

const createPost = async (req, res) => {
  const { subject_id, title, content, status } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  try {
    const data = await createPostService({
      user_id: req.user.id, // Lấy từ middleware xác thực
      subject_id,
      title,
      content,
      status,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getPosts = async (req, res) => {
  try {
    const data = await getPostsService();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const data = await getPostByIdService(req.params.id);
    if (!data.data) {
      return res.status(404).json({ message: "Bài đăng không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const updatePost = async (req, res) => {
  const updateData = req.body;
  try {
    const data = await updatePostService(req.params.id, updateData, req.user);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Bài đăng không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const data = await deletePostService(req.params.id, req.user);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Bài đăng không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};
