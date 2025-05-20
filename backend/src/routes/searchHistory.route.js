const express = require("express");
const router = express.Router();
const {
  createSearchHistory,
  getSearchHistoryByUser,
  deleteSearchHistory,
} = require("../controllers/searchHistory.controller");

// Protected routes (yêu cầu đăng nhập)
router.post("/", createSearchHistory); // Tạo lịch sử tìm kiếm mới
router.get("/", getSearchHistoryByUser); // Lấy lịch sử tìm kiếm của người dùng
router.delete("/:id", deleteSearchHistory); // Xóa lịch sử tìm kiếm

module.exports = router;
