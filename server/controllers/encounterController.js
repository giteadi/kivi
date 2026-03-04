const Encounter = require('../models/Encounter');

class EncounterController {
  constructor() {
    this.encounterModel = new Encounter();
  }

  // Get all encounters
  async getEncounters(req, res) {
    try {
      const filters = req.query;
      const encounters = await this.encounterModel.getEncounters(filters);

      res.json({
        success: true,
        data: encounters
      });
    } catch (error) {
      console.error('Get encounters error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single encounter
  async getEncounter(req, res) {
    try {
      const { id } = req.params;
      const encounter = await this.encounterModel.getEncounterWithDetails(id);

      if (!encounter) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        data: encounter
      });
    } catch (error) {
      console.error('Get encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create encounter
  async createEncounter(req, res) {
    try {
      const encounterData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const encounterId = await this.encounterModel.create(encounterData);

      res.status(201).json({
        success: true,
        data: { id: encounterId },
        message: 'Encounter created successfully'
      });
    } catch (error) {
      console.error('Create encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update encounter
  async updateEncounter(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.encounterModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        message: 'Encounter updated successfully'
      });
    } catch (error) {
      console.error('Update encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete encounter
  async deleteEncounter(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.encounterModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Encounter not found'
        });
      }

      res.json({
        success: true,
        message: 'Encounter deleted successfully'
      });
    } catch (error) {
      console.error('Delete encounter error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = EncounterController;