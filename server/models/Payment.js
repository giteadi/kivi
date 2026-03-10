const BaseModel = require('./BaseModel');

class Payment extends BaseModel {
  constructor() {
    super('kivi_payments');
  }

  // Create a new payment record
  async create(paymentData) {
    try {
      const query = `
        INSERT INTO kivi_payments (
          user_id, plan_id, order_id, payment_id, signature, 
          status, amount, currency, paid_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const values = [
        paymentData.userId,
        typeof paymentData.planId === 'string' 
          ? parseInt(paymentData.planId.replace(/\D/g, ''), 10) 
          : paymentData.planId,
        paymentData.orderId,
        paymentData.paymentId,
        paymentData.signature,
        paymentData.status,
        paymentData.amount || 0,
        paymentData.currency || 'INR',
        paymentData.paidAt ? new Date(paymentData.paidAt).toISOString().slice(0, 19).replace('T', ' ') : null
      ];

      const result = await this.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  // Get payment by payment ID
  async getByPaymentId(paymentId) {
    try {
      const query = 'SELECT * FROM kivi_payments WHERE payment_id = ?';
      const results = await this.query(query, [paymentId]);
      return results[0] || null;
    } catch (error) {
      console.error('Error getting payment by payment ID:', error);
      throw error;
    }
  }

  // Get payment history for a user
  async getUserPaymentHistory(userId, limit = 50, offset = 0) {
    try {
      const query = `
        SELECT p.*, pl.name as plan_name, pl.description as plan_description
        FROM kivi_payments p
        LEFT JOIN kivi_plans pl ON p.plan_id = pl.id
        WHERE p.user_id = ?
        ORDER BY p.paid_at DESC
        LIMIT ? OFFSET ?
      `;
      
      const results = await this.query(query, [userId, limit, offset]);
      return results;
    } catch (error) {
      console.error('Error getting user payment history:', error);
      throw error;
    }
  }

  // Get payment by order ID
  async getByOrderId(orderId) {
    try {
      const query = 'SELECT * FROM kivi_payments WHERE order_id = ?';
      const results = await this.query(query, [orderId]);
      return results[0] || null;
    } catch (error) {
      console.error('Error getting payment by order ID:', error);
      throw error;
    }
  }

  // Update payment status
  async updateStatus(paymentId, status, additionalData = {}) {
    try {
      let query = 'UPDATE kivi_payments SET status = ?';
      let values = [status];

      if (additionalData.paidAt) {
        query += ', paid_at = ?';
        values.push(additionalData.paidAt);
      }

      if (additionalData.signature) {
        query += ', signature = ?';
        values.push(additionalData.signature);
      }

      query += ' WHERE payment_id = ?';
      values.push(paymentId);

      await this.query(query, values);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Get payment statistics
  async getPaymentStats(userId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_payments,
          SUM(amount) as total_revenue,
          AVG(amount) as average_payment,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments
        FROM kivi_payments
      `;

      const params = [];
      if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
      }

      const results = await this.query(query, params);
      return results[0] || {};
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  }
}

module.exports = Payment;
