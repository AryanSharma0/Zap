const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: { type: String, required: true },
  // profileImage: { type: String },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  about: { type: String, default: "Hey I am using this app" },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notification: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

module.exports = mongoose.model("Profile", ProfileSchema);
    