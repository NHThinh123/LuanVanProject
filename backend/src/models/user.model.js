const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true, select: false },
    role: {
      type: String,
      enum: ["admin", "user"],
      // default: "student",
    },
    avatar_url: String,
    grade: String,
    major: String,
    school: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
