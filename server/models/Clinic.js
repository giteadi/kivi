const BaseModel = require('./BaseModel');

class Clinic extends BaseModel {
  constructor() {
    super('kivi_centres'); // Use centres table for backward compatibility
  }

  // Get clinics with stats (mapped to centres)
  async getClinics(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR city LIKE ? OR JSON_SEARCH(specialties, "one", ?) IS NOT NULL)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.status) {
      conditions += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.city) {
      conditions += ' AND city = ?';
      params.push(filters.city);
    }

    conditions += ' ORDER BY name';

    return await this.findAll(conditions, params);
  }

  // Get centres method for new API
  async getCentres(filters = {}) {
    return this.getClinics(filters);
  }

  // Get clinic with stats (mapped to centre with stats)
  async getClinicWithStats(id) {
    const sql = `
      SELECT c.*, 
             COUNT(DISTINCT t.id) as total_doctors, COUNT(DISTINCT t.id) as total_therapists,
             COUNT(DISTINCT s.id) as total_appointments, COUNT(DISTINCT s.id) as total_sessions,
             COUNT(DISTINCT st.id) as total_patients, COUNT(DISTINCT st.id) as total_students
      FROM kivi_centres c
      LEFT JOIN kivi_therapists t ON c.id = t.centre_id
      LEFT JOIN kivi_sessions s ON c.id = s.centre_id
      LEFT JOIN kivi_students st ON s.student_id = st.id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }

  // Get centre with stats method for new API
  async getCentreWithStats(id) {
    return this.getClinicWithStats(id);
  }
}

module.exports = Clinic;