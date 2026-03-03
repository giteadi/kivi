import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiCopy, FiTrash2, FiFileText } from 'react-icons/fi';

const TemplateViewer = ({ template, onBack, onEdit, onDuplicate, onDelete }) => {
  const renderFieldPreview = (section) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="border rounded-lg p-3 bg-gray-50">
            <textarea
              placeholder={section.placeholder}
              className="w-full bg-transparent resize-none border-none outline-none"
              rows="3"
              disabled
            />
          </div>
        );
      case 'dropdown':
        return (
          <select className="w-full p-3 border rounded-lg bg-gray-50" disabled>
            <option>Select an option...</option>
            {section.options?.map(option => (
              <option key={option.id} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
            {section.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-2">
                <input type="checkbox" disabled className="text-blue-600" />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
            {section.options?.map(option => (
              <label key={option.id} className="flex items-center space-x-2">
                <input type="radio" name={`radio-${section.id}`} disabled className="text-blue-600" />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={section.placeholder}
            className="w-full p-3 border rounded-lg bg-gray-50"
            disabled
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full p-3 border rounded-lg bg-gray-50"
            disabled
          />
        );
      default:
        return (
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-500">
            Unknown field type: {section.type}
          </div>
        );
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'specialist':
        return 'bg-purple-100 text-purple-800';
      case 'pediatric':
        return 'bg-yellow-100 text-yellow-800';
      case 'geriatric':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Template Details</h1>
              <p className="text-gray-600">View template structure and fields</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onEdit(template)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiEdit3 className="w-4 h-4" />
              <span>Edit</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDuplicate(template)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <FiCopy className="w-4 h-4" />
              <span>Duplicate</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDelete(template)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Encounter Template List</span>
          <span className="mx-2">›</span>
          <span>All Encounter Templates</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Template Details</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border sticky top-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm text-gray-800 mt-1">{template.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created By</label>
                    <p className="text-sm text-gray-800 mt-1">{template.createdBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Created Date</label>
                    <p className="text-sm text-gray-800 mt-1">{template.createdDate}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Usage Count</label>
                  <p className="text-sm text-gray-800 mt-1">{template.usageCount} times</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Total Sections</label>
                  <p className="text-sm text-gray-800 mt-1">{template.sections?.length || 0} sections</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Template Preview</h3>
              
              <div className="space-y-6">
                {template.sections && template.sections.length > 0 ? (
                  template.sections.map((section, index) => (
                    <motion.div
                      key={section.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {section.name}
                          {section.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {section.type}
                        </span>
                      </div>
                      {renderFieldPreview(section)}
                      {section.placeholder && (
                        <p className="text-xs text-gray-500 italic">
                          Placeholder: "{section.placeholder}"
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FiFileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No sections defined</p>
                    <p className="text-sm">This template doesn't have any sections yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Usage Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{template.usageCount}</div>
              <div className="text-sm text-blue-600">Total Uses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.floor(template.usageCount / 30) || 0}
              </div>
              <div className="text-sm text-green-600">Monthly Average</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {template.sections?.length || 0}
              </div>
              <div className="text-sm text-purple-600">Sections</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {template.sections?.filter(s => s.required).length || 0}
              </div>
              <div className="text-sm text-orange-600">Required Fields</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TemplateViewer;