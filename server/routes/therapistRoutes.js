const express = require('express');
const TherapistController = require('../controllers/therapistController');

const router = express.Router();
const therapistController = new TherapistController();

// GET /api/therapists - Get all therapists
router.get('/', therapistController.getTherapists.bind(therapistController));

// GET /api/therapists/:id - Get single therapist
router.get('/:id', therapistController.getTherapist.bind(therapistController));

// POST /api/therapists - Create new therapist
router.post('/', therapistController.createTherapist.bind(therapistController));

// PUT /api/therapists/:id - Update therapist
router.put('/:id', therapistController.updateTherapist.bind(therapistController));

// DELETE /api/therapists/:id - Delete therapist
router.delete('/:id', therapistController.deleteTherapist.bind(therapistController));

module.exports = router;