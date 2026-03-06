const BaseModel = require('./BaseModel');

class Patient extends BaseModel {
  constructor() {
    super('kivi_students'); // Use students table for backward compatibility
  }

  // Get patients with filters (mapped to students)
  async getPatients(filters = {}) {
    try {
      let whereConditions = 'WHERE 1=1';
      const params = [];

      if (filters.search) {
        whereConditions += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ? OR student_id LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      if (filters.status) {
        whereConditions += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.clinicId || filters.centreId) {
        whereConditions += ' AND centre_id = ?';
        params.push(filters.clinicId || filters.centreId);
      }

      whereConditions += ' ORDER BY created_at DESC';

      if (filters.limit) {
        whereConditions += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      // Simple query first, then add centre names
      const simpleSql = `SELECT * FROM kivi_students ${whereConditions}`;
      const students = await this.query(simpleSql, params);
      
      // Get centre names separately
      const studentsWithCentres = await Promise.all(students.map(async (student) => {
        let centreName = 'Unknown Centre';
        if (student.centre_id) {
          try {
            const centreResult = await this.query('SELECT name FROM kivi_centres WHERE id = ?', [student.centre_id]);
            if (centreResult.length > 0) {
              centreName = centreResult[0].name;
            }
          } catch (error) {
            console.log('Error fetching centre name:', error.message);
          }
        }
        
        return {
          ...student,
          clinic_name: centreName,
          centre_name: centreName,
          last_visit: null,
          last_session: null
        };
      }));

      return studentsWithCentres;
    } catch (error) {
      console.error('Error in getPatients:', error);
      throw error;
    }
  }

  // Get patient with appointments (mapped to student with sessions)
  async getPatientWithAppointments(id) {
    const sql = `
      SELECT s.*, 
             COUNT(sess.id) as total_appointments, COUNT(sess.id) as total_sessions,
             MAX(sess.session_date) as last_appointment, MAX(sess.session_date) as last_session
      FROM kivi_students s
      LEFT JOIN kivi_sessions sess ON s.id = sess.student_id
      WHERE s.id = ?
      GROUP BY s.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Patient;