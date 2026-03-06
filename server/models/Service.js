const BaseModel = require('./BaseModel');

class Service extends BaseModel {
  constructor() {
    super('kivi_programmes'); // Use programmes table for backward compatibility
  }

  // Get services with filters (mapped to programmes)
  async getServices(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR description LIKE ? OR programme_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.clinicId || filters.centreId) {
      conditions += ' AND centre_id = ?';
      params.push(filters.clinicId || filters.centreId);
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

  // Get programmes method for new API
  async getProgrammes(filters = {}) {
    return this.getServices(filters);
  }

  // Get services by clinic (mapped to programmes by centre)
  async getServicesByClinic(clinicId) {
    const conditions = 'WHERE centre_id = ? AND status = "active" ORDER BY name';
    return await this.findAll(conditions, [clinicId]);
  }

  // Get programmes by centre method for new API
  async getProgrammesByCentre(centreId) {
    return this.getServicesByClinic(centreId);
  }
}

module.exports = Service;