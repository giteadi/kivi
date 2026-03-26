import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const RavensCPMTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Raven\'s Coloured Progressive Matrices',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `Raven's Coloured Progressive Matrices (CPM) is a non-verbal test designed to assess eductive ability, a component of Spearman's g factor. It is particularly useful for assessing children and individuals with language or cultural barriers. The test consists of 36 items arranged in three sets (A, AB, B) of 12 items each.`,
    sections: [
      {
        name: 'Set A',
        items: [
          { id: 1, question: 'Pattern Completion 1', answer: '', correct: 6 },
          { id: 2, question: 'Pattern Completion 2', answer: '', correct: 2 },
          { id: 3, question: 'Pattern Completion 3', answer: '', correct: 4 },
          { id: 4, question: 'Pattern Completion 4', answer: '', correct: 1 },
          { id: 5, question: 'Pattern Completion 5', answer: '', correct: 3 },
          { id: 6, question: 'Pattern Completion 6', answer: '', correct: 5 },
          { id: 7, question: 'Pattern Completion 7', answer: '', correct: 2 },
          { id: 8, question: 'Pattern Completion 8', answer: '', correct: 6 },
          { id: 9, question: 'Pattern Completion 9', answer: '', correct: 4 },
          { id: 10, question: 'Pattern Completion 10', answer: '', correct: 1 },
          { id: 11, question: 'Pattern Completion 11', answer: '', correct: 3 },
          { id: 12, question: 'Pattern Completion 12', answer: '', correct: 5 }
        ]
      },
      {
        name: 'Set AB',
        items: [
          { id: 13, question: 'Pattern Completion 13', answer: '', correct: 4 },
          { id: 14, question: 'Pattern Completion 14', answer: '', correct: 2 },
          { id: 15, question: 'Pattern Completion 15', answer: '', correct: 6 },
          { id: 16, question: 'Pattern Completion 16', answer: '', correct: 1 },
          { id: 17, question: 'Pattern Completion 17', answer: '', correct: 3 },
          { id: 18, question: 'Pattern Completion 18', answer: '', correct: 5 },
          { id: 19, question: 'Pattern Completion 19', answer: '', correct: 2 },
          { id: 20, question: 'Pattern Completion 20', answer: '', correct: 4 },
          { id: 21, question: 'Pattern Completion 21', answer: '', correct: 6 },
          { id: 22, question: 'Pattern Completion 22', answer: '', correct: 1 },
          { id: 23, question: 'Pattern Completion 23', answer: '', correct: 3 },
          { id: 24, question: 'Pattern Completion 24', answer: '', correct: 5 }
        ]
      },
      {
        name: 'Set B',
        items: [
          { id: 25, question: 'Pattern Completion 25', answer: '', correct: 6 },
          { id: 26, question: 'Pattern Completion 26', answer: '', correct: 4 },
          { id: 27, question: 'Pattern Completion 27', answer: '', correct: 2 },
          { id: 28, question: 'Pattern Completion 28', answer: '', correct: 1 },
          { id: 29, question: 'Pattern Completion 29', answer: '', correct: 3 },
          { id: 30, question: 'Pattern Completion 30', answer: '', correct: 5 },
          { id: 31, question: 'Pattern Completion 31', answer: '', correct: 2 },
          { id: 32, question: 'Pattern Completion 32', answer: '', correct: 6 },
          { id: 33, question: 'Pattern Completion 33', answer: '', correct: 4 },
          { id: 34, question: 'Pattern Completion 34', answer: '', correct: 1 },
          { id: 35, question: 'Pattern Completion 35', answer: '', correct: 3 },
          { id: 36, question: 'Pattern Completion 36', answer: '', correct: 5 }
        ]
      }
    ],
    rawScore: 0,
    percentileRank: 0,
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

  const handleAnswerChange = (sectionIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) => 
        sIndex === sectionIndex 
          ? {
              ...section,
              items: section.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, answer: value } : item
              )
            }
          : section
      )
    }));
  };

  const calculateScores = () => {
    let totalCorrect = 0;
    template.sections.forEach(section => {
      section.items.forEach(item => {
        if (parseInt(item.answer) === item.correct) {
          totalCorrect++;
        }
      });
    });
    
    setTemplate(prev => ({
      ...prev,
      rawScore: totalCorrect,
      percentileRank: calculatePercentileRank(totalCorrect)
    }));
  };

  const calculatePercentileRank = (rawScore) => {
    // Simplified percentile calculation based on normative data
    const percentiles = {
      0: 0, 1: 1, 2: 2, 3: 3, 4: 5, 5: 7, 6: 9, 7: 12, 8: 15, 9: 18,
      10: 22, 11: 25, 12: 29, 13: 33, 14: 37, 15: 42, 16: 47, 17: 52, 18: 58,
      19: 63, 20: 68, 21: 73, 22: 78, 23: 82, 24: 86, 25: 89, 26: 92, 27: 94,
      28: 96, 29: 97, 30: 98, 31: 99, 32: 99, 33: 99, 34: 100, 35: 100, 36: 100
    };
    return percentiles[rawScore] || 0;
  };

  const handleSave = () => {
    calculateScores();
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
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Raven's Coloured Progressive Matrices</h1>
                <p className="text-gray-600">Non-verbal assessment of eductive ability</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Test Sections */}
            {template.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.name}</h2>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Item</div>
                    <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Question</div>
                    <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Answer</div>
                    <div className="col-span-1 p-2 text-center font-bold text-xs">Correct</div>
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-8 border-r border-black p-2 text-xs">
                          {item.question}
                        </div>
                        <div className="col-span-2 border-r border-black p-2">
                          <input
                            type="text"
                            value={item.answer}
                            onChange={(e) => handleAnswerChange(sectionIndex, itemIndex, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                            placeholder="1-6"
                            maxLength={1}
                          />
                        </div>
                        <div className="col-span-1 p-2 text-center text-xs">
                          {item.correct}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Scores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Raw Score</label>
                  <input
                    type="text"
                    value={template.rawScore}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentile Rank</label>
                  <input
                    type="text"
                    value={template.percentileRank}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
              <textarea
                value={template.interpretation}
                onChange={(e) => handleInputChange('interpretation', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors"
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
                RAVEN'S COLOURED PROGRESSIVE MATRICES ASSESSMENT REPORT
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-indigo-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-indigo-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-indigo-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Test Sections Preview */}
            {template.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{section.name}</h2>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">Item</div>
                    <div className="col-span-8 border-r border-black p-1 text-center font-bold text-xs">Question</div>
                    <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Answer</div>
                    <div className="col-span-1 p-1 text-center font-bold text-xs">Correct</div>
                  </div>
                  {section.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-8 border-r border-black p-1 text-xs">
                          {item.question}
                        </div>
                        <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                          {item.answer}
                        </div>
                        <div className="col-span-1 p-1 text-center text-xs">
                          {item.correct}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Scores Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-800 mb-2">Raw Score</h3>
                  <p className="text-2xl font-bold text-indigo-600">{template.rawScore}/36</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Percentile Rank</h3>
                  <p className="text-2xl font-bold text-purple-600">{template.percentileRank}th</p>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {template.interpretation}
                  </p>
                </div>
              </div>
            )}

            {template.conclusions && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Conclusions</h2>
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

export default RavensCPMTemplate;
