const express = require('express');
const router = express.Router();
const AssessmentPackageController = require('../controllers/assessmentPackageController');

const packageController = new AssessmentPackageController();

// GET /api/assessment-packages - Get all packages
router.get('/', packageController.getPackages.bind(packageController));

// GET /api/assessment-packages/categories - Get all categories
router.get('/categories', packageController.getCategories.bind(packageController));

// GET /api/assessment-packages/:id - Get single package
router.get('/:id', packageController.getPackage.bind(packageController));

// POST /api/assessment-packages - Create new package (admin only)
router.post('/', packageController.createPackage.bind(packageController));

// PUT /api/assessment-packages/:id - Update package (admin only)
router.put('/:id', packageController.updatePackage.bind(packageController));

// DELETE /api/assessment-packages/:id - Delete package (admin only)
router.delete('/:id', packageController.deletePackage.bind(packageController));

// POST /api/assessment-packages/assign - Assign package to student
router.post('/assign', packageController.assignPackageToStudent.bind(packageController));

// GET /api/assessment-packages/student/:student_id - Get student's packages
router.get('/student/:student_id', packageController.getStudentPackages.bind(packageController));

// PUT /api/assessment-packages/student-package/:id - Update student package status
router.put('/student-package/:id', packageController.updateStudentPackageStatus.bind(packageController));

module.exports = router;
