const express = require("express");
const router = express.Router();
const {
  // uploadDocument,
  // deleteDocument,
  getDocumentsByPost,
  getDocumentById,
} = require("../controllers/document.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
// router.post("/", authentication, uploadDocument); // Tải lên tài liệu
// router.delete("/:document_id", authentication, deleteDocument); // Xóa tài liệu

// Endpoint công khai
router.get("/post/:post_id", getDocumentsByPost); // Lấy danh sách tài liệu của bài viết
router.get("/:document_id", getDocumentById); // Lấy chi tiết tài liệu

module.exports = router;
