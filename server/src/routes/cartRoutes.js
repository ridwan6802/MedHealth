const express = require('express');
const {
	getCart,
	addToCart,
	updateCartItem,
	removeFromCart,
	clearCart
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/:medicineId', protect, updateCartItem);
router.delete('/:medicineId', protect, removeFromCart);
router.delete('/', protect, clearCart);

module.exports = router;
