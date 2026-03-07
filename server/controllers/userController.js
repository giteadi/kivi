// Updated to extend BaseModel for proper database access
const BaseModel = require('../models/BaseModel');

class UserController extends BaseModel {
  constructor() {
    super('kivi_users'); // Pass table name to BaseModel
  }

  // Get user sessions
  async getUserSessions(req, res) {
    try {
      const userId = req.user.id;

      // For parent users, return empty sessions if no linked student
      if (req.user.role === 'parent') {
        return res.json({
          success: true,
          data: []
        });
      }

      // Assuming user is linked to student, get student_id for the user
      const studentQuery = await this.query(
        'SELECT id FROM kivi_students WHERE user_id = ?',
        [userId]
      );

      if (studentQuery.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      const studentId = studentQuery[0].id;

      const sessions = await this.query(`
        SELECT
          s.id,
          s.session_date,
          s.session_time,
          s.status,
          s.notes,
          CONCAT(t.first_name, ' ', t.last_name) as therapist_name,
          c.name as centre_name,
          p.name as programme_name
        FROM kivi_sessions s
        LEFT JOIN kivi_therapists th ON s.therapist_id = th.id
        LEFT JOIN kivi_users t ON th.user_id = t.id
        LEFT JOIN kivi_centres c ON s.centre_id = c.id
        LEFT JOIN kivi_programmes p ON s.programme_id = p.id
        WHERE s.student_id = ?
        ORDER BY s.session_date DESC, s.session_time DESC
        LIMIT 10
      `, [studentId]);

      res.json({
        success: true,
        data: sessions
      });

    } catch (error) {
      console.error('Get user sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user sessions'
      });
    }
  }

  // Get user payment history
  async getUserPayments(req, res) {
    try {
      const userId = req.user.id;

      // For parent users, return empty payments if no linked student
      if (req.user.role === 'parent') {
        return res.json({
          success: true,
          data: []
        });
      }

      // Get payments from kivi_billing_records linked to user's sessions
      const payments = await this.query(`
        SELECT
          br.id,
          br.total_amount as amount,
          br.payment_status as status,
          br.created_at as date,
          br.payment_method as method,
          p.name as plan_name
        FROM kivi_billing_records br
        LEFT JOIN kivi_sessions s ON br.session_id = s.id
        LEFT JOIN kivi_programmes p ON s.programme_id = p.id
        LEFT JOIN kivi_students st ON s.student_id = st.id
        WHERE st.user_id = ? AND br.payment_status IN ('paid', 'partial')
        ORDER BY br.created_at DESC
        LIMIT 10
      `, [userId]);

      res.json({
        success: true,
        data: payments
      });

    } catch (error) {
      console.error('Get user payments error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user payments'
      });
    }
  }

  // Get user's assigned therapist
  async getUserTherapist(req, res) {
    try {
      const userId = req.user.id;

      // For parent users, return null therapist if no linked student
      if (req.user.role === 'parent') {
        return res.json({
          success: true,
          data: null
        });
      }

      const therapistQuery = await this.query(`
        SELECT
          CONCAT(u.first_name, ' ', u.last_name) as name,
          t.specialty,
          CONCAT(t.experience_years, ' years') as experience,
          t.qualification,
          u.phone,
          u.email
        FROM kivi_therapists t
        LEFT JOIN kivi_users u ON t.user_id = u.id
        LEFT JOIN kivi_sessions s ON t.id = s.therapist_id
        LEFT JOIN kivi_students st ON s.student_id = st.id
        WHERE st.user_id = ?
        LIMIT 1
      `, [userId]);

      res.json({
        success: true,
        data: therapistQuery[0] || null
      });

    } catch (error) {
      console.error('Get user therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user therapist'
      });
    }
  }

  // Update user profile
  async updateUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const { first_name, last_name, email, phone } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, and email are required'
        });
      }

      // Check if email is already taken by another user
      const existingUser = await this.query(
        'SELECT id FROM kivi_users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }

      // Update user profile
      await this.query(
        'UPDATE kivi_users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?',
        [first_name, last_name, email, phone || null, userId]
      );

      // Get updated user data
      const updatedUser = await this.query(
        'SELECT id, first_name, last_name, email, phone, role, created_at FROM kivi_users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser[0]
      });

    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }
  }

  // Get user stats
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;

      // For parent users, return empty stats if no linked student
      if (req.user.role === 'parent') {
        return res.json({
          success: true,
          data: {
            totalSessions: 0,
            completedSessions: 0,
            upcomingSessions: 0,
            progress: 0
          }
        });
      }

      // Get student_id for the user
      const studentQuery = await this.query(
        'SELECT id FROM kivi_students WHERE user_id = ?',
        [userId]
      );

      if (studentQuery.length === 0) {
        return res.json({
          success: true,
          data: {
            totalSessions: 0,
            completedSessions: 0,
            upcomingSessions: 0,
            progress: 0
          }
        });
      }

      const studentId = studentQuery[0].id;

      // Total sessions
      const totalSessionsQuery = await this.query(
        'SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id = ?',
        [studentId]
      );

      // Completed sessions
      const completedSessionsQuery = await this.query(
        'SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id = ? AND status = "completed"',
        [studentId]
      );

      // Upcoming sessions
      const upcomingSessionsQuery = await this.query(
        'SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id = ? AND session_date >= CURDATE() AND status IN ("scheduled", "confirmed")',
        [studentId]
      );

      const total = totalSessionsQuery[0].count;
      const completed = completedSessionsQuery[0].count;
      const upcoming = upcomingSessionsQuery[0].count;

      // Calculate progress (completed / total * 100)
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      res.json({
        success: true,
        data: {
          totalSessions: total,
          completedSessions: completed,
          upcomingSessions: upcoming,
          progress: progress
        }
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user stats'
      });
    }
  }
}

module.exports = new UserController();
