import React, { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ADHDT2Template = ({ 
  templateData, 
  onSave, 
  onCancel, 
  isEditing = false,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    id: null,
    name: 'ADHDT-2 Assessment Report',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced assessment instrument designed to help identify ADHD in individuals. Based on the diagnostic criteria for ADHD from the DSM-5, the ADHDT-2 provides a comprehensive measure of ADHD symptoms across multiple settings. The test evaluates both inattention and hyperactivity/impulsivity symptoms, providing valuable information for diagnostic decision-making and treatment planning. This assessment consists of behavior rating scales that measure the frequency and severity of ADHD symptoms, allowing for a standardized approach to ADHD evaluation that can be used in clinical, educational, and research settings.`,
    subscales: [
      {
        name: 'Inattention',
        rawScore: 0,
        percentileRank: 0,
        scaledScore: 0
      },
      {
        name: 'Hyperactivity/Impulsivity',
        rawScore: 0,
        percentileRank: 0,
        scaledScore: 0
      }
    ],
    adhdIndex: 0,
    remark: '',
    disclaimer: `The scores listed in the table imply that it is 'very likely' that [Student Name] has symptoms of ADHD. However, the checklist cannot be fully endorsed by the tester due to the one-to-one situation. The scores are based on the reports from the mother.`,
    isTemplate: true,
    createdBy: null,
    createdAt: null,
    updatedAt: null
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (templateData) {
      setTemplate(prev => ({
        ...prev,
        ...templateData,
        subscales: templateData.subscales || prev.subscales
      }));
    }
  }, [templateData]);

  const validateTemplate = () => {
    const newErrors = {};
    
    if (!template.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (!template.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (!template.examinerName.trim()) {
      newErrors.examinerName = 'Examiner name is required';
    }
    
    if (!template.testDate) {
      newErrors.testDate = 'Test date is required';
    }
    
    template.subscales.forEach((subscale, index) => {
      if (subscale.rawScore < 0 || subscale.rawScore > 100) {
        newErrors[`subscale_${index}_rawScore`] = 'Raw score must be between 0 and 100';
      }
      if (subscale.percentileRank < 0 || subscale.percentileRank > 100) {
        newErrors[`subscale_${index}_percentileRank`] = 'Percentile rank must be between 0 and 100';
      }
      if (subscale.scaledScore < 1 || subscale.scaledScore > 20) {
        newErrors[`subscale_${index}_scaledScore`] = 'Scaled score must be between 1 and 20';
      }
    });
    
    if (template.adhdIndex < 0 || template.adhdIndex > 150) {
      newErrors.adhdIndex = 'ADHD Index must be between 0 and 150';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubscaleChange = (index, field, value) => {
    const numValue = field === 'name' ? value : parseInt(value) || 0;
    
    setTemplate(prev => ({
      ...prev,
      subscales: prev.subscales.map((subscale, i) => 
        i === index ? { ...subscale, [field]: numValue } : subscale
      )
    }));
    
    // Clear error for this field
    const errorKey = `subscale_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addSubscale = () => {
    setTemplate(prev => ({
      ...prev,
      subscales: [
        ...prev.subscales,
        {
          name: '',
          rawScore: 0,
          percentileRank: 0,
          scaledScore: 0
        }
      ]
    }));
  };

  const removeSubscale = (index) => {
    if (template.subscales.length > 1) {
      setTemplate(prev => ({
        ...prev,
        subscales: prev.subscales.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = async () => {
    if (!validateTemplate()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsLoading(true);
    
    try {
      const templateToSave = {
        ...template,
        type: 'ADHDT2',
        updatedAt: new Date().toISOString()
      };

      let result;
      if (template.id) {
        result = await api.updateTemplate(template.id, templateToSave);
      } else {
        result = await api.createTemplate(templateToSave);
      }

      if (result.success) {
        toast.success(`Template ${template.id ? 'updated' : 'created'} successfully`);
        onSave(result.data);
      } else {
        toast.error(result.message || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error saving template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!template.id) return;
    
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await api.deleteTemplate(template.id);
      
      if (result.success) {
        toast.success('Template deleted successfully');
        onSave(null);
      } else {
        toast.error(result.message || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error deleting template');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRemark = () => {
    const inattention = template.subscales[0];
    const hyperactivity = template.subscales[1];
    
    let remark = `The scores listed in the table imply that it is `;
    
    if (inattention.percentileRank >= 75 || hyperactivity.percentileRank >= 75) {
      remark += `'very likely' that ${template.studentName} has symptoms of ADHD.`;
    } else if (inattention.percentileRank >= 50 || hyperactivity.percentileRank >= 50) {
      remark += `'likely' that ${template.studentName} has symptoms of ADHD.`;
    } else {
      remark += `'unlikely' that ${template.studentName} has symptoms of ADHD.`;
    }
    
    setTemplate(prev => ({
      ...prev,
      remark
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <FiFileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit' : 'Create'} ADHDT-2 Template
          </h2>
        </div>
        <div className="flex space-x-2">
          {template.id && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <FiSave className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Template Name *
          </label>
          <input
            type="text"
            value={template.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter template name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Date *
          </label>
          <input
            type="date"
            value={template.testDate}
            onChange={(e) => handleInputChange('testDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.testDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.testDate && <p className="text-red-500 text-sm mt-1">{errors.testDate}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name *
          </label>
          <input
            type="text"
            value={template.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.studentName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter student name"
          />
          {errors.studentName && <p className="text-red-500 text-sm mt-1">{errors.studentName}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Examiner Name *
          </label>
          <input
            type="text"
            value={template.examinerName}
            onChange={(e) => handleInputChange('examinerName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.examinerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter examiner name"
          />
          {errors.examinerName && <p className="text-red-500 text-sm mt-1">{errors.examinerName}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Description
        </label>
        <textarea
          value={template.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter test description"
        />
      </div>

      {/* Test Results Table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Test Results</h3>
          <button
            onClick={addSubscale}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Add Subscale
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Subscales</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Raw Scores</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Percentile Ranks</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Scaled Scores</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {template.subscales.map((subscale, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={subscale.name}
                      onChange={(e) => handleSubscaleChange(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                      placeholder="Subscale name"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={subscale.rawScore}
                      onChange={(e) => handleSubscaleChange(index, 'rawScore', e.target.value)}
                      className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 ${
                        errors[`subscale_${index}_rawScore`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={subscale.percentileRank}
                      onChange={(e) => handleSubscaleChange(index, 'percentileRank', e.target.value)}
                      className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 ${
                        errors[`subscale_${index}_percentileRank`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={subscale.scaledScore}
                      onChange={(e) => handleSubscaleChange(index, 'scaledScore', e.target.value)}
                      className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 ${
                        errors[`subscale_${index}_scaledScore`] ? 'border-red-500' : 'border-gray-200'
                      }`}
                      min="1"
                      max="20"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {template.subscales.length > 1 && (
                      <button
                        onClick={() => removeSubscale(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  ADHD Index
                </td>
                <td className="border border-gray-300 px-4 py-2" colSpan="3">
                  <input
                    type="number"
                    value={template.adhdIndex}
                    onChange={(e) => handleInputChange('adhdIndex', e.target.value)}
                    className={`w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 ${
                      errors.adhdIndex ? 'border-red-500' : 'border-gray-200'
                    }`}
                    min="0"
                    max="150"
                    placeholder="ADHD Index Score"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={generateRemark}
                    className="text-blue-500 hover:text-blue-700"
                    title="Generate Remark"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {errors.adhdIndex && <p className="text-red-500 text-sm mt-1">{errors.adhdIndex}</p>}
      </div>

      {/* Remark */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remark
        </label>
        <textarea
          value={template.remark}
          onChange={(e) => handleInputChange('remark', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter assessment remark"
        />
      </div>

      {/* Disclaimer */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Disclaimer
        </label>
        <textarea
          value={template.disclaimer}
          onChange={(e) => handleInputChange('disclaimer', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter disclaimer text"
        />
      </div>

      {/* Preview */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-xl font-bold text-center mb-4">{template.name}</h4>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Student:</strong> {template.studentName} | 
              <strong> Examiner:</strong> {template.examinerName} | 
              <strong> Date:</strong> {template.testDate}
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm leading-relaxed">{template.description}</p>
          </div>
          
          <div className="mb-4">
            <h5 className="font-semibold mb-2">Test Results</h5>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-1 text-left">Subscales</th>
                  <th className="border border-gray-300 px-3 py-1 text-center">Raw Scores</th>
                  <th className="border border-gray-300 px-3 py-1 text-center">Percentile Ranks</th>
                  <th className="border border-gray-300 px-3 py-1 text-center">Scaled Scores</th>
                </tr>
              </thead>
              <tbody>
                {template.subscales.map((subscale, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-3 py-1">{subscale.name}</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{subscale.rawScore}</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{subscale.percentileRank}</td>
                    <td className="border border-gray-300 px-3 py-1 text-center">{subscale.scaledScore}</td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-300 px-3 py-1 font-semibold">ADHD Index</td>
                  <td className="border border-gray-300 px-3 py-1 text-center" colSpan="3">
                    {template.adhdIndex}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {template.remark && (
            <div className="mb-4">
              <h5 className="font-semibold mb-2">Remark</h5>
              <p className="text-sm">{template.remark}</p>
            </div>
          )}
          
          {template.disclaimer && (
            <div className="mb-4">
              <h5 className="font-semibold mb-2">Disclaimer</h5>
              <p className="text-sm italic">{template.disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ADHDT2Template;
