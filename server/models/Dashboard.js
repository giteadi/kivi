const BaseModel = require('./BaseModel');

class Dashboard extends BaseModel {
  constructor() {
    super('appointments'); // Base table for dashboard stats
  }

  async getDashboardStats(filters = {}) {
    const { startDate, endDate, clinicId, doctorId } = filters;
    
    let dateCondition = '';
    let clinicCondition = '';
    let doctorCondition = '';
    let params = [];

    // Build date filter
    if (startDate && endDate) {
      dateCondition = 'AND DATE(a.appointment_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    // Build clinic filter
    if (clinicId) {
      clinicCondition = 'AND a.clinic_id = ?';
      params.push(clinicId);
    }

    // Build doctor filter
    if (doctorId) {
      doctorCondition = 'AND a.doctor_id = ?';
      params.push(doctorId);
    }

    const stats = {};

    // Total Appointments
    const appointmentCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM appointments a 
      WHERE 1=1 ${dateCondition} ${clinicCondition} ${doctorCondition}
    `, params);
    stats.totalAppointments = appointmentCount[0].total;

    // Total Patients
    const patientCount = await this.query(`
      SELECT COUNT(DISTINCT p.id) as total 
      FROM patients p 
      LEFT JOIN appointments a ON p.id = a.patient_id 
      WHERE p.status = 'active' ${dateCondition} ${clinicCondition} ${doctorCondition}
    `, params);
    stats.totalPatients = patientCount[0].total;

    // Total Clinics
    const clinicCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM clinics 
      WHERE status = 'active'
    `);
    stats.totalClinics = clinicCount[0].total;

    // Total Doctors
    const doctorCount = await this.query(`
      SELECT COUNT(DISTINCT d.id) as total 
      FROM doctors d 
      LEFT JOIN appointments a ON d.id = a.doctor_id 
      WHERE d.status = 'active' ${dateCondition} ${clinicCondition} ${doctorCondition}
    `, params);
    stats.totalDoctors = doctorCount[0].total;

    // Active Services
    const serviceCount = await this.query(`
      SELECT COUNT(*) as total 
      FROM services 
      WHERE status = 'active'
    `);
    stats.activeServices = serviceCount[0].total;

    // Total Revenue
    const revenueQuery = await this.query(`
      SELECT COALESCE(SUM(br.total_amount), 0) as total 
      FROM billing_records br 
      LEFT JOIN appointments a ON br.appointment_id = a.id 
      WHERE br.payment_status IN ('paid', 'partial') ${dateCondition} ${clinicCondition} ${doctorCondition}
    `, params);
    stats.totalRevenue = revenueQuery[0].total;

    return stats;
  }

  async getUpcomingAppointments(limit = 5, filters = {}) {
    const { clinicId, doctorId } = filters;
    
    let clinicCondition = '';
    let doctorCondition = '';
    let params = [];

    if (clinicId) {
      clinicCondition = 'AND a.clinic_id = ?';
      params.push(clinicId);
    }

    if (doctorId) {
      doctorCondition = 'AND a.doctor_id = ?';
      params.push(doctorId);
    }

    params.push(limit);

    const appointments = await this.query(`
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        CONCAT(p.first_name, ' ', p.last_name) as patient_name,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
        c.name as clinic_name,
        s.name as service_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN clinics c ON a.clinic_id = c.id
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.appointment_date >= CURDATE() 
        AND a.status IN ('scheduled', 'confirmed')
        ${clinicCondition} ${doctorCondition}
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      LIMIT ?
    `, params);

    return appointments;
  }

  async getTopDoctors(limit = 5, filters = {}) {
    const { startDate, endDate, clinicId } = filters;
    
    let dateCondition = '';
    let clinicCondition = '';
    let params = [];

    if (startDate && endDate) {
      dateCondition = 'AND DATE(a.appointment_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (clinicId) {
      clinicCondition = 'AND a.clinic_id = ?';
      params.push(clinicId);
    }

    params.push(limit);

    const doctors = await this.query(`
      SELECT 
        d.id,
        CONCAT(u.first_name, ' ', u.last_name) as doctor_name,
        c.name as clinic_name,
        COUNT(a.id) as appointment_count,
        COALESCE(SUM(br.total_amount), 0) as total_revenue
      FROM doctors d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN clinics c ON d.clinic_id = c.id
      LEFT JOIN appointments a ON d.id = a.doctor_id ${dateCondition} ${clinicCondition}
      LEFT JOIN billing_records br ON a.id = br.appointment_id AND br.payment_status = 'paid'
      WHERE d.status = 'active'
      GROUP BY d.id, u.first_name, u.last_name, c.name
      ORDER BY appointment_count DESC, total_revenue DESC
      LIMIT ?
    `, params);

    return doctors;
  }

  async getBookingStatusChart(filters = {}) {
    const { startDate, endDate, clinicId, doctorId } = filters;
    
    let dateCondition = '';
    let clinicCondition = '';
    let doctorCondition = '';
    let params = [];

    if (startDate && endDate) {
      dateCondition = 'AND DATE(appointment_date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    if (clinicId) {
      clinicCondition = 'AND clinic_id = ?';
      params.push(clinicId);
    }

    if (doctorId) {
      doctorCondition = 'AND doctor_id = ?';
      params.push(doctorId);
    }

    const statusData = await this.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM appointments
      WHERE 1=1 ${dateCondition} ${clinicCondition} ${doctorCondition}
      GROUP BY status
      ORDER BY count DESC
    `, params);

    return statusData;
  }
}

module.exports = Dashboard;