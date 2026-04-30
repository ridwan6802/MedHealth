const express = require('express');
const authRoutes = require('./authRoutes');
const medicineRoutes = require('./medicineRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');
const chatRoutes = require('./chatRoutes');
const staffRoutes = require('./staffRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/medicines', medicineRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/chat', chatRoutes);
router.use('/staff', staffRoutes);

module.exports = router;
