const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/planController');

const planController = new PlanController();

// GET /api/plans - Get all available plans
router.get('/', planController.getPlans.bind(planController));

// GET /api/plans/availability - Get plans with therapist availability
router.get('/availability', planController.getPlansWithAvailability.bind(planController));

// GET /api/plans/:id - Get single plan
router.get('/:id', planController.getPlan.bind(planController));

// POST /api/plans - Create new plan (admin only)
router.post('/', planController.createPlan.bind(planController));

// PUT /api/plans/:id - Update plan (admin only)
router.put('/:id', planController.updatePlan.bind(planController));

// DELETE /api/plans/:id - Delete plan (admin only)
router.delete('/:id', planController.deletePlan.bind(planController));

module.exports = router;
