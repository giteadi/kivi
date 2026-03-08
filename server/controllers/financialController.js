const BaseModel = require('../models/BaseModel');

class FinancialController extends BaseModel {
  constructor() {
    super();
  }

  // Get clinic revenue
  async getClinicRevenue(req, res) {
    try {
      const { clinicId, startDate, endDate } = req.query;
      
      let sql = `
        SELECT 
          c.name as clinic_name,
          SUM(br.total_amount) as total_revenue,
          COUNT(br.id) as total_transactions,
          AVG(br.total_amount) as avg_transaction
        FROM kivi_billing_records br
        JOIN kivi_sessions a ON br.session_id = a.id
        JOIN kivi_centres c ON a.centre_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (clinicId) {
        sql += ' AND c.id = ?';
        params.push(clinicId);
      }

      if (startDate) {
        sql += ' AND br.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND br.created_at <= ?';
        params.push(endDate);
      }

      sql += ' GROUP BY c.id ORDER BY total_revenue DESC';

      const results = await this.query(sql, params);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Get clinic revenue error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get doctor revenue
  async getDoctorRevenue(req, res) {
    try {
      const { doctorId, startDate, endDate } = req.query;
      
      let sql = `
        SELECT 
          u.first_name, u.last_name,
          t.specialty,
          SUM(br.total_amount) as total_revenue,
          COUNT(br.id) as total_transactions
        FROM kivi_billing_records br
        JOIN kivi_sessions a ON br.session_id = a.id
        JOIN kivi_therapists t ON a.therapist_id = t.id
        JOIN kivi_users u ON t.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (doctorId) {
        sql += ' AND t.id = ?';
        params.push(doctorId);
      }

      if (startDate) {
        sql += ' AND br.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND br.created_at <= ?';
        params.push(endDate);
      }

      sql += ' GROUP BY t.id ORDER BY total_revenue DESC';

      const results = await this.query(sql, params);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Get doctor revenue error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  // Get taxes
  async getTaxes(req, res) {
    try {
      const { year, month } = req.query;
      
      let sql = `
        SELECT 
          t.*,
          SUM(br.total_amount * t.rate / 100) as tax_amount,
          COUNT(br.id) as applicable_transactions
        FROM kivi_taxes t
        LEFT JOIN kivi_billing_records br ON 1=1
        WHERE t.status = 'active'
      `;
      const params = [];

      if (year) {
        sql += ' AND YEAR(br.created_at) = ?';
        params.push(year);
      }

      if (month) {
        sql += ' AND MONTH(br.created_at) = ?';
        params.push(month);
      }

      sql += ' GROUP BY t.id ORDER BY t.name';

      const results = await this.query(sql, params);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Get taxes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get billing records
  async getBillingRecords(req, res) {
    try {
      const { patientId, doctorId, startDate, endDate, status } = req.query;
      
      let sql = `
        SELECT 
          br.*,
          st.first_name as student_first_name, st.last_name as student_last_name,
          u.first_name as therapist_first_name, u.last_name as therapist_last_name,
          a.session_date
        FROM kivi_billing_records br
        JOIN kivi_sessions a ON br.session_id = a.id
        JOIN kivi_students st ON a.student_id = st.id
        JOIN kivi_therapists t ON a.therapist_id = t.id
        JOIN kivi_users u ON t.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (patientId) {
        sql += ' AND st.id = ?';
        params.push(patientId);
      }

      if (doctorId) {
        sql += ' AND t.id = ?';
        params.push(doctorId);
      }

      if (startDate) {
        sql += ' AND br.created_at >= ?';
        params.push(startDate);
      }

      if (endDate) {
        sql += ' AND br.created_at <= ?';
        params.push(endDate);
      }

      if (status) {
        sql += ' AND br.status = ?';
        params.push(status);
      }

      sql += ' ORDER BY br.created_at DESC';

      const results = await this.query(sql, params);

      res.json({
        success: true,
        data: results
      });
    } catch (error) {
      console.error('Get billing records error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Helper method for database queries
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
}

module.exports = FinancialController;