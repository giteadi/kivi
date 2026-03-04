const express = require('express');
const SessionController = require('../controllers/sessionController');

const router = express.Router();
const sessionController = new SessionController();

// GET /api/sessions - Get all sessions
router.get('/', sessionController.getSessions.bind(sessionController));

// GET /api/sessions/:id - Get single session
router.get('/:id', sessionController.getSession.bind(sessionController));

// POST /api/sessions - Create new session
router.post('/', sessionController.createSession.bind(sessionController));

// PUT /api/sessions/:id - Update session
router.put('/:id', sessionController.updateSession.bind(sessionController));

// DELETE /api/sessions/:id - Delete session
router.delete('/:id', sessionController.deleteSession.bind(sessionController));

// GET /api/sessions/upcoming - Get upcoming sessions
router.get('/upcoming', sessionController.getUpcomingSessions.bind(sessionController));

module.exports = router;