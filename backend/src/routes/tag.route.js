const express = require("express");
const router = express.Router();
const {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} = require("../controllers/tag.controller");

// Public routes
router.get("/", getTags); // Lấy tất cả thẻ
router.get("/:id", getTagById); // Lấy thẻ theo ID

// Admin routes (yêu cầu đăng nhập và quyền admin)
router.post("/", createTag); // Tạo thẻ mới
router.put("/:id", updateTag); // Cập nhật thẻ
router.delete("/:id", deleteTag); // Xóa thẻ

module.exports = router;
