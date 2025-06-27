const {
  likeCommentService,
  unlikeCommentService,
  getLikesByCommentService,
  checkUserLikedCommentService,
} = require("../services/user_like_comment.service");

const likeComment = async (req, res) => {
  const { comment_id } = req.body;
  const user_id = req.user._id; // Lấy từ middleware authentication

  if (!comment_id) {
    return res.status(400).json({ message: "Thiếu comment_id", EC: 1 });
  }

  const result = await likeCommentService(user_id, comment_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const unlikeComment = async (req, res) => {
  const { comment_id } = req.body;
  const user_id = req.user._id;

  if (!comment_id) {
    return res.status(400).json({ message: "Thiếu comment_id", EC: 1 });
  }

  const result = await unlikeCommentService(user_id, comment_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getLikesByComment = async (req, res) => {
  const { comment_id } = req.params;

  const result = await getLikesByCommentService(comment_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const checkUserLikedComment = async (req, res) => {
  const { comment_id } = req.query;
  const user_id = req.user._id;

  if (!comment_id) {
    return res.status(400).json({ message: "Thiếu comment_id", EC: 1 });
  }

  const result = await checkUserLikedCommentService(user_id, comment_id);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

module.exports = {
  likeComment,
  unlikeComment,
  getLikesByComment,
  checkUserLikedComment,
};
