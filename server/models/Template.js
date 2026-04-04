const BaseModel = require('./BaseModel');

class Template extends BaseModel {
  constructor() {
    super('kivi_templates');
  }

  // Get templates with filters
  async getTemplates(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.type) {
      conditions += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.status) {
      conditions += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.createdBy) {
      conditions += ' AND created_by = ?';
      params.push(filters.createdBy);
    }

    conditions += ' ORDER BY created_at DESC';

    return await this.findAll(conditions, params);
  }

  // Get active templates
  async getActiveTemplates() {
    const conditions = 'WHERE status = "active" ORDER BY name';
    return await this.findAll(conditions);
  }

  // Get template by ID with parsed data
  async getTemplateById(id) {
    const template = await this.findById(id);
    if (template && template.template_data) {
      try {
        template.template_data = JSON.parse(template.template_data);
      } catch (error) {
        console.error('Error parsing template data:', error);
        template.template_data = {};
      }
    }
    return template;
  }

  // Create template with JSON data
  async createTemplate(data) {
    const templateData = {
      name: data.name,
      type: data.type || 'ADHDT2',
      description: data.description || '',
      template_data: typeof data.template_data === 'string' ? data.template_data : JSON.stringify(data.template_data || data),
      status: data.status || 'active',
      created_by: data.createdBy || data.created_by || null,
      excel_filename: data.excel_filename || null,
      source_template_id: data.source_template_id || null,
      is_merged: data.is_merged || 0,
      merged_from: data.merged_from || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    return await this.create(templateData);
  }

  // Update template with JSON data
  async updateTemplate(id, data) {
    const templateData = {
      name: data.name,
      type: data.type || 'ADHDT2',
      description: data.description || '',
      template_data: typeof data.template_data === 'string' ? data.template_data : JSON.stringify(data.template_data || data),
      status: data.status || 'active',
      excel_filename: data.excel_filename || null,
      is_merged: data.is_merged !== undefined ? data.is_merged : undefined,
      merged_from: data.merged_from || null,
      updated_at: new Date()
    };

    // Remove undefined values
    Object.keys(templateData).forEach(key => {
      if (templateData[key] === undefined) delete templateData[key];
    });

    return await this.update(id, templateData);
  }
}

module.exports = Template;