const express = require("express");
const router = express.Router();
const {
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversityById,
} = require("../controllers/university.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực và quyền admin
router.post("/", authentication, createUniversity); // Tạo trường đại học
router.put("/:id", authentication, isAdmin, updateUniversity); // Cập nhật trường đại học
router.delete("/:id", authentication, isAdmin, deleteUniversity); // Xóa trường đại học

// Endpoint công khai
router.get("/", getAllUniversities); // Lấy danh sách trường đại học
router.get("/:id", getUniversityById); // Lấy chi tiết trường đại học

module.exports = router;
