const BaseModel = require('./BaseModel');

class Student extends BaseModel {
  constructor() {
    super('kivi_students');
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

      // Order by id DESC as fallback since created_at might not exist in all schemas
      whereConditions += ' ORDER BY id DESC';

      if (filters.limit) {
        whereConditions += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      // Try complex query with JOINs first
      try {
        const complexSql = `
          SELECT s.*, 
                 c.name as centre_name,
                 (SELECT MAX(sess.session_date) FROM kivi_sessions sess WHERE sess.student_id = s.id) as last_session
          FROM kivi_students s
          LEFT JOIN kivi_centres c ON s.centre_id = c.id
          ${whereConditions}
        `;
        const students = await this.query(complexSql, params);
        // Ensure documents are properly parsed
        return students.map(student => {
          if (student.documents) {
            if (typeof student.documents === 'string') {
              try {
                student.documents = JSON.parse(student.documents);
              } catch (e) {
                student.documents = [];
              }
            }
          } else {
            student.documents = [];
          }
          return student;
        });
      } catch (joinError) {
        console.log('JOIN query failed, falling back to simple query:', joinError.message);
        
        // Fallback to simple query
        const simpleSql = `SELECT * FROM kivi_students ${whereConditions}`;
        const students = await this.query(simpleSql, params);
        
        // Add default centre_name for compatibility and parse documents
        return students.map(student => {
          if (student.documents) {
            if (typeof student.documents === 'string') {
              try {
                student.documents = JSON.parse(student.documents);
              } catch (e) {
                student.documents = [];
              }
            }
          } else {
            student.documents = [];
          }
          return {
            ...student,
            centre_name: 'MindSaid Learning Centre',
            last_session: null
          };
        });
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
      FROM kivi_students s
      LEFT JOIN kivi_sessions sess ON s.id = sess.student_id
      WHERE s.id = ?
      GROUP BY s.id
    `;
    const results = await this.query(sql, [id]);
    if (results.length > 0) {
      const student = results[0];
      // Ensure documents is properly parsed
      if (student.documents) {
        if (typeof student.documents === 'string') {
          try {
            student.documents = JSON.parse(student.documents);
          } catch (e) {
            console.error('Error parsing documents:', e.message);
            student.documents = [];
          }
        } else if (!Array.isArray(student.documents)) {
          student.documents = [];
        }
      } else {
        student.documents = [];
      }
      return student;
    }
    return null;
  }

  // Create student (override base method for any custom logic)
  async create(data) {
    console.log('🆕 Student.create called with data:', Object.keys(data));
    return await super.create(data);
  }

  // Update student (override base method for any custom logic)
  async update(id, data) {
    console.log('🔄 Student.update called:', { id, fields: Object.keys(data) });
    
    // Handle documents field separately if it exists
    if (data.documents && typeof data.documents === 'object') {
      data.documents = JSON.stringify(data.documents);
    }
    
    return await super.update(id, data);
  }

  // Get single student by ID
  async getStudent(id) {
    console.log('🔍 Student.getStudent called with ID:', id);
    return await this.findById(id);
  }

  // Get student by examinee ID (alias for getStudentWithSessions for compatibility)
  async getStudentByExamineeId(examineeId) {
    console.log('🔍 Student.getStudentByExamineeId called with ID:', examineeId);
    return await this.getStudentWithSessions(examineeId);
  }
}

module.exports = Student;