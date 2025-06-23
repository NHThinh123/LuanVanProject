const User_Chat_Room = require("../models/user_chat_room.model");
const User = require("../models/user.model");
const ChatRoom = require("../models/chat_room.model");

const joinChatRoomService = async (user_id, chat_room_id) => {
  try {
    // Kiểm tra người dùng và phòng chat có tồn tại
    const user = await User.findById(user_id);
    const chatRoom = await ChatRoom.findById(chat_room_id);
    if (!user || !chatRoom) {
      return { message: "Người dùng hoặc phòng chat không tồn tại", EC: 1 };
    }

    // Kiểm tra xem người dùng đã tham gia phòng chat chưa
    const existingMember = await User_Chat_Room.findOne({
      user_id,
      chat_room_id,
    });
    if (existingMember) {
      return { message: "Bạn đã tham gia phòng chat này", EC: 1 };
    }

    // Thêm người dùng vào phòng chat
    const member = await User_Chat_Room.create({
      user_id,
      chat_room_id,
      last_read: Date.now(),
    });
    return {
      message: "Tham gia phòng chat thành công",
      EC: 0,
      data: member,
    };
  } catch (error) {
    console.error("Error in joinChatRoomService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const leaveChatRoomService = async (user_id, chat_room_id) => {
  try {
    // Kiểm tra người dùng và phòng chat có tồn tại
    const user = await User.findById(user_id);
    const chatRoom = await ChatRoom.findById(chat_room_id);
    if (!user || !chatRoom) {
      return { message: "Người dùng hoặc phòng chat không tồn tại", EC: 1 };
    }

    // Kiểm tra xem người dùng có trong phòng chat không
    const member = await User_Chat_Room.findOneAndDelete({
      user_id,
      chat_room_id,
    });
    if (!member) {
      return { message: "Bạn chưa tham gia phòng chat này", EC: 1 };
    }

    return {
      message: "Rời phòng chat thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in leaveChatRoomService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updateLastReadService = async (user_id, chat_room_id) => {
  try {
    // Kiểm tra người dùng và phòng chat có tồn tại
    const user = await User.findById(user_id);
    const chatRoom = await ChatRoom.findById(chat_room_id);
    if (!user || !chatRoom) {
      return { message: "Người dùng hoặc phòng chat không tồn tại", EC: 1 };
    }

    // Cập nhật thời gian đọc tin nhắn cuối
    const member = await User_Chat_Room.findOneAndUpdate(
      { user_id, chat_room_id },
      { last_read: Date.now() },
      { new: true }
    );
    if (!member) {
      return { message: "Bạn chưa tham gia phòng chat này", EC: 1 };
    }

    return {
      message: "Cập nhật thời gian đọc tin nhắn thành công",
      EC: 0,
      data: member,
    };
  } catch (error) {
    console.error("Error in updateLastReadService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getUserChatRoomsService = async (user_id) => {
  try {
    // Kiểm tra người dùng có tồn tại
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Lấy danh sách phòng chat của người dùng
    const chatRooms = await User_Chat_Room.find({ user_id })
      .populate("chat_room_id", "name description")
      .select("chat_room_id last_read createdAt");

    return {
      message: "Lấy danh sách phòng chat thành công",
      EC: 0,
      data: chatRooms,
    };
  } catch (error) {
    console.error("Error in getUserChatRoomsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  joinChatRoomService,
  leaveChatRoomService,
  updateLastReadService,
  getUserChatRoomsService,
};
