import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const WISC4Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'WECHSLER\'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `The WISC-IV is a norm-referenced, individually administered test of intelligence. Ability levels were assessed using the WISC-IV as a basis for intellectual evaluation along with the administration of additional assessments to evaluate specific areas in greater depth. It provides a measure of general intelligence as well as more specific measures of verbal comprehension, perceptual reasoning, working memory, and processing speed.`,
    
    subtests: [
      // Verbal Comprehension Index (VCI) Subtests
      {
        name: 'Similarities',
        index: 'VCI',
        description: 'Abstract verbal reasoning - conceptual thinking and verbal reasoning',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 33,
        items: [
          { id: 1, item: 'How are apple and orange alike?', response: '', score: 0 },
          { id: 2, item: 'How are dog and cat alike?', response: '', score: 0 },
          { id: 3, item: 'How are poem and statue alike?', response: '', score: 0 },
          { id: 4, item: 'How are praise and punishment alike?', response: '', score: 0 },
          { id: 5, item: 'How are fly and read alike?', response: '', score: 0 }
        ]
      },
      {
        name: 'Vocabulary',
        index: 'VCI',
        description: 'Word knowledge and verbal concept formation',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 36,
        items: [
          { id: 6, item: 'What does "umbrella" mean?', response: '', score: 0 },
          { id: 7, item: 'What does "compassionate" mean?', response: '', score: 0 },
          { id: 8, item: 'What does "democracy" mean?', response: '', score: 0 },
          { id: 9, item: 'What does "hypothesis" mean?', response: '', score: 0 },
          { id: 10, item: 'What does "paradox" mean?', response: '', score: 0 }
        ]
      },
      {
        name: 'Comprehension',
        index: 'VCI',
        description: 'Social judgment and practical knowledge',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 33,
        items: [
          { id: 11, item: 'Why should we pay taxes?', response: '', score: 0 },
          { id: 12, item: 'Why do we have laws?', response: '', score: 0 },
          { id: 13, item: 'What should you do if you find a lost wallet?', response: '', score: 0 },
          { id: 14, item: 'Why is it important to vote?', response: '', score: 0 },
          { id: 15, item: 'What is the purpose of newspapers?', response: '', score: 0 }
        ]
      },
      
      // Perceptual Reasoning Index (PRI) Subtests
      {
        name: 'Block Design',
        index: 'PRI',
        description: 'Spatial analysis, visual-motor coordination, and abstract reasoning',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 68,
        items: [
          { id: 16, item: 'Block Design Item 1', timeBonus: 0, score: 0 },
          { id: 17, item: 'Block Design Item 2', timeBonus: 0, score: 0 },
          { id: 18, item: 'Block Design Item 3', timeBonus: 0, score: 0 },
          { id: 19, item: 'Block Design Item 4', timeBonus: 0, score: 0 },
          { id: 20, item: 'Block Design Item 5', timeBonus: 0, score: 0 }
        ]
      },
      {
        name: 'Picture Concepts',
        index: 'PRI',
        description: 'Categorical and abstract reasoning',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 28,
        items: [
          { id: 21, item: 'Picture Concepts Item 1', response: '', score: 0 },
          { id: 22, item: 'Picture Concepts Item 2', response: '', score: 0 },
          { id: 23, item: 'Picture Concepts Item 3', response: '', score: 0 },
          { id: 24, item: 'Picture Concepts Item 4', response: '', score: 0 },
          { id: 25, item: 'Picture Concepts Item 5', response: '', score: 0 }
        ]
      },
      {
        name: 'Matrix Reasoning',
        index: 'PRI',
        description: 'Fluid reasoning, visual information processing, and abstract reasoning',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 35,
        items: [
          { id: 26, item: 'Matrix Reasoning Item 1', response: '', score: 0 },
          { id: 27, item: 'Matrix Reasoning Item 2', response: '', score: 0 },
          { id: 28, item: 'Matrix Reasoning Item 3', response: '', score: 0 },
          { id: 29, item: 'Matrix Reasoning Item 4', response: '', score: 0 },
          { id: 30, item: 'Matrix Reasoning Item 5', response: '', score: 0 }
        ]
      },
      {
        name: 'Picture Completion',
        index: 'PRI',
        description: 'Visual perception and organization, visual scanning',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 38,
        items: [
          { id: 31, item: 'Picture Completion Item 1', response: '', score: 0 },
          { id: 32, item: 'Picture Completion Item 2', response: '', score: 0 },
          { id: 33, item: 'Picture Completion Item 3', response: '', score: 0 },
          { id: 34, item: 'Picture Completion Item 4', response: '', score: 0 },
          { id: 35, item: 'Picture Completion Item 5', response: '', score: 0 }
        ]
      },
      
      // Working Memory Index (WMI) Subtests
      {
        name: 'Digit Span',
        index: 'WMI',
        description: 'Auditory short-term memory, attention, and concentration',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 30,
        items: [
          { id: 36, item: 'Digits Forward - 2 digits', sequence: '', score: 0 },
          { id: 37, item: 'Digits Forward - 3 digits', sequence: '', score: 0 },
          { id: 38, item: 'Digits Forward - 4 digits', sequence: '', score: 0 },
          { id: 39, item: 'Digits Backward - 2 digits', sequence: '', score: 0 },
          { id: 40, item: 'Digits Backward - 3 digits', sequence: '', score: 0 }
        ]
      },
      {
        name: 'Letter-Number Sequencing',
        index: 'WMI',
        description: 'Auditory short-term memory, working memory, attention, and sequencing',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 30,
        items: [
          { id: 41, item: 'L-N Sequence Item 1', sequence: '', score: 0 },
          { id: 42, item: 'L-N Sequence Item 2', sequence: '', score: 0 },
          { id: 43, item: 'L-N Sequence Item 3', sequence: '', score: 0 },
          { id: 44, item: 'L-N Sequence Item 4', sequence: '', score: 0 },
          { id: 45, item: 'L-N Sequence Item 5', sequence: '', score: 0 }
        ]
      },
      {
        name: 'Arithmetic',
        index: 'WMI',
        description: 'Attention, concentration, and mental manipulation',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 34,
        items: [
          { id: 46, item: '2 + 3 = ?', response: '', score: 0 },
          { id: 47, item: '7 - 4 = ?', response: '', score: 0 },
          { id: 48, item: '3 × 4 = ?', response: '', score: 0 },
          { id: 49, item: '15 ÷ 3 = ?', response: '', score: 0 },
          { id: 50, item: 'If 5 apples cost $10, how much do 3 apples cost?', response: '', score: 0 }
        ]
      },
      
      // Processing Speed Index (PSI) Subtests
      {
        name: 'Coding',
        index: 'PSI',
        description: 'Visual-motor coordination, speed, and short-term memory',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 135,
        timeLimit: 120,
        items: [
          { id: 51, item: 'Coding Item 1', response: '', correct: true, timeTaken: 0 },
          { id: 52, item: 'Coding Item 2', response: '', correct: true, timeTaken: 0 },
          { id: 53, item: 'Coding Item 3', response: '', correct: true, timeTaken: 0 },
          { id: 54, item: 'Coding Item 4', response: '', correct: true, timeTaken: 0 },
          { id: 55, item: 'Coding Item 5', response: '', correct: true, timeTaken: 0 }
        ]
      },
      {
        name: 'Symbol Search',
        index: 'PSI',
        description: 'Visual-motor quickness, short-term visual memory, visual discrimination',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 60,
        timeLimit: 120,
        items: [
          { id: 56, item: 'Symbol Search Item 1', response: '', correct: true, timeTaken: 0 },
          { id: 57, item: 'Symbol Search Item 2', response: '', correct: true, timeTaken: 0 },
          { id: 58, item: 'Symbol Search Item 3', response: '', correct: true, timeTaken: 0 },
          { id: 59, item: 'Symbol Search Item 4', response: '', correct: true, timeTaken: 0 },
          { id: 60, item: 'Symbol Search Item 5', response: '', correct: true, timeTaken: 0 }
        ]
      },
      {
        name: 'Cancellation',
        index: 'PSI',
        description: 'Visual selective attention, processing speed',
        rawScore: 0,
        scaledScore: 0,
        maxRawScore: 48,
        timeLimit: 120,
        items: [
          { id: 61, item: 'Cancellation Item 1', response: '', correct: true, timeTaken: 0 },
          { id: 62, item: 'Cancellation Item 2', response: '', correct: true, timeTaken: 0 },
          { id: 63, item: 'Cancellation Item 3', response: '', correct: true, timeTaken: 0 },
          { id: 64, item: 'Cancellation Item 4', response: '', correct: true, timeTaken: 0 },
          { id: 65, item: 'Cancellation Item 5', response: '', correct: true, timeTaken: 0 }
        ]
      }
    ],

    indexScores: {
      verbalComprehension: {
        sumOfScaledScores: 49,
        compositeScore: 138,
        percentileRank: 99,
        confidenceInterval: '129-142',
        description: 'Verbal comprehension, verbal concept formation, reasoning, and knowledge acquired from one\'s environment.'
      },
      perceptualReasoning: {
        sumOfScaledScores: 36,
        compositeScore: 111,
        percentileRank: 73,
        confidenceInterval: '102-118',
        description: 'Perceptual organization and reasoning, visual-motor integration, and nonverbal problem solving.'
      },
      workingMemory: {
        sumOfScaledScores: 21,
        compositeScore: 103,
        percentileRank: 58,
        confidenceInterval: '95-110',
        description: 'Working memory, short-term memory, concentration, and attention.'
      },
      processingSpeed: {
        sumOfScaledScores: 15,
        compositeScore: 86,
        percentileRank: 18,
        confidenceInterval: '79-97',
        description: 'Processing speed, visual-motor coordination, and short-term visual memory.'
      },
      fullScaleIQ: {
        compositeScore: 0,
        percentileRank: 0,
        confidenceInterval: '',
        description: 'Overall intellectual functioning.'
      }
    },

    discrepancyAnalysis: [
      {
        comparison: 'VCI-PRI',
        index1: 'Verbal Comprehension',
        score1: 138,
        index2: 'Perceptual Reasoning',
        score2: 111,
        difference: 27,
        criticalValue: 10.18,
        significant: true
      },
      {
        comparison: 'VCI-WMI',
        index1: 'Verbal Comprehension',
        score1: 138,
        index2: 'Working Memory',
        score2: 103,
        difference: 35,
        criticalValue: 10.99,
        significant: true
      },
      {
        comparison: 'VCI-PSI',
        index1: 'Verbal Comprehension',
        score1: 138,
        index2: 'Processing Speed',
        score2: 86,
        difference: 52,
        criticalValue: 13.15,
        significant: true
      },
      {
        comparison: 'PRI-WMI',
        index1: 'Perceptual Reasoning',
        score1: 111,
        index2: 'Working Memory',
        score2: 103,
        difference: 12,
        criticalValue: 9.29,
        significant: false
      },
      {
        comparison: 'PRI-PSI',
        index1: 'Perceptual Reasoning',
        score1: 111,
        index2: 'Processing Speed',
        score2: 86,
        difference: 10,
        criticalValue: 11.77,
        significant: false
      },
      {
        comparison: 'WMI-PSI',
        index1: 'Working Memory',
        score1: 103,
        index2: 'Processing Speed',
        score2: 86,
        difference: 11,
        criticalValue: 10.58,
        significant: true
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
        index === subtestIndex ? { ...subtest, [field]: field === 'rawScore' || field === 'scaledScore' ? parseInt(value) || 0 : value } : subtest
      )
    }));
  };

  const handleItemScore = (subtestIndex, itemIndex, score) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, sIndex) => 
        sIndex === subtestIndex 
          ? {
              ...subtest,
              items: subtest.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, score: parseInt(score) || 0 } : item
              ),
              rawScore: subtest.items.reduce((sum, item, i) => 
                i === itemIndex ? sum + (parseInt(score) || 0) : sum + item.score, 0
              )
            }
          : subtest
      )
    }));
  };

  const calculateIndexScores = () => {
    const updatedScores = { ...template.indexScores };
    
    // Calculate index scores based on subtest scaled scores
    const indexGroups = {
      verbalComprehension: template.subtests.filter(s => s.index === 'VCI'),
      perceptualReasoning: template.subtests.filter(s => s.index === 'PRI'),
      workingMemory: template.subtests.filter(s => s.index === 'WMI'),
      processingSpeed: template.subtests.filter(s => s.index === 'PSI')
    };
    
    Object.entries(indexGroups).forEach(([indexName, subtests]) => {
      const sumOfScaledScores = subtests.reduce((sum, subtest) => sum + subtest.scaledScore, 0);
      const compositeScore = Math.round((sumOfScaledScores / subtests.length) * 10 + 50); // Simplified calculation
      const percentileRank = Math.round(((compositeScore - 100) / 15) * 34 + 50);
      
      updatedScores[indexName] = {
        ...updatedScores[indexName],
        sumOfScaledScores,
        compositeScore,
        percentileRank
      };
    });
    
    // Calculate Full Scale IQ (simplified - average of all index scores)
    const allIndexScores = Object.values(updatedScores).slice(0, 4); // Exclude FSIQ itself
    const fsiqScore = Math.round(allIndexScores.reduce((sum, index) => sum + index.compositeScore, 0) / allIndexScores.length);
    const fsiqPercentile = Math.round(((fsiqScore - 100) / 15) * 34 + 50);
    
    updatedScores.fullScaleIQ = {
      compositeScore: fsiqScore,
      percentileRank: fsiqPercentile,
      confidenceInterval: `${fsiqScore - 5}-${fsiqScore + 5}`,
      description: 'Overall intellectual functioning.'
    };
    
    setTemplate(prev => ({ ...prev, indexScores: updatedScores }));
  };

  const handleIndexScoreChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      indexScores: {
        ...prev.indexScores,
        [index]: {
          ...prev.indexScores[index],
          [field]: field === 'compositeScore' || field === 'percentileRank' ? parseInt(value) || 0 : value
        }
      }
    }));
  };

  const handleSave = () => {
    calculateIndexScores();
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('subtests');

  const getScoreColor = (percentile) => {
    if (percentile >= 91) return 'text-green-600 bg-green-50';
    if (percentile >= 75) return 'text-blue-600 bg-blue-50';
    if (percentile >= 50) return 'text-yellow-600 bg-yellow-50';
    if (percentile >= 25) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

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
            <h3 className="text-lg font-semibold mb-3">Index Scores</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Index</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Sum of Scaled Scores</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Composite Score</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Percentile Rank</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">95% CI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Verbal Comprehension Index (VCI)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.verbalComprehension.sumOfScaledScores}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{template.indexScores.verbalComprehension.compositeScore}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(template.indexScores.verbalComprehension.percentileRank)}`}>
                        {template.indexScores.verbalComprehension.percentileRank}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.verbalComprehension.confidenceInterval}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Perceptual Reasoning Index (PRI)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.perceptualReasoning.sumOfScaledScores}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{template.indexScores.perceptualReasoning.compositeScore}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(template.indexScores.perceptualReasoning.percentileRank)}`}>
                        {template.indexScores.perceptualReasoning.percentileRank}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.perceptualReasoning.confidenceInterval}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Working Memory Index (WMI)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.workingMemory.sumOfScaledScores}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{template.indexScores.workingMemory.compositeScore}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(template.indexScores.workingMemory.percentileRank)}`}>
                        {template.indexScores.workingMemory.percentileRank}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.workingMemory.confidenceInterval}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-medium">Processing Speed Index (PSI)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.processingSpeed.sumOfScaledScores}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{template.indexScores.processingSpeed.compositeScore}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(template.indexScores.processingSpeed.percentileRank)}`}>
                        {template.indexScores.processingSpeed.percentileRank}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.processingSpeed.confidenceInterval}</td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="border border-gray-300 px-4 py-2">Full Scale IQ</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.fullScaleIQ.compositeScore}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-sm ${getScoreColor(template.indexScores.fullScaleIQ.percentileRank)}`}>
                        {template.indexScores.fullScaleIQ.percentileRank}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{template.indexScores.fullScaleIQ.confidenceInterval}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Subtest Scaled Score Profile</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">VCI Subtests</h4>
                <div className="space-y-1">
                  {template.subtests.filter(s => s.index === 'VCI').map(subtest => (
                    <div key={subtest.name} className="flex justify-between">
                      <span className="text-sm">{subtest.name}</span>
                      <span className="text-sm font-bold">{subtest.scaledScore}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">PRI Subtests</h4>
                <div className="space-y-1">
                  {template.subtests.filter(s => s.index === 'PRI').map(subtest => (
                    <div key={subtest.name} className="flex justify-between">
                      <span className="text-sm">{subtest.name}</span>
                      <span className="text-sm font-bold">{subtest.scaledScore}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">WMI Subtests</h4>
                <div className="space-y-1">
                  {template.subtests.filter(s => s.index === 'WMI').map(subtest => (
                    <div key={subtest.name} className="flex justify-between">
                      <span className="text-sm">{subtest.name}</span>
                      <span className="text-sm font-bold">{subtest.scaledScore}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">PSI Subtests</h4>
                <div className="space-y-1">
                  {template.subtests.filter(s => s.index === 'PSI').map(subtest => (
                    <div key={subtest.name} className="flex justify-between">
                      <span className="text-sm">{subtest.name}</span>
                      <span className="text-sm font-bold">{subtest.scaledScore}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Discrepancy Comparison Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Index</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Composite Score 1</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Composite Score 2</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Difference</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Critical Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Significant Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {template.discrepancyAnalysis.map((discrepancy, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{discrepancy.comparison}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.score1}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.score2}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center font-bold">{discrepancy.difference}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.criticalValue}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${discrepancy.significant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {discrepancy.significant ? 'Yes' : 'No'}
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
            onClick={() => setActiveTab('indices')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'indices'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Index Scores
          </button>
          <button
            onClick={() => setActiveTab('discrepancy')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'discrepancy'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Discrepancy Analysis
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
          {['VCI', 'PRI', 'WMI', 'PSI'].map(index => (
            <div key={index} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">
                {index === 'VCI' ? 'Verbal Comprehension Index' :
                 index === 'PRI' ? 'Perceptual Reasoning Index' :
                 index === 'WMI' ? 'Working Memory Index' : 'Processing Speed Index'}
              </h3>
              <div className="space-y-4">
                {template.subtests.filter(subtest => subtest.index === index).map((subtest, subtestIndex) => (
                  <div key={subtest.name} className="border rounded p-4">
                    <h4 className="font-semibold mb-1">{subtest.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{subtest.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Raw Score</label>
                        <input
                          type="number"
                          value={subtest.rawScore}
                          onChange={(e) => handleSubtestScore(template.subtests.indexOf(subtest), 'rawScore', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Scaled Score</label>
                        <input
                          type="number"
                          value={subtest.scaledScore}
                          onChange={(e) => handleSubtestScore(template.subtests.indexOf(subtest), 'scaledScore', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Raw Score</label>
                        <input
                          type="number"
                          value={subtest.maxRawScore}
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 border"
                        />
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium mb-2">Items:</h5>
                      <div className="space-y-2">
                        {subtest.items.slice(0, 3).map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-sm flex-1">{item.item}</span>
                            <select
                              value={item.score}
                              onChange={(e) => handleItemScore(template.subtests.indexOf(subtest), subtest.items.indexOf(item), e.target.value)}
                              className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                            >
                              <option value="0">0 - Incorrect</option>
                              <option value="1">1 - Partial</option>
                              <option value="2">2 - Correct</option>
                            </select>
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

      {activeTab === 'indices' && (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={calculateIndexScores}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Calculate Index Scores
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Index</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Sum of Scaled Scores</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Composite Score</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Percentile Rank</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">95% CI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value="Verbal Comprehension"
                      disabled
                      className="bg-transparent border-none font-medium"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.verbalComprehension.sumOfScaledScores}
                      onChange={(e) => handleIndexScoreChange('verbalComprehension', 'sumOfScaledScores', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.verbalComprehension.compositeScore}
                      onChange={(e) => handleIndexScoreChange('verbalComprehension', 'compositeScore', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded font-bold"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.verbalComprehension.percentileRank}
                      onChange={(e) => handleIndexScoreChange('verbalComprehension', 'percentileRank', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={template.indexScores.verbalComprehension.confidenceInterval}
                      onChange={(e) => handleIndexScoreChange('verbalComprehension', 'confidenceInterval', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value="Perceptual Reasoning"
                      disabled
                      className="bg-transparent border-none font-medium"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.perceptualReasoning.sumOfScaledScores}
                      onChange={(e) => handleIndexScoreChange('perceptualReasoning', 'sumOfScaledScores', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.perceptualReasoning.compositeScore}
                      onChange={(e) => handleIndexScoreChange('perceptualReasoning', 'compositeScore', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded font-bold"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.perceptualReasoning.percentileRank}
                      onChange={(e) => handleIndexScoreChange('perceptualReasoning', 'percentileRank', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={template.indexScores.perceptualReasoning.confidenceInterval}
                      onChange={(e) => handleIndexScoreChange('perceptualReasoning', 'confidenceInterval', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value="Working Memory"
                      disabled
                      className="bg-transparent border-none font-medium"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.workingMemory.sumOfScaledScores}
                      onChange={(e) => handleIndexScoreChange('workingMemory', 'sumOfScaledScores', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.workingMemory.compositeScore}
                      onChange={(e) => handleIndexScoreChange('workingMemory', 'compositeScore', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded font-bold"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.workingMemory.percentileRank}
                      onChange={(e) => handleIndexScoreChange('workingMemory', 'percentileRank', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={template.indexScores.workingMemory.confidenceInterval}
                      onChange={(e) => handleIndexScoreChange('workingMemory', 'confidenceInterval', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value="Processing Speed"
                      disabled
                      className="bg-transparent border-none font-medium"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.processingSpeed.sumOfScaledScores}
                      onChange={(e) => handleIndexScoreChange('processingSpeed', 'sumOfScaledScores', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.processingSpeed.compositeScore}
                      onChange={(e) => handleIndexScoreChange('processingSpeed', 'compositeScore', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded font-bold"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.processingSpeed.percentileRank}
                      onChange={(e) => handleIndexScoreChange('processingSpeed', 'percentileRank', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={template.indexScores.processingSpeed.confidenceInterval}
                      onChange={(e) => handleIndexScoreChange('processingSpeed', 'confidenceInterval', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-300 px-4 py-2">Full Scale IQ</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">-</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.fullScaleIQ.compositeScore}
                      onChange={(e) => handleIndexScoreChange('fullScaleIQ', 'compositeScore', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={template.indexScores.fullScaleIQ.percentileRank}
                      onChange={(e) => handleIndexScoreChange('fullScaleIQ', 'percentileRank', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={template.indexScores.fullScaleIQ.confidenceInterval}
                      onChange={(e) => handleIndexScoreChange('fullScaleIQ', 'confidenceInterval', e.target.value)}
                      className="w-full text-center border-none focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'discrepancy' && (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Index Comparison</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Score 1</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Score 2</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Difference</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Critical Value</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Significant</th>
                </tr>
              </thead>
              <tbody>
                {template.discrepancyAnalysis.map((discrepancy, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{discrepancy.comparison}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.score1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.score2}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-bold">{discrepancy.difference}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{discrepancy.criticalValue}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <select
                        value={discrepancy.significant ? 'true' : 'false'}
                        onChange={(e) => {
                          const updated = [...template.discrepancyAnalysis];
                          updated[index].significant = e.target.value === 'true';
                          setTemplate(prev => ({ ...prev, discrepancyAnalysis: updated }));
                        }}
                        className={`px-2 py-1 rounded text-xs ${discrepancy.significant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              placeholder="Enter your interpretation of the WISC-IV results..."
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

export default WISC4Template;
