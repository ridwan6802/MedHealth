const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');

const getOrders = async (req, res, next) => {
  try {
    const ordersInCreationOrder = await Order.find({ user: req.user._id }).sort({ createdAt: 1 });

    let nextOrderNumber = 1;

    for (const order of ordersInCreationOrder) {
      if (Number.isInteger(order.orderNumber) && order.orderNumber > 0) {
        nextOrderNumber = Math.max(nextOrderNumber, order.orderNumber + 1);
        continue;
      }

      order.orderNumber = nextOrderNumber;
      nextOrderNumber += 1;
      await order.save({ validateBeforeSave: false });
    }

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

    const trimmedTransactionId = String(transactionId || '').trim();
    const trimmedBkashNumber = String(bkashNumber || '').trim();
    const isValidBkashNumber = /^01\d{9}$/.test(trimmedBkashNumber);

    if (paymentMethod === 'bKash') {
      if (!trimmedBkashNumber && !trimmedTransactionId) {
        return res.status(400).json({ message: 'Please provide your bKash Number and Transaction ID.' });
      }

      if (!trimmedBkashNumber) {
        return res.status(400).json({ message: 'Please provide your bKash Number.' });
      }

      if (!isValidBkashNumber) {
        return res.status(400).json({ message: 'Please provide a valid bKash Number. It must be 11 digits and start with 01.' });
      }

      if (!trimmedTransactionId) {
        return res.status(400).json({ message: 'Please provide your Transaction ID.' });
      }
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const latestOrder = await Order.findOne({ user: req.user._id })
      .sort({ orderNumber: -1, createdAt: -1 })
      .select('orderNumber');
    const nextOrderNumber = Number.isFinite(Number(latestOrder?.orderNumber)) ? Number(latestOrder.orderNumber) + 1 : 1;

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
      orderNumber: nextOrderNumber,
      items: orderItems,
      totalPrice,
      status: 'Pending',
      paymentMethod,
      paymentStatus: 'Pending',
      transactionId: trimmedTransactionId,
      bkashNumber: trimmedBkashNumber
    });

    for (const item of cart.items) {
      await Medicine.updateOne(
        { _id: item.medicine._id },
        { $inc: { stock: -item.quantity } }
      );
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
