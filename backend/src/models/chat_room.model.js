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
chatRoomSchema.index({ created_by: 1, createdAt: -1 });
chatRoomSchema.index({ last_message_id: 1 });
const Chat_Room = mongoose.model("Chat_Room", chatRoomSchema);

module.exports = Chat_Room;
