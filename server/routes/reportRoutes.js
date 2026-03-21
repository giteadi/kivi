const express = require('express');
const ReportController = require('../controllers/reportController');

const router = express.Router();
const reportController = new ReportController();

// Routes
router.post('/generate-assessment-report', reportController.generateAssessmentReport.bind(reportController));

module.exports = router;
