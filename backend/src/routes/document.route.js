const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  deleteDocument,
  getDocumentsByPost,
  getDocumentById,
} = require("../controllers/document.controller");
const authentication = require("../middleware/authentication");
const multer = require("multer");

// Cấu hình multer để xử lý file
const storage = multer.memoryStorage(); // Lưu file vào bộ nhớ để xử lý trước khi upload
const upload = multer({ storage });

// Endpoint yêu cầu xác thực
router.post("/", authentication, upload.single("file"), uploadDocument); // Tải lên tài liệu
router.delete("/:document_id", authentication, deleteDocument); // Xóa tài liệu

// Endpoint công khai
router.get("/post/:post_id", getDocumentsByPost); // Lấy danh sách tài liệu của bài viết
router.get("/:document_id", getDocumentById); // Lấy chi tiết tài liệu

module.exports = router;
