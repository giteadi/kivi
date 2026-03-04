const express = require('express');
const ProgrammeController = require('../controllers/programmeController');

const router = express.Router();
const programmeController = new ProgrammeController();

// GET /api/programmes - Get all programmes
router.get('/', programmeController.getProgrammes.bind(programmeController));

// GET /api/programmes/:id - Get single programme
router.get('/:id', programmeController.getProgramme.bind(programmeController));

// POST /api/programmes - Create new programme
router.post('/', programmeController.createProgramme.bind(programmeController));

// PUT /api/programmes/:id - Update programme
router.put('/:id', programmeController.updateProgramme.bind(programmeController));

// DELETE /api/programmes/:id - Delete programme
router.delete('/:id', programmeController.deleteProgramme.bind(programmeController));

module.exports = router;