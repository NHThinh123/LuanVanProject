const express = require("express");
const router = express.Router();
const {
  likeComment,
  unlikeComment,
  getLikesByComment,
  checkUserLikedComment,
} = require("../controllers/user_like_comment.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/like", authentication, likeComment); // Thích bình luận
router.delete("/unlike", authentication, unlikeComment); // Bỏ thích bình luận
router.get("/check", authentication, checkUserLikedComment); // Kiểm tra trạng thái thích

// Endpoint công khai
router.get("/comment/:comment_id", getLikesByComment); // Lấy danh sách lượt thích của bình luận

module.exports = router;
