const express = require("express");
const router = express.Router();
const {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPostById,
  updatePostStatus,
  getRecommendedPosts,
  searchPosts,
  getPostsByTag,
  getFollowingPosts,
  getPopularPosts,
  getLikedPosts, // Thêm hàm mới
} = require("../controllers/post.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực
router.post("/", authentication, createPost); // Tạo bài viết
router.put("/:post_id", authentication, updatePost); // Cập nhật bài viết
router.delete("/:post_id", authentication, deletePost); // Xóa bài viết

// Endpoint yêu cầu xác thực và quyền admin
router.patch("/:post_id/status", authentication, updatePostStatus); // Cập nhật trạng thái bài viết

// Endpoint công khai
router.get("/", authentication, getPosts); // Lấy danh sách bài viết
router.get("/recommend", authentication, getRecommendedPosts); // Lấy danh sách bài viết đề xuất
router.get("/search", authentication, searchPosts);
router.get("/following", authentication, getFollowingPosts); // Lấy bài viết từ người dùng đang theo dõi
router.get("/popular", authentication, getPopularPosts); // Lấy bài viết phổ biến
router.get("/liked", authentication, getLikedPosts); // Lấy danh sách bài viết đã thích
router.get("/:post_id", authentication, getPostById); // Lấy chi tiết bài viết
router.get("/tag/:tag_id", authentication, getPostsByTag);

module.exports = router;
