const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessmentController');

// Create assessment controller instance
const assessmentController = new AssessmentController();

// Routes
router.get('/students/:studentId/assessments', assessmentController.getAssessments.bind(assessmentController));
router.post('/assessments', assessmentController.createAssessment.bind(assessmentController));
router.delete('/assessments/:id', assessmentController.deleteAssessment.bind(assessmentController));
router.post('/assessments/generate-report', assessmentController.generateReport.bind(assessmentController));

module.exports = router;
