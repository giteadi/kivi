const express = require('express');
const ContactQueryController = require('../controllers/contactQueryController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();
const contactQueryController = new ContactQueryController();

// POST /api/contact-queries - Create a new contact query (public route)
router.post('/', contactQueryController.createQuery.bind(contactQueryController));

// GET /api/contact-queries - Get all contact queries (admin only)
router.get('/', authenticateToken, isAdmin, contactQueryController.getAllQueries.bind(contactQueryController));

// GET /api/contact-queries/stats - Get query statistics (admin only)
router.get('/stats', authenticateToken, isAdmin, contactQueryController.getQueryStats.bind(contactQueryController));

// GET /api/contact-queries/:id - Get a single contact query by ID (admin only)
router.get('/:id', authenticateToken, isAdmin, contactQueryController.getQueryById.bind(contactQueryController));

// PUT /api/contact-queries/:id - Update contact query status (admin only)
router.put('/:id', authenticateToken, isAdmin, contactQueryController.updateQueryStatus.bind(contactQueryController));

// DELETE /api/contact-queries/:id - Delete a contact query (admin only)
router.delete('/:id', authenticateToken, isAdmin, contactQueryController.deleteQuery.bind(contactQueryController));

module.exports = router;
