const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/stats
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// GET /api/dashboard/upcoming-appointments
router.get('/upcoming-appointments', dashboardController.getUpcomingAppointments.bind(dashboardController));

// GET /api/dashboard/top-doctors
router.get('/top-doctors', dashboardController.getTopDoctors.bind(dashboardController));

// GET /api/dashboard/booking-chart
router.get('/booking-chart', dashboardController.getBookingStatusChart.bind(dashboardController));

// GET /api/dashboard/data - Get complete dashboard data
router.get('/data', dashboardController.getDashboardData.bind(dashboardController));

module.exports = router;