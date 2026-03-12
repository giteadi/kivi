const { getDb } = require('../database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = getDb();
  }

  // Execute query with promise
  async query(sql, params = []) {
    console.log('🔍 BaseModel.query:', { sql, params });
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.error('❌ Database connection not initialized');
        return reject(new Error('Database connection not initialized'));
      }
      
      console.log('📡 Executing DB query...');
      const startTime = Date.now();
      
      this.db.query(sql, params, (err, results) => {
        const duration = Date.now() - startTime;
        console.log('⏱️ DB query completed:', { duration: `${duration}ms`, error: !!err, resultsCount: results?.length || 0 });
        
        if (err) {
          console.error('❌ Database query error:', { sql, params, error: err });
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // Get all records
  async findAll(conditions = '', params = []) {
    const sql = `SELECT * FROM ${this.tableName} ${conditions}`;
    return await this.query(sql, params);
  }

  // Get single record by ID
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.query(sql, [id]);
    return results[0] || null;
  }

  // Create new record
  async create(data) {
    const fields = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    const result = await this.query(sql, values);
    return result.insertId;
  }

  // Update record
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const sql = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
    const result = await this.query(sql, values);
    return result.affectedRows > 0;
  }

  // Delete record
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Count records
  async count(conditions = '', params = []) {
    const sql = `SELECT COUNT(*) as total FROM ${this.tableName} ${conditions}`;
    const results = await this.query(sql, params);
    return results[0].total;
  }
}

module.exports = BaseModel;