const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');

const templateController = new TemplateController();

// GET /api/templates
router.get('/', templateController.getTemplates.bind(templateController));

// GET /api/templates/:id
router.get('/:id', templateController.getTemplate.bind(templateController));

// POST /api/templates
router.post('/', templateController.createTemplate.bind(templateController));

// PUT /api/templates/:id
router.put('/:id', templateController.updateTemplate.bind(templateController));

// DELETE /api/templates/:id
router.delete('/:id', templateController.deleteTemplate.bind(templateController));

module.exports = router;