const Therapist = require('../models/Therapist');

class TherapistController {
  constructor() {
    this.therapistModel = new Therapist();
  }

  // Get all therapists
  async getTherapists(req, res) {
    try {
      const filters = req.query;
      const therapists = await this.therapistModel.getTherapists(filters);

      res.json({
        success: true,
        data: therapists
      });
    } catch (error) {
      console.error('Get therapists error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single therapist
  async getTherapist(req, res) {
    try {
      const { id } = req.params;
      const therapist = await this.therapistModel.getTherapistWithStats(id);

      if (!therapist) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        data: therapist
      });
    } catch (error) {
      console.error('Get therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create therapist
  async createTherapist(req, res) {
    try {
      const therapistData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const therapistId = await this.therapistModel.create(therapistData);

      res.status(201).json({
        success: true,
        data: { id: therapistId },
        message: 'Therapist created successfully'
      });
    } catch (error) {
      console.error('Create therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update therapist
  async updateTherapist(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.therapistModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Therapist updated successfully'
      });
    } catch (error) {
      console.error('Update therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete therapist
  async deleteTherapist(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.therapistModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Therapist not found'
        });
      }

      res.json({
        success: true,
        message: 'Therapist deleted successfully'
      });
    } catch (error) {
      console.error('Delete therapist error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = TherapistController;