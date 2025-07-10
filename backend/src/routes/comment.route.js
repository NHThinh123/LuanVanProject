const express = require("express");
const router = express.Router();
const {
  createComment,
  deleteComment,
  getCommentsByPost,
  getCommentById,
  getRepliesByComment,
} = require("../controllers/comment.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/", authentication, createComment); // Tạo bình luận
router.delete("/:comment_id", authentication, deleteComment); // Xóa bình luận

// Endpoint công khai
router.get("/post/:post_id", authentication, getCommentsByPost); // Lấy danh sách bình luận của bài viết
router.get("/:comment_id", authentication, getCommentById); // Lấy chi tiết bình luận
router.get("/replies/:comment_id", authentication, getRepliesByComment); // Lấy danh sách phản hồi của bình luận

module.exports = router;
