const BaseModel = require('./BaseModel');

class Patient extends BaseModel {
  constructor() {
    super('patients');
  }

  // Get patients with filters
  async getPatients(filters = {}) {
    try {
      // First try the simple query without JOINs to test basic functionality
      let whereConditions = 'WHERE 1=1';
      const params = [];

      if (filters.search) {
        whereConditions += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (filters.status) {
        whereConditions += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.clinicId) {
        whereConditions += ' AND clinic_id = ?';
        params.push(filters.clinicId);
      }

      whereConditions += ' ORDER BY created_at DESC';

      if (filters.limit) {
        whereConditions += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      // Try complex query with JOINs first
      try {
        const complexSql = `
          SELECT p.*, 
                 c.name as clinic_name,
                 MAX(a.appointment_date) as last_visit
          FROM patients p
          LEFT JOIN clinics c ON p.clinic_id = c.id
          LEFT JOIN appointments a ON p.id = a.patient_id
          ${whereConditions}
          GROUP BY p.id, c.name
        `;
        return await this.query(complexSql, params);
      } catch (joinError) {
        console.log('JOIN query failed, falling back to simple query:', joinError.message);
        
        // Fallback to simple query
        const simpleSql = `SELECT * FROM patients ${whereConditions}`;
        const patients = await this.query(simpleSql, params);
        
        // Add default clinic_name for compatibility
        return patients.map(patient => ({
          ...patient,
          clinic_name: 'Unknown Clinic',
          last_visit: null
        }));
      }
    } catch (error) {
      console.error('Error in getPatients:', error);
      throw error;
    }
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