const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat_Room = require("../models/chat_room.model");
const User_Chat_Room = require("../models/user_chat_room.model");
const { updateLastMessageService } = require("./chat_room.service");

const sendMessageService = async (user_id, chat_room_id, content) => {
  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra phòng chat có tồn tại không
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    // Kiểm tra người dùng có trong phòng chat không
    const userChatRoom = await User_Chat_Room.findOne({
      user_id,
      chat_room_id,
    });
    if (!userChatRoom) {
      return {
        message: "Bạn không phải là thành viên của phòng chat này",
        EC: 1,
      };
    }

    // Kiểm tra nội dung tin nhắn
    if (!content || content.trim().length === 0) {
      return { message: "Nội dung tin nhắn không hợp lệ", EC: 1 };
    }

    // Tạo tin nhắn mới
    const message = await Message.create({
      user_send_id: user_id,
      chat_room_id,
      content,
    });

    // Cập nhật tin nhắn cuối của phòng chat
    await updateLastMessageService(chat_room_id, message._id);

    return {
      message: "Gửi tin nhắn thành công",
      EC: 0,
      data: message,
    };
  } catch (error) {
    console.error("Error in sendMessageService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getMessagesByChatRoomService = async (user_id, chat_room_id, query) => {
  try {
    // Kiểm tra người dùng có trong phòng chat không
    const userChatRoom = await User_Chat_Room.findOne({
      user_id,
      chat_room_id,
    });
    if (!userChatRoom) {
      return {
        message: "Bạn không phải là thành viên của phòng chat này",
        EC: 1,
      };
    }

    // Kiểm tra phòng chat có tồn tại không
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách tin nhắn
    const messages = await Message.find({ chat_room_id })
      .populate("user_send_id", "full_name avatar_url")
      .select("user_send_id content createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chat_room_id });

    return {
      message: "Lấy danh sách tin nhắn thành công",
      EC: 0,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getMessagesByChatRoomService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteMessageService = async (user_id, message_id) => {
  try {
    // Kiểm tra tin nhắn có tồn tại không
    const message = await Message.findOne({
      _id: message_id,
      user_send_id: user_id,
    });
    if (!message) {
      return {
        message: "Tin nhắn không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    // Xóa tin nhắn
    await Message.findByIdAndDelete(message_id);

    // Nếu tin nhắn bị xóa là tin nhắn cuối, cập nhật lại last_message_id
    const chatRoom = await Chat_Room.findById(message.chat_room_id);
    if (
      chatRoom.last_message_id &&
      chatRoom.last_message_id.toString() === message_id.toString()
    ) {
      const latestMessage = await Message.findOne({
        chat_room_id: message.chat_room_id,
      })
        .sort({ createdAt: -1 })
        .select("_id");
      await updateLastMessageService(
        message.chat_room_id,
        latestMessage ? latestMessage._id : null
      );
    }

    return {
      message: "Xóa tin nhắn thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteMessageService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  sendMessageService,
  getMessagesByChatRoomService,
  deleteMessageService,
};
