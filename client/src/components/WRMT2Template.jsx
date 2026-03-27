import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const WRMT2Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'WOODCOCK READING MASTERY TESTS-II (WRMT-II)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `The Woodcock Reading Mastery Tests-III are individually administered, timed tests measuring Basic Skills, Reading Comprehension, Oral Reading Fluency and Listening Comprehension. Area tests of the Woodcock Reading Mastery Tests-III include: Basic Skills: Measures the ability to read words and includes the sub tests: Word Identification and Word Attack. Reading Comprehension: Measures understanding of words and the ability to read and understand and includes the sub tests: Word Comprehension-Antonyms, Synonyms, Analogies and Passage Comprehension. Oral Reading Fluency: Measures the ability to read fluently and integrate reading abilities such as decoding, expression, and phrasing. The above sub tests are used to calculate students' Total Test Performance. Listening Comprehension: Measures the ability to listen to short passages and verbally respond to questions about their content.`,
    
    subtests: [
      {
        name: 'Word Identification',
        description: 'Measures the ability to read words in isolation',
        rawScore: 0,
        standardScore: 88,
        ageEquivalent: '9:3',
        relativeProficiencyIndex: '48/90',
        percentileRank: 7,
        descriptiveCategory: 'Average',
        items: [
          { id: 1, item: 'Word Recognition: cat', response: '', correct: true },
          { id: 2, item: 'Word Recognition: dog', response: '', correct: true },
          { id: 3, item: 'Word Recognition: house', response: '', correct: true },
          { id: 4, item: 'Word Recognition: tree', response: '', correct: true },
          { id: 5, item: 'Word Recognition: book', response: '', correct: true },
          { id: 6, item: 'Word Recognition: school', response: '', correct: true },
          { id: 7, item: 'Word Recognition: friend', response: '', correct: true },
          { id: 8, item: 'Word Recognition: happy', response: '', correct: true },
          { id: 9, item: 'Word Recognition: because', response: '', correct: true },
          { id: 10, item: 'Word Recognition: morning', response: '', correct: true }
        ]
      },
      {
        name: 'Word Attack',
        description: 'The ability to decode nonsense words',
        rawScore: 0,
        standardScore: 71,
        ageEquivalent: '7:3',
        relativeProficiencyIndex: '21/90',
        percentileRank: 7,
        descriptiveCategory: 'Average',
        items: [
          { id: 11, item: 'Nonsense Word 1', response: '', correct: true },
          { id: 12, item: 'Nonsense Word 2', response: '', correct: true },
          { id: 13, item: 'Nonsense Word 3', response: '', correct: true },
          { id: 14, item: 'Nonsense Word 4', response: '', correct: true },
          { id: 15, item: 'Nonsense Word 5', response: '', correct: true },
          { id: 16, item: 'Nonsense Word 6', response: '', correct: true },
          { id: 17, item: 'Nonsense Word 7', response: '', correct: true },
          { id: 18, item: 'Nonsense Word 8', response: '', correct: true },
          { id: 19, item: 'Nonsense Word 9', response: '', correct: true },
          { id: 20, item: 'Nonsense Word 10', response: '', correct: true }
        ]
      },
      {
        name: 'Word Comprehension',
        description: 'Understanding of words and includes subtests: Antonyms, Synonyms, Analogies, and Passage Comprehension',
        subtests: [
          {
            name: 'Antonyms',
            description: 'Provide an opposite word',
            rawScore: 0,
            standardScore: 7,
            ageEquivalent: '3:21',
            relativeProficiencyIndex: '12/90',
            percentileRank: 9,
            descriptiveCategory: 'Very Low',
            items: [
              { id: 21, item: 'Hot - Cold', response: 'cold', correct: true },
              { id: 22, item: 'Big - Small', response: 'small', correct: true },
              { id: 23, item: 'Fast - Slow', response: 'slow', correct: true },
              { id: 24, item: 'Happy - Sad', response: 'sad', correct: true },
              { id: 25, item: 'Light - Dark', response: 'dark', correct: true },
              { id: 26, item: 'Up - Down', response: 'down', correct: true },
              { id: 27, item: 'Good - Bad', response: 'bad', correct: true },
              { id: 28, item: 'Hard - Soft', response: 'soft', correct: true },
              { id: 29, item: 'Old - New', response: 'new', correct: true },
              { id: 30, item: 'In - Out', response: 'out', correct: true }
            ]
          },
          {
            name: 'Synonyms',
            description: 'Provide a word with a similar meaning',
            rawScore: 0,
            standardScore: 48,
            ageEquivalent: '8:4',
            relativeProficiencyIndex: '28/90',
            percentileRank: 49,
            descriptiveCategory: 'Average',
            items: [
              { id: 31, item: 'Happy - Joyful', response: 'joyful', correct: true },
              { id: 32, item: 'Fast - Quick', response: 'quick', correct: true },
              { id: 33, item: 'Big - Large', response: 'large', correct: true },
              { id: 34, item: 'Beautiful - Pretty', response: 'pretty', correct: true },
              { id: 35, item: 'Smart - Intelligent', response: 'intelligent', correct: true },
              { id: 36, item: 'Strong - Weak', response: 'weak', correct: true },
              { id: 37, item: 'Brave - Cowardly', response: 'cowardly', correct: true },
              { id: 38, item: 'Rich - Poor', response: 'poor', correct: true },
              { id: 39, item: 'Clean - Dirty', response: 'dirty', correct: true },
              { id: 40, item: 'Kind - Cruel', response: 'cruel', correct: true }
            ]
          },
          {
            name: 'Analogies',
            description: 'Compare a pair of words and use their relationship to create another pair',
            rawScore: 0,
            standardScore: 50,
            ageEquivalent: '10:11',
            relativeProficiencyIndex: '51/90',
            percentileRank: 51,
            descriptiveCategory: 'Average',
            items: [
              { id: 41, item: 'Dog is to puppy as cat is to kitten', response: 'kitten', correct: true },
              { id: 42, item: 'Hand is to glove as foot is to sock', response: 'sock', correct: true },
              { id: 43, item: 'Hot is to cold as up is to down', response: 'down', correct: true },
              { id: 44, item: 'Big is to small as tall is to short', response: 'short', correct: true },
              { id: 45, item: 'Day is to night as light is to dark', response: 'dark', correct: true },
              { id: 46, item: 'Happy is to sad as smile is to frown', response: 'frown', correct: true },
              { id: 47, item: 'Fast is to slow as run is to walk', response: 'walk', correct: true },
              { id: 48, item: 'Old is to new as ancient is to modern', response: 'modern', correct: true },
              { id: 49, item: 'Good is to bad as angel is to devil', response: 'devil', correct: true },
              { id: 50, item: 'Hard is to soft as rock is to feather', response: 'feather', correct: true }
            ]
          },
          {
            name: 'Passage Comprehension',
            description: 'Read a short passage and provide the missing word',
            rawScore: 0,
            standardScore: 51,
            ageEquivalent: '10:11',
            relativeProficiencyIndex: '52/90',
            percentileRank: 52,
            descriptiveCategory: 'Average',
            items: [
              { id: 51, item: 'Passage 1 - Missing Word', response: '', correct: true },
              { id: 52, item: 'Passage 2 - Missing Word', response: '', correct: true },
              { id: 53, item: 'Passage 3 - Missing Word', response: '', correct: true },
              { id: 54, item: 'Passage 4 - Missing Word', response: '', correct: true },
              { id: 55, item: 'Passage 5 - Missing Word', response: '', correct: true },
              { id: 56, item: 'Passage 6 - Missing Word', response: '', correct: true },
              { id: 57, item: 'Passage 7 - Missing Word', response: '', correct: true },
              { id: 58, item: 'Passage 8 - Missing Word', response: '', correct: true },
              { id: 59, item: 'Passage 9 - Missing Word', response: '', correct: true },
              { id: 60, item: 'Passage 10 - Missing Word', response: '', correct: true }
            ]
          }
        ]
      },
      {
        name: 'Oral Reading Fluency',
        description: 'Measures the ability to read fluently and integrate reading abilities such as decoding, expression, and phrasing',
        rawScore: 0,
        standardScore: 95,
        ageEquivalent: '11:10',
        relativeProficiencyIndex: '95/90',
        percentileRank: 101,
        descriptiveCategory: 'Very High',
        items: [
          { id: 61, item: 'Fluency Passage 1 - Time: 30 seconds', response: '', correct: true, timeTaken: 30 },
          { id: 62, item: 'Fluency Passage 2 - Time: 25 seconds', response: '', correct: true, timeTaken: 25 },
          { id: 63, item: 'Fluency Passage 3 - Time: 35 seconds', response: '', correct: true, timeTaken: 35 },
          { id: 64, item: 'Fluency Passage 4 - Time: 28 seconds', response: '', correct: true, timeTaken: 28 },
          { id: 65, item: 'Fluency Passage 5 - Time: 32 seconds', response: '', correct: true, timeTaken: 32 },
          { id: 66, item: 'Fluency Passage 6 - Time: 29 seconds', response: '', correct: true, timeTaken: 29 },
          { id: 67, item: 'Fluency Passage 7 - Time: 31 seconds', response: '', correct: true, timeTaken: 31 },
          { id: 68, item: 'Fluency Passage 8 - Time: 27 seconds', response: '', correct: true, timeTaken: 27 },
          { id: 69, item: 'Fluency Passage 9 - Time: 33 seconds', response: '', correct: true, timeTaken: 33 },
          { id: 70, item: 'Fluency Passage 10 - Time: 26 seconds', response: '', correct: true, timeTaken: 26 }
        ]
      },
      {
        name: 'Listening Comprehension',
        description: 'Measures the ability to listen to short passages and verbally respond to questions about their content',
        rawScore: 0,
        standardScore: 101,
        ageEquivalent: '11:10',
        relativeProficiencyIndex: '123/90',
        percentileRank: 11,
        descriptiveCategory: 'Very High',
        items: [
          { id: 71, item: 'Listening Passage 1 - Question 1', response: '', correct: true },
          { id: 72, item: 'Listening Passage 1 - Question 2', response: '', correct: true },
          { id: 73, item: 'Listening Passage 1 - Question 3', response: '', correct: true },
          { id: 74, item: 'Listening Passage 1 - Question 4', response: '', correct: true },
          { id: 75, item: 'Listening Passage 1 - Question 5', response: '', correct: true },
          { id: 76, item: 'Listening Passage 2 - Question 1', response: '', correct: true },
          { id: 77, item: 'Listening Passage 2 - Question 2', response: '', correct: true },
          { id: 78, item: 'Listening Passage 2 - Question 3', response: '', correct: true },
          { id: 79, item: 'Listening Passage 2 - Question 4', response: '', correct: true },
          { id: 80, item: 'Listening Passage 2 - Question 5', response: '', correct: true },
          { id: 81, item: 'Listening Passage 3 - Question 1', response: '', correct: true },
          { id: 82, item: 'Listening Passage 3 - Question 2', response: '', correct: true },
          { id: 83, item: 'Listening Passage 3 - Question 3', response: '', correct: true },
          { id: 84, item: 'Listening Passage 3 - Question 4', response: '', correct: true },
          { id: 85, item: 'Listening Passage 3 - Question 5', response: '', correct: true }
        ]
      }
    ],

    totalTestPerformance: {
      standardScore: 95,
      ageEquivalent: '11:10',
      relativeProficiencyIndex: '99/90',
      percentileRank: 101,
      descriptiveCategory: 'Very High'
    },

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
            (field === 'percentileRank' ? parseInt(value) || 0 : parseInt(value) || 0) : value 
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

  const handleTotalPerformanceChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      totalTestPerformance: {
        ...prev.totalTestPerformance,
        [field]: field === 'standardScore' || field === 'ageEquivalent' || field === 'percentileRank' ? 
          (field === 'percentileRank' ? parseInt(value) || 0 : parseInt(value) || 0) : value 
      }
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
            <h3 className="text-lg font-semibold mb-3">Total Test Performance</h3>
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Score</label>
                <p className="mt-1 text-2xl font-bold text-center">{template.totalTestPerformance.standardScore}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Equivalent</label>
                <p className="mt-1 text-2xl font-bold text-center">{template.totalTestPerformance.ageEquivalent}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relative Proficiency Index</label>
                <p className="mt-1 text-2xl font-bold text-center">{template.totalTestPerformance.relativeProficiencyIndex}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                <p className="mt-1 text-2xl font-bold text-center">{template.totalTestPerformance.percentileRank}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descriptive Category</label>
                <p className="mt-1 text-center">
                  <span className={`px-3 py-1 rounded-full text-lg ${getDescriptiveColor(template.totalTestPerformance.descriptiveCategory)}`}>
                    {template.totalTestPerformance.descriptiveCategory}
                  </span>
                </p>
              </div>
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
                    <th className="border border-gray-300 px-4 py-2 text-center">Age Equivalent</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">RPI</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Percentile Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Descriptive Category</th>
                  </tr>
                </thead>
                <tbody>
                  {template.subtests.map((subtest, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{subtest.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.standardScore}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.ageEquivalent}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{subtest.relativeProficiencyIndex}</td>
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
            onClick={() => setActiveTab('total')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'total'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Total Performance
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
                  <label className="block text-sm font-medium text-gray-700">Age Equivalent</label>
                  <input
                    type="text"
                    value={subtest.ageEquivalent}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'ageEquivalent', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Relative Proficiency Index</label>
                  <input
                    type="text"
                    value={subtest.relativeProficiencyIndex}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'relativeProficiencyIndex', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                  <input
                    type="number"
                    value={subtest.percentileRank}
                    onChange={(e) => handleSubtestScore(subtestIndex, 'percentileRank', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
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
                      {item.timeTaken !== undefined && (
                        <span className="ml-2 text-xs text-gray-500">Time: {item.timeTaken}s</span>
                      )}
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

      {activeTab === 'total' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Total Test Performance</h3>
            <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700">Standard Score</label>
                <input
                  type="number"
                  value={template.totalTestPerformance.standardScore}
                  onChange={(e) => handleTotalPerformanceChange('standardScore', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Equivalent</label>
                <input
                  type="text"
                  value={template.totalTestPerformance.ageEquivalent}
                  onChange={(e) => handleTotalPerformanceChange('ageEquivalent', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relative Proficiency Index</label>
                <input
                  type="text"
                  value={template.totalTestPerformance.relativeProficiencyIndex}
                  onChange={(e) => handleTotalPerformanceChange('relativeProficiencyIndex', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                <input
                  type="number"
                  value={template.totalTestPerformance.percentileRank}
                  onChange={(e) => handleTotalPerformanceChange('percentileRank', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descriptive Category</label>
                <select
                  value={template.totalTestPerformance.descriptiveCategory}
                  onChange={(e) => handleTotalPerformanceChange('descriptiveCategory', e.target.value)}
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
              placeholder="Enter your interpretation of WRMT-II results..."
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

export default WRMT2Template;
