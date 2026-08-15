const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const ExamineeController = require('../controllers/examineeController');

const router = express.Router();

router.use(authenticateToken);
const examineeController = new ExamineeController();

// Routes
router.get('/', examineeController.getExaminees.bind(examineeController));
router.post('/', examineeController.createExaminee.bind(examineeController));
router.post('/assessment', examineeController.createAssessmentWithScores.bind(examineeController));

module.exports = router;