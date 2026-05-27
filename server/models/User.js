const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phoneOrEmail: { type: String, required: true, unique: true },
  otp: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
