const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, require: true },
  role: String,
  avatar: String,
  bio: String,
  createdTopic: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  likedTopic: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
  dislikedTopic: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
