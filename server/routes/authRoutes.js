const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

// POST /api/auth/login
router.post('/login', authController.login.bind(authController));

// POST /api/auth/register
router.post('/register', authController.register.bind(authController));

// GET /api/auth/profile
router.get('/profile', authController.getProfile.bind(authController));

module.exports = router;