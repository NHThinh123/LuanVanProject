const {
  likePostService,
  unlikePostService,
  getLikesByPostService,
  checkUserLikedPostService,
} = require("../services/user_like_post.service");

const likePost = async (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id; // Lấy từ middleware authentication

  if (!post_id) {
    return res.status(400).json({ message: "Thiếu post_id", EC: 1 });
  }

  const result = await likePostService(user_id, post_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const unlikePost = async (req, res) => {
  const { post_id } = req.body;
  const user_id = req.user.id;

  if (!post_id) {
    return res.status(400).json({ message: "Thiếu post_id", EC: 1 });
  }

  const result = await unlikePostService(user_id, post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getLikesByPost = async (req, res) => {
  const { post_id } = req.params;

  const result = await getLikesByPostService(post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const checkUserLikedPost = async (req, res) => {
  const { post_id } = req.query;
  const user_id = req.user.id;

  if (!post_id) {
    return res.status(400).json({ message: "Thiếu post_id", EC: 1 });
  }

  const result = await checkUserLikedPostService(user_id, post_id);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

module.exports = {
  likePost,
  unlikePost,
  getLikesByPost,
  checkUserLikedPost,
};
