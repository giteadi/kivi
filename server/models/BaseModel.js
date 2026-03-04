class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = global.db;
  }

  // Execute query with promise
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
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