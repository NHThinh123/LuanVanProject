const Chat_Room = require("../models/chat_room.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");

const createChatRoomService = async (user_id, data) => {
  try {
    const { member_id } = data;

    const creator = await User.findById(user_id);
    const member = await User.findById(member_id);
    if (!creator || !member) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }
    if (user_id === member_id) {
      return { message: "Không thể tạo phòng chat với chính mình", EC: 1 };
    }

    const existingRoom = await Chat_Room.findOne({
      type: "private",
      members: { $all: [user_id, member_id] },
    });
    if (existingRoom) {
      return {
        message: "Phòng chat private đã tồn tại",
        EC: 1,
        data: existingRoom,
      };
    }

    const chatRoom = await Chat_Room.create({
      created_by: user_id,
      members: [user_id, member_id],
      type: "private",
    });

    return {
      message: "Tạo phòng chat thành công",
      EC: 0,
      data: chatRoom,
    };
  } catch (error) {
    console.error("Error in createChatRoomService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateLastMessageService = async (chat_room_id, message_id) => {
  try {
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    const message = await Message.findById(message_id);
    if (
      !message ||
      message.chat_room_id.toString() !== chat_room_id.toString()
    ) {
      return {
        message: "Tin nhắn không hợp lệ hoặc không thuộc phòng chat",
        EC: 1,
      };
    }

    chatRoom.last_message_id = message_id;
    await chatRoom.save();

    return {
      message: "Cập nhật tin nhắn cuối thành công",
      EC: 0,
      data: chatRoom,
    };
  } catch (error) {
    console.error("Error in updateLastMessageService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getUserChatRoomsService = async (user_id, query) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const chatRooms = await Chat_Room.find({ members: user_id })
      .populate({
        path: "last_message_id",
        select: "content createdAt read_by",
        populate: {
          path: "user_send_id",
          select: "full_name avatar_url",
        },
      })
      .populate({
        path: "members",
        select: "full_name avatar_url",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Chat_Room.countDocuments({ members: user_id });

    // Tính số lượng tin nhắn chưa đọc cho mỗi phòng chat
    const chatRoomsWithUnread = await Promise.all(
      chatRooms.map(async (chatRoom) => {
        const unreadCount = await Message.countDocuments({
          chat_room_id: chatRoom._id,
          read_by: { $ne: user_id },
        });
        return {
          ...chatRoom.toObject(),
          unread_count: unreadCount,
        };
      })
    );

    return {
      message: "Lấy danh sách phòng chat thành công",
      EC: 0,
      data: {
        chatRooms: chatRoomsWithUnread,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getUserChatRoomsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deleteChatRoomService = async (user_id, chat_room_id) => {
  try {
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    if (!chatRoom.members.includes(user_id)) {
      return { message: "Bạn không phải thành viên của phòng chat này", EC: 1 };
    }

    await Message.deleteMany({ chat_room_id });
    await Chat_Room.findByIdAndDelete(chat_room_id);

    return {
      message: "Xóa phòng chat thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deleteChatRoomService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createChatRoomService,
  updateLastMessageService,
  getUserChatRoomsService,
  deleteChatRoomService,
};
