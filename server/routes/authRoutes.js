const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const authController = new AuthController();

// POST /api/auth/login - Public route
router.post('/login', authController.login.bind(authController));

// POST /api/auth/register - Public route
router.post('/register', authController.register.bind(authController));

// GET /api/auth/profile - Protected route
router.get('/profile', authenticateToken, authController.getProfile.bind(authController));

module.exports = router;