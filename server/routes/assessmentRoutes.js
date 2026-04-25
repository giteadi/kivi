const express = require('express');
const router = express.Router();
const AssessmentController = require('../controllers/assessmentController');

// Create assessment controller instance
const assessmentController = new AssessmentController();

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Assessment routes working!' });
});

// Routes
router.get('/students/:studentId/assessments', assessmentController.getAssessments.bind(assessmentController));
router.post('/', assessmentController.createAssessment.bind(assessmentController));
router.put('/:id', assessmentController.updateAssessment.bind(assessmentController));
router.post('/:id', assessmentController.updateAssessment.bind(assessmentController)); // Temporary POST route for update
router.delete('/:id', assessmentController.deleteAssessment.bind(assessmentController));
router.post('/generate-report', assessmentController.generateReport.bind(assessmentController));

module.exports = router;
