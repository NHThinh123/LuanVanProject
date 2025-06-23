const express = require("express");
const router = express.Router();
const {
  addSearchHistory,
  getSearchHistory,
  deleteSearchHistory,
  clearAllSearchHistory,
} = require("../controllers/search_history.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/", authentication, addSearchHistory); // Thêm lịch sử tìm kiếm
router.get("/", authentication, getSearchHistory); // Lấy danh sách lịch sử tìm kiếm
router.delete("/:search_id", authentication, deleteSearchHistory); // Xóa một mục lịch sử
router.delete("/", authentication, clearAllSearchHistory); // Xóa tất cả lịch sử

module.exports = router;
