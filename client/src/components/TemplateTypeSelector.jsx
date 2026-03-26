import React, { useState } from 'react';
import { FiFileText, FiPlus, FiX } from 'react-icons/fi';
import ADHDT2Template from './ADHDT2Template';
import ADHTBSMTemplate from './ADHTBSMTemplate';

const TemplateTypeSelector = ({ onSelect, onCancel }) => {
  const [selectedType, setSelectedType] = useState('');

  const handleTypeSelect = (type) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  const templateTypes = [
    {
      type: 'ADHDT2',
      name: 'ADHDT-2 Assessment',
      description: 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring and percentile rankings',
      color: 'blue',
      icon: '📋'
    },
    {
      type: 'ADHT-BSM',
      name: 'ADHT-BSM Assessment',
      description: 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity',
      color: 'green',
      icon: '✅'
    },
    {
      type: 'Aston-Index',
      name: 'Aston Index Assessment',
      description: 'Comprehensive battery of tests for diagnosing language difficulties in children with performance items',
      color: 'purple',
      icon: '🧠'
    },
    {
      type: 'BKT',
      name: 'Basic Kinesthetic Test',
      description: 'Motor coordination and kinesthetic perception assessment for children',
      color: 'orange',
      icon: '🏃'
    },
    {
      type: 'Ravens-CPM',
      name: 'Raven\'s Coloured Progressive Matrices',
      description: 'Non-verbal assessment of eductive ability and problem-solving skills',
      color: 'indigo',
      icon: '🧩'
    },
    {
      type: 'GARS-3',
      name: 'Gilliam Autism Rating Scale - 3',
      description: 'Comprehensive assessment tool for identifying autism spectrum disorders',
      color: 'red',
      icon: '🧠'
    },
    {
      type: 'Brown-EF-A',
      name: 'Brown Executive Function/Attention Scales',
      description: 'Comprehensive assessment of executive function and attention processes',
      color: 'yellow',
      icon: '🧠'
    },
    {
      type: 'EACA',
      name: 'Early Academic Competency Assessment',
      description: 'Comprehensive screening tool for early academic skills and school readiness',
      color: 'teal',
      icon: '📚'
    },
    {
      type: 'EACA-Autism',
      name: 'Educational Assessment of Children with Autism (EACA)',
      description: 'Comprehensive assessment of children with autism focusing on triad of impairments across 7 domains',
      color: 'purple',
      icon: '🧩'
    },
    {
      type: 'Nelson-Denny',
      name: 'Nelson-Denny Reading Test',
      description: 'Comprehensive assessment of reading comprehension, vocabulary, and reading rate',
      color: 'cyan',
      icon: '📖'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <FiFileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Select Template Type</h2>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <FiX className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>

      {/* Template Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {templateTypes.map((template) => (
          <div
            key={template.type}
            onClick={() => handleTypeSelect(template.type)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedType === template.type
                ? `border-${template.color}-500 bg-${template.color}-50`
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">{template.icon}</span>
              <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">{template.description}</p>
            <div className={`w-full h-2 rounded-full bg-${template.color}-200`}>
              <div 
                className={`h-full rounded-full bg-${template.color}-500 ${
                  selectedType === template.type ? 'w-full' : 'w-0'
                } transition-all`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            selectedType
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FiPlus className="w-4 h-4 mr-2 inline" />
          Create Template
        </button>
      </div>
    </div>
  );
};

export default TemplateTypeSelector;
