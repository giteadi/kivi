const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const BookingController = require('../controllers/bookingController');

const bookingController = new BookingController();

// GET /api/booking/therapists - Get available therapists for booking
router.get('/therapists', bookingController.getAvailableTherapists.bind(bookingController));

// GET /api/booking/therapists/:therapistId/availability/:date - Get therapist availability
router.get('/therapists/:therapistId/availability/:date', bookingController.getTherapistAvailability.bind(bookingController));

// GET /api/booking/therapists/:therapistId/slots - Get available time slots for therapist
router.get('/therapists/:therapistId/slots', bookingController.getAvailableTimeSlots.bind(bookingController));

// POST /api/booking/session - Book a session (protected)
router.post('/session', authenticateToken, bookingController.bookSession.bind(bookingController));

// GET /api/booking/therapists/:therapistId/calendar - Get booking calendar
router.get('/therapists/:therapistId/calendar', bookingController.getBookingCalendar.bind(bookingController));

module.exports = router;
