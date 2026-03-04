const express = require('express');
const router = express.Router();
const EncounterController = require('../controllers/encounterController');

const encounterController = new EncounterController();

// GET /api/encounters
router.get('/', encounterController.getEncounters.bind(encounterController));

// GET /api/encounters/:id
router.get('/:id', encounterController.getEncounter.bind(encounterController));

// POST /api/encounters
router.post('/', encounterController.createEncounter.bind(encounterController));

// PUT /api/encounters/:id
router.put('/:id', encounterController.updateEncounter.bind(encounterController));

// DELETE /api/encounters/:id
router.delete('/:id', encounterController.deleteEncounter.bind(encounterController));

module.exports = router;