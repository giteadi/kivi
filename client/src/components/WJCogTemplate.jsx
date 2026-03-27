import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const WJCogTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'WOODCOCK-JOHNSON TESTS OF COGNITIVE ABILITIES IV (WJ-Cog)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `The Woodcock-Johnson IV Tests of Cognitive Abilities (WJ IV COG) contains 18 tests each measuring a different aspect of cognitive ability. The tests combine to form a variety of clusters. Cluster scores are the primary basis for interpretative purposes. Both subtests and cluster scores are distributed with a mean of 100 and a standard deviation of 15. The tests are designed for administration to individuals aged two through adulthood. Definitions of the measured abilities are based primarily on the Cattell-Horn-Carroll (CHC) theory of cognitive abilities, of individually administered, norm-referenced tests to measure cognitive ability.`,
    
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
        name: 'COMPREHENSION KNOWLEDGE',
        description: 'Crystallized Intelligence (Gc) is the breadth and depth of a person\'s acquired knowledge of a culture and the effective application of this knowledge. Crystallized Intelligence is correlated with reading, writing, and math academic skills.',
        subtests: [
          {
            name: 'Oral Vocabulary',
            description: 'Providing a synonym or antonym for a given word',
            rawScore: 0,
            standardScore: 82,
            percentileRank: 12,
            relativeProficiencyIndex: 52,
            descriptor: 'Low Average',
            items: [
              { id: 1, item: 'Synonym for "happy"', response: 'joyful', correct: true },
              { id: 2, item: 'Antonym for "large"', response: 'small', correct: true },
              { id: 3, item: 'Synonym for "rapid"', response: 'fast', correct: true },
              { id: 4, item: 'Antonym for "ancient"', response: 'modern', correct: true },
              { id: 5, item: 'Synonym for "brave"', response: 'courageous', correct: true }
            ]
          },
          {
            name: 'General Information',
            description: 'General knowledge questions across various domains',
            rawScore: 0,
            standardScore: 99,
            percentileRank: 47,
            relativeProficiencyIndex: 89,
            descriptor: 'Average',
            items: [
              { id: 6, item: 'Capital of France', response: 'Paris', correct: true },
              { id: 7, item: 'Largest planet', response: 'Jupiter', correct: true },
              { id: 8, item: 'Author of Romeo and Juliet', response: 'Shakespeare', correct: true },
              { id: 9, item: 'Chemical symbol for gold', response: 'Au', correct: true },
              { id: 10, item: 'Number of continents', response: '7', correct: true }
            ]
          }
        ],
        clusterScore: 93,
        clusterPercentile: 32,
        clusterDescriptor: 'Average'
      },
      {
        name: 'FLUID REASONING (EXT)',
        description: 'Fluid reasoning involves the ability to solve novel problems by identifying patterns and relationships, drawing inferences, and forming and modifying concepts.',
        subtests: [
          {
            name: 'Number Series',
            description: 'Identifying patterns in number sequences',
            rawScore: 0,
            standardScore: 108,
            percentileRank: 70,
            relativeProficiencyIndex: 95,
            descriptor: 'Average',
            items: [
              { id: 11, item: '2, 4, 6, 8, ?', response: '10', correct: true },
              { id: 12, item: '1, 4, 9, 16, ?', response: '25', correct: true },
              { id: 13, item: '3, 6, 9, 12, ?', response: '15', correct: true },
              { id: 14, item: '5, 10, 15, 20, ?', response: '25', correct: true },
              { id: 15, item: '1, 3, 6, 10, ?', response: '15', correct: true }
            ]
          },
          {
            name: 'Concept Formation',
            description: 'Forming concepts by identifying rules and patterns',
            rawScore: 0,
            standardScore: 85,
            percentileRank: 16,
            relativeProficiencyIndex: 79,
            descriptor: 'Low Average',
            items: [
              { id: 16, item: 'Concept Pattern 1', response: '', correct: true },
              { id: 17, item: 'Concept Pattern 2', response: '', correct: true },
              { id: 18, item: 'Concept Pattern 3', response: '', correct: true },
              { id: 19, item: 'Concept Pattern 4', response: '', correct: true },
              { id: 20, item: 'Concept Pattern 5', response: '', correct: true }
            ]
          },
          {
            name: 'Analysis Synthesis',
            description: 'Analyzing and synthesizing information to solve problems',
            rawScore: 0,
            standardScore: 96,
            percentileRank: 39,
            relativeProficiencyIndex: 85,
            descriptor: 'Average',
            items: [
              { id: 21, item: 'Analysis Synthesis 1', response: '', correct: true },
              { id: 22, item: 'Analysis Synthesis 2', response: '', correct: true },
              { id: 23, item: 'Analysis Synthesis 3', response: '', correct: true },
              { id: 24, item: 'Analysis Synthesis 4', response: '', correct: true },
              { id: 25, item: 'Analysis Synthesis 5', response: '', correct: true }
            ]
          }
        ],
        clusterScore: 95,
        clusterPercentile: 37,
        clusterDescriptor: 'Average'
      },
      {
        name: 'SHORT-TERM WORKING MEMORY (EXT)',
        description: 'Short-term working memory involves the ability to hold and manipulate information in immediate awareness while performing other mental operations.',
        subtests: [
          {
            name: 'Verbal Attention',
            description: 'Remembering and repeating sequences of numbers and words',
            rawScore: 0,
            standardScore: 92,
            percentileRank: 30,
            relativeProficiencyIndex: 82,
            descriptor: 'Average',
            items: [
              { id: 26, item: 'Numbers: 3-7-2', response: '3-7-2', correct: true },
              { id: 27, item: 'Words: cat-dog-bird', response: 'cat-dog-bird', correct: true },
              { id: 28, item: 'Mixed: 5-cat-8', response: '5-cat-8', correct: true },
              { id: 29, item: 'Numbers: 9-4-1-6', response: '9-4-1-6', correct: true },
              { id: 30, item: 'Words: apple-orange-banana', response: 'apple-orange-banana', correct: true }
            ]
          },
          {
            name: 'Numbers Reversed',
            description: 'Repeating sequences of numbers in reverse order',
            rawScore: 0,
            standardScore: 108,
            percentileRank: 70,
            relativeProficiencyIndex: 99,
            descriptor: 'Average',
            items: [
              { id: 31, item: 'Forward: 2-5-8, Reverse: ?', response: '8-5-2', correct: true },
              { id: 32, item: 'Forward: 3-7-1-9, Reverse: ?', response: '9-1-7-3', correct: true },
              { id: 33, item: 'Forward: 4-2-6-1-8, Reverse: ?', response: '8-1-6-2-4', correct: true },
              { id: 34, item: 'Forward: 5-9-3-7, Reverse: ?', response: '7-3-9-5', correct: true },
              { id: 35, item: 'Forward: 1-4-8-2-6, Reverse: ?', response: '6-2-8-4-1', correct: true }
            ]
          }
        ],
        clusterScore: 103,
        clusterPercentile: 58,
        clusterDescriptor: 'Average'
      },
      {
        name: 'COGNITIVE EFFICIENCY',
        description: 'Cognitive efficiency involves the ability to process information automatically and quickly with minimal attention and effort.',
        subtests: [
          {
            name: 'Letter-Pattern Matching',
            description: 'Quickly identifying matching letter patterns',
            rawScore: 0,
            standardScore: 106,
            percentileRank: 66,
            relativeProficiencyIndex: 135,
            descriptor: 'Average',
            timeLimit: 120,
            items: [
              { id: 36, item: 'Pattern Match 1', response: '', correct: true, timeTaken: 0 },
              { id: 37, item: 'Pattern Match 2', response: '', correct: true, timeTaken: 0 },
              { id: 38, item: 'Pattern Match 3', response: '', correct: true, timeTaken: 0 },
              { id: 39, item: 'Pattern Match 4', response: '', correct: true, timeTaken: 0 },
              { id: 40, item: 'Pattern Match 5', response: '', correct: true, timeTaken: 0 }
            ]
          },
          {
            name: 'Numbers Reversed',
            description: 'Repeating sequences of numbers in reverse order',
            rawScore: 0,
            standardScore: 98,
            percentileRank: 45,
            relativeProficiencyIndex: 94,
            descriptor: 'Average',
            items: [
              { id: 41, item: 'Forward: 6-2-9, Reverse: ?', response: '9-2-6', correct: true },
              { id: 42, item: 'Forward: 4-8-1-5, Reverse: ?', response: '5-1-8-4', correct: true },
              { id: 43, item: 'Forward: 7-3-6-2-9, Reverse: ?', response: '9-2-6-3-7', correct: true },
              { id: 44, item: 'Forward: 1-5-9-3-7, Reverse: ?', response: '7-3-9-5-1', correct: true },
              { id: 45, item: 'Forward: 8-4-2-6-1-9, Reverse: ?', response: '9-1-6-2-4-8', correct: true }
            ]
          }
        ],
        clusterScore: 102,
        clusterPercentile: 55,
        clusterDescriptor: 'Average'
      },
      {
        name: 'GENERAL INTELLECTUAL ABILITY',
        description: 'General intellectual ability represents overall cognitive functioning across multiple domains.',
        subtests: [],
        clusterScore: 105,
        clusterPercentile: 63,
        clusterDescriptor: 'Average'
      },
      {
        name: 'GF-Gc COMPOSITE',
        description: 'The GF-Gc Composite represents the integration of fluid reasoning and crystallized intelligence abilities.',
        subtests: [],
        clusterScore: 93,
        clusterPercentile: 32,
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
                    <th className="border border-gray-300 px-4 py-2 text-left">Composite/Subtest</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Standard Score</th>
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

          <div>
            <h3 className="text-lg font-semibold mb-3">Cluster Interpretations</h3>
            <div className="space-y-4">
              {template.clusters.map((cluster, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{cluster.name}</h4>
                  <p className="text-gray-700">{cluster.description}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(cluster.clusterScore)}`}>
                      {cluster.clusterScore} ({cluster.clusterPercentile}%) - {cluster.clusterDescriptor}
                    </span>
                  </div>
                </div>
              ))}
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

              {cluster.subtests.length > 0 && (
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
              )}
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
              <div className="space-y-2">
                {template.clusters.map((cluster, index) => (
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
              placeholder="Enter your interpretation of the WJ-Cog results..."
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

export default WJCogTemplate;
