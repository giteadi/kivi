const Template = require('../models/Template');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class TemplateController {
  constructor() {
    this.templateModel = new Template();
  }

  // Parse Excel using Python (for complex templates)
  parseExcelWithPython(filePath) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, '..', 'scripts', 'parse_excel.py');
      const cmd = `python3 "${scriptPath}" "${filePath}"`;
      
      console.log('🐍 PYTHON: Executing command:', cmd);
      
      exec(cmd, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ PYTHON ERROR:', error);
          console.error('❌ PYTHON STDERR:', stderr);
          reject(new Error(`Python parsing failed: ${error.message}`));
          return;
        }
        
        if (stderr) {
          console.warn('⚠️ PYTHON STDERR:', stderr);
        }
        
        try {
          const result = JSON.parse(stdout);
          console.log('✅ PYTHON: Parsed successfully');
          console.log('📊 PYTHON: Sheets found:', result.names?.length);
          if (result.sheets && result.names?.length > 0) {
            const firstSheet = result.sheets[result.names[0]];
            console.log('📊 PYTHON: First sheet rows:', firstSheet?.length);
            console.log('📊 PYTHON: First row sample:', firstSheet?.[0]?.slice(0, 5));
          }
          resolve(result);
        } catch (e) {
          console.error('❌ JSON PARSE ERROR:', e);
          console.error('❌ RAW OUTPUT:', stdout);
          reject(new Error('Failed to parse Python output'));
        }
      });
    });
  }

  // Get all templates
  async getTemplates(req, res) {
    try {
      console.log('🔍 GET TEMPLATES: Fetching templates with filters:', req.query);
      const filters = req.query;
      const templates = await this.templateModel.getTemplates(filters);
      
      console.log(`📋 RAW TEMPLATES FROM DB: ${templates.length} templates found`);
      
      // Parse template_data for each template
      const parsedTemplates = templates.map(template => {
        if (template.template_data) {
          try {
            template.template_data = JSON.parse(template.template_data);
            console.log(`📊 Template ${template.id} (${template.name}): template_data parsed successfully`);
            console.log(`📊 Template ${template.id} sheets:`, Object.keys(template.template_data?.sheets || {}));
          } catch (error) {
            console.error(`❌ Error parsing template ${template.id} data:`, error);
            template.template_data = {};
          }
        } else {
          console.warn(`⚠️ Template ${template.id} has NO template_data`);
        }
        return template;
      });

      console.log(`✅ GET TEMPLATES SUCCESS: Found ${parsedTemplates.length} templates`);
      // Log first template sample if exists
      if (parsedTemplates[0]) {
        console.log(`📊 SAMPLE TEMPLATE:`, {
          id: parsedTemplates[0].id,
          name: parsedTemplates[0].name,
          type: parsedTemplates[0].type,
          sheetNames: Object.keys(parsedTemplates[0].template_data?.sheets || {})
        });
      }
      
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
        description: req.body.description,
      });
      
      // DEBUG: Log template_data structure
      let templateDataToSave = req.body.template_data;
      
      // If template_data is a string, parse it (frontend may stringify it)
      if (typeof templateDataToSave === 'string') {
        try {
          templateDataToSave = JSON.parse(templateDataToSave);
          console.log('📊 TEMPLATE_DATA was STRING, parsed successfully');
        } catch (e) {
          console.error('❌ Failed to parse template_data string:', e);
        }
      }
      
      if (templateDataToSave) {
        console.log('📊 TEMPLATE_DATA STRUCTURE:', JSON.stringify(templateDataToSave, null, 2).substring(0, 1000));
        console.log('📊 SHEETS COUNT:', Object.keys(templateDataToSave.sheets || {}).length);
        console.log('📊 SHEET NAMES:', Object.keys(templateDataToSave.sheets || {}));
        // Log first sheet sample data
        const firstSheet = Object.values(templateDataToSave.sheets || {})[0];
        if (firstSheet) {
          console.log('📊 FIRST SHEET ROWS:', firstSheet.length);
          console.log('📊 FIRST SHEET SAMPLE (first 3 rows):', firstSheet.slice(0, 3));
        }
      } else {
        console.warn('⚠️ NO TEMPLATE_DATA in request!');
      }
      
      // Update req.body with parsed data
      req.body.template_data = templateDataToSave;

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

  // Bulk delete templates
  async bulkDeleteTemplates(req, res) {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of template IDs to delete'
        });
      }

      console.log(`🗑️ BULK DELETE: Deleting ${ids.length} templates:`, ids);

      // Delete templates one by one and count successes
      let deletedCount = 0;
      const errors = [];

      for (const id of ids) {
        try {
          const deleted = await this.templateModel.delete(id);
          if (deleted) {
            deletedCount++;
          } else {
            errors.push(`Template ${id} not found`);
          }
        } catch (err) {
          console.error(`Error deleting template ${id}:`, err);
          errors.push(`Template ${id}: ${err.message}`);
        }
      }

      console.log(`✅ BULK DELETE SUCCESS: Deleted ${deletedCount}/${ids.length} templates`);
      
      res.json({
        success: true,
        deletedCount,
        totalRequested: ids.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Deleted ${deletedCount} template(s) successfully`
      });
    } catch (error) {
      console.error('❌ BULK DELETE ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during bulk delete'
      });
    }
  }

  // Upload Excel with Python parsing
  async uploadExcel(req, res) {
    try {
      console.log('📤 UPLOAD EXCEL: Starting upload with Python parsing');
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname || req.file.filename;
      
      console.log('📤 UPLOAD EXCEL: File received:', fileName);
      console.log('📤 UPLOAD EXCEL: File path:', filePath);

      // Parse using Python
      const parsedData = await this.parseExcelWithPython(filePath);
      
      if (!parsedData.ok) {
        return res.status(400).json({
          success: false,
          message: 'Failed to parse Excel: ' + parsedData.error
        });
      }

      // Create template data
      const templateData = {
        name: fileName.replace(/\.(xlsx?|csv)$/i, ""),
        type: "import",
        description: `${parsedData.names.length} sheet(s) • ${fileName}`,
        template_data: {
          sheets: parsedData.sheets,
          sheetNames: parsedData.names,
          row_heights: parsedData.row_heights || {}  // ← ADD: row_heights from parser
        },
        excel_filename: fileName
      };

      // Save to database
      const templateId = await this.templateModel.createTemplate(templateData);
      
      // Cleanup temp file
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });

      console.log(`✅ UPLOAD EXCEL SUCCESS: Template created with ID: ${templateId}`);

      res.status(201).json({
        success: true,
        data: { 
          id: templateId,
          name: templateData.name,
          sheets: parsedData.names.length
        },
        message: 'Excel uploaded and parsed successfully'
      });
    } catch (error) {
      console.error('❌ UPLOAD EXCEL ERROR:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
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