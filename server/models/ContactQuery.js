const BaseModel = require('./BaseModel');

class ContactQuery extends BaseModel {
  constructor() {
    super('contact_queries');
  }

  // Create a new contact query
  async createQuery(queryData) {
    try {
      const sql = `
        INSERT INTO contact_queries (name, email, subject, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        queryData.name,
        queryData.email,
        queryData.subject,
        queryData.message,
        queryData.status || 'pending',
        queryData.created_at || new Date().toISOString()
      ];
      
      const result = await this.query(sql, params);
      return result.insertId;
    } catch (error) {
      console.error('Error creating contact query:', error);
      throw error;
    }
  }

  // Get all contact queries with optional filters
  async getAllQueries(filters = {}) {
    try {
      let sql = 'SELECT * FROM contact_queries';
      const params = [];
      const conditions = [];

      if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }

      if (filters.email) {
        conditions.push('email = ?');
        params.push(filters.email);
      }

      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      sql += ' ORDER BY created_at DESC';

      if (filters.limit) {
        sql += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      return await this.query(sql, params);
    } catch (error) {
      console.error('Error getting contact queries:', error);
      throw error;
    }
  }

  // Get a single contact query by ID
  async getQueryById(id) {
    try {
      const sql = 'SELECT * FROM contact_queries WHERE id = ?';
      const results = await this.query(sql, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error('Error getting contact query by ID:', error);
      throw error;
    }
  }

  // Update contact query status
  async updateQueryStatus(id, status, adminNotes = null) {
    try {
      let sql = 'UPDATE contact_queries SET status = ?';
      const params = [status];

      if (adminNotes !== null) {
        sql += ', admin_notes = ?';
        params.push(adminNotes);
      }

      sql += ' WHERE id = ?';
      params.push(id);

      const result = await this.query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating contact query status:', error);
      throw error;
    }
  }

  // Delete a contact query
  async deleteQuery(id) {
    try {
      const sql = 'DELETE FROM contact_queries WHERE id = ?';
      const result = await this.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting contact query:', error);
      throw error;
    }
  }

  // Get query statistics
  async getQueryStats() {
    try {
      const sql = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
          SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM contact_queries
      `;
      const results = await this.query(sql);
      return results[0];
    } catch (error) {
      console.error('Error getting query statistics:', error);
      throw error;
    }
  }
}

module.exports = ContactQuery;
