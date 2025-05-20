const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    last_message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const Chat_Room = mongoose.model("Chat_Room", chatRoomSchema);

module.exports = Chat_Room;
