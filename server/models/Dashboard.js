const BaseModel = require('./BaseModel');

class Dashboard extends BaseModel {
  constructor() {
    super('sessions'); // Base table for dashboard stats
  }

  async getDashboardStats(filters = {}) {
    const { startDate, endDate, centreId, therapistId } = filters;
    
    let dateCondition = '';
    let centreCondition = '';
    let therapistCondition = '';
    let params = [];

    // Build date filter
    if (startDate && endDate) {
      dateCondition = 'AND DATE(s.session_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Build centre filter
    if (centreId) {
      centreCondition = 'AND s.centre_id = ?';
      params.push(centreId);
    }

    // Build therapist filter
    if (therapistId) {
      therapistCondition = 'AND s.therapist_id = ?';
      params.push(therapistId);
    }

    const stats = {};

    // Total Sessions
    const sessionCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM sessions s 
      WHERE 1=1 ${dateCondition} ${centreCondition} ${therapistCondition}
    `, params);
    stats.totalSessions = sessionCount[0].total;

    // Total Students
    const studentCount = await this.query(`
      SELECT COUNT(DISTINCT st.id) as total 
      FROM students st 
      LEFT JOIN sessions s ON st.id = s.student_id 
      WHERE st.status = 'active' ${dateCondition} ${centreCondition} ${therapistCondition}
    `, params);
    stats.totalStudents = studentCount[0].total;

    // Total Centres
    const centreCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM centres 
      WHERE status = 'active'
    `);
    stats.totalCentres = centreCount[0].total;

    // Total Therapists
    const therapistCount = await this.query(`
      SELECT COUNT(DISTINCT t.id) as total 
      FROM therapists t 
      LEFT JOIN sessions s ON t.id = s.therapist_id 
      WHERE t.status = 'active' ${dateCondition} ${centreCondition} ${therapistCondition}
    `, params);
    stats.totalTherapists = therapistCount[0].total;

    // Active Programmes
    const programmeCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM programmes 
      WHERE status = 'active'
    `);
    stats.activeProgrammes = programmeCount[0].total;

    // Total Revenue
    const revenueQuery = await this.query(`
      SELECT COALESCE(SUM(br.total_amount), 0) as total 
      FROM billing_records br 
      LEFT JOIN sessions s ON br.session_id = s.id 
      WHERE br.payment_status IN ('paid', 'partial') ${dateCondition} ${centreCondition} ${therapistCondition}
    `, params);
    stats.totalRevenue = revenueQuery[0].total;

    return stats;
  }

  async getUpcomingSessions(limit = 5, filters = {}) {
    const { centreId, therapistId } = filters;
    
    let centreCondition = '';
    let therapistCondition = '';
    let params = [];

    if (centreId) {
      centreCondition = 'AND s.centre_id = ?';
      params.push(centreId);
    }

    if (therapistId) {
      therapistCondition = 'AND s.therapist_id = ?';
      params.push(therapistId);
    }

    params.push(limit);

    const sessions = await this.query(`
      SELECT 
        s.id,
        s.session_date,
        s.session_time,
        s.status,
        CONCAT(st.first_name, ' ', st.last_name) as student_name,
        CONCAT(u.first_name, ' ', u.last_name) as therapist_name,
        c.name as centre_name,
        p.name as programme_name
      FROM sessions s
      LEFT JOIN students st ON s.student_id = st.id
      LEFT JOIN therapists t ON s.therapist_id = t.id
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN centres c ON s.centre_id = c.id
      LEFT JOIN programmes p ON s.programme_id = p.id
      WHERE s.session_date >= CURDATE() 
        AND s.status IN ('scheduled', 'confirmed', 'awaiting_confirmation')
        ${centreCondition} ${therapistCondition}
      ORDER BY s.session_date ASC, s.session_time ASC
      LIMIT ?
    `, params);

    return sessions;
  }

  async getTopTherapists(limit = 5, filters = {}) {
    const { startDate, endDate, centreId } = filters;
    
    let dateCondition = '';
    let centreCondition = '';
    let params = [];

    if (startDate && endDate) {
      dateCondition = 'AND DATE(s.session_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (centreId) {
      centreCondition = 'AND s.centre_id = ?';
      params.push(centreId);
    }

    params.push(limit);

    const therapists = await this.query(`
      SELECT 
        t.id,
        CONCAT(u.first_name, ' ', u.last_name) as therapist_name,
        c.name as centre_name,
        COUNT(s.id) as session_count,
        COALESCE(SUM(br.total_amount), 0) as total_revenue
      FROM therapists t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN centres c ON t.centre_id = c.id
      LEFT JOIN sessions s ON t.id = s.therapist_id ${dateCondition} ${centreCondition}
      LEFT JOIN billing_records br ON s.id = br.session_id AND br.payment_status = 'paid'
      WHERE t.status = 'active'
      GROUP BY t.id, u.first_name, u.last_name, c.name
      ORDER BY session_count DESC, total_revenue DESC
      LIMIT ?
    `, params);

    return therapists;
  }

  async getSessionStatusChart(filters = {}) {
    const { startDate, endDate, centreId, therapistId } = filters;
    
    let dateCondition = '';
    let centreCondition = '';
    let therapistCondition = '';
    let params = [];

    if (startDate && endDate) {
      dateCondition = 'AND DATE(session_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (centreId) {
      centreCondition = 'AND centre_id = ?';
      params.push(centreId);
    }

    if (therapistId) {
      therapistCondition = 'AND therapist_id = ?';
      params.push(therapistId);
    }

    const statusData = await this.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM sessions
      WHERE 1=1 ${dateCondition} ${centreCondition} ${therapistCondition}
      GROUP BY status
      ORDER BY count DESC
    `, params);

    return statusData;
  }
}

module.exports = Dashboard;