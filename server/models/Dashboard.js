const BaseModel = require('./BaseModel');

class Dashboard extends BaseModel {
  constructor() {
    super();
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

    // Total Sessions (renamed from totalSessions to totalAppointments to match component)
    const sessionCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM kivi_sessions s 
      WHERE 1=1 ${dateCondition} ${centreCondition} ${therapistCondition}
    `, params);
    stats.totalAppointments = sessionCount[0].total;

    // Total Students (renamed from totalStudents to totalPatients to match component)
    const studentCount = await this.query(`
      SELECT COUNT(DISTINCT st.id) as total 
      FROM kivi_students st 
      WHERE st.status = 'active'
    `);
    stats.totalPatients = studentCount[0].total;

    // Total Centres (renamed from totalCentres to totalClinics to match component)
    const centreCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM kivi_centres 
      WHERE status = 'active'
    `);
    stats.totalClinics = centreCount[0].total;

    // Total Therapists (renamed from totalTherapists to totalDoctors to match component)
    const therapistCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM kivi_therapists t 
      WHERE t.status = 'active'
    `);
    stats.totalDoctors = therapistCount[0].total;

    // Active Services (renamed from activeProgrammes to activeServices to match component)
    const programmeCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM kivi_programmes 
      WHERE status = 'active'
    `);
    stats.activeServices = programmeCount[0].total;

    // Total Revenue - use kivi_payments table instead of kivi_billing_records
    const revenueQuery = await this.query(`
      SELECT COALESCE(SUM(p.amount), 0) as total 
      FROM kivi_payments p 
      WHERE p.status = 'completed' ${dateCondition.replace('s.session_date', 'DATE(p.paid_at)')}
    `, params);
    stats.totalRevenue = parseFloat(revenueQuery[0].total);

    console.log('📊 Dashboard stats calculated:', stats);
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
      FROM kivi_sessions s
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_programmes p ON s.programme_id = p.id
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
      FROM kivi_therapists t
      LEFT JOIN kivi_users u ON t.user_id = u.id
      LEFT JOIN kivi_centres c ON t.centre_id = c.id
      LEFT JOIN kivi_sessions s ON t.id = s.therapist_id ${dateCondition} ${centreCondition}
      LEFT JOIN kivi_billing_records br ON s.id = br.session_id AND br.payment_status = 'paid'
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
      FROM kivi_sessions
      WHERE 1=1 ${dateCondition} ${centreCondition} ${therapistCondition}
      GROUP BY status
      ORDER BY count DESC
    `, params);

    return statusData;
  }

  async getAllSessions() {
    const sessions = await this.query(`
      SELECT 
        s.id,
        s.session_date,
        s.session_time,
        s.status,
        s.notes,
        -- Student details
        st.first_name as student_first_name,
        st.last_name as student_last_name,
        st.email as student_email,
        st.phone as student_phone,
        st.age,
        st.gender,
        -- User (Parent/Student) details who booked session
        u.id as user_id,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        u.phone as user_phone,
        u.role as user_role,
        -- Therapist details
        CONCAT(tu.first_name, ' ', tu.last_name) as therapist_first_name,
        CONCAT(tu.first_name, ' ', tu.last_name) as therapist_last_name,
        -- Programme details
        p.name as programme_name,
        p.fee as programme_fee,
        -- Centre details
        c.name as centre_name,
        -- Payment details
        COALESCE(br.payment_status, 'pending') as payment_status,
        COALESCE(br.total_amount, 0) as total_amount,
        br.created_at as payment_date
      FROM kivi_sessions s
      LEFT JOIN kivi_students st ON s.student_id = st.id
      LEFT JOIN kivi_users u ON st.user_id = u.id
      LEFT JOIN kivi_therapists t ON s.therapist_id = t.id
      LEFT JOIN kivi_users tu ON t.user_id = tu.id
      LEFT JOIN kivi_programmes p ON s.programme_id = p.id
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      LEFT JOIN kivi_billing_records br ON s.id = br.session_id
      ORDER BY s.session_date DESC, s.session_time DESC
    `);

    return sessions;
  }
}

module.exports = Dashboard;