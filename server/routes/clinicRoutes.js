const express = require('express');
const router = express.Router();
const ClinicController = require('../controllers/clinicController');

const clinicController = new ClinicController();

// GET /api/clinics
router.get('/', clinicController.getClinics.bind(clinicController));

// GET /api/clinics/:id
router.get('/:id', clinicController.getClinic.bind(clinicController));

// POST /api/clinics
router.post('/', clinicController.createClinic.bind(clinicController));

// PUT /api/clinics/:id
router.put('/:id', clinicController.updateClinic.bind(clinicController));

// DELETE /api/clinics/:id
router.delete('/:id', clinicController.deleteClinic.bind(clinicController));

module.exports = router;