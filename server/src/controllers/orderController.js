const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.medicine').sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { paymentMethod = 'Cash on Delivery', transactionId = '', bkashNumber = '' } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.medicine');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const medicine = item.medicine;

      if (!medicine) {
        return res.status(400).json({ message: 'One or more medicines are unavailable' });
      }

      if (item.quantity > medicine.stock) {
        return res.status(400).json({ message: `Not enough stock for ${medicine.name}` });
      }

      orderItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        price: medicine.price
      });

      totalPrice += medicine.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      status: 'Pending',
      paymentMethod,
      paymentStatus: 'Pending',
      transactionId,
      bkashNumber
    });

    for (const item of cart.items) {
      const medicine = await Medicine.findById(item.medicine._id);
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate('items.medicine');
    return res.status(201).json(populatedOrder);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOrders, createOrder };
