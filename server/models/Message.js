const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24,
    },

    channel: {
      type: String,
      required: true,
      enum: ["general", "coding", "gaming", "music"],
      index: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ channel: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
