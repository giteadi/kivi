const nodemailer = require('nodemailer');

class InvoiceController {
  constructor() {
    // Configure email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });
  }

  // Send assessment invoice email
  async sendAssessmentInvoice(req, res) {
    try {
      const { 
        assessmentId, 
        studentId, 
        email, 
        firstName, 
        lastName, 
        assessmentName, 
        assessmentType,
        price,
        adminDate,
        examiner 
      } = req.body;

      console.log('Sending assessment invoice:', {
        assessmentId,
        studentId,
        email,
        assessmentName,
        price
      });

      if (!email || !assessmentId) {
        return res.status(400).json({
          success: false,
          message: 'Email and assessment ID are required'
        });
      }

      // Generate invoice number
      const invoiceNumber = `INV-ASSESS-${Date.now()}`;

      // Calculate amounts
      const subtotal = parseFloat(price) || 0;
      const gstRate = 0.18; // 18% GST
      const gstAmount = subtotal * gstRate;
      const totalAmount = subtotal + gstAmount;

      // Create email HTML
      const emailHtml = this.generateInvoiceEmail({
        invoiceNumber,
        firstName,
        lastName,
        assessmentName,
        assessmentType,
        adminDate,
        examiner,
        subtotal,
        gstAmount,
        totalAmount,
        companyName: 'MindSaid Learning',
        companyAddress: '123 Education Drive, Learning District, New York, NY 10001',
        companyPhone: '+1 (555) 123-4567',
        companyEmail: 'billing@mindsaidlearning.com'
      });

      // Send email
      const mailOptions = {
        from: process.env.SMTP_FROM || 'MindSaid Learning <billing@mindsaidlearning.com>',
        to: email,
        subject: `Assessment Invoice - ${assessmentName || 'Assessment'} - ${invoiceNumber}`,
        html: emailHtml
      };

      await this.transporter.sendMail(mailOptions);

      // Update assessment record with invoice info
      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();
      await assessmentModel.update(assessmentId, {
        invoice_sent: true,
        invoice_sent_date: new Date(),
        invoice_email: email,
        payment_status: 'pending'
      });

      res.json({
        success: true,
        message: 'Invoice sent successfully',
        data: {
          invoiceNumber,
          email,
          sentAt: new Date()
        }
      });
    } catch (error) {
      console.error('Send invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send invoice',
        error: error.message
      });
    }
  }

  // Generate invoice email HTML
  generateInvoiceEmail(data) {
    const {
      invoiceNumber,
      firstName,
      lastName,
      assessmentName,
      assessmentType,
      adminDate,
      examiner,
      subtotal,
      gstAmount,
      totalAmount,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail
    } = data;

    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const formattedAdminDate = adminDate ? new Date(adminDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) : 'Not scheduled';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assessment Invoice</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; }
    .invoice-details { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .detail-label { font-weight: bold; color: #666; }
    .detail-value { color: #333; }
    .amount-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    .amount-table th, .amount-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    .amount-table th { background: #f5f5f5; font-weight: bold; }
    .total-row { background: #667eea; color: white; font-weight: bold; font-size: 18px; }
    .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .note { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧠 MindSaid Learning</h1>
      <p>Assessment Invoice</p>
    </div>
    
    <div class="content">
      <div class="invoice-details">
        <div class="detail-row">
          <span class="detail-label">Invoice Number:</span>
          <span class="detail-value">${invoiceNumber}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Invoice Date:</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Bill To:</span>
          <span class="detail-value">${firstName || ''} ${lastName || ''}</span>
        </div>
      </div>

      <div class="invoice-details">
        <h3 style="margin-top: 0; color: #667eea;">Assessment Details</h3>
        <div class="detail-row">
          <span class="detail-label">Assessment:</span>
          <span class="detail-value">${assessmentName || 'Educational Assessment'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Type:</span>
          <span class="detail-value">${assessmentType || 'Standard'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Scheduled Date:</span>
          <span class="detail-value">${formattedAdminDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Examiner:</span>
          <span class="detail-value">${examiner || 'To be assigned'}</span>
        </div>
      </div>

      <table class="amount-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${assessmentName || 'Assessment Fee'}</td>
            <td style="text-align: right;">₹${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>GST (18%)</td>
            <td style="text-align: right;">₹${gstAmount.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Total Amount</td>
            <td style="text-align: right;">₹${totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="note">
        <strong>📌 Payment Instructions:</strong><br>
        Please complete the payment before the assessment date. You can pay online or at the center.<br>
        Payment methods: Credit Card, Debit Card, UPI, Net Banking, Cash
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <a href="#" class="button">Pay Now</a>
      </div>
    </div>

    <div class="footer">
      <p><strong>${companyName}</strong></p>
      <p>${companyAddress}</p>
      <p>Phone: ${companyPhone} | Email: ${companyEmail}</p>
      <p style="margin-top: 20px; font-size: 12px;">
        This is an electronically generated invoice and does not require a physical signature.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

module.exports = InvoiceController;
