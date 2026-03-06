const BaseModel = require('./BaseModel');

class Template extends BaseModel {
  constructor() {
    super('kivi_encounter_templates');
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

    if (filters.category) {
      conditions += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      conditions += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.createdBy) {
      conditions += ' AND created_by = ?';
      params.push(filters.createdBy);
    }

    conditions += ' ORDER BY name';

    return await this.findAll(conditions, params);
  }

  // Get active templates
  async getActiveTemplates() {
    const conditions = 'WHERE status = "active" ORDER BY name';
    return await this.findAll(conditions);
  }
}

module.exports = Template;