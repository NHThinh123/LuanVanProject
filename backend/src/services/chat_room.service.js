const Chat_Room = require("../models/chat_room.model");
const User_Chat_Room = require("../models/user_chat_room.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");

const createChatRoomService = async (user_id, data) => {
  try {
    const { name, type, member_ids } = data;

    // Kiểm tra người dùng tạo phòng
    const creator = await User.findById(user_id);
    if (!creator) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra loại phòng
    if (!["private", "group"].includes(type)) {
      return { message: "Loại phòng không hợp lệ", EC: 1 };
    }

    // Kiểm tra danh sách thành viên
    if (!member_ids || !Array.isArray(member_ids) || member_ids.length === 0) {
      return { message: "Danh sách thành viên không hợp lệ", EC: 1 };
    }

    // Kiểm tra thành viên tồn tại
    const members = await User.find({ _id: { $in: member_ids } });
    if (members.length !== member_ids.length) {
      return { message: "Một hoặc nhiều thành viên không tồn tại", EC: 1 };
    }

    // Đối với phòng private, kiểm tra phòng đã tồn tại chưa
    let chatRoom;
    if (type === "private" && member_ids.length === 1) {
      const existingRoom = await User_Chat_Room.findOne({
        user_id: { $in: [user_id, member_ids[0]] },
        chat_room_id: {
          $in: await User_Chat_Room.find({
            user_id: { $in: [user_id, member_ids[0]] },
            chat_room_id: { $ne: null },
          }).distinct("chat_room_id"),
        },
      }).populate("chat_room_id");

      if (existingRoom && existingRoom.chat_room_id.type === "private") {
        return {
          message: "Phòng chat private đã tồn tại",
          EC: 1,
          data: existingRoom.chat_room_id,
        };
      }
    }

    // Tạo phòng chat
    chatRoom = await Chat_Room.create({
      name: type === "group" ? name || "" : "",
      type,
      created_by: user_id,
    });

    // Thêm thành viên vào phòng (bao gồm người tạo)
    const userChatRoomData = [
      { user_id, chat_room_id: chatRoom._id },
      ...member_ids.map((id) => ({ user_id: id, chat_room_id: chatRoom._id })),
    ];
    await User_Chat_Room.insertMany(userChatRoomData);

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
    // Kiểm tra phòng chat
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    // Kiểm tra tin nhắn
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

    // Cập nhật tin nhắn cuối
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
    // Kiểm tra người dùng
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách phòng chat của người dùng
    const userChatRooms = await User_Chat_Room.find({ user_id })
      .populate({
        path: "chat_room_id",
        select: "name type last_message_id created_by",
        populate: [
          { path: "last_message_id", select: "content createdAt" },
          { path: "created_by", select: "full_name avatar_url" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User_Chat_Room.countDocuments({ user_id });

    // Lấy thông tin thành viên cho mỗi phòng
    const chatRooms = await Promise.all(
      userChatRooms.map(async (ucr) => {
        const members = await User_Chat_Room.find({
          chat_room_id: ucr.chat_room_id,
        })
          .populate("user_id", "full_name avatar_url")
          .select("user_id");
        return {
          ...ucr.chat_room_id._doc,
          members: members.map((m) => m.user_id),
        };
      })
    );

    return {
      message: "Lấy danh sách phòng chat thành công",
      EC: 0,
      data: {
        chatRooms,
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
    // Kiểm tra phòng chat
    const chatRoom = await Chat_Room.findById(chat_room_id);
    if (!chatRoom) {
      return { message: "Phòng chat không tồn tại", EC: 1 };
    }

    // Kiểm tra quyền xóa (chỉ người tạo được xóa)
    if (chatRoom.created_by.toString() !== user_id.toString()) {
      return { message: "Bạn không có quyền xóa phòng chat này", EC: 1 };
    }

    // Xóa tất cả tin nhắn của phòng
    await Message.deleteMany({ chat_room_id });

    // Xóa tất cả liên kết thành viên
    await User_Chat_Room.deleteMany({ chat_room_id });

    // Xóa phòng chat
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
