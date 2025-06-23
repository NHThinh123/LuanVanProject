const mongoose = require("mongoose");

const userChatRoomSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat_room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat_Room",
      required: true,
    },
    last_read: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userChatRoomSchema.index({ user_id: 1, chat_room_id: 1 }, { unique: true });

const User_Chat_Room = mongoose.model("User_Chat_Room", userChatRoomSchema);

module.exports = User_Chat_Room;
