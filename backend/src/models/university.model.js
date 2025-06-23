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

universitySchema.index({ university_name: 1 });

const University = mongoose.model("University", universitySchema);

module.exports = University;
