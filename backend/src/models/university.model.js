const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    university_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model("University", universitySchema);

module.exports = University;
