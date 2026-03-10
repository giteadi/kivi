const Session = require('../models/Session');

class SessionController {
  constructor() {
    this.sessionModel = new Session();
  }

  // Get all sessions
  async getSessions(req, res) {
    try {
      const filters = req.query;
      const sessions = await this.sessionModel.getSessions(filters);

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single session
  async getSession(req, res) {
    try {
      const { id } = req.params;
      const session = await this.sessionModel.findById(id);

      if (!session) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get available time slots
  async getAvailableTimeSlots(req, res) {
    try {
      const { therapistId, date, duration } = req.query;
      
      if (!therapistId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Therapist ID and date are required'
        });
      }

      const availableSlots = await this.sessionModel.getAvailableTimeSlots(
        parseInt(therapistId), 
        date, 
        duration ? parseInt(duration) : 30
      );

      res.json({
        success: true,
        data: availableSlots,
        therapistId: parseInt(therapistId),
        date: date,
        totalSlots: availableSlots.length
      });
    } catch (error) {
      console.error('Get available time slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create session
  async createSession(req, res) {
    try {
      const { therapist_id, session_date, session_time, duration = 30 } = req.body;

      // Only check availability if session_time is provided (for actual booking)
      // For session plans, we don't need time slot validation
      if (therapist_id && session_date && session_time) {
        const availableSlots = await this.sessionModel.getAvailableTimeSlots(
          therapist_id,
          session_date,
          duration
        );

        const isSlotAvailable = availableSlots.some(slot => slot.time === session_time);

        if (!isSlotAvailable) {
          return res.status(409).json({
            success: false,
            message: 'This time slot is not available. Please choose another time.'
          });
        }
      }

      // Generate unique session ID
      const generateSessionId = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SS${year}${month}${day}${random}`;
      };

      const sessionData = {
        session_id: generateSessionId(),
        ...req.body,
        session_date: req.body.session_date || new Date().toISOString().split('T')[0], // Default to today
        session_time: req.body.session_time || '00:00:00', // Default time for session plans
        created_at: new Date(),
        updated_at: new Date()
      };

      const sessionId = await this.sessionModel.create(sessionData);

      res.status(201).json({
        success: true,
        data: { id: sessionId },
        message: 'Session created successfully'
      });
    } catch (error) {
      console.error('Create session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update session
  async updateSession(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.sessionModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      res.json({
        success: true,
        message: 'Session updated successfully'
      });
    } catch (error) {
      console.error('Update session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete session
  async deleteSession(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.sessionModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      }

      res.json({
        success: true,
        message: 'Session deleted successfully'
      });
    } catch (error) {
      console.error('Delete session error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get upcoming sessions
  async getUpcomingSessions(req, res) {
    try {
      const { limit = 5, ...filters } = req.query;
      const sessions = await this.sessionModel.getUpcomingSessions(parseInt(limit), filters);

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Get upcoming sessions error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = SessionController;