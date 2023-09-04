const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  publicKey: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
