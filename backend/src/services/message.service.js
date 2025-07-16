const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat_Room = require("../models/chat_room.model");
const { updateLastMessageService } = require("./chat_room.service");

const sendMessageService = async (user_id, chat_room_id, content) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    if (!chatRoom.members.includes(user_id)) {
      return {
        message: "Bạn không phải là thành viên của phòng chat này",
        EC: 1,
      };
    }

    if (!content || content.trim().length === 0) {
      return { message: "Nội dung tin nhắn không hợp lệ", EC: 1 };
    }

    const message = await Message.create({
      user_send_id: user_id,
      chat_room_id,
      content,
      read_by: [user_id], // Người gửi tự động được đánh dấu là đã đọc
    });

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
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    if (!chatRoom.members.includes(user_id)) {
      return {
        message: "Bạn không phải là thành viên của phòng chat này",
        EC: 1,
      };
    }

    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chat_room_id })
      .populate("user_send_id", "full_name avatar_url")
      .select("user_send_id content createdAt read_by")
      .sort({ createdAt: 1 }) // Sắp xếp tăng dần để tin nhắn mới ở dưới
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

    await Message.findByIdAndDelete(message_id);

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

const markMessageAsReadService = async (user_id, chat_room_id) => {
  try {
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    if (!chatRoom.members.includes(user_id)) {
      return {
        message: "Bạn không phải là thành viên của phòng chat này",
        EC: 1,
      };
    }

    await Message.updateMany(
      { chat_room_id, read_by: { $ne: user_id } },
      { $addToSet: { read_by: user_id } }
    );

    return {
      message: "Đánh dấu tin nhắn đã đọc thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in markMessageAsReadService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  sendMessageService,
  getMessagesByChatRoomService,
  deleteMessageService,
  markMessageAsReadService,
};
