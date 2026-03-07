const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// User dashboard data
router.get('/sessions', authenticateToken, (req, res) => userController.getUserSessions(req, res));
router.get('/payments', authenticateToken, (req, res) => userController.getUserPayments(req, res));
router.get('/therapist', authenticateToken, (req, res) => userController.getUserTherapist(req, res));
router.get('/stats', authenticateToken, (req, res) => userController.getUserStats(req, res));

// User profile
router.put('/profile', authenticateToken, (req, res) => userController.updateUserProfile(req, res));

module.exports = router;
