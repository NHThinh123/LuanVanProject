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
    read_by: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ chat_room_id: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
