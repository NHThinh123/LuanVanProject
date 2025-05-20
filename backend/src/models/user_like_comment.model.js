const mongoose = require("mongoose");

const userLikeCommentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User_Like_Comment = mongoose.model(
  "User_Like_Comment",
  userLikeCommentSchema
);

module.exports = User_Like_Comment;
