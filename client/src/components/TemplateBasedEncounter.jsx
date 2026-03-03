import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowLeft, FiSave, FiFileText, FiCheck, FiAlertCircle } from 'react-icons/fi';

const TemplateBasedEncounter = ({ template, patientData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (sectionId, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[sectionId]) {
      setErrors(prev => ({
        ...prev,
        [sectionId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    template.sections?.forEach(section => {
      if (section.required && (!formData[section.id] || formData[section.id].toString().trim() === '')) {
        newErrors[section.id] = `${section.name} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const encounterData = {
        templateId: template.id,
        templateName: template.name,
        patientId: patientData.id,
        patientName: patientData.name,
        formData: formData,
        createdDate: new Date().toISOString(),
        status: 'Active'
      };
      
      await onSave(encounterData);
    } catch (error) {
      console.error('Error saving encounter:', error);
      alert('Error saving encounter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (section) => {
    const value = formData[section.id] || '';
    const hasError = errors[section.id];

    switch (section.type) {
      case 'text':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(section.id, e.target.value)}
              placeholder={section.placeholder}
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              rows="4"
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'dropdown':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleFieldChange(section.id, e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option...</option>
              {section.options?.map(option => (
                <option key={option.id} value={option.value || option.label}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <div className="space-y-2">
              {section.options?.map(option => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) ? value.includes(option.value || option.label) : false}
                    onChange={(e) => {
                      const optionValue = option.value || option.label;
                      let newValue = Array.isArray(value) ? [...value] : [];
                      
                      if (e.target.checked) {
                        newValue.push(optionValue);
                      } else {
                        newValue = newValue.filter(v => v !== optionValue);
                      }
                      
                      handleFieldChange(section.id, newValue);
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div>
            <div className="space-y-2">
              {section.options?.map(option => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-${section.id}`}
                    value={option.value || option.label}
                    checked={value === (option.value || option.label)}
                    onChange={(e) => handleFieldChange(section.id, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(section.id, e.target.value)}
              placeholder={section.placeholder}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            <input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(section.id, e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="w-4 h-4 mr-1" />
                {hasError}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div className="p-3 border rounded-lg bg-gray-50 text-gray-500">
            Unsupported field type: {section.type}
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedFields = template.sections?.filter(section => 
    formData[section.id] && formData[section.id].toString().trim() !== ''
  ).length || 0;
  
  const totalFields = template.sections?.length || 0;
  const progressPercentage = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;

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
              <h1 className="text-2xl font-semibold text-gray-800">Create Encounter Report</h1>
              <p className="text-gray-600">Using template: {template.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Progress: {completedFields}/{totalFields} fields
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Encounter</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Form Completion</span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Patient & Template Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Patient Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm text-gray-800">{patientData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID</label>
                    <p className="text-sm text-gray-800">{patientData.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-sm text-gray-800">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Template Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Template Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiFileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-800">{template.name}</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="text-xs text-gray-500">
                    {totalFields} sections • Used {template.usageCount} times
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Encounter Form</h3>
              
              <div className="space-y-6">
                {template.sections?.map((section, index) => (
                  <motion.div
                    key={section.id}
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
                      <div className="flex items-center space-x-2">
                        {formData[section.id] && formData[section.id].toString().trim() !== '' && (
                          <FiCheck className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {section.type}
                        </span>
                      </div>
                    </div>
                    {renderField(section)}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBasedEncounter;