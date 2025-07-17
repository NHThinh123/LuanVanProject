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
    bio: { type: String, default: "" },
    start_year: { type: Number, default: 2025 },
    avatar_url: {
      type: String,
      default:
        "https://res.cloudinary.com/luanvan/image/upload/v1750690348/avatar-vo-tri-thu-vi_o4jsb8.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { full_name: "text", bio: "text" },
  { weights: { full_name: 10, bio: 5 } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
