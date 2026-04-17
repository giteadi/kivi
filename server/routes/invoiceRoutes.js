const express = require('express');
const router = express.Router();
const InvoiceController = require('../controllers/invoiceController');

const invoiceController = new InvoiceController();

// POST /api/invoices/send-assessment - Send assessment invoice email
router.post('/send-assessment', invoiceController.sendAssessmentInvoice.bind(invoiceController));

// DELETE /api/invoices/:id - Delete invoice (soft delete)
router.delete('/:id', invoiceController.deleteInvoice.bind(invoiceController));

// PUT /api/invoices/:id - Update invoice status and amount
router.put('/:id', invoiceController.updateInvoice.bind(invoiceController));

module.exports = router;
