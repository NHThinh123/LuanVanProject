const {
  createChatRoomService,
  getUserChatRoomsService,
  deleteChatRoomService,
} = require("../services/chat_room.service");

const createChatRoom = async (req, res) => {
  const { member_id } = req.body;
  const user_id = req.user._id;

  if (!member_id) {
    return res.status(400).json({ message: "Thiếu member_id", EC: 1 });
  }

  const result = await createChatRoomService(user_id, { member_id });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getUserChatRooms = async (req, res) => {
  const user_id = req.user._id;
  const { page, limit } = req.query;

  const result = await getUserChatRoomsService(user_id, { page, limit });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteChatRoom = async (req, res) => {
  const { chat_room_id } = req.params;
  const user_id = req.user._id;

  const result = await deleteChatRoomService(user_id, chat_room_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 403 : 500)
    .json(result);
};

module.exports = {
  createChatRoom,
  getUserChatRooms,
  deleteChatRoom,
};
