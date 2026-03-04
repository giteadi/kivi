const BaseModel = require('./BaseModel');

class Doctor extends BaseModel {
  constructor() {
    super('doctors');
  }

  // Get doctors with user info
  async getDoctors(filters = {}) {
    let conditions = `
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN clinics c ON d.clinic_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      conditions += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR d.specialty LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.clinicId) {
      conditions += ' AND d.clinic_id = ?';
      params.push(filters.clinicId);
    }

    if (filters.specialty) {
      conditions += ' AND d.specialty = ?';
      params.push(filters.specialty);
    }

    conditions += ' ORDER BY u.first_name, u.last_name';

    const sql = `
      SELECT d.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as clinic_name
      FROM doctors d ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get doctor with stats
  async getDoctorWithStats(id) {
    const sql = `
      SELECT d.*, 
             u.first_name, u.last_name, u.email, u.phone,
             c.name as clinic_name,
             COUNT(a.id) as total_appointments,
             AVG(CASE WHEN a.status = 'completed' THEN 5 ELSE 0 END) as avg_rating
      FROM doctors d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN clinics c ON d.clinic_id = c.id
      LEFT JOIN appointments a ON d.id = a.doctor_id
      WHERE d.id = ?
      GROUP BY d.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Doctor;