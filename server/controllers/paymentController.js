const crypto = require('crypto');
const Razorpay = require('razorpay');

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

      // Store payment record (you'll need to create payments table)
      // await this.storePayment(paymentData);

      // Update user plan subscription
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

      // Mock payment history for demo
      const paymentHistory = [
        {
          id: 1,
          planName: 'Remedial Therapy',
          amount: 2000,
          status: 'completed',
          paymentId: 'pay_demo123',
          paidAt: '2026-03-01T10:00:00Z'
        },
        {
          id: 2,
          planName: 'Speech Language Therapy',
          amount: 1500,
          status: 'completed',
          paymentId: 'pay_demo124',
          paidAt: '2026-02-15T14:30:00Z'
        }
      ];

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

  // Get available plans
  async getPlans(req, res) {
    try {
      // Mock plans data (in real app, fetch from database)
      const plans = [
        {
          id: 1,
          name: 'Remedial Therapy',
          type: 'session',
          price: 2000,
          duration: '1 Hour',
          description: 'Comprehensive remedial therapy sessions for learning difficulties',
          features: [
            'One-on-one therapy session',
            'Customized learning approach',
            'Progress tracking',
            'Parent consultation'
          ]
        },
        {
          id: 2,
          name: 'Occupational Therapy',
          type: 'session',
          price: 1500,
          duration: '1 Hour',
          description: 'Specialized occupational therapy for daily living skills',
          features: [
            'Sensory integration therapy',
            'Fine motor skill development',
            'Daily living activities',
            'Equipment recommendations'
          ]
        },
        {
          id: 3,
          name: 'Speech Language Therapy',
          type: 'session',
          price: 1500,
          duration: '1 Hour',
          description: 'Professional speech and language development therapy',
          features: [
            'Speech articulation training',
            'Language development',
            'Communication skills',
            'Swallowing therapy'
          ]
        },
        {
          id: 4,
          name: 'Counselling',
          type: 'session',
          price: 1500,
          duration: '1 Hour',
          description: 'Professional counselling and psychological support',
          features: [
            'Individual counselling',
            'Behavioral therapy',
            'Emotional support',
            'Coping strategies'
          ]
        }
      ];

      res.json({
        success: true,
        data: plans
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