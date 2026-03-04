const BaseModel = require('./BaseModel');

class Clinic extends BaseModel {
  constructor() {
    super('clinics');
  }

  // Get clinics with stats
  async getClinics(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (name LIKE ? OR city LIKE ? OR specialties LIKE ?)';
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

  // Get clinic with stats
  async getClinicWithStats(id) {
    const sql = `
      SELECT c.*, 
             COUNT(DISTINCT d.id) as total_doctors,
             COUNT(DISTINCT a.id) as total_appointments,
             COUNT(DISTINCT p.id) as total_patients
      FROM clinics c
      LEFT JOIN doctors d ON c.id = d.clinic_id
      LEFT JOIN appointments a ON c.id = a.clinic_id
      LEFT JOIN patients p ON a.patient_id = p.id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Clinic;