const mongoose = require("mongoose");

const userInterestSubjectSchema = new mongoose.Schema(
  {
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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

const User_Interest_Subject = mongoose.model(
  "User_Interest_Subject",
  userInterestSubjectSchema
);

module.exports = User_Interest_Subject;
