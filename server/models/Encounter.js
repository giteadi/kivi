const BaseModel = require('./BaseModel');

class Encounter extends BaseModel {
  constructor() {
    super('kivi_encounters');
  }

  // Get encounters with related data (updated for new schema)
  async getEncounters(filters = {}) {
    let conditions = `
      LEFT JOIN kivi_students s ON e.student_id = s.id
      LEFT JOIN kivi_therapists t ON e.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_centres c ON e.centre_id = c.id
      LEFT JOIN kivi_sessions sess ON e.session_id = sess.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.patientId || filters.studentId) {
      conditions += ' AND e.student_id = ?';
      params.push(filters.patientId || filters.studentId);
    }

    if (filters.doctorId || filters.therapistId) {
      conditions += ' AND e.therapist_id = ?';
      params.push(filters.doctorId || filters.therapistId);
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
             s.first_name as patient_first_name, s.last_name as patient_last_name,
             s.first_name as student_first_name, s.last_name as student_last_name,
             tu.first_name as doctor_first_name, tu.last_name as doctor_last_name,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name,
             c.name as clinic_name, c.name as centre_name,
             sess.session_date as appointment_date, sess.session_date
      FROM kivi_encounters e ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get encounter with full details (updated for new schema)
  async getEncounterWithDetails(id) {
    const sql = `
      SELECT e.*, 
             s.first_name as patient_first_name, s.last_name as patient_last_name,
             s.first_name as student_first_name, s.last_name as student_last_name,
             s.date_of_birth, s.gender, s.phone as patient_phone, s.phone as student_phone,
             tu.first_name as doctor_first_name, tu.last_name as doctor_last_name,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name,
             t.specialty as doctor_specialty, t.specialty as therapist_specialty,
             sess.session_date as appointment_date, sess.session_date
      FROM kivi_encounters e
      LEFT JOIN kivi_students s ON e.student_id = s.id
      LEFT JOIN kivi_therapists t ON e.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_sessions sess ON e.session_id = sess.id
      WHERE e.id = ?
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Encounter;