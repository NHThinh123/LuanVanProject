const mongoose = require("mongoose");

const postTagSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    tag_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postTagSchema.index({ post_id: 1, tag_id: 1 }, { unique: true });

const Post_Tag = mongoose.model("Post_Tag", postTagSchema);

module.exports = Post_Tag;
