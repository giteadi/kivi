const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const ReportController = require('../controllers/reportController');

const router = express.Router();

router.use(authenticateToken);
const reportController = new ReportController();

// Routes
router.post('/generate-assessment-report', reportController.generateAssessmentReport.bind(reportController));

module.exports = router;