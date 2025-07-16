const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
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

postSchema.index({ user_id: 1, createdAt: -1 });
postSchema.index({ course_id: 1 });
postSchema.index({ category_id: 1 });
postSchema.index({ status: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
