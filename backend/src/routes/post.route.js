const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

// Public routes
router.get("/", getPosts); // Lấy tất cả bài đăng
router.get("/:id", getPostById); // Lấy bài đăng theo ID

// Protected routes (yêu cầu đăng nhập)
router.post("/", createPost); // Tạo bài đăng mới
router.put("/:id", updatePost); // Cập nhật bài đăng
router.delete("/:id", deletePost); // Xóa bài đăng

module.exports = router;
