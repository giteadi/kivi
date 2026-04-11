const CenterVisibility = require('../models/CenterVisibility');

class CenterVisibilityController {
  constructor() {
    this.centerVisibilityModel = new CenterVisibility();
  }

  // Get visibility settings for a specific center
  async getVisibilitySettings(req, res) {
    try {
      const { centerId } = req.params;
      
      const settings = await this.centerVisibilityModel.getVisibilityByCenterId(centerId);
      
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('❌ Error getting visibility settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get visibility settings',
        error: error.message
      });
    }
  }

  // Get all centers with visibility settings
  async getAllCentersVisibility(req, res) {
    try {
      const centers = await this.centerVisibilityModel.getAllCentersWithVisibility();
      
      res.json({
        success: true,
        data: centers,
        count: centers.length
      });
    } catch (error) {
      console.error('❌ Error getting all centers visibility:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get centers visibility settings',
        error: error.message
      });
    }
  }

  // Update visibility settings for a center
  async updateVisibilitySettings(req, res) {
    try {
      const { centerId } = req.params;
      const settings = req.body;

      // Validate that settings object is not empty
      if (!settings || Object.keys(settings).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No settings provided to update'
        });
      }

      const updated = await this.centerVisibilityModel.updateVisibility(centerId, settings);
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Center not found or settings could not be updated'
        });
      }

      console.log(`✅ Visibility settings updated for center ${centerId}`);

      res.json({
        success: true,
        message: 'Visibility settings updated successfully'
      });
    } catch (error) {
      console.error('❌ Error updating visibility settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update visibility settings',
        error: error.message
      });
    }
  }

  // Batch update visibility settings for multiple centers
  async batchUpdateVisibility(req, res) {
    try {
      const { centers } = req.body;

      if (!Array.isArray(centers) || centers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid centers array provided'
        });
      }

      const results = [];
      for (const { centerId, settings } of centers) {
        try {
          await this.centerVisibilityModel.updateVisibility(centerId, settings);
          results.push({ centerId, success: true });
        } catch (err) {
          results.push({ centerId, success: false, error: err.message });
        }
      }

      console.log(`✅ Batch visibility settings updated for ${centers.length} centers`);

      res.json({
        success: true,
        message: 'Batch update completed',
        data: results
      });
    } catch (error) {
      console.error('❌ Error in batch update:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to batch update visibility settings',
        error: error.message
      });
    }
  }

  // Check if user can see specific data for a center
  async checkDataVisibility(req, res) {
    try {
      const { centerId, field } = req.params;
      
      const isVisible = await this.centerVisibilityModel.isFieldVisible(centerId, field);
      
      res.json({
        success: true,
        data: {
          centerId,
          field,
          isVisible
        }
      });
    } catch (error) {
      console.error('❌ Error checking data visibility:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check data visibility',
        error: error.message
      });
    }
  }
}

module.exports = CenterVisibilityController;
