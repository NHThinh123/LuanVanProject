const {
  followUserService,
  unfollowUserService,
  getFollowersService,
  getFollowingService,
  checkUserFollowService,
} = require("../services/user_follow.service");

const followUser = async (req, res) => {
  const { user_follow_id } = req.body;
  const user_id = req.user._id;

  if (!user_follow_id) {
    return res.status(400).json({ message: "Thiếu user_follow_id", EC: 1 });
  }

  const result = await followUserService(user_id, user_follow_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const unfollowUser = async (req, res) => {
  const { user_follow_id } = req.body;
  const user_id = req.user._id;

  if (!user_follow_id) {
    return res.status(400).json({ message: "Thiếu user_follow_id", EC: 1 });
  }

  const result = await unfollowUserService(user_id, user_follow_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getFollowers = async (req, res) => {
  const { user_id } = req.params;
  const current_user_id = req.user?._id; // Lấy từ middleware authentication

  const result = await getFollowersService(user_id, current_user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getFollowing = async (req, res) => {
  const { user_id } = req.params;
  const current_user_id = req.user?._id; // Lấy từ middleware authentication

  const result = await getFollowingService(user_id, current_user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const checkUserFollow = async (req, res) => {
  const { user_follow_id } = req.query;
  const user_id = req.user._id;

  if (!user_follow_id) {
    return res.status(400).json({ message: "Thiếu user_follow_id", EC: 1 });
  }

  const result = await checkUserFollowService(user_id, user_follow_id);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkUserFollow,
};
