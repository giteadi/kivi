const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctorController');

const doctorController = new DoctorController();

// GET /api/doctors
router.get('/', doctorController.getDoctors.bind(doctorController));

// GET /api/doctors/:id
router.get('/:id', doctorController.getDoctor.bind(doctorController));

// POST /api/doctors
router.post('/', doctorController.createDoctor.bind(doctorController));

// PUT /api/doctors/:id
router.put('/:id', doctorController.updateDoctor.bind(doctorController));

// DELETE /api/doctors/:id
router.delete('/:id', doctorController.deleteDoctor.bind(doctorController));

module.exports = router;