const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "pending", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
