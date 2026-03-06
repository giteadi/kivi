const BaseModel = require('./BaseModel');

class Plan extends BaseModel {
  constructor() {
    super('kivi_plans');
  }

  // Get all available plans
  async getPlans(filters = {}) {
    try {
      let whereConditions = 'WHERE is_active = 1';
      const params = [];

      if (filters.type) {
        whereConditions += ' AND type = ?';
        params.push(filters.type);
      }

      if (filters.min_price) {
        whereConditions += ' AND price >= ?';
        params.push(filters.min_price);
      }

      if (filters.max_price) {
        whereConditions += ' AND price <= ?';
        params.push(filters.max_price);
      }

      const sql = `
        SELECT * FROM ${this.tableName} 
        ${whereConditions} 
        ORDER BY price ASC
      `;
      
      return await this.query(sql, params);
    } catch (error) {
      console.error('Error in getPlans:', error);
      throw error;
    }
  }

  // Get plan by ID
  async getPlanById(id) {
    try {
      const sql = `
        SELECT * FROM ${this.tableName} 
        WHERE id = ? AND is_active = 1
      `;
      const results = await this.query(sql, [id]);
      return results[0] || null;
    } catch (error) {
      console.error('Error in getPlanById:', error);
      throw error;
    }
  }

  // Get plans with therapist availability
  async getPlansWithTherapistAvailability(planId = null) {
    try {
      let whereClause = planId ? 'WHERE p.id = ? AND p.is_active = 1' : 'WHERE p.is_active = 1';
      const params = planId ? [planId] : [];

      const sql = `
        SELECT 
          p.*,
          COUNT(DISTINCT t.id) as available_therapists
        FROM ${this.tableName} p
        LEFT JOIN kivi_therapists t ON t.is_active = 1
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.price ASC
      `;

      return await this.query(sql, params);
    } catch (error) {
      console.error('Error in getPlansWithTherapistAvailability:', error);
      throw error;
    }
  }

  // Create new plan
  async createPlan(planData) {
    try {
      const data = {
        ...planData,
        created_at: new Date(),
        updated_at: new Date()
      };
      return await this.create(data);
    } catch (error) {
      console.error('Error in createPlan:', error);
      throw error;
    }
  }

  // Update plan
  async updatePlan(id, planData) {
    try {
      const data = {
        ...planData,
        updated_at: new Date()
      };
      return await this.update(id, data);
    } catch (error) {
      console.error('Error in updatePlan:', error);
      throw error;
    }
  }

  // Delete plan (soft delete)
  async deletePlan(id) {
    try {
      return await this.update(id, { is_active: 0, updated_at: new Date() });
    } catch (error) {
      console.error('Error in deletePlan:', error);
      throw error;
    }
  }
}

module.exports = Plan;
