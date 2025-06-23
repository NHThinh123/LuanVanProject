const express = require("express");
const router = express.Router();
const {
  addTagToPost,
  removeTagFromPost,
  getTagsByPost,
  getPostsByTag,
} = require("../controllers/post_tag.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/", authentication, addTagToPost); // Thêm thẻ vào bài viết
router.delete("/", authentication, removeTagFromPost); // Xóa thẻ khỏi bài viết

// Endpoint công khai
router.get("/post/:post_id", getTagsByPost); // Lấy danh sách thẻ của bài viết
router.get("/tag/:tag_id", getPostsByTag); // Lấy danh sách bài viết theo thẻ

module.exports = router;
