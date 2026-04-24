import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTool,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiSearch,
  FiFilter,
  FiArrowLeft
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssessmentToolsManagement = ({ onBack }) => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    assessment_id: '',
    name: '',
    category: '',
    price: '',
    description: ''
  });

  const categories = [
    'Screening',
    'Cognitive',
    'Achievement',
    'Handwriting',
    'ADHD',
    'Autism',
    'Adaptive Behavior',
    'Personality',
    'Career',
    'Anxiety',
    'Behavior',
    'Executive Function',
    'Social Skills'
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await api.request('/individual-assessments');
      if (response.success) {
        setTools(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      toast.error('Failed to load assessment tools');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tool = null) => {
    if (tool) {
      setEditingTool(tool);
      setFormData({
        assessment_id: tool.assessment_id || '',
        name: tool.name || '',
        category: tool.category || '',
        price: tool.price || '',
        description: tool.description || ''
      });
    } else {
      setEditingTool(null);
      setFormData({
        assessment_id: '',
        name: '',
        category: '',
        price: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTool(null);
    setFormData({
      assessment_id: '',
      name: '',
      category: '',
      price: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };

      let response;
      if (editingTool) {
        response = await api.request(`/individual-assessments/${editingTool.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        response = await api.request('/individual-assessments', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      if (response.success) {
        toast.success(editingTool ? 'Tool updated successfully' : 'Tool created successfully');
        fetchTools();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving tool:', error);
      toast.error('Failed to save tool');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment tool?')) return;

    try {
      const response = await api.request(`/individual-assessments/${id}`, {
        method: 'DELETE'
      });

      if (response.success) {
        toast.success('Tool deleted successfully');
        fetchTools();
      }
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast.error('Failed to delete tool');
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.assessment_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Group tools by category
  const groupedTools = filteredTools.reduce((acc, tool) => {
    const category = tool.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {});

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Assessment Tools</h1>
            <p className="text-gray-600">Manage assessment tools and pricing</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Tool</span>
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
              placeholder="Search tools..."
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{tools.length}</div>
            <div className="text-sm text-gray-600">Total Tools</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">{Object.keys(groupedTools).length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">{filteredTools.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {tools.filter(t => t.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Tools</div>
          </div>
        </div>

        {/* Tools by Category */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading tools...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTools).map(([category, categoryTools]) => (
              <div key={category} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <FiTool className="w-5 h-5" />
                    <span>{category}</span>
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                      {categoryTools.length}
                    </span>
                  </h2>
                </div>

                <div className="divide-y">
                  {categoryTools.map((tool) => (
                    <div key={tool.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {tool.assessment_id}
                            </span>
                            {!tool.is_active && (
                              <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          {tool.description && (
                            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {formatPrice(tool.price)}
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleOpenModal(tool)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tool.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredTools.length === 0 && (
          <div className="text-center py-12">
            <FiTool className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No tools found</p>
          </div>
        )}

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
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <FiTool className="w-5 h-5" />
                  <span>{editingTool ? 'Edit Tool' : 'Add New Tool'}</span>
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Assessment ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assessment_id}
                    onChange={(e) => setFormData({ ...formData, assessment_id: e.target.value })}
                    placeholder="e.g., wisc-5"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={editingTool} // Don't allow changing ID when editing
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., WISC-5"
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
                      placeholder="5500"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the tool..."
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
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
                    <span>{editingTool ? 'Update Tool' : 'Create Tool'}</span>
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

export default AssessmentToolsManagement;
