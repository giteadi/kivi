const BaseModel = require('./BaseModel');

class Receptionist extends BaseModel {
  constructor() {
    super('kivi_staff');
  }

  // Get receptionists with user info
  async getReceptionists(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_users u ON r.user_id = u.id
      LEFT JOIN kivi_centres c ON r.centre_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.clinicId || filters.centreId) {
      conditions += ' AND r.centre_id = ?';
      params.push(filters.clinicId || filters.centreId);
    }

    if (filters.status) {
      conditions += ' AND r.status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY u.first_name, u.last_name';

    const sql = `
      SELECT r.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as clinic_name, c.name as centre_name
      FROM kivi_staff r ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Receptionist;