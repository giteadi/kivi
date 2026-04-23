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
      const allowedFields = [
        'name', 'address', 'city', 'state', 'zip_code', 'country',
        'phone', 'email', 'website', 'specialties', 'facilities', 'services',
        'description', 'established_date', 'operating_hours',
        'emergency_services', 'total_students', 'total_examinees', 'status',
        'parking_available', 'wheelchair_accessible', 'insurance_accepted', 'languages_supported'
      ];

      const centreData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          centreData[field] = req.body[field];
        }
      });

      centreData.created_at = new Date();
      centreData.updated_at = new Date();

      // JSON type columns (MySQL JSON) - need JS array, but stringify for INSERT
      const jsonTypeColumns = ['specialties', 'facilities'];
      jsonTypeColumns.forEach(field => {
        if (centreData[field] !== undefined) {
          try {
            const parsed = typeof centreData[field] === 'string'
              ? JSON.parse(centreData[field])
              : (Array.isArray(centreData[field]) ? centreData[field] : []);
            centreData[field] = JSON.stringify(parsed);
          } catch {
            centreData[field] = JSON.stringify([]);
          }
        }
      });

      // TEXT type columns - need JSON string '[]'
      const textJsonColumns = ['services', 'insurance_accepted', 'languages_supported'];
      textJsonColumns.forEach(field => {
        if (centreData[field] === undefined || centreData[field] === null) {
          centreData[field] = '[]';
        } else if (Array.isArray(centreData[field])) {
          centreData[field] = JSON.stringify(centreData[field]);
        }
      });

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

      const allowedFields = [
        'name', 'address', 'city', 'state', 'zip_code', 'country',
        'phone', 'email', 'website', 'specialties', 'facilities', 'services',
        'description', 'established_date', 'operating_hours',
        'emergency_services', 'total_students', 'total_examinees', 'status',
        'parking_available', 'wheelchair_accessible', 'insurance_accepted', 'languages_supported'
      ];

      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Date sanitize - ISO → YYYY-MM-DD
      if (updateData.established_date) {
        updateData.established_date = updateData.established_date.toString().split('T')[0];
      }

      // JSON type columns (MySQL JSON) - need JS array
      const jsonTypeColumns = ['specialties', 'facilities'];
      jsonTypeColumns.forEach(field => {
        if (updateData[field] !== undefined) {
          try {
            updateData[field] = typeof updateData[field] === 'string'
              ? JSON.parse(updateData[field])
              : (Array.isArray(updateData[field]) ? updateData[field] : []);
          } catch {
            updateData[field] = [];
          }
        }
      });

      // TEXT type columns - need JSON string '[]'
      const textJsonColumns = ['services', 'insurance_accepted', 'languages_supported'];
      textJsonColumns.forEach(field => {
        if (updateData[field] === undefined || updateData[field] === null) {
          updateData[field] = '[]';
        } else if (Array.isArray(updateData[field])) {
          updateData[field] = JSON.stringify(updateData[field]);
        } else if (typeof updateData[field] === 'string') {
          // validate it's valid JSON
          try {
            JSON.parse(updateData[field]);
            // valid, keep as is
          } catch {
            updateData[field] = '[]';
          }
        }
      });

      // updated_at in MySQL datetime format
      updateData.updated_at = new Date()
        .toISOString()
        .replace('T', ' ')
        .split('.')[0];

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