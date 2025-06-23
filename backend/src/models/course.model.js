const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    course_name: { type: String, required: true },
    course_code: { type: String },
  },

  {
    timestamps: true,
  }
);

courseSchema.index({ course_name: 1 });
courseSchema.index({ course_code: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
