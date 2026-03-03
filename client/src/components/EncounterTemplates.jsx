import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiFileText, FiCopy } from 'react-icons/fi';
import { useState } from 'react';

const EncounterTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app this would come from API
  const templates = [
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
  ];

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
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Template"
                      >
                        <FiEye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                        title="Edit Template"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors"
                        title="Duplicate Template"
                      >
                        <FiCopy className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
      </div>
    </div>
  );
};

export default EncounterTemplates;