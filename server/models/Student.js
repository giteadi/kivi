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
            centre_name: student.centre_name || 'MindSaid Learning Centre',
            last_session: null
          };
        });
      }
    } catch (error) {
      console.error('Error in getStudents:', error);
      throw error;
    }
  }

  // Get student with sessions - FIXED: No GROUP BY with JSON fields
  async getStudentWithSessions(id) {
    console.log('🔍 Student.getStudentWithSessions - Fetching student ID:', id);
    
    // ✅ FIXED: Using subqueries instead of GROUP BY to avoid JSON truncation
    const sql = `
      SELECT
        s.*,
        COALESCE(s.centre_name, c.name) as centre_name,
        -- Safe subqueries (NO GROUP BY ISSUE)
        (SELECT COUNT(*)
         FROM kivi_sessions
         WHERE student_id = s.id) as total_sessions,
        (SELECT MAX(session_date)
         FROM kivi_sessions
         WHERE student_id = s.id) as last_session
      FROM kivi_students s
      LEFT JOIN kivi_centres c ON s.centre_id = c.id
      WHERE s.id = ?
    `;
    
    console.log('📊 Executing query without GROUP BY to preserve JSON fields');
    const results = await this.query(sql, [id]);
    
    if (results.length > 0) {
      const student = results[0];
      console.log('✅ Student found:', student.first_name, student.last_name);
      console.log('📦 Raw JSON field types:');
      console.log('   - documents:', typeof student.documents);
      console.log('   - evaluation_data:', typeof student.evaluation_data);
      console.log('   - diagnosis_data:', typeof student.diagnosis_data);
      console.log('   - history_data:', typeof student.history_data);
      
      // Parse documents field
      if (student.documents) {
        if (typeof student.documents === 'string') {
          try {
            student.documents = JSON.parse(student.documents);
            console.log('✅ Parsed documents:', student.documents.length, 'items');
          } catch (e) {
            console.error('❌ Error parsing documents:', e.message);
            student.documents = [];
          }
        } else if (!Array.isArray(student.documents)) {
          student.documents = [];
        }
      } else {
        student.documents = [];
      }
      
      // Log JSON field sizes for debugging
      if (student.evaluation_data) {
        const evalSize = typeof student.evaluation_data === 'string' 
          ? student.evaluation_data.length 
          : JSON.stringify(student.evaluation_data).length;
        console.log('📏 evaluation_data size:', evalSize, 'bytes');
      }
      
      if (student.history_data) {
        const histSize = typeof student.history_data === 'string' 
          ? student.history_data.length 
          : JSON.stringify(student.history_data).length;
        console.log('📏 history_data size:', histSize, 'bytes');
        
        // Check if nested data exists
        if (typeof student.history_data === 'string') {
          try {
            const parsed = JSON.parse(student.history_data);
            console.log('🔍 history_data keys:', Object.keys(parsed));
            console.log('   - Has languageSampleReportData:', !!parsed.languageSampleReportData);
            console.log('   - Has educationSampleReportData:', !!parsed.educationSampleReportData);
            console.log('   - Has healthSampleReportData:', !!parsed.healthSampleReportData);
            console.log('   - Has employmentSampleReportData:', !!parsed.employmentSampleReportData);
          } catch (e) {
            console.error('❌ Error parsing history_data for inspection:', e.message);
          }
        }
      }
      
      return student;
    }
    
    console.log('❌ Student not found with ID:', id);
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

  // Delete student with cascade delete to handle foreign key constraints
  async delete(id) {
    console.log('🗑️ Student.delete called with ID:', id);
    
    try {
      // Step 1: Delete calendar_events that reference assessments for this student
      const deleteCalendarEventsSql = `
        DELETE FROM calendar_events 
        WHERE assessment_id IN (SELECT id FROM kivi_assessments WHERE student_id = ?)
      `;
      await this.query(deleteCalendarEventsSql, [id]);
      console.log('✅ Deleted calendar_events for student:', id);

      // Step 2: Delete assessments for this student
      const deleteAssessmentsSql = `DELETE FROM kivi_assessments WHERE student_id = ?`;
      await this.query(deleteAssessmentsSql, [id]);
      console.log('✅ Deleted assessments for student:', id);

      // Step 3: Delete the student
      const deleteStudentSql = `DELETE FROM kivi_students WHERE id = ?`;
      const result = await this.query(deleteStudentSql, [id]);
      console.log('✅ Deleted student:', id, 'affected rows:', result.affectedRows);

      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Error in cascade delete student:', error);
      throw error;
    }
  }
}

module.exports = Student;