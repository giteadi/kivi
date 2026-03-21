const BaseModel = require('./BaseModel');

class Assessment extends BaseModel {
  constructor() {
    super('kivi_assessments');
  }

  // Get assessments by student ID
  async getAssessmentsByStudent(studentId) {
    try {
      const sql = `
        SELECT a.*,
               s.first_name,
               s.last_name,
               s.student_id
        FROM kivi_assessments a
        LEFT JOIN kivi_students s ON a.student_id = s.id
        WHERE a.student_id = ?
        ORDER BY a.scheduled_date DESC, a.scheduled_time DESC
      `;
      const results = await this.query(sql, [studentId]);
      return results;
    } catch (error) {
      console.error('Error in getAssessmentsByStudent:', error);
      throw error;
    }
  }

  // Create new assessment
  async create(assessmentData) {
    try {
      const columns = Object.keys(assessmentData).join(', ');
      const placeholders = Object.keys(assessmentData).map(() => '?').join(', ');
      const values = Object.values(assessmentData);

      const sql = `
        INSERT INTO kivi_assessments (${columns})
        VALUES (${placeholders})
      `;

      const result = await this.query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error in create assessment:', error);
      throw error;
    }
  }

  // Get single assessment by ID
  async getAssessment(id) {
    try {
      const sql = `
        SELECT a.*,
               s.first_name,
               s.last_name,
               s.student_id
        FROM kivi_assessments a
        LEFT JOIN kivi_students s ON a.student_id = s.id
        WHERE a.id = ?
      `;
      const results = await this.query(sql, [id]);
      return results[0] || null;
    } catch (error) {
      console.error('Error in getAssessment:', error);
      throw error;
    }
  }

  // Delete assessment
  async delete(id) {
    try {
      const sql = 'DELETE FROM kivi_assessments WHERE id = ?';
      const result = await this.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in delete assessment:', error);
      throw error;
    }
  }

  // Update assessment
  async update(id, updateData) {
    try {
      const columns = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updateData);
      values.push(id);

      const sql = `
        UPDATE kivi_assessments
        SET ${columns}, updated_at = NOW()
        WHERE id = ?
      `;

      const result = await this.query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error in update assessment:', error);
      throw error;
    }
  }
}

module.exports = Assessment;
