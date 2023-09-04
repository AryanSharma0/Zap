const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }, 
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  spam: {
    type: Boolean,
    required: true,
    default: false,
  },
  deletedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
