const ContactQuery = require('../models/ContactQuery');

class ContactQueryController {
  constructor() {
    this.contactQueryModel = new ContactQuery();
  }

  // Create a new contact query
  async createQuery(req, res) {
    try {
      const { name, email, subject, message, status, created_at } = req.body;

      // Validation
      if (!name || !email || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, subject, and message are required'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      const queryData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: status || 'pending',
        created_at: created_at || new Date().toISOString()
      };

      const queryId = await this.contactQueryModel.createQuery(queryData);

      console.log(`✅ Contact query created with ID: ${queryId}`);

      res.status(201).json({
        success: true,
        data: { id: queryId },
        message: 'Contact query submitted successfully'
      });
    } catch (error) {
      console.error('❌ Error creating contact query:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit contact query',
        error: error.message
      });
    }
  }

  // Get all contact queries
  async getAllQueries(req, res) {
    try {
      const { status, email, limit } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (email) filters.email = email;
      if (limit) filters.limit = parseInt(limit);

      const queries = await this.contactQueryModel.getAllQueries(filters);

      res.json({
        success: true,
        data: queries,
        count: queries.length
      });
    } catch (error) {
      console.error('❌ Error fetching contact queries:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact queries',
        error: error.message
      });
    }
  }

  // Get a single contact query by ID
  async getQueryById(req, res) {
    try {
      const { id } = req.params;
      
      const query = await this.contactQueryModel.getQueryById(id);
      
      if (!query) {
        return res.status(404).json({
          success: false,
          message: 'Contact query not found'
        });
      }

      res.json({
        success: true,
        data: query
      });
    } catch (error) {
      console.error('❌ Error fetching contact query:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch contact query',
        error: error.message
      });
    }
  }

  // Update contact query status
  async updateQueryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, admin_notes } = req.body;

      // Validate status
      const validStatuses = ['pending', 'resolved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be pending, resolved, or rejected'
        });
      }

      const updated = await this.contactQueryModel.updateQueryStatus(id, status, admin_notes);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Contact query not found'
        });
      }

      console.log(`✅ Contact query ${id} status updated to: ${status}`);

      res.json({
        success: true,
        message: 'Contact query status updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating contact query status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update contact query status',
        error: error.message
      });
    }
  }

  // Delete a contact query
  async deleteQuery(req, res) {
    try {
      const { id } = req.params;
      
      const deleted = await this.contactQueryModel.deleteQuery(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Contact query not found'
        });
      }

      console.log(`✅ Contact query ${id} deleted`);

      res.json({
        success: true,
        message: 'Contact query deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting contact query:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete contact query',
        error: error.message
      });
    }
  }

  // Get query statistics
  async getQueryStats(req, res) {
    try {
      const stats = await this.contactQueryModel.getQueryStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('❌ Error fetching query statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch query statistics',
        error: error.message
      });
    }
  }
}

module.exports = ContactQueryController;
