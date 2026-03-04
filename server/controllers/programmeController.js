const Programme = require('../models/Programme');

class ProgrammeController {
  constructor() {
    this.programmeModel = new Programme();
  }

  // Get all programmes
  async getProgrammes(req, res) {
    try {
      const filters = req.query;
      const programmes = await this.programmeModel.getProgrammes(filters);

      res.json({
        success: true,
        data: programmes
      });
    } catch (error) {
      console.error('Get programmes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single programme
  async getProgramme(req, res) {
    try {
      const { id } = req.params;
      const programme = await this.programmeModel.findById(id);

      if (!programme) {
        return res.status(404).json({
          success: false,
          message: 'Programme not found'
        });
      }

      res.json({
        success: true,
        data: programme
      });
    } catch (error) {
      console.error('Get programme error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create programme
  async createProgramme(req, res) {
    try {
      const programmeData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const programmeId = await this.programmeModel.create(programmeData);

      res.status(201).json({
        success: true,
        data: { id: programmeId },
        message: 'Programme created successfully'
      });
    } catch (error) {
      console.error('Create programme error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update programme
  async updateProgramme(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.programmeModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Programme not found'
        });
      }

      res.json({
        success: true,
        message: 'Programme updated successfully'
      });
    } catch (error) {
      console.error('Update programme error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete programme
  async deleteProgramme(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.programmeModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Programme not found'
        });
      }

      res.json({
        success: true,
        message: 'Programme deleted successfully'
      });
    } catch (error) {
      console.error('Delete programme error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ProgrammeController;