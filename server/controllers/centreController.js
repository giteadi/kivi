const Centre = require('../models/Centre');

class CentreController {
  constructor() {
    this.centreModel = new Centre();
  }

  // Get all centres
  async getCentres(req, res) {
    try {
      const filters = req.query;
      const centres = await this.centreModel.getCentres(filters);

      res.json({
        success: true,
        data: centres
      });
    } catch (error) {
      console.error('Get centres error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single centre
  async getCentre(req, res) {
    try {
      const { id } = req.params;
      const centre = await this.centreModel.getCentreWithStats(id);

      if (!centre) {
        return res.status(404).json({
          success: false,
          message: 'Centre not found'
        });
      }

      res.json({
        success: true,
        data: centre
      });
    } catch (error) {
      console.error('Get centre error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create centre
  async createCentre(req, res) {
    try {
      const centreData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const centreId = await this.centreModel.create(centreData);

      res.status(201).json({
        success: true,
        data: { id: centreId },
        message: 'Centre created successfully'
      });
    } catch (error) {
      console.error('Create centre error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update centre
  async updateCentre(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.centreModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Centre not found'
        });
      }

      res.json({
        success: true,
        message: 'Centre updated successfully'
      });
    } catch (error) {
      console.error('Update centre error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete centre
  async deleteCentre(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.centreModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Centre not found'
        });
      }

      res.json({
        success: true,
        message: 'Centre deleted successfully'
      });
    } catch (error) {
      console.error('Delete centre error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = CentreController;