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

      // For parent users, get sessions they've paid for OR sessions for unassigned students
      if (req.user.role === 'parent') {
        console.log('🔍 Getting sessions for parent user:', userId);
        
        // Simple logic: Get only upcoming sessions for unassigned students
        const sessions = await this.query(`
          SELECT DISTINCT
            s.id,
            s.session_date,
            s.session_time,
            s.status,
            s.notes,
            CONCAT(u.first_name, ' ', u.last_name) as therapist_name,
            u.phone as therapist_phone,
            u.email as therapist_email,
            c.name as centre_name,
            p.name as programme_name,
            st.first_name as student_name,
            st.last_name as student_last_name,
            st.email as student_email,
            st.phone as student_phone,
            st.age as student_age,
            st.gender as student_gender
          FROM kivi_sessions s
          LEFT JOIN kivi_therapists th ON s.therapist_id = th.id
          LEFT JOIN kivi_users u ON th.user_id = u.id
          LEFT JOIN kivi_centres c ON s.centre_id = c.id
          LEFT JOIN kivi_programmes p ON s.programme_id = p.id
          LEFT JOIN kivi_students st ON s.student_id = st.id
          WHERE st.user_id IS NULL 
            AND s.session_date >= CURDATE()
            AND s.status IN ('scheduled', 'confirmed')
          ORDER BY s.session_date ASC, s.session_time ASC
          LIMIT 5
        `);

        console.log('✅ Found sessions for parent:', sessions.length);
        return res.json({
          success: true,
          data: sessions
        });
      }

      // For student users, get their own sessions
      console.log('🔍 Getting sessions for student user:', userId);
      
      // Assuming user is linked to student, get student_id for the user
      const studentQuery = await this.query(
        'SELECT id FROM kivi_students WHERE user_id = ?',
        [userId]
      );

      if (studentQuery.length === 0) {
        console.log('❌ No student record found for user:', userId);
        return res.json({
          success: true,
          data: []
        });
      }

      const studentId = studentQuery[0].id;
      console.log('✅ Found student record:', { userId, studentId });

      const sessions = await this.query(`
        SELECT
          s.id,
          s.session_date,
          s.session_time,
          s.status,
          s.notes,
          CONCAT(u.first_name, ' ', u.last_name) as therapist_name,
          u.phone as therapist_phone,
          u.email as therapist_email,
          c.name as centre_name,
          p.name as programme_name,
          st.first_name as student_name,
          st.last_name as student_last_name,
          st.email as student_email,
          st.phone as student_phone,
          st.age as student_age,
          st.gender as student_gender
        FROM kivi_sessions s
        LEFT JOIN kivi_therapists th ON s.therapist_id = th.id
        LEFT JOIN kivi_users u ON th.user_id = u.id
        LEFT JOIN kivi_centres c ON s.centre_id = c.id
        LEFT JOIN kivi_programmes p ON s.programme_id = p.id
        LEFT JOIN kivi_students st ON s.student_id = st.id
        WHERE s.student_id = ?
        ORDER BY s.session_date DESC, s.session_time DESC
        LIMIT 10
      `, [studentId]);

      console.log('✅ Found sessions for student:', sessions.length);
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

      let payments = [];

      if (req.user.role === 'parent') {
        // For parent users, get payments for their children's sessions
        console.log('🔍 Getting payments for parent user:', userId);

        // Get payments from kivi_payments table
        payments = await this.query(`
          SELECT
            p.id,
            p.amount,
            p.status,
            p.paid_at as date,
            'razorpay' as method,
            pr.name as plan_name
          FROM kivi_payments p
          LEFT JOIN kivi_programmes pr ON p.plan_id = pr.id
          WHERE p.user_id = ?
          ORDER BY p.paid_at DESC
          LIMIT 10
        `, [userId]);

        console.log('✅ Found payments for parent:', payments.length);
      } else {
        // For student users, get their payments
        console.log('🔍 Getting payments for student user:', userId);

        // Get payments from kivi_payments table
        payments = await this.query(`
          SELECT
            p.id,
            p.amount,
            p.status,
            p.paid_at as date,
            'razorpay' as method,
            pr.name as plan_name
          FROM kivi_payments p
          LEFT JOIN kivi_programmes pr ON p.plan_id = pr.id
          WHERE p.user_id = ?
          ORDER BY p.paid_at DESC
          LIMIT 10
        `, [userId]);

        console.log('✅ Found payments for student:', payments.length);
      }

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

      let studentIds = [];

      if (req.user.role === 'parent') {
        // For parent users, get stats for unassigned students (upcoming only)
        console.log('🔍 Getting stats for parent user:', userId);
        
        // Simple logic: Get only upcoming sessions for unassigned students
        const sessionsQuery = await this.query(`
          SELECT DISTINCT s.id, s.status, s.session_date 
          FROM kivi_sessions s
          LEFT JOIN kivi_students st ON s.student_id = st.id
          WHERE st.user_id IS NULL 
            AND s.session_date >= CURDATE()
            AND s.status IN ('scheduled', 'confirmed')
        `);
        
        console.log('✅ Found sessions for parent stats:', sessionsQuery.length);

        const total = sessionsQuery.length;
        const completed = 0; // No completed sessions in upcoming list
        const upcoming = sessionsQuery.length; // All are upcoming

        // Calculate progress (completed / total * 100)
        const progress = 0; // No completed sessions yet

        console.log('📊 Parent stats calculated:', { total, completed, upcoming, progress });

        return res.json({
          success: true,
          data: {
            totalSessions: total,
            completedSessions: completed,
            upcomingSessions: upcoming,
            progress: progress
          }
        });
      } else {
        // For student users, get their own student ID
        console.log('🔍 Getting stats for student user:', userId);
        
        const studentQuery = await this.query(
          'SELECT id FROM kivi_students WHERE user_id = ?',
          [userId]
        );

        if (studentQuery.length === 0) {
          console.log('❌ No student record found for user:', userId);
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

        studentIds = [studentQuery[0].id];
        console.log('✅ Found student ID for user:', studentIds);
      }

      if (studentIds.length === 0) {
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

      // Build WHERE clause for multiple student IDs
      const studentIdsPlaceholder = studentIds.map(() => '?').join(',');
      
      // Total sessions
      const totalSessionsQuery = await this.query(
        `SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id IN (${studentIdsPlaceholder})`,
        studentIds
      );

      // Completed sessions
      const completedSessionsQuery = await this.query(
        `SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id IN (${studentIdsPlaceholder}) AND status = "completed"`,
        studentIds
      );

      // Upcoming sessions (future dates and scheduled/confirmed status)
      const upcomingSessionsQuery = await this.query(
        `SELECT COUNT(*) as count FROM kivi_sessions WHERE student_id IN (${studentIdsPlaceholder}) AND session_date >= CURDATE() AND status IN ("scheduled", "confirmed")`,
        studentIds
      );

      const total = totalSessionsQuery[0].count;
      const completed = completedSessionsQuery[0].count;
      const upcoming = upcomingSessionsQuery[0].count;

      // Calculate progress (completed / total * 100)
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

      console.log('📊 User stats calculated:', { total, completed, upcoming, progress, userRole: req.user.role });

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
