import React, { useState } from 'react';
import { FiFileText, FiSave, FiX } from 'react-icons/fi';

const ADHTBSMTemplate = ({ 
  onSave, 
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'ADHD-DSM 5 Checklist',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    inattentionCriteria: [
      { 
        id: 'A1', 
        text: 'Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities (e.g., overlooks or misses details, work is inaccurate)', 
        checked: false 
      },
      { 
        id: 'A2', 
        text: 'Often has trouble sustaining attention in tasks or play activities', 
        checked: false 
      },
      { 
        id: 'A3', 
        text: 'Often does not seem to listen when spoken to directly', 
        checked: false 
      },
      { 
        id: 'A4', 
        text: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace', 
        checked: false 
      },
      { 
        id: 'A5', 
        text: 'Often has difficulty organizing tasks and activities (e.g., difficulty managing sequential tasks; difficulty keeping materials and belongings in order; messy, disorganised work; has poor time management; fails to meet deadlines)', 
        checked: false 
      },
      { 
        id: 'A6', 
        text: 'Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort (e.g., schoolwork or homework; for older adolescents and adults preparing reports, completing forms, reviewing lengthy papers)', 
        checked: false 
      },
      { 
        id: 'A7', 
        text: 'Often loses things necessary for tasks or activities (e.g., school materials, pencils, books, tools, wallets, keys, paperwork, eyeglasses, mobile telephones)', 
        checked: false 
      },
      { 
        id: 'A8', 
        text: 'Is often easily distracted by extraneous stimuli (for older adolescents and adults, may include unrelated thoughts)', 
        checked: false 
      },
      { 
        id: 'A9', 
        text: 'Is often forgetful in daily activities (e.g., doing chores, running errands; for older adolescents and adults, returning calls, paying bills, keeping appointments)', 
        checked: false 
      }
    ],
    hyperactivityCriteria: [
      { 
        id: 'A10', 
        text: 'Often fidgets with or taps hands or feet or squirms in seat', 
        checked: false 
      },
      { 
        id: 'A11', 
        text: 'Often leaves seat in situations when remaining seated is expected (e.g., leaves her or his place in the classroom, in the office or other workplace, or in other situations that require remaining in place)', 
        checked: false 
      },
      { 
        id: 'A12', 
        text: 'Often runs about or climbs in situations where it is inappropriate (Note: In adolescents or adults, may be limited to feeling restless)', 
        checked: false 
      }
    ],
    inattentionTotal: 0,
    hyperactivityTotal: 0,
    remarks: ''
  });

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCriteriaChange = (section, index, checked) => {
    setTemplate(prev => {
      const newTemplate = { ...prev };
      if (section === 'inattention') {
        newTemplate.inattentionCriteria = prev.inattentionCriteria.map((c, i) => 
          i === index ? { ...c, checked } : c
        );
        newTemplate.inattentionTotal = newTemplate.inattentionCriteria.filter(c => c.checked).length;
      } else {
        newTemplate.hyperactivityCriteria = prev.hyperactivityCriteria.map((c, i) => 
          i === index ? { ...c, checked } : c
        );
        newTemplate.hyperactivityTotal = newTemplate.hyperactivityCriteria.filter(c => c.checked).length;
      }
      return newTemplate;
    });
  };

  const handleSave = () => {
    const templateData = {
      ...template,
      type: 'ADHT-BSM',
      createdAt: new Date().toISOString()
    };
    onSave(templateData);
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <FiFileText className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">ADHD-DSM 5 Checklist</h2>
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
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiSave className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            value={template.studentName}
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
            value={template.examinerName}
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
            value={template.testDate}
            onChange={(e) => handleInputChange('testDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Assessment Title */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-800">
          ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST
        </h3>
      </div>

      {/* Excel-style Table Layout */}
      <div className="border border-black mb-8">
        {/* Inattention Section */}
        <div className="border-b border-black">
          <div className="bg-gray-100 p-3 text-center font-semibold">
            INATTENTION
          </div>
          {template.inattentionCriteria.map((criteria, index) => (
            <div key={criteria.id} className="border-b border-black">
              <div className="grid grid-cols-12">
                {/* Item ID Column */}
                <div className="col-span-1 border-r border-black p-3 text-center font-medium align-top">
                  {criteria.id}
                </div>
                {/* Description Column */}
                <div className="col-span-10 border-r border-black p-3 text-sm align-top">
                  {criteria.text}
                </div>
                {/* Checkbox Column */}
                <div className="col-span-1 p-3 text-center align-top">
                  <input
                    type="checkbox"
                    checked={criteria.checked}
                    onChange={(e) => handleCriteriaChange('inattention', index, e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Total Row */}
          <div className="grid grid-cols-12">
            <div className="col-span-1 border-r border-black p-3 text-center font-bold">
              TOTAL
            </div>
            <div className="col-span-10 border-r border-black p-3"></div>
            <div className="col-span-1 p-3 text-center font-bold underline">
              {template.inattentionTotal}
            </div>
          </div>
        </div>

        {/* Hyperactivity and Impulsivity Section */}
        <div>
          <div className="bg-gray-100 p-3 text-center font-semibold">
            HYPERACTIVITY AND IMPULSIVITY
            <div className="text-xs font-normal mt-1">
              (Only behaviours occurring for 6 months or more are ticked)
            </div>
          </div>
          {template.hyperactivityCriteria.map((criteria, index) => (
            <div key={criteria.id} className="border-b border-black">
              <div className="grid grid-cols-12">
                {/* Item ID Column */}
                <div className="col-span-1 border-r border-black p-3 text-center font-medium align-top">
                  {criteria.id}
                </div>
                {/* Description Column */}
                <div className="col-span-10 border-r border-black p-3 text-sm align-top">
                  {criteria.text}
                </div>
                {/* Checkbox Column */}
                <div className="col-span-1 p-3 text-center align-top">
                  <input
                    type="checkbox"
                    checked={criteria.checked}
                    onChange={(e) => handleCriteriaChange('hyperactivity', index, e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Total Row */}
          <div className="grid grid-cols-12">
            <div className="col-span-1 border-r border-black p-3 text-center font-bold">
              TOTAL
            </div>
            <div className="col-span-10 border-r border-black p-3"></div>
            <div className="col-span-1 p-3 text-center font-bold underline">
              {template.hyperactivityTotal}
            </div>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remarks
        </label>
        <textarea
          value={template.remarks}
          onChange={(e) => handleInputChange('remarks', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter assessment remarks..."
        />
      </div>

      {/* Preview Section */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-4">
            <h5 className="text-lg font-bold text-gray-800">
              ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST
            </h5>
            <p className="text-sm text-gray-600 mt-2">
              Student: {template.studentName} | Examiner: {template.examinerName} | Date: {template.testDate}
            </p>
          </div>

          {/* Excel-style Preview */}
          <div className="border border-black">
            {/* Inattention Preview */}
            <div className="border-b border-black">
              <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
                INATTENTION
              </div>
              {template.inattentionCriteria.map((criteria) => (
                <div key={criteria.id} className="border-b border-black">
                  <div className="grid grid-cols-12">
                    <div className="col-span-1 border-r border-black p-2 text-center font-medium text-xs">
                      {criteria.id}
                    </div>
                    <div className="col-span-10 border-r border-black p-2 text-xs">
                      {criteria.text}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs font-semibold">
                      {criteria.checked ? 'Y' : ''}
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-12">
                <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">
                  TOTAL
                </div>
                <div className="col-span-10 border-r border-black p-2"></div>
                <div className="col-span-1 p-2 text-center font-bold underline text-xs">
                  {template.inattentionTotal}
                </div>
              </div>
            </div>

            {/* Hyperactivity Preview */}
            <div>
              <div className="bg-gray-100 p-2 text-center font-semibold text-sm">
                HYPERACTIVITY AND IMPULSIVITY
                <div className="text-xs font-normal">
                  (Only behaviours occurring for 6 months or more are ticked)
                </div>
              </div>
              {template.hyperactivityCriteria.map((criteria) => (
                <div key={criteria.id} className="border-b border-black">
                  <div className="grid grid-cols-12">
                    <div className="col-span-1 border-r border-black p-2 text-center font-medium text-xs">
                      {criteria.id}
                    </div>
                    <div className="col-span-10 border-r border-black p-2 text-xs">
                      {criteria.text}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs font-semibold">
                      {criteria.checked ? 'Y' : ''}
                    </div>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-12">
                <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">
                  TOTAL
                </div>
                <div className="col-span-10 border-r border-black p-2"></div>
                <div className="col-span-1 p-2 text-center font-bold underline text-xs">
                  {template.hyperactivityTotal}
                </div>
              </div>
            </div>
          </div>

          {template.remarks && (
            <div className="mt-4">
              <h6 className="font-semibold text-gray-800 mb-2">Remarks</h6>
              <p className="text-sm text-gray-700">{template.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default ADHTBSMTemplate;
