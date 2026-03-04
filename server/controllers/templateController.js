const Template = require('../models/Template');

class TemplateController {
  constructor() {
    this.templateModel = new Template();
  }

  // Get all templates
  async getTemplates(req, res) {
    try {
      const filters = req.query;
      const templates = await this.templateModel.getTemplates(filters);

      res.json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Get templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single template
  async getTemplate(req, res) {
    try {
      const { id } = req.params;
      const template = await this.templateModel.findById(id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('Get template error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  // Create template
  async createTemplate(req, res) {
    try {
      const templateData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const templateId = await this.templateModel.create(templateData);

      res.status(201).json({
        success: true,
        data: { id: templateId },
        message: 'Template created successfully'
      });
    } catch (error) {
      console.error('Create template error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update template
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.templateModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template updated successfully'
      });
    } catch (error) {
      console.error('Update template error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete template
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.templateModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('Delete template error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = TemplateController;