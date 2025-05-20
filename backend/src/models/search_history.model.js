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

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
