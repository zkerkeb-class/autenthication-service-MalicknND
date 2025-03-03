const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  provider: { type: String, required: true }, // google, github...
  providerId: { type: String, required: true, unique: true }, // ID unique du provider
  email: { type: String, required: true, unique: true },
  name: { type: String },
  avatar: { type: String },
  session: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
