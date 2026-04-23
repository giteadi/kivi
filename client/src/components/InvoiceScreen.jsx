import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiUser,
  FiX,
  FiSend,
  FiFileText,
  FiTool,
  FiActivity,
  FiEdit3,
  FiCheckCircle,
  FiAlertCircle,
  FiPrinter,
  FiDownload,
  FiChevronLeft
} from 'react-icons/fi';

const InvoiceScreen = ({ 
  isOpen, 
  onClose, 
  assessmentData,
  examineeData,
  onSendInvoice 
}) => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Editable invoice data
  const [invoiceData, setInvoiceData] = useState({
    toEmail: '',
    ccEmail: '',
    subject: '',
    notes: '',
    customMessage: ''
  });

  // Initialize with examinee data when opened
  useEffect(() => {
    if (isOpen && examineeData) {
      setInvoiceData({
        toEmail: examineeData.email || '',
        ccEmail: '',
        subject: `Invoice for ${assessmentData?.name || 'Assessment'} - ${examineeData.name || ''}`,
        notes: '',
        customMessage: `Dear ${examineeData.name || 'Parent/Guardian'},\n\nPlease find attached the invoice for the educational assessment.\n\nThank you,\nMindSaid Learning`
      });
    }
  }, [isOpen, examineeData, assessmentData]);

  const handleInputChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotals = () => {
    const price = assessmentData?.price || 5500;
    const gst = 0; // No GST
    const total = price; // Total equals base price
    return { price, gst, total };
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSendInvoice({
        ...invoiceData,
        ...calculateTotals()
      });
      onClose();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle PDF download - Professional format
  const handleDownloadPDF = () => {
    const { price, gst, total } = calculateTotals();
    const invoiceNumber = `msl/${new Date().getFullYear()}/${String(Date.now()).slice(-4)}`;
    const formattedDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const formattedDueDate = dueDate.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    // Professional HTML invoice
    const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
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
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 40px;
      border-bottom: 3px solid #29b6f6;
    }
    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
      font-weight: bold;
    }
    .company-info h1 {
      font-size: 24px;
      color: #333;
      margin: 0;
    }
    .company-info p {
      font-size: 12px;
      color: #666;
      margin: 2px 0;
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
      .no-print { display: none; }
    }
    .print-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #29b6f6;
      color: white;
      padding: 12px 30px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .print-btn:hover {
      background: #0288d1;
    }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        <div class="logo">M</div>
        <div class="company-info">
          <h1>MindSaid Learning Centre</h1>
          <p>Learning This Ability</p>
        </div>
      </div>
      <div class="invoice-title-section">
        <h2>INVOICE</h2>
        <div class="company-address">
          <strong>MindSaid Learning</strong><br>
          D-207, Crystal Plaza,<br>
          Opp. Infinity Mall, Link Road, Andheri (W),<br>
          Mumbai, Maharashtra 400053, India<br>
          Tel: +91 8928186952<br>
          www.mindsaidlearning.com
        </div>
      </div>
    </div>
    
    <div class="invoice-body">
      <div class="bill-section">
        <div class="bill-to">
          <h3>Bill To</h3>
          <div class="customer-name">${examineeData?.name || invoiceData.toName || 'Student Name'}</div>
          <div class="customer-email">${invoiceData.toEmail || 'email@example.com'}</div>
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
            <div class="value">₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </div>
      </div>

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
              <div class="item-name">${assessmentData?.name || 'Psycho-Educational Assessment (WJ-IV)'}</div>
              <div class="item-description">${assessmentData?.type || 'Woodcock-Johnson-IV(Cognitive)<br>Woodcock-Johnson-IV(Achievement)<br>Brown\'s EF/A Scales'}</div>
            </td>
            <td>1</td>
            <td>₹${price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            <td>₹${price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals-section">
        <table class="totals-table">
          <tr>
            <td>Total:</td>
            <td>₹${price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
          <tr class="grand-total">
            <td>Amount Due (INR):</td>
            <td>₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          </tr>
        </table>
      </div>
    </div>

    <div class="footer">
      <p><strong>MindSaid Learning Centre</strong></p>
      <p>D-207, Crystal Plaza, Andheri (W), Mumbai | Phone: +91 8928186952</p>
      <p>Email: contact@mindsaidlearning.com</p>
      <p style="margin-top: 15px; font-size: 11px; color: #bbb;">
        This is an electronically generated invoice and does not require a physical signature.
      </p>
      <div class="powered-by">
        Powered by <strong>〰 wave</strong>
      </div>
    </div>
  </div>
  
  <script>
    // Auto-open print dialog after a short delay
    setTimeout(() => {
      window.print();
    }, 500);
  </script>
</body>
</html>`;

    // Open in new window for print/PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const { price, gst, total } = calculateTotals();

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white flex items-center gap-2"
          >
            <FiChevronLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <div className="h-6 w-px bg-white/30" />
          <div className="flex items-center gap-2">
            <FiMail className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">Send Invoice</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm flex items-center gap-2"
          >
            <FiFileText className="w-4 h-4" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button 
            onClick={handleSend}
            disabled={isSending || !invoiceData.toEmail}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiSend className="w-4 h-4" />
            {isSending ? 'Sending...' : 'Send Invoice'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button 
            onClick={() => setActiveTab('invoice')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'invoice'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Invoice Details
          </button>
          <button 
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'student'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Student Info
          </button>
          <button 
            onClick={() => setActiveTab('diagnosis')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'diagnosis'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Diagnosis & Issues
          </button>
          <button 
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'tools'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Assessment Tools
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'invoice' && !showPreview && (
              <>
                {/* Email Configuration */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                    <FiMail className="w-5 h-5" />
                    Email Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={invoiceData.toEmail}
                        onChange={(e) => handleInputChange('toEmail', e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Invoice will be sent to this email address
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CC Email
                      </label>
                      <input
                        type="email"
                        value={invoiceData.ccEmail}
                        onChange={(e) => handleInputChange('ccEmail', e.target.value)}
                        placeholder="secondary@example.com (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Line
                      </label>
                      <input
                        type="text"
                        value={invoiceData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        placeholder="Invoice subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Message
                      </label>
                      <textarea
                        value={invoiceData.customMessage}
                        onChange={(e) => handleInputChange('customMessage', e.target.value)}
                        rows={6}
                        placeholder="Enter your custom message for the email..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiEdit3 className="w-5 h-5" />
                    Additional Notes
                  </h3>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Add any special instructions or notes to include in the invoice..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </>
            )}

            {activeTab === 'invoice' && showPreview && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="border-b pb-6 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
                      <p className="text-gray-500 text-sm mt-1">MindSaid Learning</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Invoice #</p>
                      <p className="font-medium">INV-{Date.now()}</p>
                      <p className="text-sm text-gray-500 mt-2">Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bill To:</p>
                    <p className="font-medium">{examineeData?.name || 'Student Name'}</p>
                    <p className="text-sm text-gray-600">{examineeData?.email || 'email@example.com'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assessment:</p>
                    <p className="font-medium">{assessmentData?.name || 'Educational Assessment'}</p>
                  </div>
                </div>

                <table className="w-full mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Description</th>
                      <th className="text-right p-3 text-sm font-medium text-gray-700">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="border-b">
                    <tr>
                      <td className="p-3 text-sm">{assessmentData?.name || 'Assessment Fee'}</td>
                      <td className="p-3 text-sm text-right">₹{price.toLocaleString()}</td>
                    </tr>
                    {gst > 0 && (
                      <tr>
                        <td className="p-3 text-sm">GST (18%)</td>
                        <td className="p-3 text-sm text-right">₹{gst.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold text-lg">
                      <td className="p-3">Total</td>
                      <td className="p-3 text-right text-blue-600">₹{total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>

                {invoiceData.notes && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                  </div>
                )}

                <div className="text-center text-sm text-gray-500">
                  <p>Thank you for choosing MindSaid Learning</p>
                  <p className="mt-1">For queries, contact us at support@mindsaid.com</p>
                </div>
              </div>
            )}

            {activeTab === 'student' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <FiUser className="w-5 h-5" />
                  Student Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{examineeData?.name || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{examineeData?.email || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium">{examineeData?.age || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{examineeData?.gender || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Center</p>
                    <p className="font-medium">{examineeData?.centre || 'Not available'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Examinee ID</p>
                    <p className="font-medium">{examineeData?.examineeId || 'Not available'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diagnosis' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                    <FiActivity className="w-5 h-5" />
                    Diagnosis & Issues
                  </h3>
                  
                  {examineeData?.diagnosisData ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-sm font-medium text-purple-800 mb-2">Diagnoses</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(examineeData.diagnosisData)
                            .filter(([_, value]) => value === true)
                            .map(([key]) => (
                              <span key={key} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No diagnosis data available</p>
                  )}

                  {examineeData?.evaluationData ? (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-medium text-blue-800 mb-2">Evaluation Concerns</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Object.entries(examineeData.evaluationData)
                          .filter(([_, value]) => {
                            if (typeof value === 'boolean') return value;
                            if (typeof value === 'object' && value !== null) {
                              return Object.values(value).some(v => v === true);
                            }
                            return false;
                          })
                          .map(([key, value]) => (
                            <div key={key} className="text-sm text-gray-700">
                              • {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              {typeof value === 'object' && value?.otherText && (
                                <span className="text-gray-500">: {value.otherText}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic mt-4">No evaluation data available</p>
                  )}
                </div>

                {examineeData?.historyData && (
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FiAlertCircle className="w-5 h-5" />
                      History & Referral Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {examineeData.historyData.referralSourceName && (
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-gray-500">Referral Source</p>
                          <p className="font-medium">{examineeData.historyData.referralSourceName}</p>
                          <p className="text-sm text-gray-600">{examineeData.historyData.referralSourceRole}</p>
                        </div>
                      )}
                      {Object.entries(examineeData.historyData)
                        .filter(([key, value]) => value === true && !key.includes('Other'))
                        .map(([key]) => (
                          <div key={key} className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <FiTool className="w-5 h-5" />
                  Assessment Tools Information
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-blue-900">{assessmentData?.name || 'Assessment'}</p>
                        <p className="text-sm text-blue-600">Current Assessment</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      This assessment is designed to evaluate cognitive abilities, behavioral patterns, 
                      and emotional development. Results will help in creating a personalized intervention plan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <FiCheckCircle className="w-6 h-6 text-green-500 mb-2" />
                      <p className="font-medium text-green-900">Validated</p>
                      <p className="text-sm text-green-700">Clinically validated tools</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <FiActivity className="w-6 h-6 text-purple-500 mb-2" />
                      <p className="font-medium text-purple-900">Comprehensive</p>
                      <p className="text-sm text-purple-700">Multi-domain evaluation</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <FiFileText className="w-6 h-6 text-orange-500 mb-2" />
                      <p className="font-medium text-orange-900">Detailed</p>
                      <p className="text-sm text-orange-700">In-depth reporting</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">Assessment Process</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">1</span>
                        Pre-assessment consultation and intake
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">2</span>
                        Standardized testing session (2-3 hours)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">3</span>
                        Scoring and clinical interpretation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">4</span>
                        Comprehensive report generation
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">5</span>
                        Feedback session with recommendations
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Summary */}
          <div className="space-y-6">
            {/* Invoice Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Invoice Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assessment:</span>
                  <span className="font-medium">
                    {assessmentData?.count > 1 
                      ? `${assessmentData?.name} (${assessmentData?.count} items)` 
                      : (assessmentData?.name || 'Assessment')}
                  </span>
                </div>
                {assessmentData?.count > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per Assessment:</span>
                    <span className="font-medium">₹{(price / assessmentData?.count).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">₹{price.toLocaleString()}</span>
                </div>
                {gst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%):</span>
                    <span className="font-medium">₹{gst.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-xl text-blue-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={handleSend}
                  disabled={isSending || !invoiceData.toEmail}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiSend className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Invoice'}
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <FiFileText className="w-4 h-4" />
                    {showPreview ? 'Edit' : 'Preview'}
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    PDF
                  </button>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

              {!invoiceData.toEmail && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <FiAlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Please enter a recipient email address to send the invoice.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
              <p className="text-sm font-medium text-blue-800 mb-1">Assessment</p>
              <p className="text-sm text-blue-600">{assessmentData?.name || 'Educational Assessment'}</p>
              <p className="text-xs text-blue-500 mt-2">
                Invoice includes detailed assessment information and payment instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceScreen;
