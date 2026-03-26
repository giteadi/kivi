import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const TAPS3Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Test of Auditory Processing Skills (Third Edition; TAPS-3) is a measure of auditory skill important to the development, use, and understanding of the language used in academic instruction. It includes subtests designed to assess basic phonological skills (which are important to learning to read), memory abilities (essential to processing information), and auditory cohesion (which requires not only understanding, but also the ability to use inference, deduction and abstraction to comprehend the meaning of verbally presented information). The scores below serve to show a student's performance on these auditory tasks in comparison to a normative sample of his same age peers, as well as to compare his performance on different subtests.`,
    subtests: [
      {
        name: 'Word Discrimination',
        category: 'Phonological',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 36,
        items: [
          { id: 1, item: 'Word pair 1', response: '', correct: true },
          { id: 2, item: 'Word pair 2', response: '', correct: true },
          { id: 3, item: 'Word pair 3', response: '', correct: true },
          { id: 4, item: 'Word pair 4', response: '', correct: true },
          { id: 5, item: 'Word pair 5', response: '', correct: true },
          { id: 6, item: 'Word pair 6', response: '', correct: true },
          { id: 7, item: 'Word pair 7', response: '', correct: true },
          { id: 8, item: 'Word pair 8', response: '', correct: true },
          { id: 9, item: 'Word pair 9', response: '', correct: true },
          { id: 10, item: 'Word pair 10', response: '', correct: true },
          { id: 11, item: 'Word pair 11', response: '', correct: true },
          { id: 12, item: 'Word pair 12', response: '', correct: true }
        ]
      },
      {
        name: 'Phonological Segmentation',
        category: 'Phonological',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 13, item: 'Segment word 1', response: '', correct: true },
          { id: 14, item: 'Segment word 2', response: '', correct: true },
          { id: 15, item: 'Segment word 3', response: '', correct: true },
          { id: 16, item: 'Segment word 4', response: '', correct: true },
          { id: 17, item: 'Segment word 5', response: '', correct: true },
          { id: 18, item: 'Segment word 6', response: '', correct: true },
          { id: 19, item: 'Segment word 7', response: '', correct: true },
          { id: 20, item: 'Segment word 8', response: '', correct: true },
          { id: 21, item: 'Segment word 9', response: '', correct: true },
          { id: 22, item: 'Segment word 10', response: '', correct: true }
        ]
      },
      {
        name: 'Phonological Blending',
        category: 'Phonological',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 23, item: 'Blend sounds 1', response: '', correct: true },
          { id: 24, item: 'Blend sounds 2', response: '', correct: true },
          { id: 25, item: 'Blend sounds 3', response: '', correct: true },
          { id: 26, item: 'Blend sounds 4', response: '', correct: true },
          { id: 27, item: 'Blend sounds 5', response: '', correct: true },
          { id: 28, item: 'Blend sounds 6', response: '', correct: true },
          { id: 29, item: 'Blend sounds 7', response: '', correct: true },
          { id: 30, item: 'Blend sounds 8', response: '', correct: true },
          { id: 31, item: 'Blend sounds 9', response: '', correct: true },
          { id: 32, item: 'Blend sounds 10', response: '', correct: true }
        ]
      },
      {
        name: 'Number Memory Forward',
        category: 'Memory',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 33, item: 'Repeat 2 numbers', response: '', correct: true },
          { id: 34, item: 'Repeat 3 numbers', response: '', correct: true },
          { id: 35, item: 'Repeat 4 numbers', response: '', correct: true },
          { id: 36, item: 'Repeat 5 numbers', response: '', correct: true },
          { id: 37, item: 'Repeat 6 numbers', response: '', correct: true },
          { id: 38, item: 'Repeat 7 numbers', response: '', correct: true },
          { id: 39, item: 'Repeat 8 numbers', response: '', correct: true },
          { id: 40, item: 'Repeat 9 numbers', response: '', correct: true },
          { id: 41, item: 'Repeat 10 numbers', response: '', correct: true }
        ]
      },
      {
        name: 'Number Memory Reversed',
        category: 'Memory',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 18,
        items: [
          { id: 42, item: 'Reverse 2 numbers', response: '', correct: true },
          { id: 43, item: 'Reverse 3 numbers', response: '', correct: true },
          { id: 44, item: 'Reverse 4 numbers', response: '', correct: true },
          { id: 45, item: 'Reverse 5 numbers', response: '', correct: true },
          { id: 46, item: 'Reverse 6 numbers', response: '', correct: true },
          { id: 47, item: 'Reverse 7 numbers', response: '', correct: true }
        ]
      },
      {
        name: 'Word Memory',
        category: 'Memory',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 24,
        items: [
          { id: 48, item: 'Recall 2 words', response: '', correct: true },
          { id: 49, item: 'Recall 3 words', response: '', correct: true },
          { id: 50, item: 'Recall 4 words', response: '', correct: true },
          { id: 51, item: 'Recall 5 words', response: '', correct: true },
          { id: 52, item: 'Recall 6 words', response: '', correct: true },
          { id: 53, item: 'Recall 7 words', response: '', correct: true },
          { id: 54, item: 'Recall 8 words', response: '', correct: true }
        ]
      },
      {
        name: 'Sentence Memory',
        category: 'Memory',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 55, item: 'Recall sentence 1', response: '', correct: true },
          { id: 56, item: 'Recall sentence 2', response: '', correct: true },
          { id: 57, item: 'Recall sentence 3', response: '', correct: true },
          { id: 58, item: 'Recall sentence 4', response: '', correct: true },
          { id: 59, item: 'Recall sentence 5', response: '', correct: true },
          { id: 60, item: 'Recall sentence 6', response: '', correct: true },
          { id: 61, item: 'Recall sentence 7', response: '', correct: true },
          { id: 62, item: 'Recall sentence 8', response: '', correct: true },
          { id: 63, item: 'Recall sentence 9', response: '', correct: true },
          { id: 64, item: 'Recall sentence 10', response: '', correct: true }
        ]
      },
      {
        name: 'Auditory Comprehension',
        category: 'Cohesion',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 65, item: 'Comprehension 1', response: '', correct: true },
          { id: 66, item: 'Comprehension 2', response: '', correct: true },
          { id: 67, item: 'Comprehension 3', response: '', correct: true },
          { id: 68, item: 'Comprehension 4', response: '', correct: true },
          { id: 69, item: 'Comprehension 5', response: '', correct: true },
          { id: 70, item: 'Comprehension 6', response: '', correct: true },
          { id: 71, item: 'Comprehension 7', response: '', correct: true },
          { id: 72, item: 'Comprehension 8', response: '', correct: true },
          { id: 73, item: 'Comprehension 9', response: '', correct: true },
          { id: 74, item: 'Comprehension 10', response: '', correct: true }
        ]
      },
      {
        name: 'Auditory Reasoning',
        category: 'Cohesion',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 18,
        items: [
          { id: 75, item: 'Reasoning 1', response: '', correct: true },
          { id: 76, item: 'Reasoning 2', response: '', correct: true },
          { id: 77, item: 'Reasoning 3', response: '', correct: true },
          { id: 78, item: 'Reasoning 4', response: '', correct: true },
          { id: 79, item: 'Reasoning 5', response: '', correct: true },
          { id: 80, item: 'Reasoning 6', response: '', correct: true }
        ]
      }
    ],
    phonologicIndex: 0,
    memoryIndex: 0,
    cohesionIndex: 0,
    overallIndex: 0,
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
      const correctResponses = subtest.items.filter(item => item.response === 'correct').length;
      const rawScore = correctResponses;
      const scaledScore = calculateScaledScore(rawScore, subtest.maxScore);
      const percentileRank = calculatePercentile(scaledScore);
      
      return {
        ...subtest,
        rawScore,
        scaledScore,
        percentileRank
      };
    });

    // Calculate Index Scores
    const phonologicSubtests = updatedSubtests.filter(s => s.category === 'Phonological');
    const memorySubtests = updatedSubtests.filter(s => s.category === 'Memory');
    const cohesionSubtests = updatedSubtests.filter(s => s.category === 'Cohesion');

    const phonologicIndex = calculateIndexScore(phonologicSubtests);
    const memoryIndex = calculateIndexScore(memorySubtests);
    const cohesionIndex = calculateIndexScore(cohesionSubtests);
    const overallIndex = Math.round((phonologicIndex + memoryIndex + cohesionIndex) / 3);

    // Generate interpretation
    const interpretation = generateInterpretation(overallIndex);

    setTemplate(prev => ({
      ...prev,
      subtests: updatedSubtests,
      phonologicIndex,
      memoryIndex,
      cohesionIndex,
      overallIndex,
      interpretation
    }));
  };

  const calculateScaledScore = (rawScore, maxScore) => {
    // Convert raw score to scaled score (1-20 scale)
    const percentage = (rawScore / maxScore) * 100;
    return Math.round(1 + (percentage / 100) * 19);
  };

  const calculatePercentile = (scaledScore) => {
    if (scaledScore >= 19) return 95;
    if (scaledScore >= 17) return 84;
    if (scaledScore >= 15) return 63;
    if (scaledScore >= 13) return 50;
    if (scaledScore >= 11) return 37;
    if (scaledScore >= 9) return 25;
    if (scaledScore >= 7) return 16;
    if (scaledScore >= 5) return 9;
    return 5;
  };

  const calculateIndexScore = (subtests) => {
    if (subtests.length === 0) return 0;
    const totalScaledScore = subtests.reduce((sum, subtest) => sum + subtest.scaledScore, 0);
    const averageScaledScore = totalScaledScore / subtests.length;
    // Convert to standard score (mean=100, SD=15)
    return Math.round(85 + (averageScaledScore - 10) * 2.5);
  };

  const generateInterpretation = (overallIndex) => {
    if (overallIndex >= 115) return 'above average';
    if (overallIndex >= 85) return 'average';
    if (overallIndex >= 70) return 'below average';
    return 'significantly below average';
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
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">TEST OF AUDITORY PROCESSING SKILLS-TAPS-3</h1>
                <p className="text-gray-600">Comprehensive auditory processing assessment</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Subtests */}
            {template.subtests.map((subtest, subtestIndex) => (
              <div key={subtestIndex} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{subtest.name}</h2>
                <p className="text-gray-600 text-sm mb-4">Category: {subtest.category}</p>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">ID</div>
                    <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Item</div>
                    <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Response</div>
                    <div className="col-span-1 p-2 text-center font-bold text-xs">Max</div>
                  </div>
                  {subtest.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-8 border-r border-black p-2 text-xs">
                          {item.item}
                        </div>
                        <div className="col-span-2 border-r border-black p-2">
                          <select
                            value={item.response}
                            onChange={(e) => handleItemResponse(subtestIndex, itemIndex, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
                          >
                            <option value="">Select...</option>
                            <option value="correct">Correct</option>
                            <option value="incorrect">Incorrect</option>
                          </select>
                        </div>
                        <div className="col-span-1 p-2 text-center text-xs">
                          {subtest.maxScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Index Scores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Index Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phonologic Index</label>
                  <input
                    type="text"
                    value={template.phonologicIndex}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memory Index</label>
                  <input
                    type="text"
                    value={template.memoryIndex}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cohesion Index</label>
                  <input
                    type="text"
                    value={template.cohesionIndex}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Index</label>
                  <input
                    type="text"
                    value={template.overallIndex}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center space-x-2 transition-colors"
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
                TEST OF AUDITORY PROCESSING SKILLS-TAPS-3
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-teal-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-teal-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-teal-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="bg-teal-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Subtest Results */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest and Index results are as follows:</h2>
              <div className="border border-black">
                <div className="grid grid-cols-4 border-b border-black bg-gray-100">
                  <div className="border-r border-black p-2 text-center font-bold text-xs">SUBTEST RESULTS</div>
                  <div className="border-r border-black p-2 text-center font-bold text-xs">Raw Scores</div>
                  <div className="border-r border-black p-2 text-center font-bold text-xs">Scaled Scores</div>
                  <div className="p-2 text-center font-bold text-xs">Percentile Ranks</div>
                </div>
                {template.subtests.map((subtest, index) => (
                  <div key={index} className="border-b border-black">
                    <div className="grid grid-cols-4">
                      <div className="border-r border-black p-2 text-xs">
                        {subtest.name}
                      </div>
                      <div className="border-r border-black p-2 text-center text-xs">
                        {subtest.rawScore}
                      </div>
                      <div className="border-r border-black p-2 text-center text-xs">
                        {subtest.scaledScore}
                      </div>
                      <div className="p-2 text-center text-xs">
                        {subtest.percentileRank}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Index Scores */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Index Scores</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Phonologic Index</h3>
                  <p className="text-2xl font-bold text-teal-600">Standard Score + = {template.phonologicIndex}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Memory Index</h3>
                  <p className="text-2xl font-bold text-blue-600">Standard Score † = {template.memoryIndex}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Cohesion Index</h3>
                  <p className="text-2xl font-bold text-purple-600">Standard Score * = {template.cohesionIndex}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Overall Index Score</h3>
                  <p className="text-2xl font-bold text-orange-600">+ = {template.overallIndex}</p>
                </div>
              </div>
            </div>

            {/* Chart Visualization */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">TAPS-3 Performance Chart</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-end h-32 mb-2">
                  {template.subtests.map((subtest, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-8 bg-teal-500 rounded-t"
                        style={{ height: `${(subtest.scaledScore / 20) * 100}%` }}
                      ></div>
                      <div className="text-xs mt-1 text-center transform -rotate-45 origin-left">
                        {subtest.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-4">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                  <span>15</span>
                  <span>20</span>
                </div>
                <div className="text-center text-sm text-gray-600 mt-2">
                  • Percentile Ranks • Scaled Scores • Raw Scores
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Remark</h2>
              <div className="bg-teal-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  {template.studentName}'s Overall TAPS-3 Index Standard Score is {template.overallIndex}, is in the {template.interpretation} range (85-115 average) for his chronological age.
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

export default TAPS3Template;
