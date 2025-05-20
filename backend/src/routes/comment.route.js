const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/comment.controller");

// Public routes
router.get("/post/:post_id", getCommentsByPost); // Lấy bình luận theo post_id
router.get("/:id", getCommentById); // Lấy bình luận theo ID

// Protected routes (yêu cầu đăng nhập)
router.post("/", createComment); // Tạo bình luận mới
router.put("/:id", updateComment); // Cập nhật bình luận
router.delete("/:id", deleteComment); // Xóa bình luận

module.exports = router;
