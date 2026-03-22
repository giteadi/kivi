const express = require('express');
const ExamineeController = require('../controllers/examineeController');

const router = express.Router();
const examineeController = new ExamineeController();

// Routes
router.get('/', examineeController.getExaminees.bind(examineeController));
router.post('/', examineeController.createExaminee.bind(examineeController));
router.post('/assessment', examineeController.createAssessmentWithScores.bind(examineeController));

module.exports = router;
