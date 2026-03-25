import React, { useState } from 'react';
import { FiFileText, FiPlus, FiX } from 'react-icons/fi';

const ADHTBSMTemplateSelector = ({ onSelect, onCancel }) => {
  const [templateData, setTemplateData] = useState({
    name: 'ADHT-BSM Assessment',
    studentName: '',
    examinerName: '',
    testDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelect = () => {
    onSelect({
      type: 'ADHT-BSM',
      template_data: {
        ...templateData,
        inattentionCriteria: [
          { id: 'A1', text: 'Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities', checked: false },
          { id: 'A2', text: 'Often has trouble sustaining attention in tasks or play activities', checked: false },
          { id: 'A3', text: 'Often does not seem to listen when spoken to directly', checked: false },
          { id: 'A4', text: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace', checked: false },
          { id: 'A5', text: 'Often has trouble organizing tasks and activities', checked: false },
          { id: 'A6', text: 'Often avoids, dislikes, or is reluctant to do tasks that require mental effort over a long period of time', checked: false },
          { id: 'A7', text: 'Often loses things necessary for tasks or activities', checked: false },
          { id: 'A8', text: 'Is often easily distracted', checked: false },
          { id: 'A9', text: 'Is often forgetful in daily activities', checked: false }
        ],
        hyperactivityCriteria: [
          { id: 'A10', text: 'Often fidgets with or taps hands or feet, or squirms in seat', checked: false },
          { id: 'A11', text: 'Often leaves seat in situations when remaining seated is expected', checked: false },
          { id: 'A12', text: 'Often runs about or climbs in situations where it is not appropriate', checked: false }
        ],
        inattentionTotal: 0,
        hyperactivityTotal: 0,
        remarks: ''
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <FiFileText className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Create ADHT-BSM Assessment</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create Template
          </button>
        </div>
      </div>

      {/* Template Preview */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-center mb-4">
          ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST
        </h3>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Sections:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Inattention (9 criteria: A1-A9)</li>
            <li>Hyperactivity and Impulsivity (3 criteria: A10-A12)</li>
          </ul>
          <p className="mt-3"><strong>Features:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Checkbox-based criteria selection</li>
            <li>Automatic total calculation</li>
            <li>Remarks section for additional notes</li>
            <li>Print-ready format</li>
          </ul>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            value={templateData.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter student name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Examiner Name
          </label>
          <input
            type="text"
            value={templateData.examinerName}
            onChange={(e) => handleInputChange('examinerName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter examiner name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Date
          </label>
          <input
            type="date"
            value={templateData.testDate}
            onChange={(e) => handleInputChange('testDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ADHTBSMTemplateSelector;
