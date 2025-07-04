const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  updatePostStatus,
} = require("../controllers/post.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực
router.post("/", authentication, createPost); // Tạo bài viết
router.put("/:post_id", authentication, updatePost); // Cập nhật bài viết
router.delete("/:post_id", authentication, deletePost); // Xóa bài viết

// Endpoint yêu cầu xác thực và quyền admin
router.patch("/:post_id/status", authentication, isAdmin, updatePostStatus); // Cập nhật trạng thái bài viết

// Endpoint công khai
router.get("/", getPosts); // Lấy danh sách bài viết
router.get("/:post_id", getPostById); // Lấy chi tiết bài viết

module.exports = router;
