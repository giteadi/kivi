const Plan = require('../models/Plan');

class PlanController extends Plan {
  constructor() {
    super();
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

      const plans = await super.getPlans(filters);

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
      const plan = await super.getPlanById(id);

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
      const plans = await super.getPlansWithTherapistAvailability(planId);

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

      const planData = {
        name: req.body.name,
        description: req.body.description || '',
        type: req.body.type, // 'session' or 'assessment'
        price: parseFloat(req.body.price),
        duration: req.body.duration || '',
        sessions_count: parseInt(req.body.sessions_count) || 1,
        features: JSON.stringify(req.body.features || []),
        is_active: 1
      };

      console.log('🔍 Processed plan data:', planData);

      // Validate numeric values
      if (isNaN(planData.price) || planData.price <= 0) {
        console.error('❌ Invalid price:', req.body.price);
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      if (isNaN(planData.sessions_count) || planData.sessions_count <= 0) {
        console.error('❌ Invalid sessions_count:', req.body.sessions_count);
        return res.status(400).json({
          success: false,
          message: 'Sessions count must be a valid positive number'
        });
      }

      const planId = await super.createPlan(planData);

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
      const updateData = {};

      if (req.body.name) updateData.name = req.body.name;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.type) updateData.type = req.body.type;
      if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
      if (req.body.duration) updateData.duration = req.body.duration;
      if (req.body.sessions_count !== undefined) updateData.sessions_count = parseInt(req.body.sessions_count);
      if (req.body.features) updateData.features = JSON.stringify(req.body.features);
      if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;

      const updated = await super.updatePlan(id, updateData);

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
      const deleted = await super.deletePlan(id);

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
