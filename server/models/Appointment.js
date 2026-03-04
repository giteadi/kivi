const BaseModel = require('./BaseModel');

class Appointment extends BaseModel {
  constructor() {
    super('appointments');
  }

  // Get appointments with related data
  async getAppointments(filters = {}) {
    let conditions = `
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      LEFT JOIN clinics c ON a.clinic_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.patientId) {
      conditions += ' AND a.patient_id = ?';
      params.push(filters.patientId);
    }

    if (filters.doctorId) {
      conditions += ' AND a.doctor_id = ?';
      params.push(filters.doctorId);
    }

    if (filters.clinicId) {
      conditions += ' AND a.clinic_id = ?';
      params.push(filters.clinicId);
    }

    if (filters.status) {
      conditions += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      conditions += ' AND DATE(a.appointment_date) = ?';
      params.push(filters.date);
    }

    conditions += ' ORDER BY a.appointment_date DESC';

    if (filters.limit) {
      conditions += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const sql = `
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             du.first_name as doctor_first_name, du.last_name as doctor_last_name,
             d.specialty as doctor_specialty,
             c.name as clinic_name
      FROM appointments a ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get upcoming appointments
  async getUpcomingAppointments(limit = 5, filters = {}) {
    let conditions = `
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users du ON d.user_id = du.id
      WHERE a.appointment_date >= NOW() AND a.status IN ('scheduled', 'confirmed')
    `;
    const params = [];

    if (filters.clinicId) {
      conditions += ' AND a.clinic_id = ?';
      params.push(filters.clinicId);
    }

    if (filters.doctorId) {
      conditions += ' AND a.doctor_id = ?';
      params.push(filters.doctorId);
    }

    conditions += ' ORDER BY a.appointment_date ASC LIMIT ?';
    params.push(parseInt(limit));

    const sql = `
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             du.first_name as doctor_first_name, du.last_name as doctor_last_name
      FROM appointments a ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Appointment;