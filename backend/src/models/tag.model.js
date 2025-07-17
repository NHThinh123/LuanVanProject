const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    tag_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
tagSchema.index({ tag_name: "text" });

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
