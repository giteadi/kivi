const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.use(authenticateToken);
const ServiceController = require('../controllers/serviceController');

const serviceController = new ServiceController();

// GET /api/services
router.get('/', serviceController.getServices.bind(serviceController));

// GET /api/services/:id
router.get('/:id', serviceController.getService.bind(serviceController));

// POST /api/services
router.post('/', serviceController.createService.bind(serviceController));

// PUT /api/services/:id
router.put('/:id', serviceController.updateService.bind(serviceController));

// DELETE /api/services/:id
router.delete('/:id', serviceController.deleteService.bind(serviceController));

module.exports = router;