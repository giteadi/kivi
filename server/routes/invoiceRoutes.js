const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoiceController');

const invoiceController = new InvoiceController();

// POST /api/invoices/send-assessment - Send assessment invoice email
router.post('/send-assessment', invoiceController.sendAssessmentInvoice.bind(invoiceController));

module.exports = router;
