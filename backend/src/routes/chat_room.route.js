const express = require("express");
const router = express.Router();
const {
  createChatRoom,
  updateLastMessage,
  getUserChatRooms,
  deleteChatRoom,
} = require("../controllers/chat_room.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/", authentication, createChatRoom); // Tạo phòng chat
router.put("/last-message", authentication, updateLastMessage); // Cập nhật tin nhắn cuối
router.get("/", authentication, getUserChatRooms); // Lấy danh sách phòng chat
router.delete("/:chat_room_id", authentication, deleteChatRoom); // Xóa phòng chat

module.exports = router;
