const Programme = require('../models/Programme');

class PlanController {
  constructor() {
    this.programmeModel = new Programme();
  }

  // Get all available plans
  async getPlans(req, res) {
    try {
      if (!req || !req.query) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request'
        });
      }

      const { type, min_price, max_price } = req.query;
      const filters = {};

      if (type) filters.type = type;
      if (min_price) filters.min_price = parseFloat(min_price);
      if (max_price) filters.max_price = parseFloat(max_price);

      const plans = await this.programmeModel.getProgrammes(filters);

      res.json({
        success: true,
        data: plans,
        message: 'Plans retrieved successfully'
      });
    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plans'
      });
    }
  }

  // Get single plan by ID
  async getPlan(req, res) {
    try {
      const { id } = req.params;
      const plan = await this.programmeModel.findById(id);

      if (!plan) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found'
        });
      }

      res.json({
        success: true,
        data: plan,
        message: 'Plan retrieved successfully'
      });
    } catch (error) {
      console.error('Get plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plan'
      });
    }
  }

  // Get plans with therapist availability
  async getPlansWithAvailability(req, res) {
    try {
      const { planId } = req.query;
      const plans = await this.programmeModel.getProgrammes({});

      res.json({
        success: true,
        data: plans,
        message: 'Plans with availability retrieved successfully'
      });
    } catch (error) {
      console.error('Get plans with availability error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plans with availability'
      });
    }
  }

  // Create new plan (admin only)
  async createPlan(req, res) {
    try {
      console.log('🔍 Create plan request body:', req.body);
      
      // Validate required fields
      const requiredFields = ['name', 'type', 'price'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // Map plan data to programme structure
      const programmeData = {
        name: req.body.name,
        description: req.body.description || '',
        category: req.body.type === 'session' ? 'Therapy Session' : 'Educational Assessment',
        status: req.body.status?.toLowerCase() || 'active',
        duration: parseInt(req.body.duration) || 60,
        fee: parseFloat(req.body.price),
        programme_id: 'P' + Date.now().toString().slice(-9),
        centre_id: req.body.centre_id || 1,
        therapist_id: req.body.therapist_id || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      console.log('🔍 Processed programme data:', programmeData);

      // Validate numeric values
      if (isNaN(programmeData.fee) || programmeData.fee < 0) {
        console.error('❌ Invalid fee/price:', req.body.price);
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      const planId = await this.programmeModel.create(programmeData);

      res.status(201).json({
        success: true,
        data: { id: planId },
        message: 'Plan created successfully'
      });
    } catch (error) {
      console.error('❌ Create plan error:', error);
      console.error('❌ Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to create plan',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update plan (admin only)
  async updatePlan(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        updated_at: new Date()
      };

      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.type) updateData.category = req.body.type === 'session' ? 'Therapy Session' : 'Educational Assessment';
      if (req.body.price !== undefined) updateData.fee = parseFloat(req.body.price);
      if (req.body.duration) updateData.duration = req.body.duration;
      if (req.body.status) updateData.status = req.body.status;

      const updated = await this.programmeModel.update(id, updateData);

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found'
        });
      }

      res.json({
        success: true,
        message: 'Plan updated successfully'
      });
    } catch (error) {
      console.error('Update plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update plan'
      });
    }
  }

  // Delete plan (admin only)
  async deletePlan(req, res) {
    try {
      const { id } = req.params;
      const deleted = await this.programmeModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Plan not found'
        });
      }

      res.json({
        success: true,
        message: 'Plan deleted successfully'
      });
    } catch (error) {
      console.error('Delete plan error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete plan'
      });
    }
  }
}

module.exports = PlanController;
