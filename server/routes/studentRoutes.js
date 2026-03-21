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

// Assessment routes for students
router.get('/:studentId/assessments', assessmentController.getAssessments.bind(assessmentController));

module.exports = router;