const express = require('express');
const StudentController = require('../controllers/studentController');
const AssessmentController = require('../controllers/assessmentController');

const router = express.Router();
const studentController = new StudentController();
const assessmentController = new AssessmentController();

// GET /api/students - Get all students
router.get('/', studentController.getStudents.bind(studentController));

// GET /api/students/:id - Get single student
router.get('/:id', studentController.getStudent.bind(studentController));

// POST /api/students - Create new student
router.post('/', studentController.createStudent.bind(studentController));

// PUT /api/students/:id - Update student
router.put('/:id', studentController.updateStudent.bind(studentController));

// DELETE /api/students/:id - Delete student
router.delete('/:id', studentController.deleteStudent.bind(studentController));

// POST /api/students/export - Export students data
router.post('/export', studentController.exportStudents.bind(studentController));

// Assessment routes for students
router.get('/:studentId/assessments', assessmentController.getAssessments.bind(assessmentController));

// Standalone assessment routes
router.post('/assessments', assessmentController.createAssessment.bind(assessmentController));
router.delete('/assessments/:id', assessmentController.deleteAssessment.bind(assessmentController));
router.post('/assessments/generate-report', assessmentController.generateReport.bind(assessmentController));

// Report Form Routes (for ExamineeReportForm)
router.put('/:id/report', studentController.saveReport.bind(studentController));
router.get('/:id/report', studentController.getReport.bind(studentController));

module.exports = router;