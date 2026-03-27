import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const WRAT5Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `The WRAT-5 is a norm-referenced test that measures basic academic skills of word reading, sentence comprehension, spelling, and math computation. The WRAT-5 includes the following four subtests: Word Reading measures letter and word decoding through letter identification and word recognition. Sentence Comprehension measures an individual's ability to gain meaning from words and to comprehend ideas and information contained in sentences through use of a modified cloze. Spelling measures an individual's ability to encode sounds into written form through use of dictated spelling format containing both letters and word. Math Computation measures an individual's ability to perform basic mathematics computations through counting, identifying numbers, solving simple oral problems, and calculating written mathematics problems.`,
    
    subtests: [
      {
        name: 'Word Reading',
        description: 'Measures letter and word decoding through letter identification and word recognition',
        rawScore: 0,
        standardScore: 78,
        ageEquivalent: 8.09,
        percentileRank: 8,
        descriptiveCategory: 'Very Low',
        items: [
          { id: 1, item: 'Letter Recognition A', response: '', correct: true },
          { id: 2, item: 'Letter Recognition B', response: '', correct: true },
          { id: 3, item: 'Word Recognition: cat', response: '', correct: true },
          { id: 4, item: 'Word Recognition: dog', response: '', correct: true },
          { id: 5, item: 'Word Recognition: house', response: '', correct: true },
          { id: 6, item: 'Word Recognition: tree', response: '', correct: true },
          { id: 7, item: 'Word Recognition: book', response: '', correct: true },
          { id: 8, item: 'Word Recognition: school', response: '', correct: true },
          { id: 9, item: 'Word Recognition: friend', response: '', correct: true },
          { id: 10, item: 'Word Recognition: happy', response: '', correct: true }
        ]
      },
      {
        name: 'Sentence Comprehension',
        description: 'Measures an individual\'s ability to gain meaning from words and to comprehend ideas and information contained in sentences through use of a modified cloze',
        rawScore: 0,
        standardScore: 30,
        ageEquivalent: 97,
        percentileRank: 13.1,
        descriptiveCategory: 'Average',
        items: [
          { id: 11, item: 'Simple Sentence Completion 1', response: '', correct: true },
          { id: 12, item: 'Simple Sentence Completion 2', response: '', correct: true },
          { id: 13, item: 'Simple Sentence Completion 3', response: '', correct: true },
          { id: 14, item: 'Complex Sentence Completion 1', response: '', correct: true },
          { id: 15, item: 'Complex Sentence Completion 2', response: '', correct: true },
          { id: 16, item: 'Complex Sentence Completion 3', response: '', correct: true },
          { id: 17, item: 'Paragraph Comprehension 1', response: '', correct: true },
          { id: 18, item: 'Paragraph Comprehension 2', response: '', correct: true },
          { id: 19, item: 'Paragraph Comprehension 3', response: '', correct: true },
          { id: 20, item: 'Story Comprehension 1', response: '', correct: true }
        ]
      },
      {
        name: 'Spelling',
        description: 'Measures an individual\'s ability to encode sounds into written form through use of dictated spelling format containing both letters and word',
        rawScore: 0,
        standardScore: 43,
        ageEquivalent: 106,
        percentileRank: 17.07,
        descriptiveCategory: 'Average',
        items: [
          { id: 21, item: 'Dictated Word: cat', response: 'cat', correct: true },
          { id: 22, item: 'Dictated Word: house', response: 'house', correct: true },
          { id: 23, item: 'Dictated Word: because', response: 'because', correct: true },
          { id: 24, item: 'Dictated Word: beautiful', response: 'beautiful', correct: true },
          { id: 25, item: 'Dictated Word: friend', response: 'friend', correct: true },
          { id: 26, item: 'Dictated Word: school', response: 'school', correct: true },
          { id: 27, item: 'Dictated Word: important', response: 'important', correct: true },
          { id: 28, item: 'Dictated Word: together', response: 'together', correct: true },
          { id: 29, item: 'Dictated Word: morning', response: 'morning', correct: true },
          { id: 30, item: 'Dictated Word: yesterday', response: 'yesterday', correct: true }
        ]
      },
      {
        name: 'Math Computation',
        description: 'Measures an individual\'s ability to perform basic mathematics computations through counting, identifying numbers, solving simple oral problems, and calculating written mathematics problems',
        rawScore: 0,
        standardScore: 34,
        ageEquivalent: 86,
        percentileRank: 10.08,
        descriptiveCategory: 'Low Average',
        items: [
          { id: 31, item: 'Counting: 1-10', response: '10', correct: true },
          { id: 32, item: 'Number Recognition: 5', response: '5', correct: true },
          { id: 33, item: 'Number Recognition: 12', response: '12', correct: true },
          { id: 34, item: 'Number Recognition: 25', response: '25', correct: true },
          { id: 35, item: 'Number Recognition: 100', response: '100', correct: true },
          { id: 36, item: 'Basic Addition: 2+3', response: '5', correct: true },
          { id: 37, item: 'Basic Subtraction: 8-5', response: '3', correct: true },
          { id: 38, item: 'Basic Multiplication: 3×4', response: '12', correct: true },
          { id: 39, item: 'Basic Division: 12÷3', response: '4', correct: true },
          { id: 40, item: 'Simple Word Problem: 2+3', response: '5', correct: true },
          { id: 41, item: 'Simple Word Problem: 5 apples', response: '', correct: true },
          { id: 42, item: 'Written Computation: 45+23', response: '68', correct: true },
          { id: 43, item: 'Written Computation: 87-34', response: '53', correct: true },
          { id: 44, item: 'Written Computation: 6×7', response: '42', correct: true },
          { id: 45, item: 'Written Computation: 72÷8', response: '9', correct: true }
        ]
      }
    ],

    compositeScores: [
      {
        name: 'Reading Composite',
        description: 'Combined score from Word Reading and Sentence Comprehension',
        standardScore: 175,
        ageEquivalent: 85,
        descriptiveCategory: 'Low Average'
      }
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

  const handleSubtestScore = (subtestIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, index) => 
        index === subtestIndex ? { 
          ...subtest, 
          [field]: field === 'standardScore' || field === 'ageEquivalent' || field === 'percentileRank' ? 
            (field === 'percentileRank' ? parseFloat(value) || 0 : parseInt(value) || 0) : value 
          } : subtest
      )
    }));
  };

  const handleItemResponse = (subtestIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, index) => 
        index === subtestIndex 
          ? {
              ...subtest,
              items: subtest.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, response: value, correct: value.trim() !== '' } : item
              )
            }
          : subtest
      )
    }));
  };

  const getDescriptiveColor = (category) => {
    switch (category) {
      case 'Very Low': return 'text-red-800 bg-red-100';
      case 'Low Average': return 'text-orange-600 bg-orange-50';
      case 'Average': return 'text-yellow-600 bg-yellow-50';
      case 'High Average': return 'text-green-600 bg-green-50';
      case 'Very High': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSave = () => {
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('subtests');

  if (!isEditing) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{template.name}</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <FiEdit3 />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <p className="mt-1 text-lg font-semibold">{template.studentName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <p className="mt-1 text-lg font-semibold">{template.age}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade</label>
              <p className="mt-1 text-lg font-semibold">{template.grade}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Date</label>
              <p className="mt-1 text-lg font-semibold">{template.testDate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Subtest Scores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Subtest</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Standard Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Raw Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Age Equivalent</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Percentile Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Descriptive Category</th>
                  </tr>
                </thead>
                <tbody>
                  {template.subtests.map((subtest, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{subtest.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.standardScore}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.rawScore}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.ageEquivalent}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.percentileRank}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getDescriptiveColor(subtest.descriptiveCategory)}`}>
                          {subtest.descriptiveCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Composite Scores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Composite</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Standard Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Age Equivalent</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Descriptive Category</th>
                  </tr>
                </thead>
                <tbody>
                  {template.compositeScores.map((composite, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{composite.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{composite.standardScore}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{composite.ageEquivalent}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${getDescriptiveColor(composite.descriptiveCategory)}`}>
                          {composite.descriptiveCategory}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {template.interpretation && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Interpretation</h3>
              <p className="text-gray-700">{template.interpretation}</p>
            </div>
          )}

          {template.recommendations && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <p className="text-gray-700">{template.recommendations}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{template.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <FiEye />
            <span>Preview</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <FiX />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <FiSave />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-1 border-b">
          <button
            onClick={() => setActiveTab('subtests')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'subtests'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Subtests
          </button>
          <button
            onClick={() => setActiveTab('composites')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'composites'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Composites
          </button>
          <button
            onClick={() => setActiveTab('interpretation')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'interpretation'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Interpretation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input
            type="text"
            value={template.studentName}
            onChange={(e) => handleInputChange('studentName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="text"
            value={template.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="e.g., 10 years 6 months"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Grade</label>
          <input
            type="text"
            value={template.grade}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="e.g., 5th Grade"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Test Date</label>
          <input
            type="date"
            value={template.testDate}
            onChange={(e) => handleInputChange('testDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>

      {activeTab === 'subtests' && (
        <div className="space-y-6">
          {template.subtests.map((subtest, subtestIndex) => (
            <div key={subtest.name} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{subtest.name}</h3>
              <p className="text-gray-600 mb-4">{subtest.description}</p>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Standard Score</label>
                  <input
                    type="number"
                    value={subtest.standardScore}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'standardScore', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Raw Score</label>
                  <input
                    type="number"
                    value={subtest.rawScore}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'rawScore', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age Equivalent</label>
                  <input
                    type="text"
                    value={subtest.ageEquivalent}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'ageEquivalent', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                  <input
                    type="text"
                    value={subtest.percentileRank}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'percentileRank', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Descriptive Category</label>
                <select
                  value={subtest.descriptiveCategory}
                  onChange={(e) => handleSubtestScore(subtestIndex, 'descriptiveCategory', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="Very Low">Very Low</option>
                  <option value="Low Average">Low Average</option>
                  <option value="Average">Average</option>
                  <option value="High Average">High Average</option>
                  <option value="Very High">Very High</option>
                </select>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Items:</h5>
                <div className="space-y-2">
                  {subtest.items.slice(0, 5).map((item, itemIndex) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-sm flex-1">{item.item}</span>
                      <input
                        type="text"
                        value={item.response}
                        onChange={(e) => handleItemResponse(subtestIndex, subtest.items.indexOf(item), e.target.value)}
                        className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                        placeholder="Response"
                      />
                    </div>
                  ))}
                  {subtest.items.length > 5 && (
                    <p className="text-xs text-gray-500">... and {subtest.items.length - 5} more items</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'composites' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Composite Scores</h3>
            <div className="grid grid-cols-2 gap-6">
              {template.compositeScores.map((composite, index) => (
                <div key={index} className="border rounded p-4">
                  <h4 className="font-semibold mb-2">{composite.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{composite.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Standard Score</label>
                      <input
                        type="number"
                        value={composite.standardScore}
                        onChange={(e) => {
                          const newComposites = [...template.compositeScores];
                          newComposites[index] = { ...composite, standardScore: parseInt(e.target.value) || 0 };
                          setTemplate(prev => ({ ...prev, compositeScores: newComposites }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age Equivalent</label>
                      <input
                        type="text"
                        value={composite.ageEquivalent}
                        onChange={(e) => {
                          const newComposites = [...template.compositeScores];
                          newComposites[index] = { ...composite, ageEquivalent: e.target.value };
                          setTemplate(prev => ({ ...prev, compositeScores: newComposites }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descriptive Category</label>
                      <select
                        value={composite.descriptiveCategory}
                        onChange={(e) => {
                          const newComposites = [...template.compositeScores];
                          newComposites[index] = { ...composite, descriptiveCategory: e.target.value };
                          setTemplate(prev => ({ ...prev, compositeScores: newComposites }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      >
                        <option value="Very Low">Very Low</option>
                        <option value="Low Average">Low Average</option>
                        <option value="Average">Average</option>
                        <option value="High Average">High Average</option>
                        <option value="Very High">Very High</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interpretation' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
            <textarea
              value={template.interpretation}
              onChange={(e) => handleInputChange('interpretation', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter your interpretation of WRAT-5 results..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Conclusions</label>
            <textarea
              value={template.conclusions}
              onChange={(e) => handleInputChange('conclusions', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter your conclusions..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
            <textarea
              value={template.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter your recommendations based on assessment results..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WRAT5Template;
