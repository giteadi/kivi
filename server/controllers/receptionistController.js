const Receptionist = require('../models/Receptionist');

class ReceptionistController {
  constructor() {
    this.receptionistModel = new Receptionist();
  }

  // Get all receptionists
  async getReceptionists(req, res) {
    try {
      const filters = req.query;
      const receptionists = await this.receptionistModel.getReceptionists(filters);

      res.json({
        success: true,
        data: receptionists
      });
    } catch (error) {
      console.error('Get receptionists error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single receptionist
  async getReceptionist(req, res) {
    try {
      const { id } = req.params;
      const receptionist = await this.receptionistModel.findById(id);

      if (!receptionist) {
        return res.status(404).json({
          success: false,
          message: 'Receptionist not found'
        });
      }

      res.json({
        success: true,
        data: receptionist
      });
    } catch (error) {
      console.error('Get receptionist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
  // Create receptionist
  async createReceptionist(req, res) {
    try {
      const receptionistData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const receptionistId = await this.receptionistModel.create(receptionistData);

      res.status(201).json({
        success: true,
        data: { id: receptionistId },
        message: 'Receptionist created successfully'
      });
    } catch (error) {
      console.error('Create receptionist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update receptionist
  async updateReceptionist(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.receptionistModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Receptionist not found'
        });
      }

      res.json({
        success: true,
        message: 'Receptionist updated successfully'
      });
    } catch (error) {
      console.error('Update receptionist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete receptionist
  async deleteReceptionist(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.receptionistModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Receptionist not found'
        });
      }

      res.json({
        success: true,
        message: 'Receptionist deleted successfully'
      });
    } catch (error) {
      console.error('Delete receptionist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ReceptionistController;