const mongoose = require("mongoose");

const AnalysisSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  date: {
    type: Date,
    default: Date.now,
  },
  moodPrediction: {
    type: String,
    default: "neutral",
  },
});
module.exports = mongoose.model("Analysis", AnalysisSchema);
