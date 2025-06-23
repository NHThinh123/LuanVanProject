const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    keyword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

searchHistorySchema.index({ user_id: 1, createdAt: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
