const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true },
    status: { type: String, default: 'Pending' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
