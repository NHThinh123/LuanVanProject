const express = require("express");
const router = express.Router();
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
} = require("../controllers/course.controller");
const authentication = require("../middleware/authentication");
const isAdmin = require("../middleware/isAdmin");

// Endpoint yêu cầu xác thực và quyền admin
router.post("/", authentication, createCourse); // Tạo khóa học
router.put("/:id", authentication, isAdmin, updateCourse); // Cập nhật khóa học
router.delete("/:id", authentication, isAdmin, deleteCourse); // Xóa khóa học

// Endpoint công khai
router.get("/", getAllCourses); // Lấy danh sách khóa học
router.get("/:id", getCourseById); // Lấy chi tiết khóa học

module.exports = router;
