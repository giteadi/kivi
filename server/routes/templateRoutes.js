const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const TemplateController = require('../controllers/templateController');

const templateController = new TemplateController();

// CORS middleware for this route
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
};

// Configure multer for file uploads with original extension
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// GET /api/templates
router.get('/', templateController.getTemplates.bind(templateController));

// POST /api/templates/upload - Upload Excel with Python parsing (with CORS)
router.options('/upload', corsMiddleware);
router.post('/upload', corsMiddleware, upload.single('file'), templateController.uploadExcel.bind(templateController));

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