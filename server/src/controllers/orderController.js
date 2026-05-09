const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const mongoose = require('mongoose');

const ALLOWED_ORDER_STATUSES = ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'];

const buildStaffOrderThreads = (orders) => {
  const threadsMap = new Map();

  for (const order of orders) {
    const customer = order.customer;
    const customerId = String(order.user?._id || order.user || customer?._id || '');

    if (!customerId) {
      continue;
    }

    if (!threadsMap.has(customerId)) {
      threadsMap.set(customerId, {
        customerId,
        customerName: customer?.username || `Customer #${customerId}`,
        customerEmail: customer?.email || '',
        orderCount: 0,
        latestOrderAt: null,
        latestStatus: '',
        latestOrderLabel: ''
      });
    }

    const thread = threadsMap.get(customerId);
    thread.orderCount += 1;
    thread.customerName = customer?.username || thread.customerName || `Customer #${customerId}`;
    thread.customerEmail = customer?.email || thread.customerEmail || '';

    const orderTime = order.order_date ? new Date(order.order_date).getTime() : order.createdAt ? new Date(order.createdAt).getTime() : 0;
    const latestTime = thread.latestOrderAt ? new Date(thread.latestOrderAt).getTime() : 0;

    if (!thread.latestOrderAt || orderTime >= latestTime) {
      thread.latestOrderAt = order.order_date || order.createdAt;
      thread.latestStatus = order.status;
      thread.latestOrderLabel = order.orderNumber ? `#${order.orderNumber}` : order.id ? `#${order.id}` : 'Latest order';
    }
  }

  return Array.from(threadsMap.values()).sort((left, right) => {
    const leftTime = left.latestOrderAt ? new Date(left.latestOrderAt).getTime() : 0;
    const rightTime = right.latestOrderAt ? new Date(right.latestOrderAt).getTime() : 0;
    return rightTime - leftTime;
  });
};

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

const getStaffOrderThreads = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: { $exists: true, $ne: null } })
      .populate('user', 'username email role id')
      .sort({ createdAt: -1 })
      .lean();

    const enrichedOrders = orders.map((order) => ({
      ...order,
      customer: order.user || null
    }));

    return res.json(buildStaffOrderThreads(enrichedOrders));
  } catch (error) {
    return next(error);
  }
};

const getStaffCustomerOrders = async (req, res, next) => {
  try {
    const rawCustomerId = String(req.params.customerId || '').trim();
    const isObjectId = mongoose.Types.ObjectId.isValid(rawCustomerId);

    if (!isObjectId) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customerObjectId = new mongoose.Types.ObjectId(rawCustomerId);
    const customer = await User.findOne({ _id: customerObjectId }).select('username email role id').lean();

    const orders = await Order.find({ user: customerObjectId })
      .populate('items.medicine', 'name')
      .populate('user', 'username email role id')
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.json(
      orders.map((order) => ({
        ...order,
        customer: {
          _id: customer?._id || null,
          id: customer?.id || rawCustomerId,
          username: customer?.username || `Customer #${rawCustomerId}`,
          email: customer?.email || '',
          role: customer?.role || 'customer'
        }
      }))
    );
  } catch (error) {
    return next(error);
  }
};

const updateStaffOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true })
      .populate('items.medicine')
      .populate('user', 'username email role');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
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

module.exports = {
  getOrders,
  createOrder,
  getStaffOrderThreads,
  getStaffCustomerOrders,
  updateStaffOrderStatus
};
