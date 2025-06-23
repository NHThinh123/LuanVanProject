const mongoose = require("mongoose");

const majorSchema = new mongoose.Schema(
  {
    major_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
majorSchema.index({ major_name: 1 });

const Major = mongoose.model("Major", majorSchema);

module.exports = Major;
