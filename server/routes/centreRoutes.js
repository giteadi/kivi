const express = require('express');
const CentreController = require('../controllers/centreController');

const router = express.Router();
const centreController = new CentreController();

// GET /api/centres - Get all centres
router.get('/', centreController.getCentres.bind(centreController));

// GET /api/centres/:id - Get single centre
router.get('/:id', centreController.getCentre.bind(centreController));

// POST /api/centres - Create new centre
router.post('/', centreController.createCentre.bind(centreController));

// PUT /api/centres/:id - Update centre
router.put('/:id', centreController.updateCentre.bind(centreController));

// DELETE /api/centres/:id - Delete centre
router.delete('/:id', centreController.deleteCentre.bind(centreController));

module.exports = router;