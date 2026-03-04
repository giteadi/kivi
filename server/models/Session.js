const BaseModel = require('./BaseModel');

class Session extends BaseModel {
  constructor() {
    super('sessions');
  }

  // Get sessions with related data
  async getSessions(filters = {}) {
    let conditions = `
      LEFT JOIN students st ON s.student_id = st.id
      LEFT JOIN therapists t ON s.therapist_id = t.id
      LEFT JOIN users tu ON t.user_id = tu.id
      LEFT JOIN centres c ON s.centre_id = c.id
      LEFT JOIN programmes p ON s.programme_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.studentId) {
      conditions += ' AND s.student_id = ?';
      params.push(filters.studentId);
    }

    if (filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.therapistId);
    }

    if (filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.centreId);
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
             st.first_name as student_first_name, st.last_name as student_last_name,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name,
             t.specialty as therapist_specialty,
             c.name as centre_name,
             p.name as programme_name, p.fee as programme_fee
      FROM sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }

  // Get upcoming sessions
  async getUpcomingSessions(limit = 5, filters = {}) {
    let conditions = `
      LEFT JOIN students st ON s.student_id = st.id
      LEFT JOIN therapists t ON s.therapist_id = t.id
      LEFT JOIN users tu ON t.user_id = tu.id
      WHERE s.session_date >= CURDATE() AND s.status IN ('scheduled', 'confirmed', 'awaiting_confirmation')
    `;
    const params = [];

    if (filters.centreId) {
      conditions += ' AND s.centre_id = ?';
      params.push(filters.centreId);
    }

    if (filters.therapistId) {
      conditions += ' AND s.therapist_id = ?';
      params.push(filters.therapistId);
    }

    conditions += ' ORDER BY s.session_date ASC, s.session_time ASC LIMIT ?';
    params.push(parseInt(limit));

    const sql = `
      SELECT s.*, 
             st.first_name as student_first_name, st.last_name as student_last_name,
             tu.first_name as therapist_first_name, tu.last_name as therapist_last_name
      FROM sessions s ${conditions}
    `;

    return await this.query(sql, params);
  }
}

module.exports = Session;