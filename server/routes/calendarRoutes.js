const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get all events (with optional filters)
router.get('/', calendarController.getEvents);

// Get event statistics
router.get('/stats', calendarController.getEventStats);

// Get events by specific date
router.get('/date/:date', calendarController.getEventsByDate);

// Get single event by ID
router.get('/:id', calendarController.getEventById);

// Create new event
router.post('/', calendarController.createEvent);

// Update event
router.put('/:id', calendarController.updateEvent);

// Delete event
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
