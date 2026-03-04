const Clinic = require('../models/Clinic');

class ClinicController {
  constructor() {
    this.clinicModel = new Clinic();
  }

  // Get all clinics
  async getClinics(req, res) {
    try {
      const filters = req.query;
      const clinics = await this.clinicModel.getClinics(filters);

      res.json({
        success: true,
        data: clinics
      });
    } catch (error) {
      console.error('Get clinics error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single clinic
  async getClinic(req, res) {
    try {
      const { id } = req.params;
      const clinic = await this.clinicModel.getClinicWithStats(id);

      if (!clinic) {
        return res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
      }

      res.json({
        success: true,
        data: clinic
      });
    } catch (error) {
      console.error('Get clinic error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create clinic
  async createClinic(req, res) {
    try {
      const clinicData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const clinicId = await this.clinicModel.create(clinicData);

      res.status(201).json({
        success: true,
        data: { id: clinicId },
        message: 'Clinic created successfully'
      });
    } catch (error) {
      console.error('Create clinic error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update clinic
  async updateClinic(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.clinicModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
      }

      res.json({
        success: true,
        message: 'Clinic updated successfully'
      });
    } catch (error) {
      console.error('Update clinic error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete clinic
  async deleteClinic(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.clinicModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Clinic not found'
        });
      }

      res.json({
        success: true,
        message: 'Clinic deleted successfully'
      });
    } catch (error) {
      console.error('Delete clinic error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ClinicController;