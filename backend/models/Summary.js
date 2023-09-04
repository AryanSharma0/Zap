const mongoose = require("mongoose");

const SummarySchema = mongoose.Schema({
  summary: { required: true, type: String, default: "" },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  alertDate: {
    type: Date,
    default: Date.now,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
    },
  ],
});

module.exports = mongoose.model("Summary", SummarySchema);
