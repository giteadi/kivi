const nodemailer = require('nodemailer');

// Try to load PDF library, fallback if not available
let htmlPdf;
try {
  htmlPdf = require('html-pdf-node');
} catch (err) {
  console.warn('⚠️ html-pdf-node not available, PDF generation disabled');
  htmlPdf = null;
}

class InvoiceController {
  constructor() {
    // Configure email transporter - support both naming conventions
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || '';
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || '';
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
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
        individualPrice,
        itemsCount,
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

      // Calculate amounts (no GST)
      const subtotal = parseFloat(price) || 0;
      const gstAmount = 0;
      const totalAmount = subtotal;

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
        companyName: 'MindSaid Learning Centre',
        companyAddress: 'D-207, Crystal Plaza, Opp. Infinity Mall, Link Road, Andheri (W), Mumbai, Maharashtra 400053',
        companyPhone: '+91 8928186952',
        companyEmail: 'contact@mindsaidlearning.com'
      });

      // 🔥 Generate PDF attachment (if library available)
      let attachments = [];
      
      if (htmlPdf) {
        try {
          console.log('Generating PDF attachment...');
          
          // Get package details from request
          const qty = itemsCount || 1;
          const unitPrice = individualPrice || (qty > 1 ? (subtotal / qty) : subtotal);
          
          const pdfHtml = this.generateInvoicePDF({
            invoiceNumber,
            firstName,
            lastName,
            email,
            assessmentName,
            assessmentType,
            subtotal,
            gstAmount,
            totalAmount,
            itemsCount: qty,
            individualPrice: unitPrice
          });

          const pdfBuffer = await htmlPdf.generatePdf(
            { content: pdfHtml },
            { format: 'A4', printBackground: true }
          );
          console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
          
          attachments.push({
            filename: `Invoice-${invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          });
        } catch (pdfErr) {
          console.warn('⚠️ PDF generation failed:', pdfErr.message);
          // Continue without PDF attachment
        }
      } else {
        console.log('ℹ️ PDF library not available, sending email without attachment');
      }

      // Send email (with or without PDF)
      const mailOptions = {
        from: process.env.SMTP_FROM || 'MindSaid Learning <contact@mindsaidlearning.com>',
        to: email,
        subject: `Assessment Invoice - ${assessmentName || 'Assessment'} - ${invoiceNumber}`,
        html: emailHtml,
        attachments: attachments
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully to:', email, attachments.length > 0 ? '(with PDF)' : '(HTML only)');

      // Update student's email count and history
      try {
        const Student = require('../models/Student');
        const studentModel = new Student();
        
        const parsedStudentId = parseInt(studentId);
        if (parsedStudentId && !isNaN(parsedStudentId) && parsedStudentId > 0) {
          // Get current student data
          const student = await studentModel.findById(parsedStudentId);
          if (student) {
            const currentCount = student.email_count || 0;
            const emailHistory = student.email_history ? JSON.parse(student.email_history) : [];
            
            // Add new email to history
            emailHistory.push({
              type: 'assessment_invoice',
              sent_at: new Date().toISOString(),
              email: email,
              assessment_name: assessmentName,
              amount: price
            });
            
            // Update student record
            await studentModel.update(parsedStudentId, {
              email_count: currentCount + 1,
              last_email_sent_date: new Date(),
              email_history: JSON.stringify(emailHistory)
            });
            console.log(`📧 Updated email count for student ${parsedStudentId}: ${currentCount + 1}`);
          }
        }
      } catch (studentUpdateError) {
        console.error('⚠️ Error updating student email count:', studentUpdateError.message);
        // Don't fail the request if student update fails
      }

      // Update assessment record with invoice info
      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();
      
      // Check if assessmentId is a valid number (database ID) or string (assessment type)
      let realAssessmentId = assessmentId;
      let assessmentRecord = null;
      const numericId = parseInt(assessmentId, 10);
      
      if (!isNaN(numericId) && numericId > 0 && String(assessmentId).match(/^\d+$/)) {
        // It's a pure numeric ID, try to find it
        realAssessmentId = numericId;
        assessmentRecord = await assessmentModel.getAssessment(numericId);
      }
      
      // If assessment doesn't exist, create it first
      if (!assessmentRecord) {
        console.log('Assessment not found, creating new assessment record...');
        const parsedStudentId = parseInt(studentId);
        if (!parsedStudentId || isNaN(parsedStudentId) || parsedStudentId <= 0) {
          throw new Error('Invalid student_id: ' + studentId);
        }
        const newAssessmentId = await assessmentModel.create({
          student_id: parsedStudentId,
          assessment_name: assessmentName || 'Educational Assessment',
          assessment_type: assessmentId || 'standard', // Use the string ID as type
          price: parseFloat(price) || 5500,
          examiner: examiner || 'To be assigned',
          examiner_name: examiner || 'To be assigned',
          scheduled_date: adminDate || new Date().toISOString().split('T')[0],
          scheduled_time: '09:00:00',
          duration: 60,
          status: 'Scheduled',
          delivery_method: 'Online',
          total_score: null,
          max_score: null,
          completion_percentage: 0,
          language: 'English',
          created_at: new Date(),
          updated_at: new Date()
        });
        realAssessmentId = newAssessmentId;
        console.log('Created new assessment with ID:', realAssessmentId);
      }
      
      await assessmentModel.update(realAssessmentId, {
        invoice_sent: true,
        invoice_sent_date: new Date(),
        invoice_email: email,
        payment_status: 'pending'
      });

      // Get updated student email count for response
      let emailCount = 0;
      try {
        const Student = require('../models/Student');
        const studentModel = new Student();
        const parsedStudentId = parseInt(studentId);
        if (parsedStudentId && !isNaN(parsedStudentId) && parsedStudentId > 0) {
          const updatedStudent = await studentModel.findById(parsedStudentId);
          if (updatedStudent) {
            emailCount = updatedStudent.email_count || 0;
          }
        }
      } catch (e) {
        // Ignore error, just return 0
      }

      res.json({
        success: true,
        message: 'Invoice sent successfully',
        data: {
          invoiceNumber,
          email,
          sentAt: new Date(),
          emailCount
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

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 days from now
    const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Arial, sans-serif; 
      line-height: 1.5; 
      color: #333;
      background: #f5f5f5;
    }
    .invoice-container { 
      max-width: 800px; 
      margin: 20px auto; 
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    /* MindSaid Header - Same as Forms/Coners */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
    .company-info h1 {
      font-size: 24px;
      color: #333;
      margin: 0 0 5px 0;
    }
    .company-info p {
      font-size: 14px;
      color: #666;
      margin: 2px 0;
    }
    .company-info .tagline {
      font-size: 12px;
      color: #999;
      font-style: italic;
    }
    .invoice-title-section {
      text-align: right;
    }
    .invoice-title-section h2 {
      font-size: 36px;
      color: #333;
      font-weight: 300;
      letter-spacing: 3px;
      margin: 0;
    }
    .company-address {
      font-size: 11px;
      color: #666;
      margin-top: 10px;
      line-height: 1.6;
    }
    .invoice-body {
      padding: 40px;
    }
    .bill-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .bill-to {
      flex: 1;
    }
    .bill-to h3 {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: normal;
    }
    .bill-to .customer-name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .bill-to .customer-email {
      font-size: 13px;
      color: #666;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-details h3 {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      font-weight: normal;
    }
    .detail-row {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      margin-bottom: 5px;
      font-size: 13px;
    }
    .detail-label {
      color: #666;
    }
    .detail-value {
      color: #333;
      font-weight: 500;
      min-width: 150px;
    }
    .amount-due {
      background: #f5f5f5;
      padding: 8px 15px;
      margin-top: 10px;
      display: inline-block;
    }
    .amount-due .label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }
    .amount-due .value {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .items-table thead {
      background: #29b6f6;
    }
    .items-table th {
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 500;
      font-size: 13px;
    }
    .items-table th:last-child {
      text-align: right;
    }
    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
      font-size: 13px;
      vertical-align: top;
    }
    .items-table td:last-child {
      text-align: right;
    }
    .item-name {
      font-weight: 500;
      color: #333;
    }
    .item-description {
      font-size: 11px;
      color: #666;
      margin-top: 3px;
    }
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #eee;
    }
    .totals-table {
      width: 300px;
    }
    .totals-table td {
      padding: 8px 0;
      font-size: 13px;
    }
    .totals-table td:first-child {
      text-align: left;
      color: #666;
    }
    .totals-table td:last-child {
      text-align: right;
      color: #333;
      font-weight: 500;
    }
    .totals-table .grand-total {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      padding-top: 15px;
      border-top: 2px solid #eee;
    }
    .footer {
      background: #f9f9f9;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #eee;
    }
    .footer p {
      font-size: 12px;
      color: #999;
      margin: 5px 0;
    }
    .powered-by {
      margin-top: 20px;
      font-size: 11px;
      color: #ccc;
    }
    .powered-by strong {
      color: #29b6f6;
    }
    @media print {
      body { background: white; }
      .invoice-container { box-shadow: none; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header - Same as Forms/Coners -->
    <div class="header">
      <div class="logo-section">
        <div class="logo">
          <img src="https://mindsaidlearning.com/logo.png" alt="MindSaid Learning Centre" />
        </div>
        <div class="company-info">
          <h1>MindSaid Learning Centre</h1>
          <p class="tagline">Learning This Ability</p>
          <p style="font-size: 11px; color: #666; margin-top: 8px;">
            Psycho-educational Assessment & Intervention Centre<br>
            Tel: +91 8928186952 | contact@mindsaidlearning.com<br>
            <a href="https://www.mindsaidlearning.com" style="color: #4A90E2;">www.mindsaidlearning.com</a>
          </p>
        </div>
      </div>
      <div class="invoice-title-section">
        <h2>INVOICE</h2>
        <div style="margin-top: 10px; font-size: 13px; color: #666;">
          <strong>${invoiceNumber}</strong><br>
          Date: ${formattedDate}
        </div>
      </div>
    </div>
    
    <!-- Body -->
    <div class="invoice-body">
      <div class="bill-section">
        <div class="bill-to">
          <h3>Bill To</h3>
          <div class="customer-name">${firstName || ''} ${lastName || ''}</div>
          <div class="customer-email">${companyEmail || ''}</div>
        </div>
        <div class="invoice-details">
          <h3>Invoice Details</h3>
          <div class="detail-row">
            <span class="detail-label">Invoice Number:</span>
            <span class="detail-value">${invoiceNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Invoice Date:</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Due:</span>
            <span class="detail-value">${formattedDueDate}</span>
          </div>
          <div class="amount-due">
            <div class="label">Amount Due (INR):</div>
            <div class="value">₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 50%;">Items</th>
            <th style="width: 15%;">Quantity</th>
            <th style="width: 20%;">Price</th>
            <th style="width: 15%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-name">${assessmentName || 'Psycho-Educational Assessment (WJ-IV)'}</div>
              <div class="item-description">${assessmentType || 'Woodcock-Johnson-IV(Cognitive)<br>Woodcock-Johnson-IV(Achievement)<br>Brown\'s EF/A Scales'}</div>
            </td>
            <td>1</td>
            <td>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals-section">
        <table class="totals-table">
          <tr>
            <td>Total:</td>
            <td>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr class="grand-total">
            <td>Amount Due (INR):</td>
            <td>₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>${companyName}</strong></p>
      <p>${companyAddress} | Phone: ${companyPhone}</p>
      <p>Email: ${companyEmail}</p>
      <p style="margin-top: 15px; font-size: 11px; color: #bbb;">
        This is an electronically generated invoice and does not require a physical signature.
      </p>
      <div class="powered-by">
        Powered by <strong>〰 wave</strong>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Generate PDF invoice HTML - Premium Wave Style
  generateInvoicePDF(data) {
    const {
      invoiceNumber,
      firstName,
      lastName,
      assessmentName,
      assessmentType,
      subtotal,
      gstAmount,
      totalAmount,
      itemsCount,
      individualPrice,
      email
    } = data;

    const formattedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const formattedDueDate = dueDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    
    // Calculate values
    const qty = itemsCount || 1;
    const unitPrice = individualPrice || (subtotal / qty);
    const gst = 0; // No GST
    const clientName = `${firstName || ''} ${lastName || ''}`.trim() || 'Client';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice – MindSaid Learning Centre</title>
  <!-- No external fonts - using system fonts for Wave-style look -->
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-weight: 400;
      font-size: 12.5px;
      line-height: 1.5;
      color: #222;
      background: #e8e8e8;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 40px 20px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .page {
      background: #fff;
      width: 760px;
      padding: 40px 50px 50px;
      box-shadow: 0 4px 30px rgba(0,0,0,0.12);
      border-radius: 2px;
    }

    /* ── HEADER ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 28px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 28px;
    }

    .logo-block {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 56px;
      height: 56px;
      flex-shrink: 0;
    }

    .logo-text h1 {
      font-size: 17px;
      font-weight: bold;
      color: #1a1a2e;
      letter-spacing: 0.3px;
      line-height: 1.2;
    }

    .logo-text .tagline {
      font-size: 11.5px;
      color: #4a90d9;
      font-style: italic;
      font-weight: 400;
      margin-top: 2px;
    }

    .invoice-title-block {
      text-align: right;
    }

    .invoice-title-block h2 {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 38px;
      font-weight: 300;
      letter-spacing: 3px;
      color: #1a1a2e;
      line-height: 1.2;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .company-address {
      font-size: 11px;
      color: #444;
      line-height: 1.75;
      text-align: right;
    }

    .company-address strong {
      font-size: 12.5px;
      font-weight: 700;
      color: #111;
      display: block;
      margin-bottom: 2px;
    }

    /* ── BILL TO + INVOICE META ── */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }

    .bill-to-block {
      flex: 1;
    }

    .bill-to-block .label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #888;
      margin-bottom: 8px;
    }

    .bill-to-block .client-name {
      font-size: 14.5px;
      font-weight: 700;
      color: #111;
      margin-bottom: 2px;
    }

    .bill-to-block .client-sub {
      font-size: 12px;
      color: #444;
      line-height: 1.6;
    }

    .invoice-meta-block {
      text-align: right;
      min-width: 280px;
    }

    .meta-line {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      font-size: 12px;
      margin-bottom: 5px;
      color: #333;
    }

    .meta-line .meta-key {
      font-weight: 700;
      color: #111;
      white-space: nowrap;
    }

    .meta-line .meta-val {
      color: #444;
      min-width: 120px;
      text-align: right;
    }

    .amount-due-box {
      margin-top: 10px;
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      padding: 8px 14px;
      display: inline-block;
      text-align: right;
    }

    .amount-due-box .adu-label {
      font-size: 10.5px;
      color: #666;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .amount-due-box .adu-value {
      font-size: 18px;
      font-weight: bold;
      color: #111;
      margin-top: 2px;
    }

    /* ── ITEMS TABLE ── */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0;
    }

    .items-table thead tr {
      background: #29b6f6;
    }

    .items-table thead th {
      padding: 11px 14px;
      font-size: 12.5px;
      font-weight: 700;
      color: #fff;
      text-align: left;
      letter-spacing: 0.3px;
    }

    .items-table thead th:not(:first-child) {
      text-align: center;
    }

    .items-table thead th:last-child {
      text-align: right;
    }

    .items-table tbody tr {
      border-bottom: 1px solid #ececec;
    }

    .items-table tbody tr:last-child {
      border-bottom: 2px solid #ddd;
    }

    .items-table tbody td {
      padding: 13px 14px;
      font-size: 12.5px;
      vertical-align: top;
      color: #222;
    }

    .items-table tbody td:not(:first-child) {
      text-align: center;
    }

    .items-table tbody td:last-child {
      text-align: right;
      font-weight: 600;
    }

    .item-name {
      font-weight: 700;
      color: #111;
      margin-bottom: 3px;
    }

    .item-desc {
      font-size: 11px;
      color: #555;
      line-height: 1.6;
      margin-top: 2px;
    }

    .item-breakdown {
      font-size: 10.5px;
      color: #666;
      margin-top: 4px;
      font-style: italic;
    }

    /* ── TOTALS ── */
    .totals-section {
      display: flex;
      justify-content: flex-end;
      padding-top: 6px;
    }

    .totals-table {
      width: 300px;
      border-collapse: collapse;
    }

    .totals-table td {
      padding: 7px 14px;
      font-size: 12.5px;
      color: #333;
    }

    .totals-table td:first-child {
      text-align: right;
      color: #555;
    }

    .totals-table td:last-child {
      text-align: right;
      font-weight: 600;
      color: #111;
    }


    .totals-table .grand-row td {
      padding-top: 12px;
      border-top: 1px solid #ccc;
      font-size: 13.5px;
      font-weight: bold;
      color: #111;
    }

    /* ── FOOTER ── */
    .footer {
      margin-top: 60px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .footer .powered-text {
      font-size: 12px;
      color: #888;
      font-weight: 400;
    }

    .wave-logo {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .wave-logo svg {
      height: 18px;
    }

    .wave-logo span {
      font-size: 15px;
      font-weight: 700;
      color: #1a6fc4;
      letter-spacing: 0.5px;
    }

    /* ── PRINT ── */
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; }
    }
  </style>
</head>
<body>

<div class="page">

  <!-- HEADER -->
  <div class="header">
    <div class="logo-block">
      <svg class="logo-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="9" fill="#f87171" opacity="0.85"/>
        <circle cx="30" cy="10" r="7" fill="#34d399" opacity="0.85"/>
        <circle cx="44" cy="16" r="6" fill="#60a5fa" opacity="0.85"/>
        <circle cx="10" cy="30" r="6" fill="#fbbf24" opacity="0.85"/>
        <circle cx="26" cy="32" r="8" fill="#a78bfa" opacity="0.85"/>
        <circle cx="42" cy="30" r="5" fill="#f472b6" opacity="0.85"/>
        <circle cx="18" cy="44" r="5" fill="#4ade80" opacity="0.85"/>
        <circle cx="36" cy="44" r="6" fill="#38bdf8" opacity="0.85"/>
      </svg>
      <div class="logo-text">
        <h1>MindSaid Learning Centre</h1>
        <div class="tagline">Learning This Ability</div>
      </div>
    </div>

    <div class="invoice-title-block">
      <h2>INVOICE</h2>
      <div class="company-address">
        <strong>MindSaid Learning</strong>
        D-207, Crystal Plaza,<br />
        Opp. Infinity Mall, Link Road, Andheri (W),<br />
        Mumbai, Maharashtra 400053<br />
        India<br /><br />
        Mobile: +91 8928186952<br />
        www.mindsaidlearning.com
      </div>
    </div>
  </div>

  <!-- BILL TO + META -->
  <div class="meta-row">
    <div class="bill-to-block">
      <div class="label">Bill To</div>
      <div class="client-name">${clientName}</div>
      <div class="client-sub">
        ${clientName}<br />
        ${email || ''}
      </div>
    </div>

    <div class="invoice-meta-block">
      <div class="meta-line">
        <span class="meta-key">Invoice Number:</span>
        <span class="meta-val">${invoiceNumber}</span>
      </div>
      <div class="meta-line">
        <span class="meta-key">Invoice Date:</span>
        <span class="meta-val">${formattedDate}</span>
      </div>
      <div class="meta-line">
        <span class="meta-key">Payment Due:</span>
        <span class="meta-val">${formattedDueDate}</span>
      </div>
      <div class="amount-due-box">
        <div class="adu-label">Amount Due (INR):</div>
        <div class="adu-value">₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
      </div>
    </div>
  </div>

  <!-- ITEMS TABLE -->
  <table class="items-table">
    <thead>
      <tr>
        <th style="width:52%">Items</th>
        <th style="width:12%">Quantity</th>
        <th style="width:18%">Price</th>
        <th style="width:18%">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-name">${assessmentName || 'Psycho-Educational Assessment'}</div>
          <div class="item-desc">${assessmentType || 'Woodcock-Johnson-IV(Cognitive), Woodcock-Johnson-IV(Achievement)'}</div>
          <div class="item-breakdown">(${qty} assessment${qty > 1 ? 's' : ''} × ₹${unitPrice.toLocaleString('en-IN')})</div>
        </td>
        <td>${qty}</td>
        <td>₹${unitPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
        <td>₹${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
      </tr>
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals-section">
    <table class="totals-table">
      <tr class="grand-row">
        <td>Amount (INR):</td>
        <td>₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
      </tr>
    </table>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="powered-text">Powered by</div>
    <div class="wave-logo">
      <span style="font-size: 16px; font-weight: 700; color: #1a6fc4; letter-spacing: 0.5px;">Centrix by MindSaid Learning</span>
    </div>
  </div>

</div>

</body>
</html>
`;
  }

  // Delete invoice (soft delete - just mark invoice_sent as false)
  async deleteInvoice(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid invoice ID is required'
        });
      }

      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();

      // Check if assessment exists
      const assessment = await assessmentModel.getAssessment(parseInt(id));
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Soft delete - mark invoice_sent as false and clear invoice data
      await assessmentModel.update(parseInt(id), {
        invoice_sent: false,
        invoice_sent_date: null,
        invoice_email: null,
        payment_status: null
      });

      res.json({
        success: true,
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      console.error('Delete invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete invoice',
        error: error.message
      });
    }
  }

  // Update invoice (status and amount)
  async updateInvoice(req, res) {
    try {
      const { id } = req.params;
      const { status, amount } = req.body;

      if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
          success: false,
          message: 'Valid invoice ID is required'
        });
      }

      const Assessment = require('../models/Assessment');
      const assessmentModel = new Assessment();

      // Check if assessment exists
      const assessment = await assessmentModel.getAssessment(parseInt(id));
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Invoice not found'
        });
      }

      // Prepare update data
      const updateData = {};
      if (status) updateData.payment_status = status.toLowerCase();
      if (amount !== undefined && amount !== null) updateData.price = parseFloat(amount);

      await assessmentModel.update(parseInt(id), updateData);

      res.json({
        success: true,
        message: 'Invoice updated successfully',
        data: {
          id: parseInt(id),
          ...updateData
        }
      });
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update invoice',
        error: error.message
      });
    }
  }
}

module.exports = InvoiceController;
