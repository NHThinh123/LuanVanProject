const express = require("express");
const router = express.Router();
const {
  createTag,
  updateTag,
  deleteTag,
  getAllTags,
  getTagById,
} = require("../controllers/tag.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực và quyền admin
router.post("/", authentication, createTag); // Tạo thẻ
router.put("/:id", authentication, isAdmin, updateTag); // Cập nhật thẻ
router.delete("/:id", authentication, isAdmin, deleteTag); // Xóa thẻ

// Endpoint công khai
router.get("/", getAllTags); // Lấy danh sách thẻ
router.get("/:id", getTagById); // Lấy chi tiết thẻ

module.exports = router;
