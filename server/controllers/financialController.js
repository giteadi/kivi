class FinancialController {
  constructor() {
    this.db = global.db;
  }

  // Get clinic revenue
  async getClinicRevenue(req, res) {
    try {
      const { clinicId, startDate, endDate } = req.query;
      
      let sql = `
        SELECT 
          c.name as clinic_name,
          SUM(br.amount) as total_revenue,
          COUNT(br.id) as total_transactions,
          AVG(br.amount) as avg_transaction
        FROM billing_records br
        JOIN appointments a ON br.appointment_id = a.id
        JOIN clinics c ON a.clinic_id = c.id
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
          d.specialty,
          SUM(br.amount) as total_revenue,
          COUNT(br.id) as total_transactions
        FROM billing_records br
        JOIN appointments a ON br.appointment_id = a.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (doctorId) {
        sql += ' AND d.id = ?';
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

      sql += ' GROUP BY d.id ORDER BY total_revenue DESC';

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
          SUM(br.amount * t.rate / 100) as tax_amount,
          COUNT(br.id) as applicable_transactions
        FROM taxes t
        LEFT JOIN billing_records br ON 1=1
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
          p.first_name as patient_first_name, p.last_name as patient_last_name,
          u.first_name as doctor_first_name, u.last_name as doctor_last_name,
          a.appointment_date
        FROM billing_records br
        JOIN appointments a ON br.appointment_id = a.id
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE 1=1
      `;
      const params = [];

      if (patientId) {
        sql += ' AND p.id = ?';
        params.push(patientId);
      }

      if (doctorId) {
        sql += ' AND d.id = ?';
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