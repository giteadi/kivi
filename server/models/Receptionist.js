const BaseModel = require('./BaseModel');

class Receptionist extends BaseModel {
  constructor() {
    super('receptionists');
  }

  // Get receptionists with user info
  async getReceptionists(filters = {}) {
    let conditions = `
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN clinics c ON r.clinic_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.clinicId) {
      conditions += ' AND r.clinic_id = ?';
      params.push(filters.clinicId);
    }

    if (filters.status) {
      conditions += ' AND r.status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY u.first_name, u.last_name';

    const sql = `
      SELECT r.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as clinic_name
      FROM receptionists r ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Receptionist;