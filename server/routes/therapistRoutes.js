const express = require('express');
const TherapistController = require('../controllers/therapistController');

const router = express.Router();

let therapistController;
try {
  therapistController = new TherapistController();
  console.log('✅ TherapistController instantiated successfully');
} catch (error) {
  console.error('❌ Failed to instantiate TherapistController:', error);
  throw error;
}

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

// GET /api/therapists/:id/availability - Get therapist availability
router.get('/:id/availability', therapistController.getTherapistAvailability.bind(therapistController));

// PUT /api/therapists/:id/availability - Update therapist availability
router.put('/:id/availability', therapistController.updateTherapistAvailability.bind(therapistController));

// GET /api/therapists/my/availability - Get current user's availability
router.get('/my/availability', therapistController.getMyAvailability.bind(therapistController));

// PUT /api/therapists/my/availability - Update current user's availability
router.put('/my/availability', therapistController.updateMyAvailability.bind(therapistController));

module.exports = router;