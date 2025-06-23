const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ category_name: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
