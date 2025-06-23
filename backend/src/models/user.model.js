const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    university_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },
    major_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Major",
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, require: true, select: false },
    full_name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    start_year: { type: Number, default: 2025 },
    avatar_url: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
