const express = require('express');
const router = express.Router();
const IndividualAssessmentController = require('../controllers/individualAssessmentController');

const controller = new IndividualAssessmentController();

// GET /api/individual-assessments - Get all assessments
router.get('/', controller.getAssessments.bind(controller));

// GET /api/individual-assessments/categories - Get all categories
router.get('/categories', controller.getCategories.bind(controller));

// GET /api/individual-assessments/:id - Get single assessment
router.get('/:id', controller.getAssessment.bind(controller));

// POST /api/individual-assessments - Create new assessment (admin only)
router.post('/', controller.createAssessment.bind(controller));

// PUT /api/individual-assessments/:id - Update assessment (admin only)
router.put('/:id', controller.updateAssessment.bind(controller));

// DELETE /api/individual-assessments/:id - Delete assessment (admin only)
router.delete('/:id', controller.deleteAssessment.bind(controller));

module.exports = router;
