import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const BKTTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Basic Kinesthetic Test',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Basic Kinesthetic Test (BKT) is an assessment tool designed to evaluate kinesthetic perception and motor coordination abilities in children. This test helps identify difficulties in motor planning, body awareness, and spatial orientation that may affect learning and daily functioning.`,
    grossMotorSkills: [
      { id: 1, test: 'Balance on one foot (right)', score: '', remarks: '' },
      { id: 2, test: 'Balance on one foot (left)', score: '', remarks: '' },
      { id: 3, test: 'Hop on one foot (right)', score: '', remarks: '' },
      { id: 4, test: 'Hop on one foot (left)', score: '', remarks: '' },
      { id: 5, test: 'Jump forward with both feet', score: '', remarks: '' },
      { id: 6, test: 'Throw ball forward', score: '', remarks: '' },
      { id: 7, test: 'Catch ball with both hands', score: '', remarks: '' }
    ],
    fineMotorSkills: [
      { id: 8, test: 'Finger tapping (right hand)', score: '', remarks: '' },
      { id: 9, test: 'Finger tapping (left hand)', score: '', remarks: '' },
      { id: 10, test: 'Touch finger to thumb (right)', score: '', remarks: '' },
      { id: 11, test: 'Touch finger to thumb (left)', score: '', remarks: '' },
      { id: 12, test: 'Copy simple shapes', score: '', remarks: '' },
      { id: 13, test: 'Draw a person', score: '', remarks: '' }
    ],
    bodyAwareness: [
      { id: 14, test: 'Identify body parts', score: '', remarks: '' },
      { id: 15, test: 'Left-right discrimination', score: '', remarks: '' },
      { id: 16, test: 'Body coordination', score: '', remarks: '' },
      { id: 17, test: 'Spatial orientation', score: '', remarks: '' }
    ],
    interpretation: '',
    conclusions: '',
    recommendations: ''
  });

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGrossMotorChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      grossMotorSkills: prev.grossMotorSkills.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleFineMotorChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      fineMotorSkills: prev.fineMotorSkills.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleBodyAwarenessChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      bodyAwareness: prev.bodyAwareness.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = () => {
    onSave(template);
  };

  const [activeTab, setActiveTab] = useState('edit');

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Basic Kinesthetic Test (BKT)</h1>
                <p className="text-gray-600">Motor coordination and kinesthetic perception assessment</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'edit' ? (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={template.studentName}
                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <textarea
                value={template.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Gross Motor Skills */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gross Motor Skills</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-2 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-2 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.grossMotorSkills.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-2 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-2">
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleGrossMotorChange(index, 'score', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Score"
                        />
                      </div>
                      <div className="col-span-2 p-2">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleGrossMotorChange(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fine Motor Skills */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Fine Motor Skills</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-2 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-2 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.fineMotorSkills.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-2 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-2">
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleFineMotorChange(index, 'score', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Score"
                        />
                      </div>
                      <div className="col-span-2 p-2">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleFineMotorChange(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body Awareness */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Body Awareness</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-2 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-2 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.bodyAwareness.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-2 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-2">
                        <input
                          type="text"
                          value={item.score}
                          onChange={(e) => handleBodyAwarenessChange(index, 'score', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Score"
                        />
                      </div>
                      <div className="col-span-2 p-2">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleBodyAwarenessChange(index, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          placeholder="Remarks"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
              <textarea
                value={template.interpretation}
                onChange={(e) => handleInputChange('interpretation', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter interpretation of test results"
              />
            </div>

            {/* Conclusions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Conclusions</h2>
              <textarea
                value={template.conclusions}
                onChange={(e) => handleInputChange('conclusions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter conclusions"
              />
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
              <textarea
                value={template.recommendations}
                onChange={(e) => handleInputChange('recommendations', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter recommendations"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
              >
                <FiSave className="w-4 h-4" />
                <span>Save Template</span>
              </button>
            </div>
          </div>
        ) : (
          /* Preview Mode */
          <div className="bg-white rounded-lg shadow-sm border p-8">
            {/* Template Header */}
            <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                BASIC KINESTHETIC TEST (BKT) REPORT
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-orange-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-orange-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-orange-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Gross Motor Skills Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gross Motor Skills</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-1 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.grossMotorSkills.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-1 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                        {item.score}
                      </div>
                      <div className="col-span-2 p-1 text-xs">
                        {item.remarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fine Motor Skills Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Fine Motor Skills</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-1 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.fineMotorSkills.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-1 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                        {item.score}
                      </div>
                      <div className="col-span-2 p-1 text-xs">
                        {item.remarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Body Awareness Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Body Awareness</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                  <div className="col-span-7 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                  <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Score</div>
                  <div className="col-span-2 p-1 text-center font-bold text-xs">Remarks</div>
                </div>
                {template.bodyAwareness.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                        {index + 1}
                      </div>
                      <div className="col-span-7 border-r border-black p-1 text-xs">
                        {item.test}
                      </div>
                      <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                        {item.score}
                      </div>
                      <div className="col-span-2 p-1 text-xs">
                        {item.remarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-orange-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {template.interpretation}
                  </p>
                </div>
              </div>
            )}

            {template.conclusions && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Comprehension</h2>
                <div className="bg-blue-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {template.conclusions}
                  </p>
                </div>
              </div>
            )}

            {template.recommendations && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h2>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {template.recommendations}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BKTTemplate;
