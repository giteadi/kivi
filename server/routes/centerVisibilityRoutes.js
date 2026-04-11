const express = require('express');
const CenterVisibilityController = require('../controllers/centerVisibilityController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();
const centerVisibilityController = new CenterVisibilityController();

// GET /api/center-visibility - Get all centers with visibility settings (admin only)
router.get('/', authenticateToken, isAdmin, centerVisibilityController.getAllCentersVisibility.bind(centerVisibilityController));

// GET /api/center-visibility/:centerId - Get visibility settings for specific center (admin only)
router.get('/:centerId', authenticateToken, isAdmin, centerVisibilityController.getVisibilitySettings.bind(centerVisibilityController));

// PUT /api/center-visibility/:centerId - Update visibility settings for a center (admin only)
router.put('/:centerId', authenticateToken, isAdmin, centerVisibilityController.updateVisibilitySettings.bind(centerVisibilityController));

// POST /api/center-visibility/batch - Batch update visibility settings (admin only)
router.post('/batch', authenticateToken, isAdmin, centerVisibilityController.batchUpdateVisibility.bind(centerVisibilityController));

// GET /api/center-visibility/:centerId/check/:field - Check if specific field is visible (authenticated users)
router.get('/:centerId/check/:field', authenticateToken, centerVisibilityController.checkDataVisibility.bind(centerVisibilityController));

module.exports = router;
