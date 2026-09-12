import logoUrl from '../assets/mindsaid-logo.png';

export const ORG = {
  name: 'MindSaid Learning Centre',
  addressLines: [
    'D-207, Crystal Plaza,',
    'Opp. Infinity Mall, Link Road, Andheri (W),',
    'Mumbai, Maharashtra 400053',
    'India'
  ],
  phone: 'Phone: +022 49742555',
  mobile: 'Mobile: +91 8928186952',
  website: 'www.mindsaidlearning.com'
};

export const PAYMENT_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Cheque'];
export const PAYMENT_STATUSES = ['PAID', 'PART PAID', 'DUE'];

export const DEFAULT_NOTES = [
  "Fees once paid are subject to the centre's cancellation/refund policy.",
  'Reports are released after completion of the assessment process and settlement of applicable fees.',
  'Please retain this invoice/receipt for your records.',
  'For any billing clarification, please contact MindSaid Learning Centre.'
];

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price || 0);

export const formatPriceRaw = (price) =>
  Number(price || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

export const formatDateLong = (d) => {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const generateInvoiceNo = () =>
  `msl/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Date.now().toString().slice(-4)}`;

let cachedLogo = null;

export const getLogoDataUrl = () =>
  new Promise((resolve) => {
    if (cachedLogo) return resolve(cachedLogo);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        cachedLogo = canvas.toDataURL('image/png');
        resolve(cachedLogo);
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });

// Shared invoice HTML — used for both in-app preview and print/PDF window.
export const buildInvoiceHtml = (inv, logoData, { print = false } = {}) => {
  const itemsRows = (inv.items || []).map(t => `
      <tr>
        <td>
          <div class="item-name">${t.name || ''}</div>
          ${t.description ? `<div class="item-description">${t.description}</div>` : ''}
        </td>
        <td style="text-align:center;">${t.qty ?? 1}</td>
        <td style="text-align:right;">₹${formatPriceRaw(t.price)}</td>
        <td style="text-align:right;">₹${formatPriceRaw(t.price * (t.qty ?? 1))}</td>
      </tr>`).join('');

  const notesLines = (inv.notes || DEFAULT_NOTES.join('\n'))
    .split('\n')
    .filter(l => l.trim())
    .map(l => `<p>${l.replace(/^•\s*/, '')}</p>`)
    .join('');

  const paymentLine = inv.amountReceived > 0
    ? `<tr>
          <td>Payment on ${formatDateLong(inv.paymentDate || inv.invoiceDate)} using ${(inv.paymentMode || 'cash').toLowerCase()}:</td>
          <td>₹${formatPriceRaw(inv.amountReceived)}</td>
        </tr>`
    : '';

  const discountLine = inv.discount > 0
    ? `<tr>
          <td>Discount:</td>
          <td>- ₹${formatPriceRaw(inv.discount)}</td>
        </tr>`
    : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${inv.invoiceNo || ''}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #2a2a2a; background: ${print ? '#fff' : '#f3f4f6'}; }
    .page { max-width: 820px; margin: ${print ? '0' : '24px'} auto; background: #fff; ${print ? '' : 'box-shadow: 0 2px 12px rgba(0,0,0,0.08);'} padding: 48px 56px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; }
    .header img { height: 64px; }
    .header-right { text-align: right; }
    .header-right h1 { font-size: 40px; font-weight: 400; letter-spacing: 2px; color: #1a1a2e; }
    .org { margin-top: 10px; font-size: 12px; color: #333; line-height: 1.55; }
    .divider { border: none; border-top: 1px solid #ddd; margin: 26px 0; }
    .meta-row { display: flex; justify-content: space-between; align-items: flex-start; }
    .billto-label { font-size: 10px; letter-spacing: 1px; color: #999; font-weight: 600; }
    .billto-name { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-top: 4px; }
    .billto-sub { font-size: 11.5px; color: #555; margin-top: 2px; }
    .invoice-meta { font-size: 12.5px; }
    .invoice-meta .row { display: flex; justify-content: flex-end; gap: 18px; margin-bottom: 5px; }
    .invoice-meta .lbl { font-weight: 600; color: #333; min-width: 110px; text-align: right; }
    .invoice-meta .val { min-width: 130px; text-align: right; color: #333; }
    .due-box { display: inline-block; background: #f1f3f6; padding: 4px 14px; font-weight: 600; margin-top: 4px; }
    table.items { width: 100%; border-collapse: collapse; margin-top: 28px; }
    table.items thead th { background: #25a5dc; color: #fff; font-weight: 500; font-size: 12.5px; padding: 10px 14px; text-align: left; }
    table.items thead th.qty { text-align: center; }
    table.items thead th.num { text-align: right; }
    table.items tbody td { padding: 12px 14px; border-bottom: 1px solid #eee; vertical-align: top; font-size: 12.5px; }
    .item-name { font-weight: 600; color: #222; }
    .item-description { font-size: 11px; color: #666; margin-top: 2px; }
    .totals { width: 320px; margin-left: auto; margin-top: 22px; font-size: 12.5px; }
    .totals table { width: 100%; border-collapse: collapse; }
    .totals td { padding: 5px 0; }
    .totals td:last-child { text-align: right; }
    .totals .grand { border-top: 1px solid #ddd; font-weight: 700; }
    .totals .grand td { padding-top: 10px; }
    .notes { margin-top: 34px; }
    .notes h4 { font-size: 12px; font-weight: 700; color: #333; margin-bottom: 4px; }
    .notes p { font-size: 11.5px; color: #555; }
    .powered { text-align: center; margin-top: 80px; font-size: 12px; color: #1e3a8a; font-weight: 600; }
    .print-btn { position: fixed; bottom: 28px; right: 28px; background: #25a5dc; color: #fff; border: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
    @media print { .no-print { display: none; } .page { padding: 24px 32px; } }
  </style>
</head>
<body>
  ${print ? '<button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>' : ''}
  <div class="page">
    <div class="header">
      <img src="${logoData || ''}" alt="MindSaid Learning Centre" />
      <div class="header-right">
        <h1>INVOICE</h1>
        <div class="org">
          <strong>MindSaid Learning</strong><br>
          ${ORG.addressLines.join('<br>')}<br><br>
          ${ORG.phone}<br>
          ${ORG.mobile}<br>
          ${ORG.website}
        </div>
      </div>
    </div>
    <hr class="divider">
    <div class="meta-row">
      <div>
        <div class="billto-label">BILL TO</div>
        <div class="billto-name">${inv.billTo || '-'}</div>
        ${inv.studentName ? `<div class="billto-sub">Student: ${inv.studentName}${inv.gradeAge ? ` (${inv.gradeAge})` : ''}</div>` : ''}
        ${inv.contact ? `<div class="billto-sub">${inv.contact}</div>` : ''}
      </div>
      <div class="invoice-meta">
        <div class="row"><span class="lbl">Invoice Number:</span><span class="val">${inv.invoiceNo || '-'}</span></div>
        <div class="row"><span class="lbl">Invoice Date:</span><span class="val">${formatDateLong(inv.invoiceDate)}</span></div>
        <div class="row"><span class="lbl">Payment Due:</span><span class="val">${formatDateLong(inv.paymentDue)}</span></div>
        <div class="row"><span class="due-box">Amount Due (INR): &nbsp;₹${formatPriceRaw(inv.balanceDue)}</span></div>
      </div>
    </div>
    <table class="items">
      <thead>
        <tr>
          <th style="width:50%;">Items</th>
          <th class="qty" style="width:15%;">Quantity</th>
          <th class="num" style="width:17%;">Price</th>
          <th class="num" style="width:18%;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>
    <div class="totals">
      <table>
        <tr><td><strong>Total:</strong></td><td>₹${formatPriceRaw(inv.subtotal)}</td></tr>
        ${discountLine}
        ${paymentLine}
        <tr class="grand"><td>Amount Due (INR):</td><td>₹${formatPriceRaw(inv.balanceDue)}</td></tr>
      </table>
    </div>
    <div class="notes">
      <h4>Notes / Terms</h4>
      ${notesLines}
    </div>
    <div class="powered">Powered by MindSaid Learning</div>
  </div>
</body>
</html>`;
};

export const openInvoicePrintWindow = async (inv) => {
  const logoData = await getLogoDataUrl();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  printWindow.document.write(buildInvoiceHtml(inv, logoData, { print: true }));
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 400);
  return true;
};

// Simple package price list (not an invoice) — used for package PDF export.
export const buildPackageHtml = (pkg, logoData, { print = false } = {}) => {
  const rows = (pkg.tools || []).map(t => `
      <tr>
        <td>${t.name || ''}</td>
        <td style="text-align:right;">₹${formatPriceRaw(t.price)}</td>
      </tr>`).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Package - ${pkg.name || ''}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #2a2a2a; background: ${print ? '#fff' : '#f3f4f6'}; }
    .page { max-width: 720px; margin: ${print ? '0' : '24px'} auto; background: #fff; ${print ? '' : 'box-shadow: 0 2px 12px rgba(0,0,0,0.08);'} padding: 48px 56px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; }
    .header img { height: 60px; }
    .header h1 { font-size: 32px; font-weight: 400; letter-spacing: 2px; color: #1a1a2e; }
    .divider { border: none; border-top: 1px solid #ddd; margin: 26px 0; }
    .pkg-name { font-size: 20px; font-weight: 700; color: #1a1a2e; }
    .pkg-sub { font-size: 11px; color: #888; margin-top: 4px; }
    table.items { width: 100%; border-collapse: collapse; margin-top: 28px; }
    table.items thead th { background: #25a5dc; color: #fff; font-weight: 500; font-size: 12.5px; padding: 10px 14px; text-align: left; }
    table.items thead th.num { text-align: right; }
    table.items tbody td { padding: 11px 14px; border-bottom: 1px solid #eee; font-size: 13px; font-weight: 600; color: #222; }
    .total-row { display: flex; justify-content: space-between; margin-top: 20px; padding: 14px; background: #f0fdf4; border-radius: 6px; }
    .total-row .lbl { font-weight: 700; color: #333; }
    .total-row .val { font-weight: 700; color: #15803d; font-size: 16px; }
    .powered { text-align: center; margin-top: 80px; font-size: 12px; color: #1e3a8a; font-weight: 600; }
    .print-btn { position: fixed; bottom: 28px; right: 28px; background: #25a5dc; color: #fff; border: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
    @media print { .no-print { display: none; } .page { padding: 24px 32px; } }
  </style>
</head>
<body>
  ${print ? '<button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>' : ''}
  <div class="page">
    <div class="header">
      <img src="${logoData || ''}" alt="MindSaid Learning Centre" />
      <h1>PACKAGE</h1>
    </div>
    <hr class="divider">
    <div class="pkg-name">${pkg.name || '-'}</div>
    <div class="pkg-sub">${(pkg.tools || []).length} tool(s) · Created ${pkg.createdAt ? formatDateLong(pkg.createdAt) : '-'}</div>
    <table class="items">
      <thead>
        <tr>
          <th>Items</th>
          <th class="num" style="width:140px;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="total-row">
      <span class="lbl">Total Package Price</span>
      <span class="val">₹${formatPriceRaw(pkg.total)}</span>
    </div>
    <div class="powered">Powered by MindSaid Learning</div>
  </div>
</body>
</html>`;
};

export const openPackagePrintWindow = async (pkg) => {
  const logoData = await getLogoDataUrl();
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;
  printWindow.document.write(buildPackageHtml(pkg, logoData, { print: true }));
  printWindow.document.close();
  setTimeout(() => printWindow.print(), 400);
  return true;
};
