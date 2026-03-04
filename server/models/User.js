const BaseModel = require('./BaseModel');

class User extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    const sql = `SELECT * FROM ${this.tableName} WHERE email = ?`;
    const results = await this.query(sql, [email]);
    return results[0] || null;
  }

  async findByRole(role) {
    const sql = `SELECT * FROM ${this.tableName} WHERE role = ? AND is_active = 1`;
    return await this.query(sql, [role]);
  }

  async getDashboardStats(dateRange = {}) {
    let dateCondition = '';
    let params = [];

    if (dateRange.startDate && dateRange.endDate) {
      dateCondition = 'WHERE DATE(created_at) BETWEEN ? AND ?';
      params = [dateRange.startDate, dateRange.endDate];
    }

    const stats = {};

    // Total users by role
    const userStats = await this.query(`
      SELECT role, COUNT(*) as count 
      FROM ${this.tableName} 
      ${dateCondition}
      GROUP BY role
    `, params);

    userStats.forEach(stat => {
      stats[stat.role] = stat.count;
    });

    return stats;
  }
}

module.exports = User;