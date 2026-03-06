const BaseModel = require('./BaseModel');

class Centre extends BaseModel {
  constructor() {
    super('kivi_centres');
  }

  // Get centres with stats
  async getCentres(filters = {}) {
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

  // Get centre with stats
  async getCentreWithStats(id) {
    const sql = `
      SELECT c.*, 
             COUNT(DISTINCT t.id) as total_therapists,
             COUNT(DISTINCT s.id) as total_sessions,
             COUNT(DISTINCT st.id) as total_students
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
}

module.exports = Centre;