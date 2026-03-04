const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// GET /api/dashboard/upcoming-sessions
router.get('/upcoming-sessions', dashboardController.getUpcomingSessions.bind(dashboardController));

// GET /api/dashboard/top-therapists
router.get('/top-therapists', dashboardController.getTopTherapists.bind(dashboardController));

// GET /api/dashboard/session-chart
router.get('/session-chart', dashboardController.getSessionStatusChart.bind(dashboardController));

// GET /api/dashboard/data - Get complete dashboard data
router.get('/data', dashboardController.getDashboardData.bind(dashboardController));

module.exports = router;