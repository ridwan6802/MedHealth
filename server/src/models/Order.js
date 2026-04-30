const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    paymentMethod: { type: String, enum: ['Cash on Delivery', 'bKash'], default: 'Cash on Delivery' },
    paymentStatus: { type: String, default: 'Pending' },
    transactionId: { type: String, default: '' },
    bkashNumber: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
