const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Category = require('../models/Category');
const Notification = require('../models/Notification');

const getDashboardSummary = async (req, res, next) => {
  try {
    const [users, medicines, categories] = await Promise.all([
      User.countDocuments(),
      Medicine.countDocuments(),
      Category.countDocuments()
    ]);

    return res.json({ users, medicines, categories });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { username, email, password, phone = '', address = '', role = 'customer' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({
      username,
      email: String(email).toLowerCase(),
      password: await bcrypt.hash(password, 10),
      phone,
      address,
      role
    });

    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.email) {
      updates.email = String(updates.email).toLowerCase();
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().populate('user', 'username email role').populate('sender', 'username email role').sort({ createdAt: -1 });
    const adminNotifications = notifications.filter((notification) => notification.user?.role === 'admin');
    return res.json(adminNotifications);
  } catch (error) {
    return next(error);
  }
};

const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true })
      .populate('user', 'username email role')
      .populate('sender', 'username email role');

    if (!notification || notification.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.json(notification);
  } catch (error) {
    return next(error);
  }
};

const markAllNotificationsRead = async (req, res, next) => {
  try {
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminIds = adminUsers.map((adminUser) => adminUser._id);
    await Notification.updateMany({ user: { $in: adminIds } }, { isRead: true });
    return res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getDashboardSummary, getUsers, createUser, updateUser, deleteUser, getNotifications, markNotificationRead, markAllNotificationsRead };
