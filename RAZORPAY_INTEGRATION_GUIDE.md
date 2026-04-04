# Razorpay Payment Integration - Future Implementation Note

## Overview
This document outlines the steps to integrate Razorpay payment gateway for the "Pay Now" button in assessment invoices.

## Prerequisites
- Razorpay account (https://razorpay.com)
- API Keys (Key ID and Key Secret)

## Implementation Steps

### 1. Backend Setup

Install Razorpay SDK:
```bash
npm install razorpay
```

Add environment variables to `.env`:
```env
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### 2. Create Payment Controller

Create `/server/controllers/paymentController.js`:
```javascript
const Razorpay = require('razorpay');

class PaymentController {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }

  // Generate payment link for invoice
  async createPaymentLink(req, res) {
    try {
      const { 
        amount, 
        email, 
        assessmentId, 
        assessmentName,
        firstName,
        lastName 
      } = req.body;

      const paymentLink = await this.razorpay.paymentLink.create({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        description: `Assessment Fee - ${assessmentName}`,
        customer: {
          email: email,
          name: `${firstName} ${lastName}`
        },
        notify: {
          email: true
        },
        reminder_enable: true,
        notes: {
          assessmentId: assessmentId,
          type: 'assessment_invoice'
        }
      });

      res.json({
        success: true,
        paymentLink: paymentLink.short_url,
        paymentLinkId: paymentLink.id
      });
    } catch (error) {
      console.error('Payment link creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment link'
      });
    }
  }

  // Webhook handler for payment status updates
  async handleWebhook(req, res) {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      const signature = req.headers['x-razorpay-signature'];
      
      // Verify webhook signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expectedSignature) {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
      }

      const event = req.body;
      
      // Handle payment captured event
      if (event.event === 'payment_link.paid') {
        const paymentLinkId = event.payload.payment_link.entity.id;
        const notes = event.payload.payment_link.entity.notes;
        
        // Update assessment payment status
        const Assessment = require('../models/Assessment');
        const assessmentModel = new Assessment();
        
        await assessmentModel.update(notes.assessmentId, {
          payment_status: 'paid',
          payment_date: new Date(),
          payment_link_id: paymentLinkId,
          payment_amount: event.payload.payment.entity.amount / 100
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ success: false });
    }
  }
}

module.exports = PaymentController;
```

### 3. Add Routes

Create `/server/routes/paymentRoutes.js`:
```javascript
const express = require('express');
const PaymentController = require('../controllers/paymentController');

const router = express.Router();
const paymentController = new PaymentController();

router.post('/create-link', paymentController.createPaymentLink.bind(paymentController));
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

module.exports = router;
```

Add to `/server/index.js`:
```javascript
app.use('/api/payments', require('./routes/paymentRoutes'));
```

### 4. Update Invoice Controller

Modify `/server/controllers/invoiceController.js` to include payment link:

```javascript
// Add method to generate payment link
async generatePaymentLink(assessmentData) {
  try {
    const response = await fetch(`${process.env.API_URL}/api/payments/create-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: assessmentData.price,
        email: assessmentData.email,
        assessmentId: assessmentData.assessmentId,
        assessmentName: assessmentData.assessmentName,
        firstName: assessmentData.firstName,
        lastName: assessmentData.lastName
      })
    });
    
    const result = await response.json();
    return result.success ? result.paymentLink : null;
  } catch (error) {
    console.error('Error generating payment link:', error);
    return null;
  }
}
```

### 5. Update Invoice Email Template

Modify the email HTML in `generateInvoiceEmail()` method:

Replace static button:
```html
<a href="#" class="button">Pay Now</a>
```

With dynamic payment link:
```html
<a href="${paymentLink || '#'}" class="button" ${!paymentLink ? 'disabled' : ''}>Pay Now</a>
```

### 6. Frontend Integration (Optional)

If you want to show payment status in frontend:

```javascript
// Check payment status
const checkPaymentStatus = async (assessmentId) => {
  const response = await fetch(`/api/assessments/${assessmentId}/payment-status`);
  const result = await response.json();
  return result.data.paymentStatus;
};
```

### 7. Razorpay Dashboard Configuration

1. Add webhook URL in Razorpay Dashboard:
   - URL: `https://dashboard.iplanbymsl.in/api/payments/webhook`
   - Events: Select "Payment Link Events" -> "payment_link.paid"
   - Secret: Generate and add to `.env` as `RAZORPAY_WEBHOOK_SECRET`

2. Enable payment methods:
   - UPI
   - Credit/Debit Cards
   - Net Banking
   - Wallets (optional)

## Security Considerations

1. Never expose `RAZORPAY_KEY_SECRET` in frontend code
2. Always verify webhook signatures
3. Use HTTPS for all payment-related endpoints
4. Implement idempotency for payment creation

## Testing

Test payment flow in Razorpay Test Mode:
- Use test key credentials
- Test cards available at: https://razorpay.com/docs/payments/payments/test-card-details/
- Common test card: 5267 3181 8797 5449 (Mastercard)

## Notes

- Payment links expire after 7 days (configurable)
- GST calculation should be included in amount
- Consider adding payment reminder emails
- Store all payment transactions for audit purposes
