const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent_comment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ post_id: 1, createdAt: -1 });
commentSchema.index({ parent_comment_id: 1 });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
