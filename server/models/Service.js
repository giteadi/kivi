const BaseModel = require('./BaseModel');

class Service extends BaseModel {
  constructor() {
    super('services');
  }

  // Get services with filters
  async getServices(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters.clinicId) {
      conditions += ' AND clinic_id = ?';
      params.push(filters.clinicId);
    }

    if (filters.category) {
      conditions += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      conditions += ' AND status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY name';

    return await this.findAll(conditions, params);
  }

  // Get services by clinic
  async getServicesByClinic(clinicId) {
    const conditions = 'WHERE clinic_id = ? AND status = "active" ORDER BY name';
    return await this.findAll(conditions, [clinicId]);
  }
}

module.exports = Service;