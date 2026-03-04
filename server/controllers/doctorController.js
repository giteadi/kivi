const Doctor = require('../models/Doctor');

class DoctorController {
  constructor() {
    this.doctorModel = new Doctor();
  }

  // Get all doctors
  async getDoctors(req, res) {
    try {
      const filters = req.query;
      const doctors = await this.doctorModel.getDoctors(filters);

      res.json({
        success: true,
        data: doctors
      });
    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single doctor
  async getDoctor(req, res) {
    try {
      const { id } = req.params;
      const doctor = await this.doctorModel.getDoctorWithStats(id);

      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        data: doctor
      });
    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create doctor
  async createDoctor(req, res) {
    try {
      const doctorData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const doctorId = await this.doctorModel.create(doctorData);

      res.status(201).json({
        success: true,
        data: { id: doctorId },
        message: 'Doctor created successfully'
      });
    } catch (error) {
      console.error('Create doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update doctor
  async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.doctorModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        message: 'Doctor updated successfully'
      });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete doctor
  async deleteDoctor(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.doctorModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      res.json({
        success: true,
        message: 'Doctor deleted successfully'
      });
    } catch (error) {
      console.error('Delete doctor error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = DoctorController;