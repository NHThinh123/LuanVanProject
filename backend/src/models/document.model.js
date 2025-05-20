const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    type: {
      type: String,
      enum: ["pdf", "docx", "xlsx", "image", "rar", "zip"],
      required: true,
    },
    document_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
