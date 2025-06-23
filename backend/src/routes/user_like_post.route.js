const express = require("express");
const router = express.Router();
const {
  likePost,
  unlikePost,
  getLikesByPost,
  checkUserLikedPost,
} = require("../controllers/user_like_post.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/like", authentication, likePost); // Thích bài đăng
router.delete("/unlike", authentication, unlikePost); // Bỏ thích bài đăng
router.get("/check", authentication, checkUserLikedPost); // Kiểm tra trạng thái thích

// Endpoint công khai
router.get("/post/:post_id", getLikesByPost); // Lấy danh sách lượt thích của bài đăng

module.exports = router;
