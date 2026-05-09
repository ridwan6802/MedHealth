const Chat = require('../models/Chat');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getMessages = async (req, res, next) => {
  try {
    const messages = await Chat.find({ customer: req.user._id }).populate('customer', 'username email role').sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

const getStaffMessages = async (req, res, next) => {
  try {
    const messages = await Chat.find().populate('customer', 'username email role').sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

const getConversationByCustomer = async (req, res, next) => {
  try {
    const messages = await Chat.find({ customer: req.params.customerId }).populate('customer', 'username email role').sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

const getStaffMessageThreads = async (req, res, next) => {
  try {
    const messages = await Chat.find().populate('customer', 'username email role').sort({ createdAt: 1 });

    const threadsMap = new Map();

    for (const message of messages) {
      const customer = message.customer;

      // Skip messages where customer no longer exists
      if (!customer) {
        continue;
      }

      const customerId = String(customer._id);

      if (!threadsMap.has(customerId)) {
        threadsMap.set(customerId, {
          customerId,
          customerName: customer.username || 'Customer',
          customerEmail: customer.email || '',
          messages: [],
          unreadCount: 0,
          latestMessageAt: null,
          latestMessage: ''
        });
      }

      const thread = threadsMap.get(customerId);
      thread.messages.push(message);

      if (message.senderRole === 'customer' && !message.isRead) {
        thread.unreadCount += 1;
      }

      const messageTime = message.createdAt ? new Date(message.createdAt).getTime() : 0;
      const latestTime = thread.latestMessageAt ? new Date(thread.latestMessageAt).getTime() : 0;

      if (!thread.latestMessageAt || messageTime >= latestTime) {
        thread.latestMessageAt = message.createdAt;
        thread.latestMessage = message.message;
      }
    }

    return res.json(Array.from(threadsMap.values()));
  } catch (error) {
    return next(error);
  }
};

const markConversationRead = async (req, res, next) => {
  try {
    const result = await Chat.updateMany(
      {
        customer: req.params.customerId,
        senderRole: 'customer',
        isRead: false
      },
      { $set: { isRead: true } }
    );

    return res.json({
      message: 'Conversation marked as read',
      matchedCount: result.matchedCount ?? result.n,
      modifiedCount: result.modifiedCount ?? result.nModified
    });
  } catch (error) {
    return next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const customerId = req.params.customerId || req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if ((req.user.role === 'staff' || req.user.role === 'admin') && !req.params.customerId) {
      return res.status(400).json({ message: 'customerId is required for staff messages' });
    }

    const chat = await Chat.create({
      customer: customerId,
      senderRole: req.user.role,
      message: message.trim()
    });

    if (req.user.role === 'customer') {
      const staffUsers = await User.find({ role: 'staff' }).select('_id');
      await Notification.insertMany(
        staffUsers.map((staffUser) => ({
          user: staffUser._id,
          message: `New customer message from ${req.user.username}`,
          notificationType: 'chat'
        }))
      );
    } else {
      await Notification.create({
        user: customerId,
        message: `Staff replied to your message`,
        notificationType: 'chat'
      });
    }

    const populatedChat = await Chat.findById(chat._id).populate('customer', 'username email role');
    return res.status(201).json(populatedChat);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMessages, getStaffMessages, getStaffMessageThreads, getConversationByCustomer, markConversationRead, sendMessage };
