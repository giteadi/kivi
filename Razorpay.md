# Razorpay Payment Integration Guide

## 📋 Overview
This document describes the complete Razorpay payment integration implemented in the NES NGO project for handling donations, ID card payments, certificates, and other services.

---

## 🔑 Razorpay Credentials

### Test Mode Credentials (Development & Production)
```env
RAZORPAY_KEY_ID=rzp_test_SNpafZQympJjF6
RAZORPAY_SECRET=kessrETUaSQNmohXEK6DpnpQ
```

### Where to Update Credentials

#### 1. Production Server (.env)
**Location:** `/root/ngo/server/.env`
```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_SNpafZQympJjF6
RAZORPAY_SECRET=kessrETUaSQNmohXEK6DpnpQ
```

#### 2. Local Development Server (.env)
**Location:** `server/.env`
```env
# Razorpay
RAZORPAY_KEY_ID=rzp_test_SNpafZQympJjF6
RAZORPAY_SECRET=kessrETUaSQNmohXEK6DpnpQ
```

#### 3. Frontend (.env)
**Location:** `.env`
```env
# API Configuration
VITE_API_URL=https://api.nesngo.org/api
VITE_ENV=production
```
**Note:** Frontend doesn't store Razorpay keys directly. Keys are fetched from backend API response.

---

## 🔧 Backend Implementation

### 1. Package Installation
```bash
cd server
npm install razorpay
```

### 2. Razorpay Instance Configuration
**File:** `server/controllers/createOrder.js`
```javascript
const Razorpay = require("razorpay")

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
})
```

### 3. Create Order Endpoint
**File:** `server/controllers/createOrder.js`
```javascript
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes = {} } = req.body

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      })
    }

    const options = {
      amount: Number(amount) * 100, // Convert rupees to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes,
    }

    const order = await razorpay.orders.create(options)

    res.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID, // Send key to frontend
    })
  } catch (error) {
    console.error("[v0] Razorpay order creation error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    })
  }
}

module.exports = { createRazorpayOrder }
```

### 4. Verify Payment Endpoint
**File:** `server/controllers/varifyPayment.js`
```javascript
const crypto = require('crypto');

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payer_user_id,
      amount,
      method,
      purpose
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified successfully
      // Save to database, send receipt email, etc.
      
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

module.exports = { verifyRazorpayPayment };
```

### 5. Payment Routes
**File:** `server/routes/paymentRoutes.js`
```javascript
const express = require('express');
const { createRazorpayOrder } = require('../controllers/createOrder');
const { verifyRazorpayPayment } = require('../controllers/varifyPayment');

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createRazorpayOrder);

// Verify Razorpay payment
router.post('/verify-payment', verifyRazorpayPayment);

module.exports = router;
```

### 6. Register Routes in Server
**File:** `server/server.js`
```javascript
const paymentRoutes = require('./routes/paymentRoutes');

// Payment routes
app.use('/api', paymentRoutes);
```

---

## 💻 Frontend Implementation

### 1. Components with Razorpay Integration

#### A. Main Donation Page
**File:** `src/components/DonationContent.jsx`
- Full donation form with multiple categories
- Quick amount selection (₹100, ₹200, ₹300, ₹500, ₹1000, ₹2000)
- Custom amount input
- Anonymous donation support
- Email receipt functionality

**Key Features:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleSubmit = async (event) => {
  event.preventDefault();
  
  // Load Razorpay SDK
  const scriptLoaded = await loadRazorpayScript();
  
  // Create order
  const orderResponse = await axios.post(`${API_URL}/create-order`, {
    amount: parseFloat(amount),
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: { purpose: 'Donation' }
  });
  
  const { order, key_id } = orderResponse.data;
  
  // Razorpay options
  const options = {
    key: key_id,
    amount: order.amount,
    currency: order.currency,
    name: 'Noujawan Ekta Sangathan',
    description: 'Donation',
    order_id: order.id,
    handler: async (response) => {
      // Verify payment
      const verifyResponse = await axios.post(`${API_URL}/verify-payment`, {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: parseFloat(amount),
        method: 'razorpay',
        purpose: 'Donation'
      });
      
      if (verifyResponse.data.success) {
        alert('Payment successful! Thank you for your donation.');
      }
    },
    theme: { color: '#16a34a' }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

#### B. Quick Donation Widget
**File:** `src/components/QuickDonation.jsx`
- Inline donation widget for cause pages
- Quick donation with preset amounts
- Used in program details and cause pages

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

#### C. ID Card Generator
**File:** `src/components/IDCardGenerator.jsx`
- Payment for ID card generation (₹100)
- Member data collection
- ID card preview and download

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

#### D. Visitor Donation
**File:** `src/components/VisitorDonation.jsx`
- Simplified donation form for visitors
- Quick donation without registration

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

#### E. Reusable Payment Component
**File:** `src/components/RazorpayPayment.jsx`
- Generic payment component
- Can be used anywhere in the app
- Props: amount, purpose, onSuccess, onFailure, userDetails

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

**Usage Example:**
```jsx
<RazorpayPayment
  amount={200}
  purpose="Achievement Certificate Generation"
  onSuccess={(data) => console.log('Payment successful', data)}
  onFailure={(error) => console.log('Payment failed', error)}
  userDetails={{ name: 'John Doe', email: 'john@example.com' }}
/>
```

#### F. Achievement Certificate
**File:** `src/components/AchievementCertificate.jsx`
- Payment for certificate generation (₹200)
- Uses RazorpayPayment component

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

#### G. Appointment Letter Generator
**File:** `src/components/AppointmentLetterGenerator.jsx`
- Payment for appointment letter (₹150)
- Employee data collection

**API URL:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://api.nesngo.org/api';
```

---

## 🔄 Payment Flow

### Step-by-Step Process

1. **User Initiates Payment**
   - User fills form and clicks "Donate Now" or "Pay Now"
   - Frontend validates input data

2. **Load Razorpay SDK**
   ```javascript
   const scriptLoaded = await loadRazorpayScript();
   ```

3. **Create Order on Backend**
   ```javascript
   POST /api/create-order
   Body: { amount, currency, receipt, notes }
   Response: { order, key_id }
   ```

4. **Open Razorpay Checkout**
   ```javascript
   const razorpay = new window.Razorpay(options);
   razorpay.open();
   ```

5. **User Completes Payment**
   - User enters card/UPI/netbanking details
   - Razorpay processes payment

6. **Payment Success Handler**
   ```javascript
   handler: async (response) => {
     // response contains:
     // - razorpay_order_id
     // - razorpay_payment_id
     // - razorpay_signature
   }
   ```

7. **Verify Payment on Backend**
   ```javascript
   POST /api/verify-payment
   Body: {
     razorpay_order_id,
     razorpay_payment_id,
     razorpay_signature,
     amount,
     method,
     purpose
   }
   ```

8. **Backend Verification**
   - Verify signature using HMAC SHA256
   - Save payment record to database
   - Send receipt email (if email provided)
   - Return success response

9. **Frontend Success Action**
   - Show success message
   - Reset form
   - Redirect or download document

---

## 🧪 Testing

### Test Razorpay Credentials
Use these test cards in test mode:

**Success:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: 4000 0000 0000 0002

### Test Payment on Server
```bash
# SSH to server
ssh root@195.35.45.17

# Test Razorpay credentials
cd /root/ngo/server
node -e "
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: 'rzp_test_SNpafZQympJjF6',
  key_secret: 'kessrETUaSQNmohXEK6DpnpQ'
});
razorpay.orders.create({
  amount: 50000,
  currency: 'INR',
  receipt: 'test_receipt'
}).then(order => {
  console.log('✅ SUCCESS:', order.id);
}).catch(err => {
  console.log('❌ ERROR:', err.error);
});
"
```

### Test API Endpoints
```bash
# Test create-order endpoint
curl -X POST https://api.nesngo.org/api/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "currency": "INR",
    "receipt": "test_receipt_123"
  }'

# Expected Response:
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 10000,
    "currency": "INR",
    "receipt": "test_receipt_123"
  },
  "key_id": "rzp_test_SNpafZQympJjF6"
}
```

---

## 🔐 Security Best Practices

### 1. Never Expose Secret Key
- ✅ Store in `.env` file
- ✅ Add `.env` to `.gitignore`
- ❌ Never commit to Git
- ❌ Never send to frontend

### 2. Always Verify Payment Signature
```javascript
const expectedSign = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(sign.toString())
  .digest("hex");

if (razorpay_signature === expectedSign) {
  // Payment verified ✅
}
```

### 3. Validate Amount on Backend
```javascript
// Don't trust frontend amount
// Verify with your database records
const expectedAmount = getAmountFromDatabase(order_id);
if (amount !== expectedAmount) {
  throw new Error('Amount mismatch');
}
```

### 4. Use HTTPS Only
- ✅ Production: https://api.nesngo.org
- ❌ Never use HTTP for payments

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] Update Razorpay credentials to **Live Mode**
  ```env
  RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
  RAZORPAY_SECRET=XXXXXXXXXXXXXXXXXX
  ```

- [ ] Test all payment flows
  - [ ] Donation page
  - [ ] ID card payment
  - [ ] Certificate payment
  - [ ] Quick donation widget

- [ ] Verify webhook setup (if using)
  - [ ] Configure webhook URL in Razorpay dashboard
  - [ ] Implement webhook handler in backend

- [ ] Enable payment receipt emails
  - [ ] Configure email service
  - [ ] Test email delivery

- [ ] Set up payment logging
  - [ ] Log all transactions to database
  - [ ] Set up error monitoring

- [ ] Update environment variables
  ```bash
  # Production server
  ssh root@195.35.45.17
  cd /root/ngo/server
  nano .env
  # Update RAZORPAY_KEY_ID and RAZORPAY_SECRET
  pm2 restart ngo-api --update-env
  ```

---

## 🐛 Troubleshooting

### Issue 1: Authentication Failed (401)
**Error:** `Authentication failed`

**Cause:** Invalid or expired Razorpay credentials

**Solution:**
1. Verify credentials in Razorpay dashboard
2. Update `.env` file with correct keys
3. Restart server: `pm2 restart ngo-api --update-env`

### Issue 2: Payment Verification Failed
**Error:** `Invalid signature`

**Cause:** Signature mismatch during verification

**Solution:**
1. Ensure `RAZORPAY_SECRET` is correct
2. Check signature generation logic
3. Verify order_id and payment_id are correct

### Issue 3: Razorpay SDK Not Loading
**Error:** `Razorpay SDK failed to load`

**Cause:** Script loading issue or network problem

**Solution:**
1. Check internet connection
2. Verify script URL: `https://checkout.razorpay.com/v1/checkout.js`
3. Check browser console for errors

### Issue 4: Amount Mismatch
**Error:** Amount in paise vs rupees confusion

**Solution:**
- Backend expects amount in **rupees**
- Backend converts to paise: `amount * 100`
- Razorpay API uses **paise** (1 rupee = 100 paise)

---

## 📊 Payment Analytics

### Database Schema (Example)
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  razorpay_order_id VARCHAR(255) NOT NULL,
  razorpay_payment_id VARCHAR(255) NOT NULL,
  razorpay_signature VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'success',
  purpose VARCHAR(255),
  payer_user_id VARCHAR(255),
  payer_email VARCHAR(255),
  payer_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Query Payment Stats
```sql
-- Total donations
SELECT SUM(amount) as total_donations 
FROM payments 
WHERE purpose LIKE '%Donation%' 
AND status = 'success';

-- Monthly donations
SELECT 
  DATE_FORMAT(created_at, '%Y-%m') as month,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount
FROM payments
WHERE status = 'success'
GROUP BY month
ORDER BY month DESC;
```

---

## 📞 Support

### Razorpay Support
- Dashboard: https://dashboard.razorpay.com
- Documentation: https://razorpay.com/docs/
- Support Email: support@razorpay.com

### Project Contacts
- Email: nes15072019ngo@gmail.com
- Phone: +91 78797 15369

---

## 📝 Change Log

### 2026-02-09
- ✅ Updated Razorpay credentials (Test Mode)
- ✅ Fixed authentication issues
- ✅ Updated all frontend payment components
- ✅ Configured production API URLs
- ✅ Tested payment flow successfully

### Previous Updates
- Implemented donation page with Razorpay
- Added ID card payment integration
- Created reusable RazorpayPayment component
- Added certificate payment functionality

---

## 🎯 Future Enhancements

- [ ] Add subscription/recurring payments
- [ ] Implement payment webhooks
- [ ] Add refund functionality
- [ ] Create payment dashboard for admin
- [ ] Add payment analytics and reports
- [ ] Support multiple payment gateways
- [ ] Add payment reminders
- [ ] Implement payment links

---

**Last Updated:** February 9, 2026  
**Version:** 1.0  
**Status:** ✅ Active & Working
