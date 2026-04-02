const BaseModel = require('./BaseModel');

class AssessmentResult extends BaseModel {
  constructor() {
    super('kivi_assessment_results');
  }

  // Create new assessment result
  async create(data) {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);

      const sql = `
        INSERT INTO kivi_assessment_results (${columns})
        VALUES (${placeholders})
      `;

      const result = await this.query(sql, values);
      return result.insertId;
    } catch (error) {
      console.error('Error creating assessment result:', error);
      throw error;
    }
  }

  // Get results by assessment ID
  async getResultsByAssessment(assessmentId) {
    try {
      const sql = `
        SELECT * FROM kivi_assessment_results
        WHERE assessment_id = ?
        ORDER BY item_number ASC
      `;
      const results = await this.query(sql, [assessmentId]);
      return results;
    } catch (error) {
      console.error('Error getting assessment results:', error);
      throw error;
    }
  }

  // Get results by student ID
  async getResultsByStudent(studentId) {
    try {
      const sql = `
        SELECT ar.*, a.assessment_type, a.assessment_name
        FROM kivi_assessment_results ar
        JOIN kivi_assessments a ON ar.assessment_id = a.id
        WHERE ar.student_id = ?
        ORDER BY ar.created_at DESC
      `;
      const results = await this.query(sql, [studentId]);
      return results;
    } catch (error) {
      console.error('Error getting student assessment results:', error);
      throw error;
    }
  }

  // Delete results by assessment ID
  async deleteByAssessment(assessmentId) {
    try {
      const sql = 'DELETE FROM kivi_assessment_results WHERE assessment_id = ?';
      const result = await this.query(sql, [assessmentId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Error deleting assessment results:', error);
      throw error;
    }
  }

  // Update a specific result
  async update(id, data) {
    try {
      const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), id];

      const sql = `
        UPDATE kivi_assessment_results
        SET ${columns}
        WHERE id = ?
      `;

      const result = await this.query(sql, values);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating assessment result:', error);
      throw error;
    }
  }
}

module.exports = AssessmentResult;
