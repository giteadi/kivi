import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiDownload,
  FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  buildInvoiceHtml,
  openInvoicePrintWindow,
  getLogoDataUrl,
  generateInvoiceNo,
  formatPrice,
  PAYMENT_MODES,
  PAYMENT_STATUSES,
  DEFAULT_NOTES
} from '../utils/invoice';

const PACKAGES_KEY = 'kivi_packages';
const INVOICES_KEY = 'kivi_invoices';

const emptyInvoice = () => ({
  billTo: '',
  studentName: '',
  gradeAge: '',
  contact: '',
  invoiceNo: generateInvoiceNo(),
  invoiceDate: new Date().toISOString().split('T')[0],
  paymentDue: new Date().toISOString().split('T')[0],
  discount: '',
  amountReceived: '',
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMode: 'Cash',
  transactionRef: '',
  status: 'PAID',
  notes: DEFAULT_NOTES.join('\n'),
  items: []
});

const Invoices = () => {
  const [packages, setPackages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(emptyInvoice());
  const [selectedPackageId, setSelectedPackageId] = useState('');
  const [logoData, setLogoData] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [viewingHtml, setViewingHtml] = useState('');

  useEffect(() => {
    try {
      const pk = localStorage.getItem(PACKAGES_KEY);
      if (pk) setPackages(JSON.parse(pk));
      const iv = localStorage.getItem(INVOICES_KEY);
      if (iv) setInvoices(JSON.parse(iv));
    } catch (e) {
      console.error('Failed to load data:', e);
    }
    getLogoDataUrl().then(setLogoData);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices:', e);
    }
  }, [invoices]);

  const subtotal = useMemo(
    () => form.items.reduce((s, t) => s + (parseFloat(t.price) || 0) * (parseFloat(t.qty) || 1), 0),
    [form.items]
  );
  const discountNum = parseFloat(form.discount) || 0;
  const receivedNum = parseFloat(form.amountReceived) || 0;
  const total = subtotal - discountNum;
  const balanceDue = Math.max(0, total - receivedNum);

  const setField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const applyPackage = (packageId) => {
    setSelectedPackageId(packageId);
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;
    const items = (pkg.tools || []).map(t => ({
      name: t.name,
      description: t.description || '',
      qty: 1,
      price: t.price
    }));
    setForm(prev => ({ ...prev, items: [...prev.items, ...items] }));
    toast.success(`"${pkg.name}" items added to invoice`);
    setSelectedPackageId('');
  };

  const addItem = () =>
    setForm(prev => ({ ...prev, items: [...prev.items, { name: '', qty: 1, price: '' }] }));

  const removeItem = (index) =>
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));

  const updateItem = (index, field, value) =>
    setForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));

  const buildInvoiceRecord = () => ({
    id: Date.now().toString(),
    billTo: form.billTo.trim(),
    studentName: form.studentName.trim(),
    gradeAge: form.gradeAge.trim(),
    contact: form.contact.trim(),
    invoiceNo: form.invoiceNo.trim(),
    invoiceDate: form.invoiceDate,
    paymentDue: form.paymentDue,
    discount: discountNum,
    amountReceived: receivedNum,
    paymentDate: form.paymentDate,
    paymentMode: form.paymentMode,
    transactionRef: form.transactionRef.trim(),
    status: form.status,
    notes: form.notes,
    items: form.items
      .filter(t => t.name.trim() && parseFloat(t.price) > 0)
      .map(t => ({
        name: t.name.trim(),
        description: (t.description || '').trim(),
        qty: parseFloat(t.qty) || 1,
        price: parseFloat(t.price)
      })),
    subtotal,
    total,
    balanceDue,
    createdAt: new Date().toISOString()
  });

  const validate = (record) => {
    if (!record.billTo) { toast.error('Bill To is required'); return false; }
    if (record.items.length === 0) { toast.error('Add at least one item (select a package or add manually)'); return false; }
    return true;
  };

  const handleGenerate = async () => {
    const record = buildInvoiceRecord();
    if (!validate(record)) return;
    const ok = await openInvoicePrintWindow(record);
    if (!ok) {
      toast.error('Popup blocked — allow popups to view the invoice');
      return;
    }
    setInvoices(prev => [...prev, record]);
    toast.success('Invoice generated');
    setForm(emptyInvoice());
  };

  const handleSave = () => {
    const record = buildInvoiceRecord();
    if (!validate(record)) return;
    setInvoices(prev => [...prev, record]);
    toast.success('Invoice saved');
    setForm(emptyInvoice());
  };

  const handleDeleteInvoice = (id) => {
    if (!confirm('Delete this invoice?')) return;
    setInvoices(prev => prev.filter(i => i.id !== id));
    toast.success('Invoice deleted');
  };

  const openView = (inv) => {
    setViewingInvoice(inv);
    setViewingHtml(buildInvoiceHtml(inv, logoData));
  };

  const reprintInvoice = async (inv) => {
    const ok = await openInvoicePrintWindow(inv);
    if (!ok) toast.error('Popup blocked — allow popups');
  };

  const inputCls = 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm';

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Invoice</h1>
          <p className="text-gray-600">Select a package or add tools — invoice generates automatically</p>
        </div>

        {/* Invoice form */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
            <FiFileText className="w-5 h-5 text-blue-600" />
            <span>New Invoice</span>
          </h2>

          {/* Package selector */}
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <FiPackage className="w-4 h-4" />
              <span>Add from Package</span>
            </label>
            <select
              value={selectedPackageId}
              onChange={(e) => applyPackage(e.target.value)}
              className={inputCls}
            >
              <option value="">— Select a package to add its tools —</option>
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({formatPrice(pkg.total)})
                </option>
              ))}
            </select>
            {packages.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">
                No packages yet — create them in the Packages screen first.
              </p>
            )}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-800">Items *</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-sm transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {form.items.length === 0 ? (
              <div className="border border-dashed rounded-lg p-6 text-center text-gray-400 text-sm">
                Select a package above or add items manually
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-2 bg-sky-500 text-white text-xs font-semibold px-3 py-2">
                  <div className="col-span-8">Service / Assessment</div>
                  <div className="col-span-3 text-right">Price (₹)</div>
                  <div className="col-span-1"></div>
                </div>
                {form.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-3 py-2 border-b last:border-b-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Service name"
                      className="md:col-span-8 px-2 py-1.5 border rounded focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      min="0"
                      className="md:col-span-3 px-2 py-1.5 border rounded text-right focus:ring-1 focus:ring-blue-500 text-sm"
                    />
                    <div className="md:col-span-1 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bill to + invoice meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bill To / Parent / Guardian *</label>
              <input type="text" value={form.billTo} onChange={(e) => setField('billTo', e.target.value)} placeholder="e.g., Mrs. Chamaria" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student / Client</label>
              <input type="text" value={form.studentName} onChange={(e) => setField('studentName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade / Age</label>
              <input type="text" value={form.gradeAge} onChange={(e) => setField('gradeAge', e.target.value)} placeholder="e.g., Grade 4 / 9 yrs" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number / Email</label>
              <input type="text" value={form.contact} onChange={(e) => setField('contact', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No.</label>
              <input type="text" value={form.invoiceNo} onChange={(e) => setField('invoiceNo', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
              <input type="date" value={form.invoiceDate} onChange={(e) => setField('invoiceDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Due</label>
              <input type="date" value={form.paymentDue} onChange={(e) => setField('paymentDue', e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Totals + payment */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
              <div className="text-lg font-bold text-gray-800">{formatPrice(subtotal)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discount (₹)</label>
              <input type="number" value={form.discount} onChange={(e) => setField('discount', e.target.value)} min="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount Received (₹)</label>
              <input type="number" value={form.amountReceived} onChange={(e) => setField('amountReceived', e.target.value)} min="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Balance Due</label>
              <div className="text-lg font-bold text-green-600">{formatPrice(balanceDue)}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Date</label>
              <input type="date" value={form.paymentDate} onChange={(e) => setField('paymentDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode</label>
              <select value={form.paymentMode} onChange={(e) => setField('paymentMode', e.target.value)} className={inputCls}>
                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Transaction / Ref No.</label>
              <input type="text" value={form.transactionRef} onChange={(e) => setField('transactionRef', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setField('status', e.target.value)} className={inputCls}>
                {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Terms</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Save Invoice
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Generate Invoice / PDF</span>
            </button>
          </div>
        </div>

        {/* Saved invoices */}
        {invoices.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Saved Invoices</h2>
            <div className="space-y-3">
              {invoices.slice().reverse().map(inv => (
                <div
                  key={inv.id}
                  onClick={() => openView(inv)}
                  className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="font-bold text-gray-800">{inv.billTo}</div>
                    <div className="text-xs text-gray-500">
                      {inv.invoiceNo} · {inv.items.length} item{inv.items.length !== 1 ? 's' : ''} · {new Date(inv.invoiceDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      inv.status === 'PART PAID' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{inv.status}</span>
                    <span className="font-bold text-gray-800">{formatPrice(inv.total)}</span>
                    <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => reprintInvoice(inv)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(inv.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice preview modal */}
      <AnimatePresence>
        {viewingInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setViewingInvoice(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  {viewingInvoice.invoiceNo} — Invoice Preview
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => reprintInvoice(viewingInvoice)}
                    className="flex items-center space-x-1 px-3 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <iframe
                title="Invoice preview"
                srcDoc={viewingHtml}
                className="w-full flex-1 border-0"
                style={{ minHeight: '70vh' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Invoices;
