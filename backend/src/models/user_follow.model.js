const mongoose = require("mongoose");

const userFollowSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_follow_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userFollowSchema.index({ user_id: 1, user_follow_id: 1 }, { unique: true });

const UserFollow = mongoose.model("UserFollow", userFollowSchema);

module.exports = UserFollow;
