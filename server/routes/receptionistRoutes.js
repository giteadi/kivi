const express = require('express');
const router = express.Router();
const ReceptionistController = require('../controllers/receptionistController');

const receptionistController = new ReceptionistController();

// GET /api/receptionists
router.get('/', receptionistController.getReceptionists.bind(receptionistController));

// GET /api/receptionists/:id
router.get('/:id', receptionistController.getReceptionist.bind(receptionistController));

// POST /api/receptionists
router.post('/', receptionistController.createReceptionist.bind(receptionistController));

// PUT /api/receptionists/:id
router.put('/:id', receptionistController.updateReceptionist.bind(receptionistController));

// DELETE /api/receptionists/:id
router.delete('/:id', receptionistController.deleteReceptionist.bind(receptionistController));

module.exports = router;