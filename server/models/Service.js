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
      conditions += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.programme_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.clinicId || filters.centreId) {
      conditions += ' AND p.centre_id = ?';
      params.push(filters.clinicId || filters.centreId);
    }

    if (filters.category) {
      conditions += ' AND p.category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      conditions += ' AND p.status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY p.name';

    const query = `
      SELECT 
        p.*,
        u.first_name as therapist_first_name,
        u.last_name as therapist_last_name,
        t.specialty as therapist_specialty,
        c.name as centre_name
      FROM kivi_programmes p
      LEFT JOIN kivi_therapists t ON p.therapist_id = t.id
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON p.centre_id = c.id
      ${conditions}
    `;

    return await this.query(query, params);
  }

  // Get programmes method for new API
  async getProgrammes(filters = {}) {
    return this.getServices(filters);
  }

  // Get services by clinic (mapped to programmes by centre)
  async getServicesByClinic(clinicId) {
    const query = `
      SELECT 
        p.*,
        u.first_name as therapist_first_name,
        u.last_name as therapist_last_name,
        t.specialty as therapist_specialty,
        c.name as centre_name
      FROM kivi_programmes p
      LEFT JOIN kivi_therapists t ON p.therapist_id = t.id
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON p.centre_id = c.id
      WHERE p.centre_id = ? AND p.status = "active" ORDER BY p.name
    `;
    return await this.query(query, [clinicId]);
  }

  // Get programmes by centre method for new API
  async getProgrammesByCentre(centreId) {
    return this.getServicesByClinic(centreId);
  }
}

module.exports = Service;