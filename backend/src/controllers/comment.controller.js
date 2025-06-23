const {
  createCommentService,
  deleteCommentService,
  getCommentsByPostService,
  getCommentByIdService,
} = require("../services/comment.service");

const createComment = async (req, res) => {
  const { post_id, content, parent_comment_id } = req.body;
  const user_id = req.user.id; // Lấy từ middleware authentication

  if (!post_id || !content) {
    return res
      .status(400)
      .json({ message: "Thiếu post_id hoặc content", EC: 1 });
  }

  const result = await createCommentService(
    user_id,
    post_id,
    content,
    parent_comment_id
  );
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteComment = async (req, res) => {
  const { comment_id } = req.params;
  const user_id = req.user.id;

  const result = await deleteCommentService(user_id, comment_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 403 : 500)
    .json(result);
};

const getCommentsByPost = async (req, res) => {
  const { post_id } = req.params;
  const { page, limit } = req.query;

  const result = await getCommentsByPostService(post_id, { page, limit });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getCommentById = async (req, res) => {
  const { comment_id } = req.params;

  const result = await getCommentByIdService(comment_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createComment,
  deleteComment,
  getCommentsByPost,
  getCommentById,
};
