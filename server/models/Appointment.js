const BaseModel = require('./BaseModel');

class Appointment extends BaseModel {
  constructor() {
    super('kivi_sessions'); // Use sessions table for backward compatibility
  }

  // Get appointments with related data (mapped to sessions)
  async getAppointments(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_programmes p ON s.programme_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.patientId || filters.studentId) {
      conditions += ' AND s.student_id = ?';
      params.push(filters.patientId || filters.studentId);
    }

    if (filters.doctorId || filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.doctorId || filters.therapistId);
    }

    if (filters.clinicId || filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.clinicId || filters.centreId);
    }

    if (filters.status) {
      conditions += ' AND s.status = ?';
      params.push(filters.status);
    }

    if (filters.date) {
      conditions += ' AND DATE(s.session_date) = ?';
      params.push(filters.date);
    }

    conditions += ' ORDER BY s.session_date DESC, s.session_time DESC';

    if (filters.limit) {
      conditions += ' LIMIT ?';
      params.push(parseInt(filters.limit));
    }

    const sql = `
      SELECT s.*, 
             s.session_date as appointment_date,
             s.session_time as appointment_time,
             st.first_name as patient_first_name, st.last_name as patient_last_name,
             tu.first_name as doctor_first_name, tu.last_name as doctor_last_name,
             t.specialty as doctor_specialty,
             c.name as clinic_name, c.name as centre_name,
             p.name as service_name, p.fee as service_price
      FROM kivi_sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get sessions method for new API
  async getSessions(filters = {}) {
    return this.getAppointments(filters);
  }

  // Get upcoming appointments (mapped to upcoming sessions)
  async getUpcomingAppointments(limit = 5, filters = {}) {
    let conditions = `
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      WHERE s.session_date >= CURDATE() AND s.status IN ('scheduled', 'confirmed', 'awaiting_confirmation')
    `;
    const params = [];

    if (filters.clinicId || filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.clinicId || filters.centreId);
    }

    if (filters.doctorId || filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.doctorId || filters.therapistId);
    }

    conditions += ' ORDER BY s.session_date ASC, s.session_time ASC LIMIT ?';
    params.push(parseInt(limit));

    const sql = `
      SELECT s.*, 
             s.session_date as appointment_date,
             s.session_time as appointment_time,
             st.first_name as patient_first_name, st.last_name as patient_last_name,
             tu.first_name as doctor_first_name, tu.last_name as doctor_last_name
      FROM kivi_sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Appointment;