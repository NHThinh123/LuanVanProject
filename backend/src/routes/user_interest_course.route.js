const express = require("express");
const router = express.Router();
const {
  addInterestCourse,
  removeInterestCourse,
  getInterestedCourses,
  checkUserInterestedCourse,
} = require("../controllers/user_interest_course.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/add", authentication, addInterestCourse); // Thêm khóa học quan tâm
router.delete("/remove", authentication, removeInterestCourse); // Xóa khóa học quan tâm
router.get("/user", authentication, getInterestedCourses); // Lấy danh sách khóa học quan tâm
router.get("/check", authentication, checkUserInterestedCourse); // Kiểm tra trạng thái quan tâm

module.exports = router;
