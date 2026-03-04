const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/appointmentController');

const appointmentController = new AppointmentController();

// GET /api/appointments
router.get('/', appointmentController.getAppointments.bind(appointmentController));

// GET /api/appointments/:id
router.get('/:id', appointmentController.getAppointment.bind(appointmentController));

// POST /api/appointments
router.post('/', appointmentController.createAppointment.bind(appointmentController));

// PUT /api/appointments/:id
router.put('/:id', appointmentController.updateAppointment.bind(appointmentController));

// DELETE /api/appointments/:id
router.delete('/:id', appointmentController.deleteAppointment.bind(appointmentController));

module.exports = router;