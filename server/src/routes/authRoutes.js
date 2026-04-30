const express = require('express');
const { registerUser, loginUser, getMe, logoutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutUser);

module.exports = router;
