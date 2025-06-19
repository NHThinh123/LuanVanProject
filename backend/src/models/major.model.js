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

const Major = mongoose.model("Major", majorSchema);

module.exports = Major;
