const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// User dashboard data
router.get('/sessions', authenticateToken, userController.getUserSessions);
router.get('/payments', authenticateToken, userController.getUserPayments);
router.get('/therapist', authenticateToken, userController.getUserTherapist);
router.get('/stats', authenticateToken, userController.getUserStats);

module.exports = router;
