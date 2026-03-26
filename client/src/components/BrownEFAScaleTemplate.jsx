import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const BrownEFAScaleTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Brown Executive Function/Attention Scales',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Brown Executive Function/Attention Scales (Brown EF/A Scales) is a comprehensive assessment tool designed to evaluate executive function and attention processes in children, adolescents, and adults. The assessment measures various aspects of executive functioning including organization, time management, emotional regulation, and working memory.`,
    subscales: [
      {
        name: 'Organization',
        items: [
          { id: 1, description: 'Has difficulty organizing materials for school/work', frequency: '', impact: '' },
          { id: 2, description: 'Loses or misplaces important items', frequency: '', impact: '' },
          { id: 3, description: 'Has trouble keeping workspace organized', frequency: '', impact: '' },
          { id: 4, description: 'Struggles to organize thoughts before speaking/writing', frequency: '', impact: '' },
          { id: 5, description: 'Has difficulty planning multi-step tasks', frequency: '', impact: '' },
          { id: 6, description: 'Forgets to bring necessary items to activities', frequency: '', impact: '' },
          { id: 7, description: 'Has messy backpack, desk, or room', frequency: '', impact: '' },
          { id: 8, description: 'Struggles with organizing digital files/documents', frequency: '', impact: '' }
        ]
      },
      {
        name: 'Time Management',
        items: [
          { id: 9, description: 'Has difficulty estimating time needed for tasks', frequency: '', impact: '' },
          { id: 10, description: 'Often runs late to appointments or activities', frequency: '', impact: '' },
          { id: 11, description: 'Procrastinates on starting tasks', frequency: '', impact: '' },
          { id: 12, description: 'Has trouble completing tasks on time', frequency: '', impact: '' },
          { id: 13, description: 'Gets absorbed in one activity, loses track of time', frequency: '', impact: '' },
          { id: 14, description: 'Has difficulty breaking large tasks into smaller steps', frequency: '', impact: '' },
          { id: 15, description: 'Rushes through tasks at the last minute', frequency: '', impact: '' },
          { id: 16, description: 'Has trouble establishing daily routines', frequency: '', impact: '' }
        ]
      },
      {
        name: 'Working Memory',
        items: [
          { id: 17, description: 'Forgets instructions soon after hearing them', frequency: '', impact: '' },
          { id: 18, description: 'Has trouble remembering multiple steps', frequency: '', impact: '' },
          { id: 19, description: 'Loses track of what they were saying', frequency: '', impact: '' },
          { id: 20, description: 'Forgets information while reading', frequency: '', impact: '' },
          { id: 21, description: 'Has difficulty holding information in mind', frequency: '', impact: '' },
          { id: 22, description: 'Forgets what they were supposed to do next', frequency: '', impact: '' },
          { id: 23, description: 'Has trouble recalling recent events', frequency: '', impact: '' },
          { id: 24, description: 'Forgets appointments or commitments', frequency: '', impact: '' }
        ]
      },
      {
        name: 'Emotional Regulation',
        items: [
          { id: 25, description: 'Has sudden mood changes', frequency: '', impact: '' },
          { id: 26, description: 'Overreacts to minor frustrations', frequency: '', impact: '' },
          { id: 27, description: 'Has difficulty calming down when upset', frequency: '', impact: '' },
          { id: 28, description: 'Is easily frustrated by small problems', frequency: '', impact: '' },
          { id: 29, description: 'Has explosive reactions to stress', frequency: '', impact: '' },
          { id: 30, description: 'Has difficulty managing anxiety', frequency: '', impact: '' },
          { id: 31, description: 'Shows excessive emotional responses', frequency: '', impact: '' },
          { id: 32, description: 'Has difficulty with emotional self-control', frequency: '', impact: '' }
        ]
      },
      {
        name: 'Task Initiation',
        items: [
          { id: 33, description: 'Has trouble getting started on tasks', frequency: '', impact: '' },
          { id: 34, description: 'Avoids starting difficult or boring tasks', frequency: '', impact: '' },
          { id: 35, description: 'Delays beginning assignments or projects', frequency: '', impact: '' },
          { id: 36, description: 'Has difficulty initiating daily routines', frequency: '', impact: '' },
          { id: 37, description: 'Waits until last minute to start', frequency: '', impact: '' },
          { id: 38, description: 'Has trouble transitioning between activities', frequency: '', impact: '' },
          { id: 39, description: 'Appears "stuck" when starting tasks', frequency: '', impact: '' },
          { id: 40, description: 'Needs external prompts to begin activities', frequency: '', impact: '' }
        ]
      },
      {
        name: 'Sustained Attention',
        items: [
          { id: 41, description: 'Has difficulty maintaining focus during tasks', frequency: '', impact: '' },
          { id: 42, description: 'Gets easily distracted by external stimuli', frequency: '', impact: '' },
          { id: 43, description: 'Loses focus during conversations', frequency: '', impact: '' },
          { id: 44, description: 'Has trouble completing reading assignments', frequency: '', impact: '' },
          { id: 45, description: 'Mind wanders during important activities', frequency: '', impact: '' },
          { id: 46, description: 'Has difficulty staying on task', frequency: '', impact: '' },
          { id: 47, description: 'Frequently daydreams or zones out', frequency: '', impact: '' },
          { id: 48, description: 'Has trouble maintaining attention in meetings/classes', frequency: '', impact: '' }
        ]
      }
    ],
    executiveFunctionIndex: 0,
    attentionIndex: 0,
    overallIndex: 0,
    severityLevel: '',
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

  const handleItemChange = (subscaleIndex, itemIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      subscales: prev.subscales.map((subscale, sIndex) => 
        sIndex === subscaleIndex 
          ? {
              ...subscale,
              items: subscale.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, [field]: value } : item
              )
            }
          : subscale
      )
    }));
  };

  const calculateScores = () => {
    let efScore = 0;
    let attentionScore = 0;
    
    template.subscales.forEach((subscale, index) => {
      let subscaleScore = 0;
      subscale.items.forEach(item => {
        const freqScore = getFrequencyScore(item.frequency);
        const impactScore = getImpactScore(item.impact);
        subscaleScore += (freqScore + impactScore) / 2;
      });
      
      // Organization, Time Management, Working Memory, Emotional Regulation, Task Initiation = Executive Function
      if (index < 5) {
        efScore += subscaleScore;
      }
      // Sustained Attention = Attention
      if (index === 5) {
        attentionScore += subscaleScore;
      }
    });
    
    const executiveFunctionIndex = Math.round(efScore / 5);
    const attentionIndex = Math.round(attentionScore);
    const overallIndex = Math.round((efScore + attentionScore) / 6);
    const severityLevel = getSeverityLevel(overallIndex);
    
    setTemplate(prev => ({
      ...prev,
      executiveFunctionIndex,
      attentionIndex,
      overallIndex,
      severityLevel
    }));
  };

  const getFrequencyScore = (frequency) => {
    const scores = { 'Never': 0, 'Once a month': 1, 'A few times a month': 2, 'Once a week': 3, 'A few times a week': 4, 'Daily': 5 };
    return scores[frequency] || 0;
  };

  const getImpactScore = (impact) => {
    const scores = { 'No problems': 0, 'Minor problems': 1, 'Moderate problems': 2, 'Major problems': 3, 'Severe problems': 4 };
    return scores[impact] || 0;
  };

  const getSeverityLevel = (score) => {
    if (score >= 4) return 'Severe';
    if (score >= 3) return 'Moderate to Severe';
    if (score >= 2) return 'Moderate';
    if (score >= 1) return 'Mild to Moderate';
    return 'Minimal';
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
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Brown Executive Function/Attention Scales</h1>
                <p className="text-gray-600">Comprehensive executive function assessment</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Assessment Subscales */}
            {template.subscales.map((subscale, subscaleIndex) => (
              <div key={subscaleIndex} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{subscale.name}</h2>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">ID</div>
                    <div className="col-span-6 border-r border-black p-2 text-center font-bold text-xs">Behavior Description</div>
                    <div className="col-span-3 border-r border-black p-2 text-center font-bold text-xs">Frequency</div>
                    <div className="col-span-2 p-2 text-center font-bold text-xs">Impact</div>
                  </div>
                  {subscale.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-6 border-r border-black p-2 text-xs">
                          {item.description}
                        </div>
                        <div className="col-span-3 border-r border-black p-2">
                          <select
                            value={item.frequency}
                            onChange={(e) => handleItemChange(subscaleIndex, itemIndex, 'frequency', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                          >
                            <option value="">Select</option>
                            <option value="Never">Never</option>
                            <option value="Once a month">Once a month</option>
                            <option value="A few times a month">A few times a month</option>
                            <option value="Once a week">Once a week</option>
                            <option value="A few times a week">A few times a week</option>
                            <option value="Daily">Daily</option>
                          </select>
                        </div>
                        <div className="col-span-2 p-2">
                          <select
                            value={item.impact}
                            onChange={(e) => handleItemChange(subscaleIndex, itemIndex, 'impact', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-500"
                          >
                            <option value="">Select</option>
                            <option value="No problems">No problems</option>
                            <option value="Minor problems">Minor problems</option>
                            <option value="Moderate problems">Moderate problems</option>
                            <option value="Major problems">Major problems</option>
                            <option value="Severe problems">Severe problems</option>
                          </select>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Executive Function Index</label>
                  <input
                    type="text"
                    value={template.executiveFunctionIndex}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attention Index</label>
                  <input
                    type="text"
                    value={template.attentionIndex}
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
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <input
                  type="text"
                  value={template.severityLevel}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
              <textarea
                value={template.interpretation}
                onChange={(e) => handleInputChange('interpretation', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2 transition-colors"
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
                BROWN EXECUTIVE FUNCTION/ATTENTION SCALES
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-yellow-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-yellow-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-yellow-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Subscales Preview */}
            {template.subscales.map((subscale, subscaleIndex) => (
              <div key={subscaleIndex} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{subscale.name}</h2>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">ID</div>
                    <div className="col-span-6 border-r border-black p-1 text-center font-bold text-xs">Behavior Description</div>
                    <div className="col-span-3 border-r border-black p-1 text-center font-bold text-xs">Frequency</div>
                    <div className="col-span-2 p-1 text-center font-bold text-xs">Impact</div>
                  </div>
                  {subscale.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-6 border-r border-black p-1 text-xs">
                          {item.description}
                        </div>
                        <div className="col-span-3 border-r border-black p-1 text-center text-xs">
                          {item.frequency}
                        </div>
                        <div className="col-span-2 p-1 text-center text-xs">
                          {item.impact}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Index Scores Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Results</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">Executive Function Index</h3>
                  <p className="text-2xl font-bold text-yellow-600">{template.executiveFunctionIndex}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Attention Index</h3>
                  <p className="text-2xl font-bold text-orange-600">{template.attentionIndex}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Overall Index</h3>
                  <p className="text-2xl font-bold text-red-600">{template.overallIndex}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Severity Level</h3>
                  <p className="text-lg font-bold text-purple-600">{template.severityLevel}</p>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-yellow-50 rounded-lg p-6">
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

export default BrownEFAScaleTemplate;
