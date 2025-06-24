const express = require("express");
const router = express.Router();
const {
  createMajor,
  updateMajor,
  deleteMajor,
  getAllMajors,
  getMajorById,
} = require("../controllers/major.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực và quyền admin
router.post("/", authentication, createMajor); // Tạo ngành học
router.put("/:id", authentication, isAdmin, updateMajor); // Cập nhật ngành học
router.delete("/:id", authentication, isAdmin, deleteMajor); // Xóa ngành học

// Endpoint công khai
router.get("/", getAllMajors); // Lấy danh sách ngành học
router.get("/:id", getMajorById); // Lấy chi tiết ngành học

module.exports = router;
