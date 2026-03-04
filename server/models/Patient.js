const BaseModel = require('./BaseModel');

class Patient extends BaseModel {
  constructor() {
    super('patients');
  }

  // Get patients with filters
  async getPatients(filters = {}) {
    let conditions = 'WHERE 1=1';
    const params = [];

    if (filters.search) {
      conditions += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.status) {
      conditions += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.clinicId) {
      conditions += ' AND clinic_id = ?';
      params.push(filters.clinicId);
    }

    conditions += ' ORDER BY created_at DESC';

    if (filters.limit) {
      conditions += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    return await this.findAll(conditions, params);
  }

  // Get patient with appointments
  async getPatientWithAppointments(id) {
    const sql = `
      SELECT p.*, 
             COUNT(a.id) as total_appointments,
             MAX(a.appointment_date) as last_appointment
      FROM patients p
      LEFT JOIN appointments a ON p.id = a.patient_id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Patient;