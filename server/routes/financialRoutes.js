const express = require('express');
const router = express.Router();
const FinancialController = require('../controllers/financialController');

const financialController = new FinancialController();

// GET /api/financial/clinic-revenue
router.get('/clinic-revenue', financialController.getClinicRevenue.bind(financialController));

// GET /api/financial/doctor-revenue
router.get('/doctor-revenue', financialController.getDoctorRevenue.bind(financialController));

// GET /api/financial/taxes
router.get('/taxes', financialController.getTaxes.bind(financialController));

// GET /api/financial/billing-records
router.get('/billing-records', financialController.getBillingRecords.bind(financialController));

module.exports = router;