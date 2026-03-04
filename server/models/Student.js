const BaseModel = require('./BaseModel');

class Student extends BaseModel {
  constructor() {
    super('students');
  }

  // Get students with filters
  async getStudents(filters = {}) {
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

      if (filters.centreId) {
        whereConditions += ' AND centre_id = ?';
        params.push(filters.centreId);
      }

      whereConditions += ' ORDER BY created_at DESC';

      if (filters.limit) {
        whereConditions += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      // Try complex query with JOINs first
      try {
        const complexSql = `
          SELECT s.*, 
                 c.name as centre_name,
                 MAX(sess.session_date) as last_session
          FROM students s
          LEFT JOIN centres c ON s.centre_id = c.id
          LEFT JOIN sessions sess ON s.id = sess.student_id
          ${whereConditions}
          GROUP BY s.id, c.name
        `;
        return await this.query(complexSql, params);
      } catch (joinError) {
        console.log('JOIN query failed, falling back to simple query:', joinError.message);
        
        // Fallback to simple query
        const simpleSql = `SELECT * FROM students ${whereConditions}`;
        const students = await this.query(simpleSql, params);
        
        // Add default centre_name for compatibility
        return students.map(student => ({
          ...student,
          centre_name: 'Unknown Centre',
          last_session: null
        }));
      }
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }

  // Get student with sessions
  async getStudentWithSessions(id) {
    const sql = `
      SELECT s.*, 
             COUNT(sess.id) as total_sessions,
             MAX(sess.session_date) as last_session
      FROM students s
      LEFT JOIN sessions sess ON s.id = sess.student_id
      WHERE s.id = ?
      GROUP BY s.id
    `;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }
}

module.exports = Student;