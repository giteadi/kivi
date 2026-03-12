const Therapist = require('../models/Therapist');

class BookingController extends Therapist {
  constructor() {
    super();
  }

  // Get available therapists for booking
  async getAvailableTherapists(req, res) {
    try {
      const { date, specialty } = req.query;
      console.log('🔍 Backend: Fetching available therapists with filters:', { date, specialty });
      const therapists = await super.getAvailableTherapists(date, specialty);
      console.log('✅ Backend: Therapists fetched from DB:', therapists.map(t => ({
        id: t.id,
        name: `${t.first_name} ${t.last_name}`,
        is_available: t.is_available,
        login_time: t.login_time,
        logout_time: t.logout_time
      })));

      res.json({
        success: true,
        data: therapists,
        message: 'Available therapists retrieved successfully'
      });
    } catch (error) {
      console.error('Get available therapists error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available therapists'
      });
    }
  }

  // Get therapist availability
  async getTherapistAvailability(req, res) {
    try {
      const { therapistId, date } = req.params;
      
      if (!therapistId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Therapist ID and date are required'
        });
      }

      const availability = await super.getTherapistAvailability(therapistId, date);

      res.json({
        success: true,
        data: availability,
        message: 'Therapist availability retrieved successfully'
      });
    } catch (error) {
      console.error('Get therapist availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch therapist availability'
      });
    }
  }

  // Get available time slots for a therapist
  async getAvailableTimeSlots(req, res) {
    try {
      const { therapistId } = req.params;
      const { date } = req.query;
      
      if (!therapistId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Therapist ID and date are required'
        });
      }

      const timeSlots = await super.getAvailableTimeSlots(therapistId, date);

      res.json({
        success: true,
        data: timeSlots,
        message: 'Available time slots retrieved successfully'
      });
    } catch (error) {
      console.error('Get available time slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch available time slots'
      });
    }
  }

  // Book a session
  async bookSession(req, res) {
    try {
      console.log('🚀 === SESSION BOOKING START ===');
      console.log('📥 Request body:', req.body);
      console.log('👤 User info:', { id: req.user.id, role: req.user.role, email: req.user.email });
      
      const { therapistId, date, time, planId, notes } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!therapistId || !date || !time) {
        console.log('❌ Validation failed - missing fields:', { therapistId, date, time });
        return res.status(400).json({
          success: false,
          message: 'Therapist ID, date, and time are required'
        });
      }

      console.log('✅ Validation passed - proceeding with booking');

      // Check if time slot is still available
      console.log('🔍 Checking slot availability...');
      const timeSlots = await super.getAvailableTimeSlots(therapistId, date);
      console.log('📅 Available slots:', timeSlots.map(s => ({ time: s.time, available: s.available })));
      
      const isSlotAvailable = timeSlots.some(slot => slot.time === time && slot.available);
      console.log('🎯 Slot availability check:', { requestedTime: time, isAvailable: isSlotAvailable });

      if (!isSlotAvailable) {
        console.log('❌ Slot not available anymore');
        return res.status(400).json({
          success: false,
          message: 'Selected time slot is no longer available'
        });
      }

      // Get user details
      console.log('👤 Fetching user details...');
      const userQuery = 'SELECT first_name, last_name, email, phone, role FROM kivi_users WHERE id = ?';
      const userResult = await this.query(userQuery, [userId]);
      
      if (userResult.length === 0) {
        console.log('❌ User not found in database');
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      const user = userResult[0];
      console.log('✅ User found:', { 
        id: userId, 
        name: `${user.first_name} ${user.last_name}`, 
        email: user.email, 
        role: user.role 
      });

      // Use parent's user_id as student_id for direct booking
      console.log('🔍 Using parent direct booking approach...');
      const studentId = userId; // Use parent's ID as student reference
      
      console.log('✅ Parent direct booking:', { userId, studentId: userId });

      // Get therapist's centre_id
      console.log('🏥 Fetching therapist centre info...');
      const therapistSql = 'SELECT centre_id FROM kivi_therapists WHERE id = ?';
      const therapistResult = await this.query(therapistSql, [therapistId]);
      console.log('👨‍⚕️ Therapist query result:', therapistResult);
      
      if (therapistResult.length === 0) {
        console.log('❌ Therapist not found');
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      // Create session with user details directly
      console.log('📅 Creating session record...');
      const sessionId = `SES${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const sessionData = {
        session_id: sessionId,
        therapist_id: therapistId,
        student_id: studentId,
        centre_id: therapistResult[0].centre_id,
        session_date: date,
        session_time: time,
        status: 'scheduled',
        notes: notes || '',
        programme_id: planId ? parseInt(planId.replace('P', '')) : null,
        created_by: userId,
        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      
      console.log('📋 Session data to be inserted:', sessionData);

      const sql = `
        INSERT INTO kivi_sessions (
          session_id,
          therapist_id,
          student_id,
          centre_id,
          session_date,
          session_time,
          status,
          notes,
          programme_id,
          created_by,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        sessionData.session_id,
        sessionData.therapist_id,
        sessionData.student_id,
        sessionData.centre_id,
        sessionData.session_date,
        sessionData.session_time,
        sessionData.status,
        sessionData.notes,
        sessionData.programme_id,
        sessionData.created_by,
        sessionData.created_at,
        sessionData.updated_at
      ];

      console.log('🔧 SQL Parameters:', params);
      const result = await this.query(sql, params);
      console.log('✅ Session created successfully:', { 
        sessionId, 
        studentId, 
        therapistId, 
        userRole: user.role,
        insertId: result.insertId 
      });

      console.log('🎉 === SESSION BOOKING COMPLETED ===');
      res.status(201).json({
        success: true,
        data: { sessionId, studentId },
        message: 'Session booked successfully'
      });
    } catch (error) {
      console.error('Book session error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to book session'
      });
    }
  }

  // Get booking calendar for a therapist
  async getBookingCalendar(req, res) {
    try {
      const { therapistId } = req.params;
      const { month, year } = req.query;

      const currentDate = new Date();
      const targetMonth = month || currentDate.getMonth() + 1;
      const targetYear = year || currentDate.getFullYear();

      const startDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-01`;
      const endDate = `${targetYear}-${targetMonth.toString().padStart(2, '0')}-31`;

      const sql = `
        SELECT 
          session_date,
          session_time,
          status,
          COUNT(*) as session_count
        FROM kivi_sessions 
        WHERE therapist_id = ? 
          AND session_date BETWEEN ? AND ?
        GROUP BY session_date, session_time, status
        ORDER BY session_date, session_time
      `;

      const calendarData = await this.query(sql, [therapistId, startDate, endDate]);

      res.json({
        success: true,
        data: calendarData,
        message: 'Booking calendar retrieved successfully'
      });
    } catch (error) {
      console.error('Get booking calendar error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking calendar'
      });
    }
  }
}

module.exports = BookingController;
