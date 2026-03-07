const Therapist = require('../models/Therapist');

class BookingController extends Therapist {
  constructor() {
    super();
  }

  // Get available therapists for booking
  async getAvailableTherapists(req, res) {
    try {
      const { date, specialty } = req.query;
      const therapists = await super.getAvailableTherapists(date, specialty);

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

      const availability = await this.getTherapistAvailability(therapistId, date);

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

      const timeSlots = await this.getAvailableTimeSlots(therapistId, date);

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
      const timeSlots = await this.getAvailableTimeSlots(therapistId, date);
      const isSlotAvailable = timeSlots.some(slot => slot.time === time && slot.available);

      if (!isSlotAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Selected time slot is no longer available'
        });
      }

      // Create the session
      const sessionData = {
        therapist_id: therapistId,
        session_date: date,
        session_time: time,
        status: 'scheduled',
        notes: notes || '',
        programme_id: planId || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const sessionId = await this.create(sessionData);

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
