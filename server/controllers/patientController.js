const Patient = require('../models/Patient');

class PatientController {
  constructor() {
    this.patientModel = new Patient();
  }

  // Get all patients
  async getPatients(req, res) {
    try {
      const filters = req.query;
      const patients = await this.patientModel.getPatients(filters);

      res.json({
        success: true,
        data: patients
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single patient
  async getPatient(req, res) {
    try {
      const { id } = req.params;
      const patient = await this.patientModel.getPatientWithAppointments(id);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        data: patient
      });
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create patient
  async createPatient(req, res) {
    try {
      const patientData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const patientId = await this.patientModel.create(patientData);

      res.status(201).json({
        success: true,
        data: { id: patientId },
        message: 'Patient created successfully'
      });
    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update patient
  async updatePatient(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.patientModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Patient updated successfully'
      });
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete patient
  async deletePatient(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.patientModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }

      res.json({
        success: true,
        message: 'Patient deleted successfully'
      });
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = PatientController;