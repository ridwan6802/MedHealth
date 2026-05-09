const Notification = require('../models/Notification');
const User = require('../models/User');

const getStaffNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ sender: req.user._id }).populate('user', 'username email role').sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (error) {
    return next(error);
  }
};

const createStaffNotification = async (req, res, next) => {
  try {
    const { message, notificationType = 'general' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const adminUser = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select('_id');
    if (!adminUser) {
      return res.status(400).json({ message: 'No admin users found' });
    }

    const trimmedMessage = message.trim();
    const recentDuplicate = await Notification.findOne({
      user: adminUser._id,
      sender: req.user._id,
      message: trimmedMessage,
      notificationType,
      createdAt: { $gte: new Date(Date.now() - 5000) }
    }).sort({ createdAt: -1 });

    if (recentDuplicate) {
      return res.status(200).json(recentDuplicate);
    }

    const notification = await Notification.create({
      user: adminUser._id,
      sender: req.user._id,
      message: trimmedMessage,
      notificationType
    });

    return res.status(201).json(notification);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStaffNotifications, createStaffNotification };
