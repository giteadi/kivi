const express = require('express');
const router = express.Router();
const AssessmentResultController = require('../controllers/assessmentResultController');

const assessmentResultController = new AssessmentResultController();

// POST /api/assessment-results - Save assessment item results
router.post('/', assessmentResultController.saveResults.bind(assessmentResultController));

// GET /api/assessment-results/assessment/:assessmentId - Get results for an assessment
router.get('/assessment/:assessmentId', assessmentResultController.getResults.bind(assessmentResultController));

// DELETE /api/assessment-results/assessment/:assessmentId - Delete results for an assessment
router.delete('/assessment/:assessmentId', assessmentResultController.deleteResults.bind(assessmentResultController));

module.exports = router;
