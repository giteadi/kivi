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
  FiChevronLeft
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import {
  openPackagePrintWindow,
  formatPrice
} from '../utils/invoice';

const STORAGE_KEY = 'kivi_packages';

const emptyForm = () => ({
  name: '',
  tools: [{ name: '', price: '' }]
});

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);
  const [formData, setFormData] = useState(emptyForm());

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

  const computedTotal = useMemo(
    () => formData.tools.reduce((sum, t) => sum + (parseFloat(t.price) || 0), 0),
    [formData.tools]
  );

  const openAdd = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setShowModal(true);
  };

  const openEdit = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name || '',
      tools: (pkg.tools || []).map(t => ({
        name: t.name,
        price: String(t.price)
      }))
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm());
  };

  const addTool = () =>
    setFormData(prev => ({
      ...prev,
      tools: [...prev.tools, { name: '', price: '' }]
    }));

  const removeTool = (index) =>
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index)
    }));

  const updateTool = (index, field, value) =>
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.map((tool, i) =>
        i === index ? { ...tool, [field]: value } : tool
      )
    }));

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

    const total = sanitizedTools.reduce((s, t) => s + t.price, 0);
    const now = new Date().toISOString();

    if (editingId) {
      setPackages(prev =>
        prev.map(pkg =>
          pkg.id === editingId
            ? { ...pkg, name: formData.name.trim(), tools: sanitizedTools, total, subtotal: total, balanceDue: total, updatedAt: now }
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
          subtotal: total,
          balanceDue: total,
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

  const downloadPDF = async (pkg) => {
    const ok = await openPackagePrintWindow(pkg);
    if (ok) {
      toast.success('Package opened — save as PDF from the print dialog');
    } else {
      toast.error('Popup blocked — allow popups to download');
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
            <p className="text-gray-600">Package templates — tools + costing (use them when creating invoices)</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setViewingPackage(pkg)}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              >
                <div className="px-5 pt-5 pb-3 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Package Template</p>
                      <h3 className="text-base font-bold text-gray-800">{pkg.name}</h3>
                      <p className="text-[11px] text-gray-400">
                        {pkg.tools?.length || 0} tool{(pkg.tools?.length || 0) !== 1 ? 's' : ''}
                        {pkg.createdAt ? ` · ${new Date(pkg.createdAt).toLocaleDateString('en-IN')}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total</p>
                      <div className="text-xl font-bold text-gray-900">{formatPrice(pkg.total)}</div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-sky-500 text-white">
                        <th className="text-left px-2 py-1.5 font-semibold rounded-tl">Items</th>
                        <th className="text-right px-2 py-1.5 font-semibold w-24 rounded-tr">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(pkg.tools || []).slice(0, 4).map((tool, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="px-2 py-1.5 font-medium text-gray-800">{tool.name}</td>
                          <td className="px-2 py-1.5 text-right text-gray-800">{formatPrice(tool.price)}</td>
                        </tr>
                      ))}
                      {(pkg.tools?.length || 0) > 4 && (
                        <tr>
                          <td colSpan="2" className="px-2 py-1 text-[10px] text-gray-400">
                            +{pkg.tools.length - 4} more
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="bg-green-50">
                        <td className="px-2 py-1.5 font-bold text-gray-700">Total</td>
                        <td className="px-2 py-1.5 text-right font-bold text-green-700">{formatPrice(pkg.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="px-5 pb-4 flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
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
                    className="flex items-center space-x-1 px-3 py-1.5 text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-xs font-medium"
                    title="Download PDF"
                  >
                    <FiDownload className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Package detail screen — opens on card click */}
      <AnimatePresence>
        {viewingPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewingPackage(null)}
                  className="text-white/80 hover:text-white flex items-center gap-2"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  <span className="text-sm">Back</span>
                </button>
                <div className="h-6 w-px bg-white/30" />
                <div className="flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Package Details</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setViewingPackage(null); openEdit(viewingPackage); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this package?')) {
                      setPackages(prev => prev.filter(p => p.id !== viewingPackage.id));
                      toast.success('Package deleted');
                      setViewingPackage(null);
                    }
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-red-500/30 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => downloadPDF(viewingPackage)}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 flex items-center gap-2"
                >
                  <FiDownload className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-w-5xl mx-auto p-6 space-y-6">
              {/* Summary card */}
              <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center">
                    <FiPackage className="w-7 h-7 text-sky-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{viewingPackage.name}</h1>
                    <p className="text-sm text-gray-500">
                      {viewingPackage.tools?.length || 0} tool{(viewingPackage.tools?.length || 0) !== 1 ? 's' : ''}
                      {viewingPackage.createdAt ? ` · Created ${new Date(viewingPackage.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Total Price</p>
                  <p className="text-3xl font-bold text-green-600">{formatPrice(viewingPackage.total)}</p>
                </div>
              </div>

              {/* Tools table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-bold text-gray-800">Tools / Services Included</h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-sky-500 text-white">
                      <th className="text-left px-6 py-3 font-semibold w-12">#</th>
                      <th className="text-left px-6 py-3 font-semibold">Tool / Service</th>
                      <th className="text-right px-6 py-3 font-semibold w-40">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(viewingPackage.tools || []).map((tool, idx) => (
                      <tr key={idx} className="border-b border-gray-100 last:border-b-0">
                        <td className="px-6 py-3.5 text-gray-400">{idx + 1}</td>
                        <td className="px-6 py-3.5 font-medium text-gray-800">{tool.name}</td>
                        <td className="px-6 py-3.5 text-right font-medium text-gray-800">{formatPrice(tool.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-50">
                      <td colSpan="2" className="px-6 py-4 font-bold text-gray-700">Total Package Price</td>
                      <td className="px-6 py-4 text-right font-bold text-green-700 text-lg">
                        {formatPrice(viewingPackage.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Edit package modal */}
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <FiPackage className="w-5 h-5" />
                  <span>{editingId ? 'Edit Package' : 'New Package'}</span>
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Psycho-educational Testing"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-800">TOOLS / SERVICES *</label>
                    <button
                      type="button"
                      onClick={addTool}
                      className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg text-sm transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Tool</span>
                    </button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-2 bg-sky-500 text-white text-xs font-semibold px-3 py-2">
                      <div className="col-span-8">Tool / Service</div>
                      <div className="col-span-3 text-right">Price (₹)</div>
                      <div className="col-span-1"></div>
                    </div>
                    {formData.tools.map((tool, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-3 py-2 border-b last:border-b-0 bg-white">
                        <input
                          type="text"
                          value={tool.name}
                          onChange={(e) => updateTool(index, 'name', e.target.value)}
                          placeholder="Tool name"
                          className="md:col-span-8 px-2 py-1.5 border rounded focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          value={tool.price}
                          onChange={(e) => updateTool(index, 'price', e.target.value)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="md:col-span-3 px-2 py-1.5 border rounded text-right focus:ring-1 focus:ring-blue-500"
                        />
                        <div className="md:col-span-1 flex items-center justify-end">
                          {formData.tools.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTool(index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Package Price</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(computedTotal)}</span>
                </div>

                <div className="flex space-x-3 pt-2">
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
