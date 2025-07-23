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
    reason: { type: String, default: "" },
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

// Thêm text index với trọng số: title (10), content (5)
postSchema.index(
  { title: "text", content: "text" },
  { weights: { title: 10, content: 5 } }
);
postSchema.index({ user_id: 1, createdAt: -1 });
postSchema.index({ course_id: 1 });
postSchema.index({ category_id: 1 });
postSchema.index({ status: 1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
