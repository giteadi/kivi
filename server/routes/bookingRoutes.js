const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const BookingController = require('../controllers/bookingController');

const bookingController = new BookingController();

// GET /api/booking/therapists - Get available therapists for booking
router.get('/therapists', (req, res) => bookingController.getAvailableTherapists(req, res));

// GET /api/booking/therapists/:therapistId/availability/:date - Get therapist availability
router.get('/therapists/:therapistId/availability/:date', (req, res) => bookingController.getTherapistAvailability(req, res));

// GET /api/booking/therapists/:therapistId/slots - Get available time slots for therapist
router.get('/therapists/:therapistId/slots', (req, res) => bookingController.getAvailableTimeSlots(req, res));

// POST /api/booking/session - Book a session (protected)
router.post('/session', authenticateToken, (req, res) => bookingController.bookSession(req, res));

// GET /api/booking/therapists/:therapistId/calendar - Get booking calendar
router.get('/therapists/:therapistId/calendar', (req, res) => bookingController.getBookingCalendar(req, res));

module.exports = router;
