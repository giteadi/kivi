const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

const paymentController = new PaymentController();

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', authenticateToken, paymentController.createOrder.bind(paymentController));

// POST /api/payment/verify - Verify Razorpay payment
router.post('/verify', authenticateToken, paymentController.verifyPayment.bind(paymentController));

// GET /api/payment/history - Get user payment history
router.get('/history', authenticateToken, paymentController.getPaymentHistory.bind(paymentController));

// GET /api/payment/plans - Get available plans
router.get('/plans', paymentController.getPlans.bind(paymentController));

module.exports = router;