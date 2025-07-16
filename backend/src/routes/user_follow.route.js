const express = require("express");
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkUserFollow,
} = require("../controllers/user_follow.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/follow", authentication, followUser); // Theo dõi người dùng
router.delete("/unfollow", authentication, unfollowUser); // Bỏ theo dõi người dùng
router.get("/check", authentication, checkUserFollow); // Kiểm tra trạng thái theo dõi

// Endpoint công khai
router.get("/followers/:user_id", authentication, getFollowers); // Lấy danh sách người theo dõi
router.get("/following/:user_id", authentication, getFollowing); // Lấy danh sách người đang theo dõi

module.exports = router;
