const BaseModel = require('./BaseModel');

class Programme extends BaseModel {
  constructor() {
    super('kivi_programmes');
  }

  // Get programmes with filters
  async getProgrammes(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR description LIKE ? OR programme_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.centreId) {
      conditions += ' AND centre_id = ?';
      params.push(filters.centreId);
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

  // Get programmes by centre
  async getProgrammesByCentre(centreId) {
    const conditions = 'WHERE centre_id = ? AND status = "active" ORDER BY name';
    return await this.findAll(conditions, [centreId]);
  }
}

module.exports = Programme;