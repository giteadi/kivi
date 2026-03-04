const BaseModel = require('./BaseModel');

class Encounter extends BaseModel {
  constructor() {
    super('encounters');
  }

  // Get encounters with related data
  async getEncounters(filters = {}) {
    let conditions = `
      LEFT JOIN patients p ON e.patient_id = p.id
      LEFT JOIN doctors d ON e.doctor_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      LEFT JOIN clinics c ON e.clinic_id = c.id
      LEFT JOIN appointments a ON e.appointment_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.patientId) {
      conditions += ' AND e.patient_id = ?';
      params.push(filters.patientId);
    }

    if (filters.doctorId) {
      conditions += ' AND e.doctor_id = ?';
      params.push(filters.doctorId);
    }

    if (filters.status) {
      conditions += ' AND e.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      conditions += ' AND DATE(e.encounter_date) = ?';
      params.push(filters.date);
    }

    conditions += ' ORDER BY e.encounter_date DESC';

    if (filters.limit) {
      conditions += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const sql = `
      SELECT e.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             du.first_name as doctor_first_name, du.last_name as doctor_last_name,
             c.name as clinic_name,
             a.appointment_date
      FROM encounters e ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get encounter with full details
  async getEncounterWithDetails(id) {
    const sql = `
      SELECT e.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             p.date_of_birth, p.gender, p.phone as patient_phone,
             du.first_name as doctor_first_name, du.last_name as doctor_last_name,
             d.specialty as doctor_specialty,
             a.appointment_date
      FROM encounters e
      LEFT JOIN patients p ON e.patient_id = p.id
      LEFT JOIN doctors d ON e.doctor_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      LEFT JOIN appointments a ON e.appointment_id = a.id
      WHERE e.id = ?
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Encounter;