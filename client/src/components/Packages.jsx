import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiDownload,
  FiDollarSign
} from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'kivi_packages';

// Invoice-style header — edit these values to match your organisation
const ORG = {
  name: 'MindSaid Learning Centre',
  tagline: 'Learning This Ability',
  addressLines: [
    'D-207, Crystal Plaza,',
    'Opp. Infinity Mall, Link Road, Andheri (W),',
    'Mumbai, Maharashtra 400053',
    'India'
  ],
  contact: 'Mobile: +91 8928186952',
  website: 'www.mindsaidlearning.com'
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price || 0);
};

const formatPriceRaw = (price) => {
  return Number(price || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tools: [{ name: '', price: '' }]
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPackages(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load packages:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
      console.error('Failed to save packages:', e);
    }
  }, [packages]);

  const computedTotal = useMemo(() => {
    return formData.tools.reduce((sum, tool) => {
      return sum + (parseFloat(tool.price) || 0);
    }, 0);
  }, [formData.tools]);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', tools: [{ name: '', price: '' }] });
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      tools: pkg.tools.map(t => ({ name: t.name, price: String(t.price) }))
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ name: '', tools: [{ name: '', price: '' }] });
  };

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { name: '', price: '' }]
    }));
  };

  const removeTool = (index) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));
  };

  const updateTool = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map((tool, i) =>
        i === index ? { ...tool, [field]: value } : tool
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Package name is required');
      return;
    }

    const validTools = formData.tools.filter(
      t => t.name.trim() && parseFloat(t.price) > 0
    );

    if (validTools.length === 0) {
      toast.error('Add at least one valid tool with a price');
      return;
    }

    const sanitizedTools = validTools.map(t => ({
      name: t.name.trim(),
      price: parseFloat(t.price)
    }));

    const total = sanitizedTools.reduce((sum, t) => sum + t.price, 0);
    const now = new Date().toISOString();

    if (editingId) {
      setPackages(prev =>
        prev.map(pkg =>
          pkg.id === editingId
            ? { ...pkg, name: formData.name.trim(), tools: sanitizedTools, total, updatedAt: now }
            : pkg
        )
      );
      toast.success('Package updated');
    } else {
      setPackages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: formData.name.trim(),
          tools: sanitizedTools,
          total,
          createdAt: now,
          updatedAt: now
        }
      ]);
      toast.success('Package created');
    }

    closeModal();
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
    toast.success('Package deleted');
  };

  const downloadPDF = (pkg) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const rightEdge = pageWidth - 14;

    // Organisation details left
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    let y = 38;
    ORG.addressLines.forEach((line) => {
      doc.text(line, 14, y);
      y += 5;
    });
    doc.text(ORG.contact, 14, y);
    y += 5;
    doc.text(ORG.website, 14, y);

    // Title right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text('PACKAGE', rightEdge, 32, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text('Quotation', rightEdge, 39, { align: 'right' });

    // Package meta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Package: ${pkg.name}`, 14, 74);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(pkg.createdAt).toLocaleDateString('en-IN')}`, 14, 80);

    // Amount Due box
    const boxY = 68;
    const boxW = 80;
    const boxX = rightEdge - boxW;
    doc.setFillColor(240, 248, 255);
    doc.rect(boxX, boxY, boxW, 22, 'F');
    doc.setDrawColor(200, 220, 240);
    doc.rect(boxX, boxY, boxW, 22, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text('Amount Due (INR):', boxX + 5, boxY + 9);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${formatPriceRaw(pkg.total)}`, boxX + 5, boxY + 19);

    // Items table
    const body = pkg.tools.map((tool) => [
      tool.name,
      '1',
      `Rs. ${formatPriceRaw(tool.price)}`,
      `Rs. ${formatPriceRaw(tool.price)}`
    ]);

    doc.autoTable({
      startY: 90,
      head: [['Items', 'Quantity', 'Price', 'Amount']],
      body,
      foot: [['', '', 'Amount (INR):', `Rs. ${formatPriceRaw(pkg.total)}`]],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      footStyles: { fontStyle: 'bold', fillColor: [240, 253, 244], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      },
      styles: { fontSize: 10 }
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Powered by Kivi', pageWidth / 2, finalY, { align: 'center' });

    const cleanName = pkg.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    doc.save(`${cleanName}_package.pdf`);
    toast.success('PDF downloaded');
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
            <p className="text-gray-600">Create tool packages with auto-calculated pricing</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Package</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No packages found. Create one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Package</p>
                      <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(pkg.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Amount Due</p>
                      <div className="text-2xl font-bold text-gray-800">{formatPrice(pkg.total)}</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-blue-500 text-white">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold">Items</th>
                          <th className="text-center px-3 py-2 font-semibold w-16">Qty</th>
                          <th className="text-right px-3 py-2 font-semibold w-24">Price</th>
                          <th className="text-right px-3 py-2 font-semibold w-24">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pkg.tools.map((tool, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            <td className="px-3 py-2 text-gray-700">{tool.name}</td>
                            <td className="px-3 py-2 text-center text-gray-600">1</td>
                            <td className="px-3 py-2 text-right text-gray-600">{formatPrice(tool.price)}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800">{formatPrice(tool.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-green-50">
                        <tr>
                          <td className="px-3 py-2 font-bold text-gray-700" colSpan="3">Amount (INR)</td>
                          <td className="px-3 py-2 text-right font-bold text-green-600">{formatPrice(pkg.total)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className="flex items-center justify-end space-x-1 mt-4">
                    <button
                      onClick={() => openEdit(pkg)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadPDF(pkg)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <FiPackage className="w-5 h-5" />
                  <span>{editingId ? 'Edit Package' : 'Add New Package'}</span>
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Comprehensive Assessment"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Tools *</label>
                    <button
                      type="button"
                      onClick={addTool}
                      className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-sm transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Tool</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.tools.map((tool, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateTool(index, 'name', e.target.value)}
                          placeholder="Tool name"
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="relative w-36">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                            <FiDollarSign className="w-4 h-4" />
                          </span>
                          <input
                            type="number"
                            value={tool.price}
                            onChange={(e) => updateTool(index, 'price', e.target.value)}
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        {formData.tools.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTool(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Package Price</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(computedTotal)}</span>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{editingId ? 'Update Package' : 'Create Package'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Packages;
