const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// IMPORTANT: Specific routes MUST come before generic parameter routes like /:id

// Get all events (with optional filters)
router.get('/', calendarController.getEvents);

// Get all assessments for a student (with package/tools details) - SPECIFIC ROUTE FIRST
router.get('/student-assessments/:studentId', calendarController.getStudentAssessments);

// Get event statistics
router.get('/stats', calendarController.getEventStats);

// Get events by specific date
router.get('/date/:date', calendarController.getEventsByDate);

// Create new event
router.post('/', calendarController.createEvent);

// Get single event by ID - GENERIC ROUTE LAST
router.get('/:id', calendarController.getEventById);

// Update event
router.put('/:id', calendarController.updateEvent);

// Delete event
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
