const {
  joinChatRoomService,
  leaveChatRoomService,
  updateLastReadService,
  getUserChatRoomsService,
} = require("../services/user_chat_room.service");

const joinChatRoom = async (req, res) => {
  const { chat_room_id } = req.body;
  const user_id = req.user.id; // Lấy từ middleware authentication

  if (!chat_room_id) {
    return res.status(400).json({ message: "Thiếu chat_room_id", EC: 1 });
  }

  const result = await joinChatRoomService(user_id, chat_room_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const leaveChatRoom = async (req, res) => {
  const { chat_room_id } = req.body;
  const user_id = req.user.id;

  if (!chat_room_id) {
    return res.status(400).json({ message: "Thiếu chat_room_id", EC: 1 });
  }

  const result = await leaveChatRoomService(user_id, chat_room_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateLastRead = async (req, res) => {
  const { chat_room_id } = req.body;
  const user_id = req.user.id;

  if (!chat_room_id) {
    return res.status(400).json({ message: "Thiếu chat_room_id", EC: 1 });
  }

  const result = await updateLastReadService(user_id, chat_room_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getUserChatRooms = async (req, res) => {
  const user_id = req.user.id;

  const result = await getUserChatRoomsService(user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  joinChatRoom,
  leaveChatRoom,
  updateLastRead,
  getUserChatRooms,
};
