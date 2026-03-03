import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiFileText, FiCopy } from 'react-icons/fi';
import { useState } from 'react';

const EncounterTemplates = ({ onCreateTemplate, onEditTemplate, onViewTemplate, onDuplicateTemplate, onDeleteTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'General Consultation Template',
      description: 'Standard template for general medical consultations',
      category: 'General',
      createdBy: 'Dr. Smith',
      createdDate: '2026-01-15',
      usageCount: 45,
      sections: ['Patient History', 'Physical Examination', 'Diagnosis', 'Treatment Plan']
    },
    {
      id: 2,
      name: 'Emergency Visit Template',
      description: 'Template for emergency department visits',
      category: 'Emergency',
      createdBy: 'Dr. Johnson',
      createdDate: '2026-01-10',
      usageCount: 23,
      sections: ['Chief Complaint', 'Vital Signs', 'Assessment', 'Immediate Care']
    },
    {
      id: 3,
      name: 'Follow-up Visit Template',
      description: 'Template for patient follow-up appointments',
      category: 'Follow-up',
      createdBy: 'Dr. Wilson',
      createdDate: '2026-01-08',
      usageCount: 67,
      sections: ['Previous Treatment Review', 'Current Status', 'Adjustments', 'Next Steps']
    }
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDeleteTemplate(templateToDelete);
    setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
    setShowDeleteModal(false);
    setTemplateToDelete(null);
  };

  const handleDuplicateTemplate = (template) => {
    onDuplicateTemplate(template);
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  const handleViewTemplate = (template) => {
    onViewTemplate(template);
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">All Encounter Template List</h1>
            <p className="text-gray-600">Create and manage encounter templates</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateTemplate}
            className="flex items-center space-x-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Template</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Encounter Template List</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">All Encounter Templates</span>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </motion.div>

        {/* Templates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-blue-600 text-white">
            <div className="grid grid-cols-12 gap-4 px-6 py-4">
              <div className="col-span-1 flex items-center">
                <input type="checkbox" className="rounded border-blue-300" />
              </div>
              <div className="col-span-1 text-sm font-medium uppercase tracking-wider">
                ID
              </div>
              <div className="col-span-4 text-sm font-medium uppercase tracking-wider">
                Template Name
              </div>
              <div className="col-span-6 text-sm font-medium uppercase tracking-wider flex items-center justify-end">
                Action
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1 flex items-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </div>
                  <div className="col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-900">{template.id}</span>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                          <span className="text-xs text-gray-500">Used {template.usageCount} times</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 flex items-center justify-end">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewTemplate(template)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Template"
                      >
                        <FiEye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEditTemplate(template)}
                        className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Edit Template"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDuplicateTemplate(template)}
                        className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Duplicate Template"
                      >
                        <FiCopy className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Template"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-red-400 text-lg">No encounter templates found</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {templates.filter(t => t.category === 'General').length}
            </div>
            <div className="text-sm text-gray-600">General Templates</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-red-600">
              {templates.filter(t => t.category === 'Emergency').length}
            </div>
            <div className="text-sm text-gray-600">Emergency Templates</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Usage</div>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Template</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncounterTemplates;