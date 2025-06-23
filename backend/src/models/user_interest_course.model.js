const mongoose = require("mongoose");

const userInterestCourseSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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
userInterestCourseSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

const User_Interest_Course = mongoose.model(
  "User_Interest_Course",
  userInterestCourseSchema
);

module.exports = User_Interest_Course;
