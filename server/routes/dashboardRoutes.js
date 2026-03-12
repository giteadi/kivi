const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, dashboardController.getStats.bind(dashboardController));

// GET /api/dashboard/upcoming-sessions
router.get('/upcoming-sessions', authenticateToken, dashboardController.getUpcomingSessions.bind(dashboardController));

// GET /api/dashboard/top-therapists
router.get('/top-therapists', authenticateToken, dashboardController.getTopTherapists.bind(dashboardController));

// GET /api/dashboard/session-chart
router.get('/session-chart', authenticateToken, dashboardController.getSessionStatusChart.bind(dashboardController));

// GET /api/dashboard/data - Get complete dashboard data
router.get('/data', authenticateToken, dashboardController.getDashboardData.bind(dashboardController));

// GET /api/dashboard/admin/sessions - Get all sessions for admin
router.get('/admin/sessions', authenticateToken, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
}, dashboardController.getAllSessions.bind(dashboardController));

module.exports = router;