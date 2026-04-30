const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin', 'staff'], default: 'customer' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
