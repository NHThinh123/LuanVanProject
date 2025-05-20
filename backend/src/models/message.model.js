const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user_send_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat_room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat_Room",
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
