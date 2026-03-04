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

  // Create session
  async createSession(req, res) {
    try {
      const sessionData = {
        ...req.body,
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