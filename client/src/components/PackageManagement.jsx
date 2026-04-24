import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    package_id: '',
    name: '',
    category: '',
    price: '',
    age_range: '',
    description: '',
    includes: ['']
  });

  const categories = [
    'PE Assessment',
    'Therapy',
    'Specialized',
    'Early Childhood',
    'Adolescent',
    'Adult'
  ];

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.request('/assessment-packages');
      if (response.success) {
        setPackages(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        package_id: pkg.package_id || '',
        name: pkg.name || '',
        category: pkg.category || '',
        price: pkg.price || '',
        age_range: pkg.age_range || '',
        description: pkg.description || '',
        includes: pkg.includes || ['']
      });
    } else {
      setEditingPackage(null);
      setFormData({
        package_id: '',
        name: '',
        category: '',
        price: '',
        age_range: '',
        description: '',
        includes: ['']
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(null);
    setFormData({
      package_id: '',
      name: '',
      category: '',
      price: '',
      age_range: '',
      description: '',
      includes: ['']
    });
  };

  const handleAddInclude = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const handleRemoveInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
  };

  const handleIncludeChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        includes: formData.includes.filter(item => item.trim() !== ''),
        price: parseFloat(formData.price)
      };

      let response;
      if (editingPackage) {
        response = await api.request(`/assessment-packages/${editingPackage.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        response = await api.request('/assessment-packages', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      if (response.success) {
        toast.success(editingPackage ? 'Package updated successfully' : 'Package created successfully');
        fetchPackages();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await api.request(`/assessment-packages/${id}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Package deleted successfully');
        fetchPackages();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Assessment Packages</h1>
            <p className="text-gray-600">Manage assessment packages and pricing</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Package</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{pkg.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        pkg.category === 'Therapy' ? 'bg-emerald-100 text-emerald-700' :
                        pkg.category === 'PE Assessment' ? 'bg-purple-100 text-purple-700' :
                        pkg.category === 'Specialized' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {pkg.category}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenModal(pkg)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-green-600">
                      {formatPrice(pkg.price)}
                    </div>
                    {pkg.age_range && (
                      <p className="text-sm text-gray-500 mt-1">{pkg.age_range}</p>
                    )}
                  </div>

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  )}

                  {/* Includes */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Includes:</p>
                      <div className="space-y-1">
                        {pkg.includes.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span className="text-xs text-gray-600">{item}</span>
                          </div>
                        ))}
                        {pkg.includes.length > 3 && (
                          <p className="text-xs text-gray-500 ml-5">+{pkg.includes.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status */}
                  <div className="mt-4 pt-4 border-t">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No packages found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
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
                  <span>{editingPackage ? 'Edit Package' : 'Add New Package'}</span>
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Package ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.package_id}
                    onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                    placeholder="e.g., PE-BASIC"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Comprehensive Assessment"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="18500"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Range
                  </label>
                  <input
                    type="text"
                    value={formData.age_range}
                    onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                    placeholder="e.g., 6-16 years"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the package..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Includes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's Included
                  </label>
                  <div className="space-y-2">
                    {formData.includes.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleIncludeChange(index, e.target.value)}
                          placeholder="e.g., WISC-IV Assessment"
                          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.includes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveInclude(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddInclude}
                      className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{editingPackage ? 'Update Package' : 'Create Package'}</span>
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

export default PackageManagement;
