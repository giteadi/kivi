const BaseModel = require('./BaseModel');

class Therapist extends BaseModel {
  constructor() {
    super('kivi_therapists');
  }

  // Get therapists with user info
  async getTherapists(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON t.centre_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR t.specialty LIKE ? OR t.employee_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.centreId) {
      conditions += ' AND t.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.specialty) {
      conditions += ' AND t.specialty = ?';
      params.push(filters.specialty);
    }

    if (filters.status) {
      conditions += ' AND t.status = ?';
      params.push(filters.status);
    }

    conditions += ' ORDER BY u.first_name, u.last_name';

    const sql = `
      SELECT t.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as centre_name
      FROM kivi_therapists t ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get therapist with stats
  async getTherapistWithStats(id) {
    const sql = `
      SELECT t.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as centre_name,
             COUNT(s.id) as total_sessions,
             AVG(CASE WHEN s.status = 'completed' THEN 5 ELSE 0 END) as avg_rating
      FROM kivi_therapists t
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON t.centre_id = c.id
      LEFT JOIN kivi_sessions s ON t.id = s.therapist_id
      WHERE t.id = ?
      GROUP BY t.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Therapist;