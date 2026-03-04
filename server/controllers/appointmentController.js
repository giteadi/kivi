const Appointment = require('../models/Appointment');

class AppointmentController {
  constructor() {
    this.appointmentModel = new Appointment();
  }

  // Get all appointments
  async getAppointments(req, res) {
    try {
      const filters = req.query;
      const appointments = await this.appointmentModel.getAppointments(filters);

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single appointment
  async getAppointment(req, res) {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentModel.findById(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        data: appointment
      });
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create appointment
  async createAppointment(req, res) {
    try {
      const appointmentData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const appointmentId = await this.appointmentModel.create(appointmentData);

      res.status(201).json({
        success: true,
        data: { id: appointmentId },
        message: 'Appointment created successfully'
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update appointment
  async updateAppointment(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.appointmentModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        message: 'Appointment updated successfully'
      });
    } catch (error) {
      console.error('Update appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete appointment
  async deleteAppointment(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.appointmentModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      res.json({
        success: true,
        message: 'Appointment deleted successfully'
      });
    } catch (error) {
      console.error('Delete appointment error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = AppointmentController;