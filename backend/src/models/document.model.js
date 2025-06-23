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
documentSchema.index({ post_id: 1 });

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
