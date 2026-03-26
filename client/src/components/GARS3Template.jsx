import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const GARS3Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Gilliam Autism Rating Scale - Third Edition',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Gilliam Autism Rating Scale, Third Edition (GARS-3) is a standardized, norm-referenced instrument used to identify autism spectrum disorders and assist in designing intervention programs. The instrument consists of 56 items describing characteristic behaviors of persons with autism.`,
    subscales: [
      {
        name: 'Restricted/Repetitive Behaviors',
        items: [
          { id: 1, description: 'Engages in repetitive motor movements', frequency: '', severity: '' },
          { id: 2, description: 'Insists on sameness, routines, or rituals', frequency: '', severity: '' },
          { id: 3, description: 'Has highly restricted interests', frequency: '', severity: '' },
          { id: 4, description: 'Hyper- or hypo-reactive to sensory input', frequency: '', severity: '' },
          { id: 5, description: 'Lines up objects or toys', frequency: '', severity: '' },
          { id: 6, description: 'Repeats words or phrases', frequency: '', severity: '' },
          { id: 7, description: 'Has difficulty with changes in routine', frequency: '', severity: '' },
          { id: 8, description: 'Shows unusual attachments to objects', frequency: '', severity: '' }
        ]
      },
      {
        name: 'Social Interaction',
        items: [
          { id: 9, description: 'Has difficulty making eye contact', frequency: '', severity: '' },
          { id: 10, description: 'Does not respond to name being called', frequency: '', severity: '' },
          { id: 11, description: 'Has difficulty understanding others feelings', frequency: '', severity: '' },
          { id: 12, description: 'Prefers to play alone', frequency: '', severity: '' },
          { id: 13, description: 'Has difficulty making friends', frequency: '', severity: '' },
          { id: 14, description: 'Does not share interests or achievements', frequency: '', severity: '' },
          { id: 15, description: 'Has difficulty initiating social interaction', frequency: '', severity: '' },
          { id: 16, description: 'Does not engage in pretend play', frequency: '', severity: '' }
        ]
      },
      {
        name: 'Communication',
        items: [
          { id: 17, description: 'Has delayed speech development', frequency: '', severity: '' },
          { id: 18, description: 'Repeats words or phrases heard', frequency: '', severity: '' },
          { id: 19, description: 'Uses pronouns incorrectly', frequency: '', severity: '' },
          { id: 20, description: 'Has difficulty expressing needs', frequency: '', severity: '' },
          { id: 21, description: 'Does not understand jokes or sarcasm', frequency: '', severity: '' },
          { id: 22, description: 'Has difficulty following conversations', frequency: '', severity: '' },
          { id: 23, description: 'Speaks in flat or robotic tone', frequency: '', severity: '' },
          { id: 24, description: 'Has difficulty with back-and-forth conversation', frequency: '', severity: '' }
        ]
      },
      {
        name: 'Emotional Regulation',
        items: [
          { id: 25, description: 'Has frequent emotional outbursts', frequency: '', severity: '' },
          { id: 26, description: 'Has difficulty calming down', frequency: '', severity: '' },
          { id: 27, description: 'Shows excessive anxiety', frequency: '', severity: '' },
          { id: 28, description: 'Has difficulty with transitions', frequency: '', severity: '' },
          { id: 29, description: 'Shows self-injurious behavior', frequency: '', severity: '' },
          { id: 30, description: 'Has aggressive behavior', frequency: '', severity: '' },
          { id: 31, description: 'Has unusual sleep patterns', frequency: '', severity: '' },
          { id: 32, description: 'Has unusual eating habits', frequency: '', severity: '' }
        ]
      },
      {
        name: 'Cognitive Style',
        items: [
          { id: 33, description: 'Has excellent memory for details', frequency: '', severity: '' },
          { id: 34, description: 'Thinks in visual terms', frequency: '', severity: '' },
          { id: 35, description: 'Has difficulty with abstract concepts', frequency: '', severity: '' },
          { id: 36, description: 'Shows strong interest in patterns', frequency: '', severity: '' },
          { id: 37, description: 'Has unusual problem-solving approach', frequency: '', severity: '' },
          { id: 38, description: 'Shows exceptional ability in specific area', frequency: '', severity: '' },
          { id: 39, description: 'Has difficulty with flexible thinking', frequency: '', severity: '' },
          { id: 40, description: 'Processes information differently', frequency: '', severity: '' }
        ]
      },
      {
        name: 'Maladaptive Behaviors',
        items: [
          { id: 41, description: 'Engages in self-stimulatory behavior', frequency: '', severity: '' },
          { id: 42, description: 'Has difficulty with personal space', frequency: '', severity: '' },
          { id: 43, description: 'Shows inappropriate social behavior', frequency: '', severity: '' },
          { id: 44, description: 'Has difficulty with personal hygiene', frequency: '', severity: '' },
          { id: 45, description: 'Engages in property destruction', frequency: '', severity: '' },
          { id: 46, description: 'Shows inappropriate sexual behavior', frequency: '', severity: '' },
          { id: 47, description: 'Has difficulty with personal safety', frequency: '', severity: '' },
          { id: 48, description: 'Shows inappropriate eating behavior', frequency: '', severity: '' }
        ]
      }
    ],
    autismIndex: 0,
    probabilityLevel: '',
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
    let totalScore = 0;
    template.subscales.forEach(subscale => {
      subscale.items.forEach(item => {
        const freqScore = getFrequencyScore(item.frequency);
        const sevScore = getSeverityScore(item.severity);
        totalScore += (freqScore + sevScore) / 2;
      });
    });
    
    const autismIndex = Math.round(totalScore);
    const probabilityLevel = getProbabilityLevel(autismIndex);
    
    setTemplate(prev => ({
      ...prev,
      autismIndex,
      probabilityLevel
    }));
  };

  const getFrequencyScore = (frequency) => {
    const scores = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, 'Very Often': 4 };
    return scores[frequency] || 0;
  };

  const getSeverityScore = (severity) => {
    const scores = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3, 'Very Severe': 4 };
    return scores[severity] || 0;
  };

  const getProbabilityLevel = (score) => {
    if (score >= 90) return 'Very High';
    if (score >= 75) return 'High';
    if (score >= 60) return 'Moderate';
    if (score >= 45) return 'Low';
    return 'Very Low';
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Gilliam Autism Rating Scale - 3</h1>
                <p className="text-gray-600">Comprehensive autism assessment tool</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    <div className="col-span-2 p-2 text-center font-bold text-xs">Severity</div>
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
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                          >
                            <option value="">Select</option>
                            <option value="Never">Never</option>
                            <option value="Rarely">Rarely</option>
                            <option value="Sometimes">Sometimes</option>
                            <option value="Often">Often</option>
                            <option value="Very Often">Very Often</option>
                          </select>
                        </div>
                        <div className="col-span-2 p-2">
                          <select
                            value={item.severity}
                            onChange={(e) => handleItemChange(subscaleIndex, itemIndex, 'severity', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                          >
                            <option value="">Select</option>
                            <option value="None">None</option>
                            <option value="Mild">Mild</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Severe">Severe</option>
                            <option value="Very Severe">Very Severe</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Autism Index */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Autism Index</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Autism Index Score</label>
                  <input
                    type="text"
                    value={template.autismIndex}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Probability Level</label>
                  <input
                    type="text"
                    value={template.probabilityLevel}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors"
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
                GILLIAM AUTISM RATING SCALE - THIRD EDITION
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-red-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-red-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-red-600">{template.testDate}</strong></span>
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
                    <div className="col-span-2 p-1 text-center font-bold text-xs">Severity</div>
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
                          {item.severity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Autism Index Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Results</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Autism Index</h3>
                  <p className="text-2xl font-bold text-red-600">{template.autismIndex}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Probability Level</h3>
                  <p className="text-lg font-bold text-orange-600">{template.probabilityLevel}</p>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-red-50 rounded-lg p-6">
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

export default GARS3Template;
