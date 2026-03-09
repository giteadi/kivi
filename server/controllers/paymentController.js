const crypto = require('crypto');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');

class PaymentController {
  constructor() {
    // Razorpay test configuration - Using new valid credentials
    this.razorpayKeyId = 'rzp_test_SNpafZQympJjF6'; // New test key ID
    this.razorpayKeySecret = 'kessrETUaSQNmohXEK6DpnpQ'; // New test key secret

    // Initialize Razorpay with new test credentials
    this.razorpay = new Razorpay({
      key_id: this.razorpayKeyId,
      key_secret: this.razorpayKeySecret,
    });

    // Initialize Payment model
    this.paymentModel = new Payment();
  }

  // Create Razorpay order
  async createOrder(req, res) {
    try {
      const { planId, amount, currency = 'INR' } = req.body;
      const userId = req.user.id;

      console.log('Create order request:', { planId, amount, currency, userId });
      console.log('Using Razorpay key_id:', this.razorpayKeyId);

      if (!planId || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Plan ID and amount are required'
        });
      }

      // Create order with Razorpay
      const options = {
        amount: amount, // amount in the smallest currency unit (paise for INR)
        currency: currency,
        receipt: `receipt_${userId}_${Date.now()}`,
        notes: {
          planId: planId,
          userId: userId
        }
      };

      console.log('Creating Razorpay order with options:', options);

      const order = await this.razorpay.orders.create(options);

      console.log('Razorpay order created successfully:', order.id);

      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: this.razorpayKeyId
        }
      });

    } catch (error) {
      console.error('Create order error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: 'Failed to create order'
      });
    }
  }

  // Verify Razorpay payment
  async verifyPayment(req, res) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planId
      } = req.body;

      const userId = req.user.id;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing payment verification parameters'
        });
      }

      // Verify signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', this.razorpayKeySecret)
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed'
        });
      }

      // Payment is verified, update database
      const paymentData = {
        userId: userId,
        planId: planId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'completed',
        paidAt: new Date().toISOString()
      };

      // Get order details to fetch amount
      const order = await this.razorpay.orders.fetch(razorpay_order_id);
      paymentData.amount = order.amount / 100; // Convert from paise to rupees
      paymentData.currency = order.currency;

      // Store payment record in database
      await this.storePayment(paymentData);

      // Update user plan subscription (if needed)
      // await this.updateUserPlan(userId, planId);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          paymentId: razorpay_payment_id,
          status: 'completed'
        }
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  }

  // Get user payment history
  async getPaymentHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0 } = req.query;

      // Get payment history from database
      const paymentHistory = await this.paymentModel.getUserPaymentHistory(
        userId, 
        parseInt(limit), 
        parseInt(offset)
      );

      res.json({
        success: true,
        data: paymentHistory
      });

    } catch (error) {
      console.error('Get payment history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch payment history'
      });
    }
  }

  // Store payment in database
  async storePayment(paymentData) {
    try {
      const paymentId = await this.paymentModel.create(paymentData);
      console.log('Payment stored successfully with ID:', paymentId);
      return paymentId;
    } catch (error) {
      console.error('Error storing payment:', error);
      throw error;
    }
  }

  // Get available plans
  async getPlans(req, res) {
    try {
      // Fetch plans from database
      const query = 'SELECT * FROM kivi_plans WHERE is_active = TRUE ORDER BY id';
      const plans = await this.paymentModel.executeQuery(query);

      // Transform the data to match the expected format
      const formattedPlans = plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: parseFloat(plan.price),
        duration: plan.duration,
        description: plan.description,
        features: plan.features ? JSON.parse(plan.features) : []
      }));

      res.json({
        success: true,
        data: formattedPlans
      });

    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch plans'
      });
    }
  }
}

module.exports = PaymentController;