const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

const patientController = new PatientController();

// GET /api/patients
router.get('/', patientController.getPatients.bind(patientController));

// GET /api/patients/:id
router.get('/:id', patientController.getPatient.bind(patientController));

// POST /api/patients
router.post('/', patientController.createPatient.bind(patientController));

// PUT /api/patients/:id
router.put('/:id', patientController.updatePatient.bind(patientController));

// DELETE /api/patients/:id
router.delete('/:id', patientController.deletePatient.bind(patientController));

module.exports = router;