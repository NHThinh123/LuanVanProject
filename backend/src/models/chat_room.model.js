const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    last_message_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: {
      type: String,
      enum: ["private"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);
chatRoomSchema.index({ created_by: 1, createdAt: -1 });
chatRoomSchema.index({ last_message_id: 1 });
chatRoomSchema.index({ members: 1 });

const Chat_Room = mongoose.model("Chat_Room", chatRoomSchema);

module.exports = Chat_Room;
