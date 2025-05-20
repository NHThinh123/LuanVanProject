const {
  createCommentService,
  getCommentsByPostService,
  getCommentByIdService,
  updateCommentService,
  deleteCommentService,
} = require("../services/comment.service");

const createComment = async (req, res) => {
  const { post_id, parent_comment_id, content } = req.body;
  if (!post_id || !content) {
    return res.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin (post_id và content)",
    });
  }

  try {
    const data = await createCommentService({
      post_id,
      user_id: req.user.id, // Lấy từ middleware xác thực
      parent_comment_id,
      content,
    });
    return res.status(201).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  const { post_id } = req.params;
  try {
    const data = await getCommentsByPostService(post_id);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const data = await getCommentByIdService(req.params.id);
    if (!data.data) {
      return res.status(404).json({ message: "Bình luận không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const updateComment = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res
      .status(400)
      .json({ message: "Nội dung bình luận không được để trống" });
  }
  try {
    const data = await updateCommentService(
      req.params.id,
      { content },
      req.user
    );
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Bình luận không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const data = await deleteCommentService(req.params.id, req.user);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Bình luận không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
