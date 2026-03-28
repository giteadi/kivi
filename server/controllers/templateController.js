const Template = require('../models/Template');

class TemplateController {
  constructor() {
    this.templateModel = new Template();
  }

  // Get all templates
  async getTemplates(req, res) {
    try {
      console.log('🔍 GET TEMPLATES: Fetching templates with filters:', req.query);
      const filters = req.query;
      const templates = await this.templateModel.getTemplates(filters);
      
      // Parse template_data for each template
      const parsedTemplates = templates.map(template => {
        if (template.template_data) {
          try {
            template.template_data = JSON.parse(template.template_data);
          } catch (error) {
            console.error('Error parsing template data:', error);
            template.template_data = {};
          }
        }
        return template;
      });

      console.log(`✅ GET TEMPLATES SUCCESS: Found ${parsedTemplates.length} templates`);
      res.json({
        success: true,
        data: parsedTemplates
      });
    } catch (error) {
      console.error('❌ GET TEMPLATES ERROR:', error);
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
      console.log(`🔍 GET TEMPLATE: Fetching template with ID: ${id}`);
      
      const template = await this.templateModel.getTemplateById(id);

      if (!template) {
        console.log(`❌ GET TEMPLATE FAILED: Template not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      console.log(`✅ GET TEMPLATE SUCCESS: Template ${id} retrieved`);
      res.json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error(`❌ GET TEMPLATE ERROR: Failed to fetch template ${id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create template
  async createTemplate(req, res) {
    try {
      console.log('🆕 CREATE TEMPLATE: Starting template creation');
      console.log(`📤 REQUEST BODY:`, {
        name: req.body.name,
        type: req.body.type,
        studentName: req.body.studentName,
        subscalesCount: req.body.subscales ? req.body.subscales.length : 0
      });

      const templateId = await this.templateModel.createTemplate(req.body);
      console.log(`✅ CREATE TEMPLATE SUCCESS: Template created with ID: ${templateId}`);

      res.status(201).json({
        success: true,
        data: { id: templateId },
        message: 'Template created successfully'
      });
    } catch (error) {
      console.error('❌ CREATE TEMPLATE ERROR: Failed to create template:', error);
      console.error('❌ ERROR DETAILS:', error.sqlMessage || error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.sqlMessage || error.message
      });
    }
  }

  // Update template
  async updateTemplate(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔄 UPDATE TEMPLATE: Starting update for template ID: ${id}`);
      console.log(`📤 REQUEST BODY:`, {
        name: req.body.name,
        type: req.body.type,
        studentName: req.body.studentName,
        subscalesCount: req.body.subscales ? req.body.subscales.length : 0
      });

      const updated = await this.templateModel.updateTemplate(id, req.body);

      if (!updated) {
        console.log(`❌ UPDATE TEMPLATE FAILED: Template not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      console.log(`✅ UPDATE TEMPLATE SUCCESS: Template ${id} updated successfully`);
      res.json({
        success: true,
        message: 'Template updated successfully'
      });
    } catch (error) {
      console.error(`❌ UPDATE TEMPLATE ERROR: Failed to update template ${id}:`, error);
      console.error('❌ ERROR DETAILS:', error.sqlMessage || error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.sqlMessage || error.message
      });
    }
  }

  // Delete template
  async deleteTemplate(req, res) {
    try {
      const { id } = req.params;
      console.log(`🗑️ DELETE TEMPLATE: Starting deletion of template ID: ${id}`);
      
      const deleted = await this.templateModel.delete(id);

      if (!deleted) {
        console.log(`❌ DELETE TEMPLATE FAILED: Template not found with ID: ${id}`);
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      console.log(`✅ DELETE TEMPLATE SUCCESS: Template ${id} deleted successfully`);
      res.json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error(`❌ DELETE TEMPLATE ERROR: Failed to delete template ${id}:`, error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Generate report from template
  async generateReportFromTemplate(req, res) {
    console.log(`📄 GENERATE REPORT METHOD CALLED!`);
    console.log(`📄 PARAMS:`, req.params);
    console.log(`📄 BODY:`, req.body);
    
    try {
      const templateId = req.params.id;
      const { studentId, examineeId, customData } = req.body || {};
      
      // Use studentId or examineeId (whichever is provided)
      const actualStudentId = studentId || examineeId;
      
      // Parse templateId to integer
      const parsedTemplateId = parseInt(templateId);
      const parsedStudentId = parseInt(actualStudentId);
      
      console.log(`📄 GENERATE REPORT: Using template ${parsedTemplateId} for student ${parsedStudentId}`);
      console.log(`📄 ORIGINAL PARAMS: templateId=${templateId}, studentId=${studentId}, examineeId=${examineeId}`);
      console.log(`📄 PARSED PARAMS: templateId=${parsedTemplateId}, studentId=${parsedStudentId}`);
      
      if (!parsedStudentId || isNaN(parsedStudentId)) {
        return res.status(400).json({
          success: false,
          message: 'Student ID is required and must be a valid number'
        });
      }
      
      console.log(`📄 REQUEST BODY:`, JSON.stringify(req.body, null, 2));
      
      // Get template
      console.log(`📄 FETCHING TEMPLATE WITH ID: ${parsedTemplateId} (type: ${typeof parsedTemplateId})`);
      const template = await this.templateModel.findById(parsedTemplateId);
      console.log(`📄 TEMPLATE RESULT:`, template ? 'FOUND' : 'NOT FOUND');
      console.log(`📄 TEMPLATE DETAILS:`, template ? JSON.stringify(template, null, 2) : 'NULL');
      
      if (!template) {
        console.log(`📄 TEMPLATE NOT FOUND FOR ID: ${templateId}`);
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      // Parse template data if it exists
      if (template.template_data) {
        try {
          template.template_data = JSON.parse(template.template_data);
        } catch (error) {
          console.error('Error parsing template data:', error);
          template.template_data = {};
        }
      }

      console.log(`📄 TEMPLATE FOUND: ${template.name}`);

      // Get student data
      const Student = require('../models/Student');
      const studentModel = new Student();
      const student = await studentModel.getStudentWithSessions(parsedStudentId);
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Merge template with student data and custom data
      const reportData = {
        ...template.template_data,
        studentName: student.first_name + ' ' + student.last_name,
        studentId: student.id,
        ...customData
      };

      console.log(`✅ GENERATE REPORT SUCCESS: Report generated for student ${parsedStudentId}`);
      res.json({
        success: true,
        data: reportData,
        message: 'Report generated successfully'
      });
    } catch (error) {
      console.error('❌ GENERATE REPORT ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = TemplateController;