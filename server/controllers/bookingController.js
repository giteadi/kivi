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
      const { therapistId, date, time, planId, notes } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!therapistId || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Therapist ID, date, and time are required'
        });
      }

      // Check if the time slot is still available
      const timeSlots = await super.getAvailableTimeSlots(therapistId, date);
      const isSlotAvailable = timeSlots.some(slot => slot.time === time && slot.available);

      if (!isSlotAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Selected time slot is no longer available'
        });
      }

      // Get therapist's centre_id
      const therapistSql = 'SELECT centre_id FROM kivi_therapists WHERE id = ?';
      const therapistResult = await this.query(therapistSql, [therapistId]);
      
      if (therapistResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      // Create the session
      const sessionId = `SES${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const sessionData = {
        session_id: sessionId,
        therapist_id: therapistId,
        student_id: userId, // Link session to the booking user (student)
        centre_id: therapistResult[0].centre_id,
        session_date: date,
        session_time: time,
        status: 'scheduled',
        notes: notes || '',
        programme_id: planId || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const sql = `
        INSERT INTO kivi_sessions (session_id, therapist_id, student_id, centre_id, session_date, session_time, status, notes, programme_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        sessionData.created_at,
        sessionData.updated_at
      ];

      const result = await this.query(sql, params);

      res.status(201).json({
        success: true,
        data: { sessionId },
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
