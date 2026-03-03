import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiEdit3, FiMove } from 'react-icons/fi';

const TemplateBuilder = ({ template = null, onSave, onCancel }) => {
  const [templateData, setTemplateData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'General',
    sections: template?.sections || [
      {
        id: 1,
        name: 'Patient History',
        type: 'text',
        required: true,
        placeholder: 'Enter patient medical history...',
        options: []
      }
    ]
  });

  const sectionTypes = [
    { value: 'text', label: 'Text Area' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox List' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'number', label: 'Number Input' },
    { value: 'date', label: 'Date Picker' }
  ];

  const categories = ['General', 'Emergency', 'Follow-up', 'Specialist', 'Pediatric', 'Geriatric'];

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      name: 'New Section',
      type: 'text',
      required: false,
      placeholder: 'Enter information...',
      options: []
    };
    setTemplateData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const addOption = (sectionId) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, options: [...section.options, { id: Date.now(), label: 'New Option', value: '' }] }
          : section
      )
    }));
  };

  const updateOption = (sectionId, optionId, field, value) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map(option =>
                option.id === optionId ? { ...option, [field]: value } : option
              )
            }
          : section
      )
    }));
  };

  const deleteOption = (sectionId, optionId) => {
    setTemplateData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, options: section.options.filter(option => option.id !== optionId) }
          : section
      )
    }));
  };

  const handleSave = () => {
    if (!templateData.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    onSave(templateData);
  };

  const renderSectionPreview = (section) => {
    switch (section.type) {
      case 'text':
        return (
          <textarea
            placeholder={section.placeholder}
            className="w-full p-3 border rounded-lg resize-none"
            rows="3"
            disabled
          />
        );
      case 'dropdown':
        return (
          <select className="w-full p-3 border rounded-lg" disabled>
            <option>Select an option...</option>
            {section.options.map(option => (
              <option key={option.id} value={option.value}>{option.label}</option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {section.options.map(option => (
              <label key={option.id} className="flex items-center space-x-2">
                <input type="checkbox" disabled />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {section.options.map(option => (
              <label key={option.id} className="flex items-center space-x-2">
                <input type="radio" name={`radio-${section.id}`} disabled />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            placeholder={section.placeholder}
            className="w-full p-3 border rounded-lg"
            disabled
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            disabled
          />
        );
      default:
        return null;
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
              onClick={onCancel}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {template ? 'Edit Template' : 'Create New Template'}
              </h1>
              <p className="text-gray-600">Design reusable encounter templates</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Template</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Builder */}
          <div className="space-y-6">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateData.name}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={templateData.description}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the template purpose"
                    className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={templateData.category}
                    onChange={(e) => setTemplateData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Template Sections</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addSection}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add Section</span>
                </motion.button>
              </div>

              <div className="space-y-4">
                {templateData.sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <FiMove className="w-4 h-4 text-gray-400 cursor-move" />
                        <span className="text-sm font-medium text-gray-600">Section {index + 1}</span>
                      </div>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Section Name
                        </label>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Field Type
                        </label>
                        <select
                          value={section.type}
                          onChange={(e) => updateSection(section.id, 'type', e.target.value)}
                          className="w-full p-2 border rounded text-sm"
                        >
                          {sectionTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        value={section.placeholder}
                        onChange={(e) => updateSection(section.id, 'placeholder', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={section.required}
                          onChange={(e) => updateSection(section.id, 'required', e.target.checked)}
                        />
                        <span className="text-xs text-gray-600">Required Field</span>
                      </label>
                    </div>

                    {/* Options for dropdown, checkbox, radio */}
                    {['dropdown', 'checkbox', 'radio'].includes(section.type) && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-gray-600">Options</label>
                          <button
                            onClick={() => addOption(section.id)}
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            + Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {section.options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option.label}
                                onChange={(e) => updateOption(section.id, option.id, 'label', e.target.value)}
                                placeholder="Option label"
                                className="flex-1 p-2 border rounded text-sm"
                              />
                              <button
                                onClick={() => deleteOption(section.id, option.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Preview</h3>
              
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-800">{templateData.name || 'Template Name'}</h4>
                  <p className="text-sm text-gray-600">{templateData.description || 'Template description'}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {templateData.category}
                  </span>
                </div>

                {templateData.sections.map((section, index) => (
                  <div key={section.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {section.name}
                      {section.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderSectionPreview(section)}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;