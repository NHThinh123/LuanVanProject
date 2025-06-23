const express = require("express");
const router = express.Router();
const {
  joinChatRoom,
  leaveChatRoom,
  updateLastRead,
  getUserChatRooms,
} = require("../controllers/user_chat_room.controller");
const authentication = require("../middleware/authentication");

// Endpoint yêu cầu xác thực
router.post("/join", authentication, joinChatRoom); // Tham gia phòng chat
router.delete("/leave", authentication, leaveChatRoom); // Rời phòng chat
router.patch("/last-read", authentication, updateLastRead); // Cập nhật thời gian đọc
router.get("/user", authentication, getUserChatRooms); // Lấy danh sách phòng chat

module.exports = router;
