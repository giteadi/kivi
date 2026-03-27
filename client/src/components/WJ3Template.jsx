import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const WJ3Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'WJ-III - TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `The Woodcock-Johnson III Tests of Achievement (WJ-III, ACH) contains a set of norm-referenced tests that are administered individually. It is used to measure academic achievement. It is made up of 13 clusters, to help identify performance levels, determines educational progress, and identifies individual strengths and weaknesses.`,
    
    standardScoreDescriptors: [
      { range: '>130', descriptor: 'Very Superior', percentileRank: '>97th' },
      { range: '121-130', descriptor: 'Superior', percentileRank: '91st-97th' },
      { range: '111-120', descriptor: 'High Average', percentileRank: '75th-91st' },
      { range: '90-110', descriptor: 'Average', percentileRank: '25th-75th' },
      { range: '80-89', descriptor: 'Low Average', percentileRank: '9th-23rd' },
      { range: '70-79', descriptor: 'Poor', percentileRank: '2nd-8th' },
      { range: '<69', descriptor: 'Very Poor', percentileRank: '<2nd' }
    ],

    clusters: [
      {
        name: 'Brief Reading',
        description: 'Basic reading skills assessment',
        subtests: [
          {
            name: 'Letter-Word Identification',
            description: 'Ability to identify letters and words',
            rawScore: 0,
            standardScore: 99,
            percentileRank: 47,
            relativeProficiencyIndex: 88,
            descriptor: 'Average',
            items: [
              { id: 1, item: 'Letter Recognition A', response: '', correct: true },
              { id: 2, item: 'Letter Recognition B', response: '', correct: true },
              { id: 3, item: 'Word Recognition: cat', response: '', correct: true },
              { id: 4, item: 'Word Recognition: dog', response: '', correct: true },
              { id: 5, item: 'Word Recognition: house', response: '', correct: true }
            ]
          },
          {
            name: 'Passage Comprehension',
            description: 'Ability to understand written text',
            rawScore: 0,
            standardScore: 102,
            percentileRank: 61,
            relativeProficiencyIndex: 94,
            descriptor: 'Average',
            items: [
              { id: 6, item: 'Simple Sentence 1', response: '', correct: true },
              { id: 7, item: 'Simple Sentence 2', response: '', correct: true },
              { id: 8, item: 'Short Paragraph 1', response: '', correct: true },
              { id: 9, item: 'Short Paragraph 2', response: '', correct: true },
              { id: 10, item: 'Story Passage 1', response: '', correct: true }
            ]
          }
        ],
        clusterScore: 100,
        clusterPercentile: 50,
        clusterDescriptor: 'Average'
      },
      {
        name: 'Broad Reading',
        description: 'Comprehensive reading assessment',
        subtests: [
          {
            name: 'Letter-Word Identification',
            description: 'Ability to identify letters and words',
            rawScore: 0,
            standardScore: 94,
            percentileRank: 34,
            relativeProficiencyIndex: 89,
            descriptor: 'Average',
            items: [
              { id: 11, item: 'Advanced Word Recognition 1', response: '', correct: true },
              { id: 12, item: 'Advanced Word Recognition 2', response: '', correct: true },
              { id: 13, item: 'Advanced Word Recognition 3', response: '', correct: true },
              { id: 14, item: 'Advanced Word Recognition 4', response: '', correct: true },
              { id: 15, item: 'Advanced Word Recognition 5', response: '', correct: true }
            ]
          },
          {
            name: 'Passage Comprehension',
            description: 'Ability to understand written text',
            rawScore: 0,
            standardScore: 103,
            percentileRank: 58,
            relativeProficiencyIndex: 94,
            descriptor: 'Average',
            items: [
              { id: 16, item: 'Complex Paragraph 1', response: '', correct: true },
              { id: 17, item: 'Complex Paragraph 2', response: '', correct: true },
              { id: 18, item: 'Complex Paragraph 3', response: '', correct: true },
              { id: 19, item: 'Complex Paragraph 4', response: '', correct: true },
              { id: 20, item: 'Complex Paragraph 5', response: '', correct: true }
            ]
          },
          {
            name: 'Reading Fluency',
            description: 'Reading speed and accuracy',
            rawScore: 0,
            standardScore: 102,
            percentileRank: 61,
            relativeProficiencyIndex: 94,
            descriptor: 'Average',
            timeLimit: 180,
            items: [
              { id: 21, item: 'Fluency Passage 1', response: '', correct: true, timeTaken: 0 },
              { id: 22, item: 'Fluency Passage 2', response: '', correct: true, timeTaken: 0 },
              { id: 23, item: 'Fluency Passage 3', response: '', correct: true, timeTaken: 0 }
            ]
          }
        ],
        clusterScore: 97,
        clusterPercentile: 42,
        clusterDescriptor: 'Average'
      },
      {
        name: 'Brief Mathematics',
        description: 'Basic math skills assessment',
        subtests: [
          {
            name: 'Applied Problems',
            description: 'Mathematical problem solving',
            rawScore: 0,
            standardScore: 119,
            percentileRank: 89,
            relativeProficiencyIndex: 98,
            descriptor: 'High Average',
            items: [
              { id: 24, item: 'Basic Addition: 2+3', response: '5', correct: true },
              { id: 25, item: 'Basic Subtraction: 8-5', response: '3', correct: true },
              { id: 26, item: 'Word Problem 1', response: '', correct: true },
              { id: 27, item: 'Word Problem 2', response: '', correct: true },
              { id: 28, item: 'Word Problem 3', response: '', correct: true }
            ]
          },
          {
            name: 'Calculation',
            description: 'Mathematical computation skills',
            rawScore: 0,
            standardScore: 116,
            percentileRank: 86,
            relativeProficiencyIndex: 97,
            descriptor: 'High Average',
            items: [
              { id: 29, item: 'Addition: 45+23', response: '68', correct: true },
              { id: 30, item: 'Subtraction: 87-34', response: '53', correct: true },
              { id: 31, item: 'Multiplication: 6×7', response: '42', correct: true },
              { id: 32, item: 'Division: 72÷8', response: '9', correct: true },
              { id: 33, item: 'Mixed Operations 1', response: '', correct: true }
            ]
          }
        ],
        clusterScore: 117,
        clusterPercentile: 87,
        clusterDescriptor: 'High Average'
      },
      {
        name: 'Broad Mathematics',
        description: 'Comprehensive math assessment',
        subtests: [
          {
            name: 'Applied Problems',
            description: 'Mathematical problem solving',
            rawScore: 0,
            standardScore: 114,
            percentileRank: 82,
            relativeProficiencyIndex: 97,
            descriptor: 'High Average',
            items: [
              { id: 34, item: 'Advanced Word Problem 1', response: '', correct: true },
              { id: 35, item: 'Advanced Word Problem 2', response: '', correct: true },
              { id: 36, item: 'Advanced Word Problem 3', response: '', correct: true },
              { id: 37, item: 'Advanced Word Problem 4', response: '', correct: true },
              { id: 38, item: 'Advanced Word Problem 5', response: '', correct: true }
            ]
          },
          {
            name: 'Calculation',
            description: 'Mathematical computation skills',
            rawScore: 0,
            standardScore: 116,
            percentileRank: 86,
            relativeProficiencyIndex: 97,
            descriptor: 'High Average',
            items: [
              { id: 39, item: 'Advanced Calculation 1', response: '', correct: true },
              { id: 40, item: 'Advanced Calculation 2', response: '', correct: true },
              { id: 41, item: 'Advanced Calculation 3', response: '', correct: true },
              { id: 42, item: 'Advanced Calculation 4', response: '', correct: true },
              { id: 43, item: 'Advanced Calculation 5', response: '', correct: true }
            ]
          },
          {
            name: 'Math Fluency',
            description: 'Math calculation speed and accuracy',
            rawScore: 0,
            standardScore: 114,
            percentileRank: 82,
            relativeProficiencyIndex: 97,
            descriptor: 'High Average',
            timeLimit: 180,
            items: [
              { id: 44, item: 'Math Fluency 1', response: '', correct: true, timeTaken: 0 },
              { id: 45, item: 'Math Fluency 2', response: '', correct: true, timeTaken: 0 },
              { id: 46, item: 'Math Fluency 3', response: '', correct: true, timeTaken: 0 }
            ]
          }
        ],
        clusterScore: 115,
        clusterPercentile: 84,
        clusterDescriptor: 'High Average'
      },
      {
        name: 'Math Calculation Skills',
        description: 'Math computation abilities',
        subtests: [
          {
            name: 'Calculation',
            description: 'Mathematical computation skills',
            rawScore: 0,
            standardScore: 103,
            percentileRank: 58,
            relativeProficiencyIndex: 97,
            descriptor: 'Average',
            items: [
              { id: 47, item: 'Complex Calculation 1', response: '', correct: true },
              { id: 48, item: 'Complex Calculation 2', response: '', correct: true },
              { id: 49, item: 'Complex Calculation 3', response: '', correct: true },
              { id: 50, item: 'Complex Calculation 4', response: '', correct: true },
              { id: 51, item: 'Complex Calculation 5', response: '', correct: true }
            ]
          },
          {
            name: 'Math Fluency',
            description: 'Math calculation speed and accuracy',
            rawScore: 0,
            standardScore: 112,
            percentileRank: 79,
            relativeProficiencyIndex: 97,
            descriptor: 'High Average',
            timeLimit: 180,
            items: [
              { id: 52, item: 'Fluency Math 1', response: '', correct: true, timeTaken: 0 },
              { id: 53, item: 'Fluency Math 2', response: '', correct: true, timeTaken: 0 },
              { id: 54, item: 'Fluency Math 3', response: '', correct: true, timeTaken: 0 }
            ]
          }
        ],
        clusterScore: 114,
        clusterPercentile: 82,
        clusterDescriptor: 'High Average'
      },
      {
        name: 'Brief Writing',
        description: 'Basic writing skills assessment',
        subtests: [
          {
            name: 'Spelling',
            description: 'Spelling ability',
            rawScore: 0,
            standardScore: 103,
            percentileRank: 58,
            relativeProficiencyIndex: 91,
            descriptor: 'Average',
            items: [
              { id: 55, item: 'Spell: cat', response: 'cat', correct: true },
              { id: 56, item: 'Spell: house', response: 'house', correct: true },
              { id: 57, item: 'Spell: because', response: 'because', correct: true },
              { id: 58, item: 'Spell: beautiful', response: 'beautiful', correct: true },
              { id: 59, item: 'Spell: necessary', response: 'necessary', correct: true }
            ]
          },
          {
            name: 'Writing Samples',
            description: 'Writing ability and quality',
            rawScore: 0,
            standardScore: 89,
            percentileRank: 23,
            relativeProficiencyIndex: 60,
            descriptor: 'Low Average',
            items: [
              { id: 60, item: 'Write a simple sentence', response: '', score: 0 },
              { id: 61, item: 'Write about your favorite animal', response: '', score: 0 },
              { id: 62, item: 'Write a short paragraph', response: '', score: 0 },
              { id: 63, item: 'Write a story prompt', response: '', score: 0 },
              { id: 64, item: 'Write an opinion piece', response: '', score: 0 }
            ]
          }
        ],
        clusterScore: 97,
        clusterPercentile: 42,
        clusterDescriptor: 'Average'
      },
      {
        name: 'Broad Written Language',
        description: 'Comprehensive writing assessment',
        subtests: [
          {
            name: 'Spelling',
            description: 'Spelling ability',
            rawScore: 0,
            standardScore: 84,
            percentileRank: 14,
            relativeProficiencyIndex: 31,
            descriptor: 'Low Average',
            items: [
              { id: 65, item: 'Advanced Spelling 1', response: '', correct: true },
              { id: 66, item: 'Advanced Spelling 2', response: '', correct: true },
              { id: 67, item: 'Advanced Spelling 3', response: '', correct: true },
              { id: 68, item: 'Advanced Spelling 4', response: '', correct: true },
              { id: 69, item: 'Advanced Spelling 5', response: '', correct: true }
            ]
          },
          {
            name: 'Writing Samples',
            description: 'Writing ability and quality',
            rawScore: 0,
            standardScore: 97,
            percentileRank: 42,
            relativeProficiencyIndex: 84,
            descriptor: 'Average',
            items: [
              { id: 70, item: 'Complex Writing Task 1', response: '', score: 0 },
              { id: 71, item: 'Complex Writing Task 2', response: '', score: 0 },
              { id: 72, item: 'Complex Writing Task 3', response: '', score: 0 },
              { id: 73, item: 'Complex Writing Task 4', response: '', score: 0 },
              { id: 74, item: 'Complex Writing Task 5', response: '', score: 0 }
            ]
          },
          {
            name: 'Writing Fluency',
            description: 'Writing speed and quality',
            rawScore: 0,
            standardScore: 84,
            percentileRank: 14,
            relativeProficiencyIndex: 31,
            descriptor: 'Low Average',
            timeLimit: 420,
            items: [
              { id: 75, item: 'Fluency Writing 1', response: '', correct: true, timeTaken: 0 },
              { id: 76, item: 'Fluency Writing 2', response: '', correct: true, timeTaken: 0 },
              { id: 77, item: 'Fluency Writing 3', response: '', correct: true, timeTaken: 0 }
            ]
          }
        ],
        clusterScore: 88,
        clusterPercentile: 21,
        clusterDescriptor: 'Low Average'
      },
      {
        name: 'Written Expression',
        description: 'Writing expression abilities',
        subtests: [
          {
            name: 'Writing Samples',
            description: 'Writing ability and quality',
            rawScore: 0,
            standardScore: 97,
            percentileRank: 42,
            relativeProficiencyIndex: 84,
            descriptor: 'Average',
            items: [
              { id: 78, item: 'Expression Writing 1', response: '', score: 0 },
              { id: 79, item: 'Expression Writing 2', response: '', score: 0 },
              { id: 80, item: 'Expression Writing 3', response: '', score: 0 },
              { id: 81, item: 'Expression Writing 4', response: '', score: 0 },
              { id: 82, item: 'Expression Writing 5', response: '', score: 0 }
            ]
          },
          {
            name: 'Writing Fluency',
            description: 'Writing speed and quality',
            rawScore: 0,
            standardScore: 98,
            percentileRank: 45,
            relativeProficiencyIndex: 88,
            descriptor: 'Average',
            timeLimit: 420,
            items: [
              { id: 83, item: 'Expression Fluency 1', response: '', correct: true, timeTaken: 0 },
              { id: 84, item: 'Expression Fluency 2', response: '', correct: true, timeTaken: 0 },
              { id: 85, item: 'Expression Fluency 3', response: '', correct: true, timeTaken: 0 }
            ]
          }
        ],
        clusterScore: 97,
        clusterPercentile: 42,
        clusterDescriptor: 'Average'
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

  const handleSubtestScore = (clusterIndex, subtestIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      clusters: prev.clusters.map((cluster, cIndex) => 
        cIndex === clusterIndex 
          ? {
              ...cluster,
              subtests: cluster.subtests.map((subtest, sIndex) => 
                sIndex === subtestIndex ? { ...subtest, [field]: field === 'standardScore' || field === 'percentileRank' || field === 'relativeProficiencyIndex' ? parseInt(value) || 0 : value } : subtest
              )
            }
          : cluster
      )
    }));
  };

  const handleItemResponse = (clusterIndex, subtestIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      clusters: prev.clusters.map((cluster, cIndex) => 
        cIndex === clusterIndex 
          ? {
              ...cluster,
              subtests: cluster.subtests.map((subtest, sIndex) => 
                sIndex === subtestIndex 
                  ? {
                      ...subtest,
                      items: subtest.items.map((item, iIndex) => 
                        iIndex === itemIndex ? { ...item, response: value, correct: value.trim() !== '' } : item
                      )
                    }
                  : subtest
              )
            }
          : cluster
      )
    }));
  };

  const handleClusterScoreChange = (clusterIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      clusters: prev.clusters.map((cluster, index) => 
        index === clusterIndex ? { ...cluster, [field]: field === 'clusterScore' || field === 'clusterPercentile' ? parseInt(value) || 0 : value } : cluster
      )
    }));
  };

  const getDescriptor = (standardScore) => {
    if (standardScore >= 130) return 'Very Superior';
    if (standardScore >= 121) return 'Superior';
    if (standardScore >= 111) return 'High Average';
    if (standardScore >= 90) return 'Average';
    if (standardScore >= 80) return 'Low Average';
    if (standardScore >= 70) return 'Poor';
    return 'Very Poor';
  };

  const getScoreColor = (standardScore) => {
    if (standardScore >= 130) return 'text-purple-600 bg-purple-50';
    if (standardScore >= 121) return 'text-blue-600 bg-blue-50';
    if (standardScore >= 111) return 'text-green-600 bg-green-50';
    if (standardScore >= 90) return 'text-yellow-600 bg-yellow-50';
    if (standardScore >= 80) return 'text-orange-600 bg-orange-50';
    if (standardScore >= 70) return 'text-red-600 bg-red-50';
    return 'text-red-800 bg-red-100';
  };

  const handleSave = () => {
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('clusters');

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
            <h3 className="text-lg font-semibold mb-3">Standard Score Descriptors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Standard Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Descriptor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Percentile Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {template.standardScoreDescriptors.map((desc, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{desc.range}</td>
                      <td className="border border-gray-300 px-4 py-2">{desc.descriptor}</td>
                      <td className="border border-gray-300 px-4 py-2">{desc.percentileRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cluster and Subtest Scores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Cluster/Subtest</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Standard Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Percentile Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Relative Proficiency Index</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Descriptor</th>
                  </tr>
                </thead>
                <tbody>
                  {template.clusters.map((cluster, clusterIndex) => (
                    <React.Fragment key={clusterIndex}>
                      <tr className="bg-gray-100 font-semibold">
                        <td className="border border-gray-300 px-4 py-2">{cluster.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{cluster.clusterScore}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{cluster.clusterPercentile}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(cluster.clusterScore)}`}>
                            {cluster.clusterDescriptor}
                          </span>
                        </td>
                      </tr>
                      {cluster.subtests.map((subtest, subtestIndex) => (
                        <tr key={subtestIndex}>
                          <td className="border border-gray-300 px-4 py-2 pl-8">{subtest.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subtest.standardScore}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subtest.percentileRank}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subtest.relativeProficiencyIndex}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${getScoreColor(subtest.standardScore)}`}>
                              {subtest.descriptor}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
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
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'clusters'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Clusters
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'scores'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Score Summary
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

      {activeTab === 'clusters' && (
        <div className="space-y-6">
          {template.clusters.map((cluster, clusterIndex) => (
            <div key={clusterIndex} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{cluster.name}</h3>
              <p className="text-gray-600 mb-4">{cluster.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cluster Score</label>
                  <input
                    type="number"
                    value={cluster.clusterScore}
                    onChange={(e) => handleClusterScoreChange(clusterIndex, 'clusterScore', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cluster Percentile</label>
                  <input
                    type="number"
                    value={cluster.clusterPercentile}
                    onChange={(e) => handleClusterScoreChange(clusterIndex, 'clusterPercentile', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                  <select
                    value={cluster.clusterDescriptor}
                    onChange={(e) => handleClusterScoreChange(clusterIndex, 'clusterDescriptor', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  >
                    <option value="Very Superior">Very Superior</option>
                    <option value="Superior">Superior</option>
                    <option value="High Average">High Average</option>
                    <option value="Average">Average</option>
                    <option value="Low Average">Low Average</option>
                    <option value="Poor">Poor</option>
                    <option value="Very Poor">Very Poor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {cluster.subtests.map((subtest, subtestIndex) => (
                  <div key={subtest.name} className="border rounded p-4">
                    <h4 className="font-semibold mb-1">{subtest.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{subtest.description}</p>
                    
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Standard Score</label>
                        <input
                          type="number"
                          value={subtest.standardScore}
                          onChange={(e) => handleSubtestScore(clusterIndex, subtestIndex, 'standardScore', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                        <input
                          type="number"
                          value={subtest.percentileRank}
                          onChange={(e) => handleSubtestScore(clusterIndex, subtestIndex, 'percentileRank', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relative Proficiency</label>
                        <input
                          type="number"
                          value={subtest.relativeProficiencyIndex}
                          onChange={(e) => handleSubtestScore(clusterIndex, subtestIndex, 'relativeProficiencyIndex', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                        <select
                          value={subtest.descriptor}
                          onChange={(e) => handleSubtestScore(clusterIndex, subtestIndex, 'descriptor', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        >
                          <option value="Very Superior">Very Superior</option>
                          <option value="Superior">Superior</option>
                          <option value="High Average">High Average</option>
                          <option value="Average">Average</option>
                          <option value="Low Average">Low Average</option>
                          <option value="Poor">Poor</option>
                          <option value="Very Poor">Very Poor</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Items:</h5>
                      <div className="space-y-2">
                        {subtest.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-sm flex-1">{item.item}</span>
                            <input
                              type="text"
                              value={item.response}
                              onChange={(e) => handleItemResponse(clusterIndex, subtestIndex, subtest.items.indexOf(item), e.target.value)}
                              className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                              placeholder="Response"
                            />
                          </div>
                        ))}
                        {subtest.items.length > 3 && (
                          <p className="text-xs text-gray-500">... and {subtest.items.length - 3} more items</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scores' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Standard Score Descriptors</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Standard Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Descriptor</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Percentile Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {template.standardScoreDescriptors.map((desc, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{desc.range}</td>
                      <td className="border border-gray-300 px-4 py-2">{desc.descriptor}</td>
                      <td className="border border-gray-300 px-4 py-2">{desc.percentileRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cluster Score Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Reading Clusters</h4>
                <div className="space-y-2">
                  {template.clusters.filter(c => c.name.includes('Reading')).map((cluster, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{cluster.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{cluster.clusterScore}</span>
                        <span className="text-xs text-gray-500">({cluster.clusterPercentile}%)</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(cluster.clusterScore)}`}>
                          {cluster.clusterDescriptor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mathematics Clusters</h4>
                <div className="space-y-2">
                  {template.clusters.filter(c => c.name.includes('Math')).map((cluster, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{cluster.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{cluster.clusterScore}</span>
                        <span className="text-xs text-gray-500">({cluster.clusterPercentile}%)</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(cluster.clusterScore)}`}>
                          {cluster.clusterDescriptor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Writing Clusters</h4>
                <div className="space-y-2">
                  {template.clusters.filter(c => c.name.includes('Writing')).map((cluster, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <span className="font-medium">{cluster.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{cluster.clusterScore}</span>
                        <span className="text-xs text-gray-500">({cluster.clusterPercentile}%)</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(cluster.clusterScore)}`}>
                          {cluster.clusterDescriptor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
              placeholder="Enter your interpretation of the WJ-III results..."
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
              placeholder="Enter your recommendations based on the assessment results..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WJ3Template;
