const express = require('express');
const { getDashboardSummary, getUsers, createUser, updateUser, deleteUser, getNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/adminController');
const {
	createMedicine,
	updateMedicine,
	deleteMedicine
} = require('../controllers/medicineController');
const {
	createCategory,
	updateCategory,
	deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboardSummary);
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/users', protect, authorize('admin'), createUser);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.post('/medicines', protect, authorize('admin'), createMedicine);
router.put('/medicines/:id', protect, authorize('admin'), updateMedicine);
router.delete('/medicines/:id', protect, authorize('admin'), deleteMedicine);
router.post('/categories', protect, authorize('admin'), createCategory);
router.put('/categories/:id', protect, authorize('admin'), updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);
router.get('/notifications', protect, authorize('admin'), getNotifications);
router.patch('/notifications/:id/read', protect, authorize('admin'), markNotificationRead);
router.patch('/notifications/read-all', protect, authorize('admin'), markAllNotificationsRead);

module.exports = router;
