const Programme = require('../models/Programme');

class ServiceController {
  constructor() {
    this.serviceModel = new Programme(); // Use Programme model for backward compatibility
  }

  // Get all services
  async getServices(req, res) {
    try {
      const filters = req.query;
      const services = await this.serviceModel.getProgrammes(filters);

      res.json({
        success: true,
        data: services
      });
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Get single service
  async getService(req, res) {
    try {
      const { id } = req.params;
      const service = await this.serviceModel.findById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error('Get service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Create service
  async createService(req, res) {
    try {
      const serviceData = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date()
      };

      const serviceId = await this.serviceModel.create(serviceData);

      res.status(201).json({
        success: true,
        data: { id: serviceId },
        message: 'Service created successfully'
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Update service
  async updateService(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updated_at: new Date()
      };

      const updated = await this.serviceModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service updated successfully'
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // Delete service
  async deleteService(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.serviceModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      console.error('Delete service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = ServiceController;