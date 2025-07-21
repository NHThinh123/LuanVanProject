const express = require("express");
const router = express.Router();
const {
  createChatRoom,

  getUserChatRooms,
  deleteChatRoom,
} = require("../controllers/chat_room.controller");
const authentication = require("../middleware/authentication");

router.post("/", authentication, createChatRoom); // Tạo phòng chat

router.get("/", authentication, getUserChatRooms); // Lấy danh sách phòng chat của người dùng
router.delete("/:chat_room_id", authentication, deleteChatRoom); // Xóa phòng chat

module.exports = router;
