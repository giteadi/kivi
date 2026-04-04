const express = require('express');
const router = express.Router();
const multer = require('multer');
const TemplateController = require('../controllers/templateController');

const templateController = new TemplateController();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// GET /api/templates
router.get('/', templateController.getTemplates.bind(templateController));

// POST /api/templates/upload - Upload Excel with Python parsing
router.post('/upload', upload.single('file'), templateController.uploadExcel.bind(templateController));

// POST /api/templates
router.post('/', templateController.createTemplate.bind(templateController));

// POST /api/templates/:id/generate-report - Must come before /:id
router.post('/:id/generate-report', templateController.generateReportFromTemplate.bind(templateController));

// GET /api/templates/:id
router.get('/:id', templateController.getTemplate.bind(templateController));

// PUT /api/templates/:id
router.put('/:id', templateController.updateTemplate.bind(templateController));

// DELETE /api/templates/:id
router.delete('/:id', templateController.deleteTemplate.bind(templateController));

// POST /api/templates/bulk-delete - Bulk delete templates
router.post('/bulk-delete', templateController.bulkDeleteTemplates.bind(templateController));

module.exports = router;