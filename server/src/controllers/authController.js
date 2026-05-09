const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role, address, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'customer',
      address,
      phone
    });

    return res.status(201).json({
      message: 'User created successfully',
      token: signToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      message: 'Login successful',
      token: signToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

const updateMe = async (req, res, next) => {
  try {
    const { username, email, phone, address, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email.toLowerCase();
    }

    if (username) {
      user.username = username;
    }

    if (typeof phone === 'string') {
      user.phone = phone;
    }

    if (typeof address === 'string') {
      user.address = address;
    }

    if (password && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    return next(error);
  }
};

const logoutUser = async (req, res) => {
  return res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, getMe, updateMe, logoutUser };
