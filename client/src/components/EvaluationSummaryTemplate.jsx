import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText, FiUser, FiCalendar, FiTrendingUp, FiAlertCircle, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';

const EvaluationSummaryTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'SUMMARY OF EVALUATION',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `Comprehensive summary of evaluation results across multiple assessment instruments including WJ-IV COG, WJ-IV ACH, and Brown's EF/A Scale. This report provides an integrated analysis of cognitive abilities, academic achievement, and executive functioning.`,
    
    generalIntellectualAbility: {
      score: 106,
      descriptor: 'Average',
      interpretation: 'Overall cognitive functioning within normal range'
    },

    gfGcComposite: {
      score: 105,
      descriptor: 'Average',
      fluidIntelligence: 'Fluid Intelligence (Gf)',
      crystallizedIntelligence: 'Crystallized Intelligence (Gc)'
    },

    wjCognitiveMeasures: [
      {
        area: 'Fluid Reasoning (Gf)',
        score: null,
        descriptor: 'Superior',
        interpretation: 'Strong ability in novel problem-solving and pattern recognition'
      },
      {
        area: 'Short-Term Working Memory (GWM)',
        score: null,
        descriptor: 'Superior',
        interpretation: 'Excellent ability to hold and manipulate information'
      },
      {
        area: 'Cognitive Efficiency',
        score: null,
        descriptor: 'Average',
        interpretation: 'Processing speed and accuracy within normal limits'
      },
      {
        area: 'Comprehension Knowledge (Gc)',
        score: null,
        descriptor: 'Low Average',
        interpretation: 'Difficulty with acquired knowledge and verbal concepts'
      },
      {
        area: 'Letter-Pattern Matching',
        score: null,
        descriptor: 'Limited',
        rpi: '28/90',
        interpretation: 'Significant difficulty with visual pattern recognition'
      }
    ],

    wjAchievementMeasures: [
      {
        area: 'Brief Achievement',
        score: 118,
        descriptor: 'High Average',
        interpretation: 'Strong overall academic performance'
      },
      {
        area: 'Broad Achievement',
        score: 106,
        descriptor: 'Average',
        interpretation: 'Overall academic achievement within normal range'
      },
      {
        area: 'Basic Reading Skills',
        score: null,
        descriptor: 'High Average',
        interpretation: 'Strong fundamental reading abilities'
      },
      {
        area: 'Mathematics',
        score: null,
        descriptor: 'High Average',
        interpretation: 'Strong mathematical computation skills'
      },
      {
        area: 'Broad Mathematics',
        score: null,
        descriptor: 'High Average',
        interpretation: 'Comprehensive math skills are well-developed'
      },
      {
        area: 'Academic Skills',
        score: null,
        descriptor: 'High Average',
        interpretation: 'Strong overall academic competencies'
      },
      {
        area: 'Reading',
        score: null,
        descriptor: 'Average',
        interpretation: 'Reading abilities within normal range'
      },
      {
        area: 'Broad Reading',
        score: null,
        descriptor: 'Average',
        interpretation: 'Comprehensive reading skills are age-appropriate'
      },
      {
        area: 'Reading Fluency',
        score: null,
        descriptor: 'Average',
        interpretation: 'Reading speed and accuracy are adequate'
      },
      {
        area: 'Math Calculation Skills',
        score: null,
        descriptor: 'High Average',
        interpretation: 'Strong mathematical computation abilities'
      },
      {
        area: 'Written Language',
        score: null,
        descriptor: 'Average',
        interpretation: 'Written expression skills are developing appropriately'
      },
      {
        area: 'Broad Written Language',
        score: null,
        descriptor: 'Average',
        interpretation: 'Overall written language abilities are adequate'
      },
      {
        area: 'Written Expression',
        score: null,
        descriptor: 'Average',
        interpretation: 'Written communication skills are age-appropriate'
      },
      {
        area: 'Academic Fluency',
        score: null,
        descriptor: 'Average',
        interpretation: 'Academic processing speed is adequate'
      },
      {
        area: 'Academic Applications',
        score: null,
        descriptor: 'Average',
        interpretation: 'Application of academic skills is appropriate'
      }
    ],

    brownEfaScale: {
      overallIndicator: 'somewhat atypical',
      significance: 'unlikely significant problem',
      interpretation: 'Executive functioning shows some atypical patterns but not indicative of major dysfunction',
      difficulties: [
        'Difficulty in clusters of Activation',
        'Difficulty in clusters of Focus',
        'Difficulty in clusters of Effort'
      ]
    },

    overallSummary: '',
    conclusions: '',
    recommendations: ''
  });

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWjCognitiveChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      wjCognitiveMeasures: prev.wjCognitiveMeasures.map((measure, i) => 
        i === index ? { ...measure, [field]: value } : measure
      )
    }));
  };

  const handleWjAchievementChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      wjAchievementMeasures: prev.wjAchievementMeasures.map((measure, i) => 
        i === index ? { ...measure, [field]: value } : measure
      )
    }));
  };

  const handleBrownEfaChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      brownEfaScale: {
        ...prev.brownEfaScale,
        [field]: value
      }
    }));
  };

  const handleBrownDifficultyChange = (index, value) => {
    setTemplate(prev => ({
      ...prev,
      brownEfaScale: {
        ...prev.brownEfaScale,
        difficulties: prev.brownEfaScale.difficulties.map((difficulty, i) => 
          i === index ? value : difficulty
        )
      }
    }));
  };

  const getDescriptorColor = (descriptor) => {
    switch (descriptor) {
      case 'Superior': return 'text-purple-600 bg-purple-50';
      case 'High Average': return 'text-blue-600 bg-blue-50';
      case 'Average': return 'text-green-600 bg-green-50';
      case 'Low Average': return 'text-yellow-600 bg-yellow-50';
      case 'Limited': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSave = () => {
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('cognitive');

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
            <h3 className="text-lg font-semibold mb-3">General Intellectual Ability</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-800">{template.generalIntellectualAbility.score}</p>
                  <p className="text-lg text-blue-600">{template.generalIntellectualAbility.descriptor}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-lg ${getDescriptorColor(template.generalIntellectualAbility.descriptor)}`}>
                    {template.generalIntellectualAbility.descriptor}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{template.generalIntellectualAbility.interpretation}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Gf-Gc Composite</h3>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-800">{template.gfGcComposite.score}</p>
                  <p className="text-lg text-green-600">{template.gfGcComposite.descriptor}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-lg ${getDescriptorColor(template.gfGcComposite.descriptor)}`}>
                    {template.gfGcComposite.descriptor}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">{template.gfGcComposite.fluidIntelligence}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{template.gfGcComposite.crystallizedIntelligence}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">WJ-IV Cognitive Measures</h3>
            <div className="space-y-3">
              {template.wjCognitiveMeasures.map((measure, index) => (
                <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-purple-800">{measure.area}</h4>
                    <div className="text-right">
                      {measure.score && (
                        <>
                          <p className="text-xl font-bold text-purple-800">{measure.score}</p>
                          <span className={`px-2 py-1 rounded-full ${getDescriptorColor(measure.descriptor)}`}>
                            {measure.descriptor}
                          </span>
                        </>
                      )}
                      {measure.rpi && (
                        <p className="text-sm text-purple-600">RPI: {measure.rpi}</p>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{measure.interpretation}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">WJ-IV Achievement Measures</h3>
            <div className="grid grid-cols-2 gap-4">
              {template.wjAchievementMeasures.map((measure, index) => (
                <div key={index} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">{measure.area}</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      {measure.score && (
                        <p className="text-xl font-bold text-yellow-800">{measure.score}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {measure.descriptor && (
                        <span className={`px-2 py-1 rounded-full ${getDescriptorColor(measure.descriptor)}`}>
                          {measure.descriptor}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{measure.interpretation}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Brown's EF/A Scale</h3>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Overall Indicator:</p>
                  <p className="text-lg font-semibold text-red-800">{template.brownEfaScale.overallIndicator}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Significance:</p>
                  <p className="text-lg font-semibold text-red-800">{template.brownEfaScale.significance}</p>
                </div>
              </div>
              <p className="mb-3 text-gray-700">{template.brownEfaScale.interpretation}</p>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Identified Difficulties:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  {template.brownEfaScale.difficulties.map((difficulty, index) => (
                    <li key={index} className="text-gray-700">{difficulty}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {template.overallSummary && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Overall Summary</h3>
              <p className="text-gray-700">{template.overallSummary}</p>
            </div>
          )}

          {template.conclusions && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Conclusions</h3>
              <p className="text-gray-700">{template.conclusions}</p>
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
            onClick={() => setActiveTab('cognitive')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'cognitive'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiBarChart2 className="inline mr-2" />
            Cognitive
          </button>
          <button
            onClick={() => setActiveTab('achievement')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'achievement'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiTrendingUp className="inline mr-2" />
            Achievement
          </button>
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'executive'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiAlertCircle className="inline mr-2" />
            Executive
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'summary'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiFileText className="inline mr-2" />
            Summary
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

      {activeTab === 'cognitive' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">General Intellectual Ability</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Score</label>
                <input
                  type="number"
                  value={template.generalIntellectualAbility.score}
                  onChange={(e) => handleInputChange('generalIntellectualAbility', { ...template.generalIntellectualAbility, score: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                <select
                  value={template.generalIntellectualAbility.descriptor}
                  onChange={(e) => handleInputChange('generalIntellectualAbility', { ...template.generalIntellectualAbility, descriptor: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="Superior">Superior</option>
                  <option value="High Average">High Average</option>
                  <option value="Average">Average</option>
                  <option value="Low Average">Low Average</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Interpretation</label>
                <textarea
                  value={template.generalIntellectualAbility.interpretation}
                  onChange={(e) => handleInputChange('generalIntellectualAbility', { ...template.generalIntellectualAbility, interpretation: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Gf-Gc Composite</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Score</label>
                <input
                  type="number"
                  value={template.gfGcComposite.score}
                  onChange={(e) => handleInputChange('gfGcComposite', { ...template.gfGcComposite, score: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                <select
                  value={template.gfGcComposite.descriptor}
                  onChange={(e) => handleInputChange('gfGcComposite', { ...template.gfGcComposite, descriptor: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="Superior">Superior</option>
                  <option value="High Average">High Average</option>
                  <option value="Average">Average</option>
                  <option value="Low Average">Low Average</option>
                  <option value="Limited">Limited</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">WJ-IV Cognitive Measures</h3>
            <div className="space-y-4">
              {template.wjCognitiveMeasures.map((measure, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{measure.area}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Score</label>
                      <input
                        type="number"
                        value={measure.score || ''}
                        onChange={(e) => handleWjCognitiveChange(index, 'score', parseInt(e.target.value) || null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                      <select
                        value={measure.descriptor}
                        onChange={(e) => handleWjCognitiveChange(index, 'descriptor', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      >
                        <option value="">Select...</option>
                        <option value="Superior">Superior</option>
                        <option value="High Average">High Average</option>
                        <option value="Average">Average</option>
                        <option value="Low Average">Low Average</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">RPI</label>
                      <input
                        type="text"
                        value={measure.rpi || ''}
                        onChange={(e) => handleWjCognitiveChange(index, 'rpi', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="e.g., 28/90"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interpretation</label>
                    <textarea
                      value={measure.interpretation}
                      onChange={(e) => handleWjCognitiveChange(index, 'interpretation', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievement' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">WJ-IV Achievement Measures</h3>
            <div className="grid grid-cols-2 gap-4">
              {template.wjAchievementMeasures.map((measure, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{measure.area}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Score</label>
                      <input
                        type="number"
                        value={measure.score || ''}
                        onChange={(e) => handleWjAchievementChange(index, 'score', parseInt(e.target.value) || null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descriptor</label>
                      <select
                        value={measure.descriptor}
                        onChange={(e) => handleWjAchievementChange(index, 'descriptor', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      >
                        <option value="">Select...</option>
                        <option value="Superior">Superior</option>
                        <option value="High Average">High Average</option>
                        <option value="Average">Average</option>
                        <option value="Low Average">Low Average</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interpretation</label>
                    <textarea
                      value={measure.interpretation}
                      onChange={(e) => handleWjAchievementChange(index, 'interpretation', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'executive' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Brown's EF/A Scale</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Overall Indicator</label>
                <input
                  type="text"
                  value={template.brownEfaScale.overallIndicator}
                  onChange={(e) => handleBrownEfaChange('overallIndicator', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Significance</label>
                <input
                  type="text"
                  value={template.brownEfaScale.significance}
                  onChange={(e) => handleBrownEfaChange('significance', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
              <textarea
                value={template.brownEfaScale.interpretation}
                onChange={(e) => handleBrownEfaChange('interpretation', e.target.value)}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Identified Difficulties</label>
              <div className="space-y-2">
                {template.brownEfaScale.difficulties.map((difficulty, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-8">{index + 1}.</span>
                    <input
                      type="text"
                      value={difficulty}
                      onChange={(e) => handleBrownDifficultyChange(index, e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                    <button
                      onClick={() => {
                        const newDifficulties = template.brownEfaScale.difficulties.filter((_, i) => i !== index);
                        setTemplate(prev => ({
                          ...prev,
                          brownEfaScale: {
                            ...prev.brownEfaScale,
                            difficulties: newDifficulties
                          }
                        }));
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setTemplate(prev => ({
                      ...prev,
                      brownEfaScale: {
                        ...prev.brownEfaScale,
                        difficulties: [...prev.brownEfaScale.difficulties, '']
                      }
                    }));
                  }}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Difficulty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Overall Summary</label>
            <textarea
              value={template.overallSummary}
              onChange={(e) => handleInputChange('overallSummary', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter comprehensive evaluation summary..."
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
              placeholder="Enter your recommendations..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationSummaryTemplate;
