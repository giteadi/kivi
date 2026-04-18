import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiDownload, FiCalendar, FiUser, FiDollarSign, FiFilter, FiRefreshCw, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './Toast';

/* ─────────────────────────────────────────────
   Helper: generate MindSaid invoice HTML string
   ───────────────────────────────────────────── */
const generateMindSaidInvoiceHTML = (bill) => {
  const invoiceNumber = bill.id || 'msl/2025/01/01';
  const invoiceDate   = bill.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const dueDate       = bill.dueDate || invoiceDate;
  const clientName    = bill.patient?.name || '';
  const clientEmail   = bill.patient?.email || '';
  const total         = bill.total ?? bill.amount ?? 0;
  const subtotal      = bill.amount ?? 0;
  const tax           = bill.tax ?? 0;
  const service       = bill.service || 'Assessment Service';
  const clinic        = bill.clinic || 'Centrix Centre';

  // Build items rows — one main row + tax row if applicable
  const itemRows = `
    <tr>
      <td>
        <div class="item-name">${service}</div>
        <div class="item-desc">${clinic}</div>
      </td>
      <td>1</td>
      <td>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
    </tr>
    ${tax > 0 ? `
    <tr>
      <td><div class="item-name">Tax / GST</div></td>
      <td>1</td>
      <td>₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      <td>₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
    </tr>` : ''}
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Invoice ${invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Merriweather:wght@700&display=swap" rel="stylesheet"/>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Lato',sans-serif;background:#e8e8e8;display:flex;justify-content:center;padding:40px 20px;min-height:100vh}
  .page{background:#fff;width:760px;padding:40px 50px 50px;box-shadow:0 4px 30px rgba(0,0,0,.12)}
  .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:28px;border-bottom:1px solid #ddd;margin-bottom:28px}
  .logo-block{display:flex;align-items:center;gap:12px}
  .logo-icon{width:56px;height:56px;flex-shrink:0}
  .logo-text h1{font-size:17px;font-weight:900;color:#1a1a2e;letter-spacing:.3px;line-height:1.2}
  .logo-text .tagline{font-size:11.5px;color:#4a90d9;font-style:italic;margin-top:2px}
  .invoice-title-block{text-align:right}
  .invoice-title-block h2{font-family:'Merriweather',serif;font-size:40px;font-weight:700;letter-spacing:4px;color:#111;line-height:1;margin-bottom:14px}
  .company-address{font-size:11px;color:#444;line-height:1.75;text-align:right}
  .company-address strong{font-size:12.5px;font-weight:700;color:#111;display:block;margin-bottom:2px}
  .meta-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px}
  .bill-to-block .label{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#888;margin-bottom:8px}
  .bill-to-block .client-name{font-size:14.5px;font-weight:700;color:#111;margin-bottom:2px}
  .bill-to-block .client-sub{font-size:12px;color:#444;line-height:1.6}
  .invoice-meta-block{text-align:right;min-width:280px}
  .meta-line{display:flex;justify-content:flex-end;gap:12px;font-size:12px;margin-bottom:5px;color:#333}
  .meta-line .meta-key{font-weight:700;color:#111;white-space:nowrap}
  .meta-line .meta-val{color:#444;min-width:120px;text-align:right}
  .amount-due-box{margin-top:10px;background:#f5f5f5;border:1px solid #e0e0e0;padding:8px 14px;display:inline-block;text-align:right}
  .amount-due-box .adu-label{font-size:10.5px;color:#666;font-weight:700;letter-spacing:.5px}
  .amount-due-box .adu-value{font-size:18px;font-weight:900;color:#111;margin-top:2px}
  .items-table{width:100%;border-collapse:collapse;margin-bottom:0}
  .items-table thead tr{background:#29b6f6}
  .items-table thead th{padding:11px 14px;font-size:12.5px;font-weight:700;color:#fff;text-align:left;letter-spacing:.3px}
  .items-table thead th:not(:first-child){text-align:center}
  .items-table thead th:last-child{text-align:right}
  .items-table tbody tr{border-bottom:1px solid #ececec}
  .items-table tbody tr:last-child{border-bottom:2px solid #ddd}
  .items-table tbody td{padding:13px 14px;font-size:12.5px;vertical-align:top;color:#222}
  .items-table tbody td:not(:first-child){text-align:center}
  .items-table tbody td:last-child{text-align:right;font-weight:600}
  .item-name{font-weight:700;color:#111;margin-bottom:3px}
  .item-desc{font-size:11px;color:#555;line-height:1.6;margin-top:2px}
  .totals-section{display:flex;justify-content:flex-end;padding-top:6px}
  .totals-table{width:300px;border-collapse:collapse}
  .totals-table td{padding:7px 14px;font-size:12.5px;color:#333}
  .totals-table td:first-child{text-align:right;color:#555}
  .totals-table td:last-child{text-align:right;font-weight:600;color:#111}
  .totals-table .grand-row td{padding-top:12px;border-top:1px solid #ccc;font-size:13.5px;font-weight:900;color:#111}
  .footer{margin-top:60px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:6px}
  .footer .powered-text{font-size:12px;color:#888}
  .wave-logo{display:flex;align-items:center;gap:5px}
  .wave-logo svg{height:18px}
  .wave-logo span{font-size:15px;font-weight:700;color:#1a6fc4;letter-spacing:.5px}
  @media print{body{background:white;padding:0}.page{box-shadow:none}}
</style>
</head>
<body>
<div class="page">
  <!-- HEADER -->
  <div class="header">
    <div class="logo-block">
      <svg class="logo-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="9" fill="#f87171" opacity=".85"/>
        <circle cx="30" cy="10" r="7" fill="#34d399" opacity=".85"/>
        <circle cx="44" cy="16" r="6" fill="#60a5fa" opacity=".85"/>
        <circle cx="10" cy="30" r="6" fill="#fbbf24" opacity=".85"/>
        <circle cx="26" cy="32" r="8" fill="#a78bfa" opacity=".85"/>
        <circle cx="42" cy="30" r="5" fill="#f472b6" opacity=".85"/>
        <circle cx="18" cy="44" r="5" fill="#4ade80" opacity=".85"/>
        <circle cx="36" cy="44" r="6" fill="#38bdf8" opacity=".85"/>
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
        D-207, Crystal Plaza,<br/>
        Opp. Infinity Mall, Link Road, Andheri (W),<br/>
        Mumbai, Maharashtra 400053<br/>
        India<br/><br/>
        Phone: +022 49742555<br/>
        Mobile: +91 8928186952<br/>
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
        ${clientName}<br/>
        ${clientEmail}
      </div>
    </div>
    <div class="invoice-meta-block">
      <div class="meta-line">
        <span class="meta-key">Invoice Number:</span>
        <span class="meta-val">${invoiceNumber}</span>
      </div>
      <div class="meta-line">
        <span class="meta-key">Invoice Date:</span>
        <span class="meta-val">${invoiceDate}</span>
      </div>
      <div class="meta-line">
        <span class="meta-key">Payment Due:</span>
        <span class="meta-val">${dueDate}</span>
      </div>
      <div class="amount-due-box">
        <div class="adu-label">Amount Due (INR):</div>
        <div class="adu-value">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
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
      ${itemRows}
    </tbody>
  </table>

  <!-- TOTALS -->
  <div class="totals-section">
    <table class="totals-table">
      <tr>
        <td>Total:</td>
        <td>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
      <tr class="grand-row">
        <td>Amount Due (INR):</td>
        <td>₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
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
</html>`;
};

/* ─────────────────────────────────────────────
   InvoicePreview — rendered inside the modal
   ───────────────────────────────────────────── */
const InvoicePreview = ({ bill }) => {
  const invoiceDate = bill.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const total       = bill.total ?? bill.amount ?? 0;
  const subtotal    = bill.amount ?? 0;
  const tax         = bill.tax ?? 0;
  const service     = bill.service || 'Assessment Service';
  const clinic      = bill.clinic  || 'Centrix Centre';

  return (
    <div style={{ fontFamily: "'Lato', sans-serif", color: '#333', background: '#fff', width: '100%' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 24, borderBottom: '1px solid #ddd', marginBottom: 24 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="52" height="52" viewBox="0 0 56 56" fill="none">
            <circle cx="14" cy="14" r="9"  fill="#f87171" opacity=".85"/>
            <circle cx="30" cy="10" r="7"  fill="#34d399" opacity=".85"/>
            <circle cx="44" cy="16" r="6"  fill="#60a5fa" opacity=".85"/>
            <circle cx="10" cy="30" r="6"  fill="#fbbf24" opacity=".85"/>
            <circle cx="26" cy="32" r="8"  fill="#a78bfa" opacity=".85"/>
            <circle cx="42" cy="30" r="5"  fill="#f472b6" opacity=".85"/>
            <circle cx="18" cy="44" r="5"  fill="#4ade80" opacity=".85"/>
            <circle cx="36" cy="44" r="6"  fill="#38bdf8" opacity=".85"/>
          </svg>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1a1a2e' }}>MindSaid Learning Centre</div>
            <div style={{ fontSize: 11, color: '#4a90d9', fontStyle: 'italic' }}>Learning This Ability</div>
          </div>
        </div>

        {/* Title + Address */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 4, color: '#111', marginBottom: 12 }}>INVOICE</div>
          <div style={{ fontSize: 10.5, color: '#444', lineHeight: 1.75 }}>
            <strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>MindSaid Learning</strong>
            D-207, Crystal Plaza,<br/>
            Opp. Infinity Mall, Link Road, Andheri (W),<br/>
            Mumbai, Maharashtra 400053<br/>
            India<br/><br/>
            Phone: +022 49742555<br/>
            Mobile: +91 8928186952<br/>
            www.mindsaidlearning.com
          </div>
        </div>
      </div>

      {/* ── BILL TO + META ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        {/* Bill To */}
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#888', marginBottom: 6 }}>Bill To</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 2 }}>{bill.patient?.name}</div>
          <div style={{ fontSize: 11.5, color: '#444', lineHeight: 1.6 }}>
            {bill.patient?.name}<br/>
            {bill.patient?.email}
          </div>
        </div>

        {/* Invoice Meta */}
        <div style={{ textAlign: 'right', minWidth: 250 }}>
          {[
            ['Invoice Number:', bill.id],
            ['Invoice Date:',   invoiceDate],
            ['Payment Due:',    invoiceDate],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, fontSize: 11.5, marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: '#111' }}>{k}</span>
              <span style={{ color: '#444', minWidth: 110, textAlign: 'right' }}>{v}</span>
            </div>
          ))}
          {/* Amount Due Box */}
          <div style={{ marginTop: 8, background: '#f5f5f5', border: '1px solid #e0e0e0', padding: '7px 12px', display: 'inline-block', textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#666', fontWeight: 700, letterSpacing: .5 }}>Amount Due (INR):</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: '#111', marginTop: 2 }}>
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* ── ITEMS TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#29b6f6' }}>
            {['Items', 'Quantity', 'Price', 'Amount'].map((h, i) => (
              <th key={h} style={{
                padding: '10px 12px',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center',
                letterSpacing: .3
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: tax > 0 ? '1px solid #ececec' : '2px solid #ddd' }}>
            <td style={{ padding: '12px 12px', fontSize: 12, verticalAlign: 'top' }}>
              <div style={{ fontWeight: 700, color: '#111', marginBottom: 3 }}>{service}</div>
              <div style={{ fontSize: 10.5, color: '#555', lineHeight: 1.6 }}>{clinic}</div>
            </td>
            <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'center' }}>1</td>
            <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'center' }}>
              ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </td>
            <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'right', fontWeight: 600 }}>
              ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </td>
          </tr>
          {tax > 0 && (
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <td style={{ padding: '12px 12px', fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: '#111' }}>Tax / GST</div>
              </td>
              <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'center' }}>1</td>
              <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'center' }}>
                ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td style={{ padding: '12px 12px', fontSize: 12, textAlign: 'right', fontWeight: 600 }}>
                ₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── TOTALS ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
        <table style={{ width: 280, borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '6px 12px', fontSize: 12, textAlign: 'right', color: '#555' }}>Total:</td>
              <td style={{ padding: '6px 12px', fontSize: 12, textAlign: 'right', fontWeight: 600, color: '#111' }}>
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px 12px 6px', fontSize: 13, textAlign: 'right', fontWeight: 900, color: '#111', borderTop: '1px solid #ccc' }}>
                Amount Due (INR):
              </td>
              <td style={{ padding: '10px 12px 6px', fontSize: 13, textAlign: 'right', fontWeight: 900, color: '#111', borderTop: '1px solid #ccc' }}>
                ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ marginTop: 50, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 11, color: '#aaa' }}>Powered by</div>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1a6fc4', letterSpacing: '0.5px' }}>Centrix by MindSaid Learning</span>
        </div>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────────
   Main BillingRecords Component
   ───────────────────────────────────────────── */
const BillingRecords = ({ onViewBilling, onEditBilling, onDeleteBilling, onCreateNewBilling }) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: 'Pending', amount: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => { fetchBillingRecords(); }, []);

  const fetchBillingRecords = async () => {
    try {
      setLoading(true); setError(null);
      const result = await api.getBillingRecords();
      if (result.success) {
        setBillingData(result.data.map(record => ({
          id: `#INV-${String(record.id).padStart(3, '0')}`,
          patient: {
            name: record.student_first_name + ' ' + record.student_last_name,
            initials: (record.student_first_name?.[0] || '') + (record.student_last_name?.[0] || ''),
            email: 'Not provided'
          },
          doctor: {
            name: `Dr. ${record.therapist_first_name} ${record.therapist_last_name}`,
            initials: (record.therapist_first_name?.[0] || '') + (record.therapist_last_name?.[0] || '')
          },
          clinic: 'Centrix Centre',
          service: 'Session',
          amount: parseFloat(record.amount) || 0,
          tax: 0,
          total: parseFloat(record.amount) || 0,
          date: record.created_at ? new Date(record.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not available',
          status: record.status || 'Pending',
          paymentMethod: 'Not specified',
          rawId: record.id
        })));
      } else {
        setError(result.message || 'Failed to fetch billing records');
        toast.error(result.message || 'Failed to fetch billing records');
      }
    } catch (err) {
      setError('Error loading billing records');
      toast.error('Error loading billing records');
    } finally {
      setLoading(false);
    }
  };

  const filteredBilling = billingData.filter(bill => {
    const q = searchTerm.toLowerCase();
    return (
      (bill.patient.name.toLowerCase().includes(q) ||
       bill.doctor.name.toLowerCase().includes(q) ||
       bill.id.toLowerCase().includes(q) ||
       bill.clinic.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || bill.status.toLowerCase() === filterStatus.toLowerCase())
    );
  });

  const totalPages  = Math.ceil(filteredBilling.length / itemsPerPage);
  const startIndex  = (currentPage - 1) * itemsPerPage;
  const currentBilling = filteredBilling.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (String(status || '').toLowerCase()) {
      case 'paid':      return 'bg-green-100 text-green-800';
      case 'pending':   return 'bg-yellow-100 text-yellow-800';
      case 'overdue':   return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  /* ── Download as styled HTML invoice ── */
  const handleDownloadPDF = (bill) => {
    const html = generateMindSaidInvoiceHTML(bill);
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Invoice-${bill.id}-${bill.patient.name}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded — open in browser then Print → Save as PDF');
  };

  /* ── Edit ── */
  const handleEditClick = (bill) => {
    setSelectedBill(bill);
    setEditForm({ status: bill.status, amount: bill.amount });
    setShowEditModal(true);
  };

  const handleUpdateBilling = async () => {
    if (!selectedBill) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/invoices/${selectedBill.rawId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status: editForm.status, amount: editForm.amount })
      });
      const result = await res.json();
      if (result.success) { toast.success('Invoice updated'); setShowEditModal(false); fetchBillingRecords(); }
      else toast.error(result.message || 'Failed to update');
    } catch { toast.error('Failed to update invoice'); }
    finally { setIsUpdating(false); }
  };

  /* ── Delete ── */
  const handleDeleteClick    = (bill) => { setBillToDelete(bill); setShowDeleteConfirm(true); };
  const handleConfirmDelete  = async () => {
    if (!billToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/invoices/${billToDelete.rawId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const result = await res.json();
      if (result.success) { toast.success('Invoice deleted'); setShowDeleteConfirm(false); fetchBillingRecords(); }
      else toast.error(result.message || 'Failed to delete');
    } catch { toast.error('Failed to delete invoice'); }
    finally { setIsDeleting(false); setBillToDelete(null); }
  };

  /* ── Export CSV ── */
  const handleExport = () => {
    const csv = [
      ['Invoice ID', 'Patient', 'Doctor', 'Service', 'Amount', 'Status', 'Date'],
      ...filteredBilling.map(b => [b.id, b.patient.name, b.doctor.name, b.service, b.amount, b.status, b.date])
    ].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `Billing-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success('Records exported');
  };

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Billing Records</h1>
            <p className="text-gray-600">Manage patient billing and invoices</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              <FiDownload className="w-4 h-4" /><span>Export</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewBilling && onCreateNewBilling()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <FiPlus className="w-4 h-4" /><span>New Invoice</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span><span className="mx-2">›</span>
          <span>Financial</span><span className="mx-2">›</span>
          <span className="text-gray-800">Billing Records</span>
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search invoices, patients, or doctors..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <FiFilter className="w-4 h-4" /><span>Advanced Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading billing records...</p>
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="text-red-800">{error}</div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={fetchBillingRecords}
              className="flex items-center space-x-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm">
              <FiRefreshCw className="w-4 h-4" /><span>Retry</span>
            </motion.button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full table-fixed">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="w-12 px-3 py-3 text-left text-xs font-medium uppercase"><input type="checkbox" className="rounded" /></th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium uppercase">Invoice ID</th>
                  <th className="w-48 px-3 py-3 text-left text-xs font-medium uppercase">Patient</th>
                  <th className="w-40 px-3 py-3 text-left text-xs font-medium uppercase">Doctor</th>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase">Service</th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium uppercase">Amount</th>
                  <th className="w-24 px-3 py-3 text-left text-xs font-medium uppercase">Status</th>
                  <th className="w-28 px-3 py-3 text-left text-xs font-medium uppercase">Date</th>
                  <th className="w-32 px-3 py-3 text-left text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBilling.map((bill, idx) => (
                  <motion.tr key={bill.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                    onClick={() => { setSelectedBill(bill); setShowViewModal(true); }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                    <td className="px-3 py-3 text-sm font-medium text-blue-600 truncate">{bill.id}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600">{bill.patient.initials}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{bill.patient.name}</div>
                          <div className="text-xs text-gray-500 truncate">{bill.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center">
                        <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                          <span className="text-xs font-semibold text-green-600">{bill.doctor.initials}</span>
                        </div>
                        <span className="text-sm text-gray-900 truncate">{bill.doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900 truncate">{bill.service}</div>
                      <div className="text-xs text-gray-500 truncate">{bill.clinic}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900">₹{bill.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">₹{bill.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>{bill.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiCalendar className="w-4 h-4 mr-1 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{bill.date}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center space-x-1">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { setSelectedBill(bill); setShowViewModal(true); }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded" title="View Invoice">
                          <FiEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditClick(bill)}
                          className="text-green-600 hover:text-green-900 p-1 rounded" title="Edit">
                          <FiEdit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownloadPDF(bill)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded" title="Download Invoice">
                          <FiDownload className="w-4 h-4" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(bill)}
                          className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete">
                          <FiTrash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredBilling.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FiDollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No billing records found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredBilling.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500">
                {[5,10,25,50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBilling.length)} of {filteredBilling.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 text-sm border rounded ${currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </motion.div>
        )}


        {/* ══ VIEW INVOICE MODAL — MindSaid Design ══ */}
        {showViewModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">

              {/* Modal top bar */}
              <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBill.status)}`}>{selectedBill.status}</span>
                  <span className="text-sm text-gray-500">{selectedBill.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    onClick={() => handleDownloadPDF(selectedBill)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    <FiDownload className="w-4 h-4" /> Download Invoice
                  </motion.button>
                  <button onClick={() => setShowViewModal(false)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Invoice preview — same design as the screenshot */}
              <div className="p-8">
                <InvoicePreview bill={selectedBill} />
              </div>
            </motion.div>
          </div>
        )}


        {/* ══ EDIT MODAL ══ */}
        {showEditModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold text-white">Edit Invoice</h2>
                <button onClick={() => setShowEditModal(false)} className="text-white hover:text-gray-200"><FiX className="w-6 h-6" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                  <p className="text-gray-900 font-medium">{selectedBill.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    {['Pending','Paid','Overdue','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" value={editForm.amount} onChange={e => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleUpdateBilling} disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}


        {/* ══ DELETE CONFIRM ══ */}
        {showDeleteConfirm && billToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="bg-red-600 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
                <button onClick={() => setShowDeleteConfirm(false)} className="text-white hover:text-gray-200"><FiX className="w-6 h-6" /></button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">Are you sure you want to delete invoice <strong>{billToDelete.id}</strong>?</p>
                <p className="text-sm text-gray-500">Patient: {billToDelete.patient.name}<br/>Amount: ₹{billToDelete.amount?.toLocaleString()}</p>
                <p className="text-red-600 text-sm mt-4">This action cannot be undone.</p>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-xl">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                  {isDeleting ? 'Deleting...' : 'Delete Invoice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BillingRecords;