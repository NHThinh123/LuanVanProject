const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByChatRoom,
  deleteMessage,
  markMessageAsRead,
} = require("../controllers/message.controller");
const authentication = require("../middleware/authentication");

router.post("/", authentication, sendMessage); // Gửi tin nhắn
router.get("/room/:chat_room_id", authentication, getMessagesByChatRoom); // Lấy danh sách tin nhắn theo phòng chat
router.delete("/:message_id", authentication, deleteMessage); // Xóa tin nhắn
router.post("/read/:chat_room_id", authentication, markMessageAsRead); // Đánh dấu tin nhắn là đã đọc

module.exports = router;
