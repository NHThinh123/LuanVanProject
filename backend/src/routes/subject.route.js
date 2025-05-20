const express = require("express");
const router = express.Router();
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subject.controller");

// Public routes
router.get("/", getSubjects); // Lấy tất cả môn học
router.get("/:id", getSubjectById); // Lấy môn học theo ID

// Admin routes (yêu cầu đăng nhập và quyền admin)
router.post("/", createSubject); // Tạo môn học mới
router.put("/:id", updateSubject); // Cập nhật môn học
router.delete("/:id", deleteSubject); // Xóa môn học

module.exports = router;
