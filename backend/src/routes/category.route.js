const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} = require("../controllers/category.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực và quyền admin
router.post("/", authentication, createCategory); // Tạo danh mục
router.put("/:id", authentication, isAdmin, updateCategory); // Cập nhật danh mục
router.delete("/:id", authentication, isAdmin, deleteCategory); // Xóa danh mục

// Endpoint công khai
router.get("/", getAllCategories); // Lấy danh sách danh mục
router.get("/:id", getCategoryById); // Lấy chi tiết danh mục

module.exports = router;
