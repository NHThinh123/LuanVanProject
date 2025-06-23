const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByChatRoom,
  deleteMessage,
} = require("../controllers/message.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/", authentication, sendMessage); // Gửi tin nhắn
router.get("/room/:chat_room_id", authentication, getMessagesByChatRoom); // Lấy danh sách tin nhắn
router.delete("/:message_id", authentication, deleteMessage); // Xóa tin nhắn

module.exports = router;
