const express = require('express');
const { getStaffNotifications, createStaffNotification } = require('../controllers/staffController');
const { getStaffMessages, getStaffMessageThreads, getConversationByCustomer, markConversationRead, sendMessage } = require('../controllers/chatController');
const { getStaffOrderThreads, getStaffCustomerOrders, updateStaffOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/messages', protect, authorize('staff', 'admin'), getStaffMessages);
router.get('/messages/threads', protect, authorize('staff', 'admin'), getStaffMessageThreads);
router.get('/messages/:customerId', protect, authorize('staff', 'admin'), getConversationByCustomer);
router.patch('/messages/:customerId/read', protect, authorize('staff', 'admin'), markConversationRead);
router.post('/messages/:customerId', protect, authorize('staff', 'admin'), sendMessage);
router.get('/orders', protect, authorize('staff'), getStaffOrderThreads);
router.get('/orders/:customerId', protect, authorize('staff'), getStaffCustomerOrders);
router.patch('/orders/:orderId/status', protect, authorize('staff'), updateStaffOrderStatus);
router.get('/notifications', protect, authorize('staff'), getStaffNotifications);
router.post('/notifications', protect, authorize('staff'), createStaffNotification);

module.exports = router;
