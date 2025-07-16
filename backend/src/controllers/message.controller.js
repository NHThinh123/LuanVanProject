const {
  sendMessageService,
  getMessagesByChatRoomService,
  deleteMessageService,
  markMessageAsReadService,
} = require("../services/message.service");

const sendMessage = async (req, res) => {
  const { chat_room_id, content } = req.body;
  const user_id = req.user._id;

  if (!chat_room_id || !content) {
    return res
      .status(400)
      .json({ message: "Thiếu chat_room_id hoặc content", EC: 1 });
  }

  const result = await sendMessageService(user_id, chat_room_id, content);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getMessagesByChatRoom = async (req, res) => {
  const { chat_room_id } = req.params;
  const user_id = req.user._id;
  const { page, limit } = req.query;

  const result = await getMessagesByChatRoomService(user_id, chat_room_id, {
    page,
    limit,
  });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteMessage = async (req, res) => {
  const { message_id } = req.params;
  const user_id = req.user._id;

  const result = await deleteMessageService(user_id, message_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 403 : 500)
    .json(result);
};

const markMessageAsRead = async (req, res) => {
  const { chat_room_id } = req.params;
  const user_id = req.user._id;

  const result = await markMessageAsReadService(user_id, chat_room_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

module.exports = {
  sendMessage,
  getMessagesByChatRoom,
  deleteMessage,
  markMessageAsRead,
};
