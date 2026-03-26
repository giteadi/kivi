import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const RIPAPrimaryTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning. It can be used to develop and guide rehabilitation goals and objectives based on individual strengths and weaknesses.`,
    subtests: [
      {
        name: 'Immediate Memory',
        description: 'In this subtest, the child is required to repeat numbers, words and sentences of increasing length and complexity.',
        standardScore: 0,
        percentileRank: 0,
        items: [
          { id: 1, task: 'Repeat 2-digit number', response: '', maxScore: 2 },
          { id: 2, task: 'Repeat 3-digit number', response: '', maxScore: 3 },
          { id: 3, task: 'Repeat 4-digit number', response: '', maxScore: 4 },
          { id: 4, task: 'Repeat 2-word sequence', response: '', maxScore: 2 },
          { id: 5, task: 'Repeat 3-word sequence', response: '', maxScore: 3 },
          { id: 6, task: 'Repeat 4-word sequence', response: '', maxScore: 4 },
          { id: 7, task: 'Repeat simple sentence', response: '', maxScore: 3 },
          { id: 8, task: 'Repeat complex sentence', response: '', maxScore: 4 }
        ]
      },
      {
        name: 'Recent Memory',
        description: 'In this subtest, the child is required to recall specific newly acquired information relative to his or her environment and daily activity. Each question requires a verbal response which is assessed for accuracy and appropriateness.',
        standardScore: 0,
        percentileRank: 0,
        items: [
          { id: 9, task: 'Recall daily activities', response: '', maxScore: 3 },
          { id: 10, task: 'Recall recent events', response: '', maxScore: 3 },
          { id: 11, task: 'Recall personal information', response: '', maxScore: 2 },
          { id: 12, task: 'Recall environmental details', response: '', maxScore: 3 },
          { id: 13, task: 'Recall temporal information', response: '', maxScore: 2 },
          { id: 14, task: 'Recall spatial information', response: '', maxScore: 3 },
          { id: 15, task: 'Recall functional information', response: '', maxScore: 2 },
          { id: 16, task: 'Recall social information', response: '', maxScore: 3 }
        ]
      },
      {
        name: 'Recall of General Information',
        description: 'This subtest assesses the child\'s ability to recall general information in remote memory.',
        standardScore: 0,
        percentileRank: 0,
        items: [
          { id: 17, task: 'General knowledge question 1', response: '', maxScore: 2 },
          { id: 18, task: 'General knowledge question 2', response: '', maxScore: 2 },
          { id: 19, task: 'General knowledge question 3', response: '', maxScore: 2 },
          { id: 20, task: 'General knowledge question 4', response: '', maxScore: 2 },
          { id: 21, task: 'General knowledge question 5', response: '', maxScore: 2 },
          { id: 22, task: 'General knowledge question 6', response: '', maxScore: 2 },
          { id: 23, task: 'General knowledge question 7', response: '', maxScore: 2 },
          { id: 24, task: 'General knowledge question 8', response: '', maxScore: 2 }
        ]
      },
      {
        name: 'Spatial Orientation',
        description: 'In this subtest, the child answers questions related to spatial concepts and orientation. Elicitation of accurate responses requires recall from both recent and remote memory. Spatial concepts require organization skills, including categorization and sequencing.',
        standardScore: 0,
        percentileRank: 0,
        items: [
          { id: 25, task: 'Identify left/right', response: '', maxScore: 2 },
          { id: 26, task: 'Identify positions', response: '', maxScore: 2 },
          { id: 27, task: 'Spatial relationships', response: '', maxScore: 3 },
          { id: 28, task: 'Directional concepts', response: '', maxScore: 2 },
          { id: 29, task: 'Object positioning', response: '', maxScore: 3 },
          { id: 30, task: 'Environmental orientation', response: '', maxScore: 2 },
          { id: 31, task: 'Body orientation', response: '', maxScore: 2 },
          { id: 32, task: 'Spatial sequencing', response: '', maxScore: 3 }
        ]
      }
    ],
    memoryQuotient: 0,
    compositeScore: 0,
    tScore: 0,
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

  const handleItemResponse = (subtestIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, sIndex) => 
        sIndex === subtestIndex 
          ? {
              ...subtest,
              items: subtest.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, response: value } : item
              )
            }
          : subtest
      )
    }));
  };

  const calculateScores = () => {
    const updatedSubtests = template.subtests.map(subtest => {
      const totalScore = subtest.items.reduce((sum, item) => {
        const response = parseInt(item.response) || 0;
        return sum + Math.min(response, item.maxScore);
      }, 0);
      const maxPossibleScore = subtest.items.reduce((sum, item) => sum + item.maxScore, 0);
      const standardScore = Math.round((totalScore / maxPossibleScore) * 100 + 50); // Convert to standard score
      const percentileRank = calculatePercentile(standardScore);
      
      return {
        ...subtest,
        standardScore,
        percentileRank,
        totalScore
      };
    });

    // Calculate Memory Quotient (average of subtest standard scores)
    const memoryQuotient = Math.round(
      updatedSubtests.reduce((sum, subtest) => sum + subtest.standardScore, 0) / updatedSubtests.length
    );

    // Calculate Composite Score
    const compositeScore = Math.round(
      updatedSubtests.reduce((sum, subtest) => sum + subtest.standardScore, 0) / updatedSubtests.length
    );

    // Calculate T-Score (standard score with mean=50, SD=10)
    const tScore = Math.round(((compositeScore - 100) / 15) * 10 + 50);

    // Generate interpretation
    const interpretation = generateInterpretation(memoryQuotient);

    setTemplate(prev => ({
      ...prev,
      subtests: updatedSubtests,
      memoryQuotient,
      compositeScore,
      tScore,
      interpretation
    }));
  };

  const calculatePercentile = (standardScore) => {
    if (standardScore >= 130) return 98;
    if (standardScore >= 120) return 91;
    if (standardScore >= 110) return 75;
    if (standardScore >= 100) return 50;
    if (standardScore >= 90) return 25;
    if (standardScore >= 80) return 9;
    if (standardScore >= 70) return 2;
    return 1;
  };

  const generateInterpretation = (memoryQuotient) => {
    if (memoryQuotient >= 110) return 'no deficits in the areas of information processing skills (memory)';
    if (memoryQuotient >= 90) return 'minimal deficits in the areas of information processing skills (memory)';
    if (memoryQuotient >= 80) return 'mild deficits in the areas of information processing skills (memory)';
    if (memoryQuotient >= 70) return 'moderate deficits in the areas of information processing skills (memory)';
    return 'significant deficits in the areas of information processing skills (memory)';
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
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY</h1>
                <p className="text-gray-600">Cognitive-linguistic assessment for ages 5-0 to 12-11</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Subtests */}
            {template.subtests.map((subtest, subtestIndex) => (
              <div key={subtestIndex} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{subtest.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{subtest.description}</p>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">ID</div>
                    <div className="col-span-7 border-r border-black p-2 text-center font-bold text-xs">Task</div>
                    <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Response</div>
                    <div className="col-span-2 p-2 text-center font-bold text-xs">Max Score</div>
                  </div>
                  {subtest.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-7 border-r border-black p-2 text-xs">
                          {item.task}
                        </div>
                        <div className="col-span-2 border-r border-black p-2">
                          <input
                            type="number"
                            value={item.response}
                            onChange={(e) => handleItemResponse(subtestIndex, itemIndex, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500"
                            placeholder="0"
                            min="0"
                            max={item.maxScore}
                          />
                        </div>
                        <div className="col-span-2 p-2 text-center text-xs">
                          {item.maxScore}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memory Quotient</label>
                  <input
                    type="text"
                    value={template.memoryQuotient}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Composite Score</label>
                  <input
                    type="text"
                    value={template.compositeScore}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">T-Score</label>
                  <input
                    type="text"
                    value={template.tScore}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
                  <input
                    type="text"
                    value={template.interpretation}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2 transition-colors"
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
                ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-emerald-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-emerald-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-emerald-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Subtest Results */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest and standard score results are as follows:</h2>
              <div className="border border-black">
                <div className="grid grid-cols-3 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">RIPA</div>
                  <div className="p-2 text-center font-bold text-xs">Standard Scores</div>
                </div>
                {template.subtests.map((subtest, index) => (
                  <div key={index} className="border-b border-black">
                    <div className="grid grid-cols-3">
                      <div className="col-span-2 border-r border-black p-2 text-xs">
                        {subtest.name}
                      </div>
                      <div className="p-2 text-center text-xs">
                        {subtest.standardScore}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory Quotient and Scores */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Memory Quotient & Composite Score</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-emerald-800 mb-2">Memory Quotient</h3>
                  <p className="text-2xl font-bold text-emerald-600">{template.memoryQuotient}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Composite Score</h3>
                  <p className="text-2xl font-bold text-blue-600">{template.compositeScore}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">T-Score</h3>
                  <p className="text-2xl font-bold text-purple-600">T-{template.tScore}</p>
                </div>
              </div>
            </div>

            {/* Subtest Descriptions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest description</h2>
              {template.subtests.map((subtest, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">{subtest.name}-</h3>
                  <p className="text-gray-600 text-sm">{subtest.description}</p>
                </div>
              ))}
            </div>

            {/* Interpretation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
              <div className="bg-emerald-50 rounded-lg p-6">
                <p className="text-gray-700 font-semibold text-center">
                  {template.studentName}'s RIPA-P scores imply '{template.interpretation}'.
                </p>
              </div>
            </div>

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

export default RIPAPrimaryTemplate;
