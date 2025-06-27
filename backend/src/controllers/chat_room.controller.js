const {
  createChatRoomService,
  updateLastMessageService,
  getUserChatRoomsService,
  deleteChatRoomService,
} = require("../services/chat_room.service");

const createChatRoom = async (req, res) => {
  const { name, type, member_ids } = req.body;
  const user_id = req.user._id; // Lấy từ middleware authentication

  if (!type || !member_ids) {
    return res
      .status(400)
      .json({ message: "Thiếu type hoặc member_ids", EC: 1 });
  }

  const result = await createChatRoomService(user_id, {
    name,
    type,
    member_ids,
  });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateLastMessage = async (req, res) => {
  const { chat_room_id, message_id } = req.body;

  if (!chat_room_id || !message_id) {
    return res
      .status(400)
      .json({ message: "Thiếu chat_room_id hoặc message_id", EC: 1 });
  }

  const result = await updateLastMessageService(chat_room_id, message_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
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
  updateLastMessage,
  getUserChatRooms,
  deleteChatRoom,
};
