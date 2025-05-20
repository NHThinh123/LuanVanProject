const mongoose = require("mongoose");

const userLikePostSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const User_Like_Post = mongoose.model("User_Like_Post", userLikePostSchema);

module.exports = User_Like_Post;
