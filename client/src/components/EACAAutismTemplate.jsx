import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const EACAAutismTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Educational Assessment of Children with Autism (EACA)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Educational Assessment of Children with Autism (EACA) consists of a checklist of skill behaviours that are functionally relevant for such children. With the focus on the triad of impairments (impairment in social interaction, delay in language and communication, and limited interests and activities) in autism, EACA views how the impairments may impact acquisition of learning skills. The test contains 48 items and have been categorized within 7 domains namely: Attention Skills, Imitation Skills, Language and Communication Skills, Cognitive Skills, Play Skills, Self-help Skills, and Behaviour Skills.`,
    domains: [
      {
        name: 'Attention Skills',
        items: [
          { id: 1, skill: 'Sustains attention to preferred activities', score: '', maxScore: 4, remarks: '' },
          { id: 2, skill: 'Shifts attention between objects/people', score: '', maxScore: 4, remarks: '' },
          { id: 3, skill: 'Responds to name when called', score: '', maxScore: 4, remarks: '' },
          { id: 4, skill: 'Maintains eye contact during interaction', score: '', maxScore: 4, remarks: '' },
          { id: 5, skill: 'Attends to group activities', score: '', maxScore: 4, remarks: '' },
          { id: 6, skill: 'Focuses on teacher-directed tasks', score: '', maxScore: 4, remarks: '' },
          { id: 7, skill: 'Screens out environmental distractions', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Imitation Skills',
        items: [
          { id: 8, skill: 'Imitates simple motor actions', score: '', maxScore: 4, remarks: '' },
          { id: 9, skill: 'Imitates facial expressions', score: '', maxScore: 4, remarks: '' },
          { id: 10, skill: 'Imitates sounds/vocalizations', score: '', maxScore: 4, remarks: '' },
          { id: 11, skill: 'Imitates object use', score: '', maxScore: 4, remarks: '' },
          { id: 12, skill: 'Imitates multi-step actions', score: '', maxScore: 4, remarks: '' },
          { id: 13, skill: 'Imitates peer behaviors', score: '', maxScore: 4, remarks: '' },
          { id: 14, skill: 'Spontaneous imitation of new skills', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Language and Communication Skills',
        items: [
          { id: 15, skill: 'Uses gestures for communication', score: '', maxScore: 4, remarks: '' },
          { id: 16, skill: 'Follows simple verbal instructions', score: '', maxScore: 4, remarks: '' },
          { id: 17, skill: 'Understands questions', score: '', maxScore: 4, remarks: '' },
          { id: 18, skill: 'Expresses needs verbally/non-verbally', score: '', maxScore: 4, remarks: '' },
          { id: 19, skill: 'Initiates conversations', score: '', maxScore: 4, remarks: '' },
          { id: 20, skill: 'Maintains topic of conversation', score: '', maxScore: 4, remarks: '' },
          { id: 21, skill: 'Uses appropriate social language', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Cognitive Skills',
        items: [
          { id: 22, skill: 'Problem-solving skills', score: '', maxScore: 4, remarks: '' },
          { id: 23, skill: 'Cause and effect understanding', score: '', maxScore: 4, remarks: '' },
          { id: 24, skill: 'Object permanence', score: '', maxScore: 4, remarks: '' },
          { id: 25, skill: 'Classification/sorting skills', score: '', maxScore: 4, remarks: '' },
          { id: 26, skill: 'Sequencing abilities', score: '', maxScore: 4, remarks: '' },
          { id: 27, skill: 'Memory skills', score: '', maxScore: 4, remarks: '' },
          { id: 28, skill: 'Abstract thinking', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Play and Social Skills',
        items: [
          { id: 29, skill: 'Engages in solitary play', score: '', maxScore: 4, remarks: '' },
          { id: 30, skill: 'Parallel play with peers', score: '', maxScore: 4, remarks: '' },
          { id: 31, skill: 'Interactive play with others', score: '', maxScore: 4, remarks: '' },
          { id: 32, skill: 'Shares toys/materials', score: '', maxScore: 4, remarks: '' },
          { id: 33, skill: 'Takes turns in games', score: '', maxScore: 4, remarks: '' },
          { id: 34, skill: 'Shows empathy to others', score: '', maxScore: 4, remarks: '' },
          { id: 35, skill: 'Initiates social interactions', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Self-help Skills',
        items: [
          { id: 36, skill: 'Self-feeding skills', score: '', maxScore: 4, remarks: '' },
          { id: 37, skill: 'Toilet training', score: '', maxScore: 4, remarks: '' },
          { id: 38, skill: 'Dressing independently', score: '', maxScore: 4, remarks: '' },
          { id: 39, skill: 'Personal hygiene', score: '', maxScore: 4, remarks: '' },
          { id: 40, skill: 'Organizes personal belongings', score: '', maxScore: 4, remarks: '' },
          { id: 41, skill: 'Manages personal schedule', score: '', maxScore: 4, remarks: '' },
          { id: 42, skill: 'Independent work completion', score: '', maxScore: 4, remarks: '' }
        ]
      },
      {
        name: 'Behaviour Skills',
        items: [
          { id: 43, skill: 'Manages frustration appropriately', score: '', maxScore: 4, remarks: '' },
          { id: 44, skill: 'Follows classroom rules', score: '', maxScore: 4, remarks: '' },
          { id: 45, skill: 'Transitions between activities', score: '', maxScore: 4, remarks: '' },
          { id: 46, skill: 'Accepts changes in routine', score: '', maxScore: 4, remarks: '' },
          { id: 47, skill: 'Appropriate emotional expression', score: '', maxScore: 4, remarks: '' },
          { id: 48, skill: 'Self-regulation skills', score: '', maxScore: 4, remarks: '' }
        ]
      }
    ],
    totalScore: 0,
    maxTotalScore: 192,
    percentage: 0,
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

  const handleItemChange = (domainIndex, itemIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      domains: prev.domains.map((domain, dIndex) => 
        dIndex === domainIndex 
          ? {
              ...domain,
              items: domain.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, [field]: value } : item
              )
            }
          : domain
      )
    }));
  };

  const calculateScores = () => {
    let totalScore = 0;
    
    template.domains.forEach(domain => {
      domain.items.forEach(item => {
        const score = parseInt(item.score) || 0;
        totalScore += score;
      });
    });
    
    const percentage = template.maxTotalScore > 0 ? (totalScore / template.maxTotalScore) * 100 : 0;
    
    setTemplate(prev => ({
      ...prev,
      totalScore,
      percentage
    }));
  };

  const handleSave = () => {
    calculateScores();
    onSave(template);
  };

  const [activeTab, setActiveTab] = useState('edit');

  const getDomainScore = (domain) => {
    let domainScore = 0;
    let domainMax = 0;
    domain.items.forEach(item => {
      domainScore += parseInt(item.score) || 0;
      domainMax += item.maxScore;
    });
    return { score: domainScore, max: domainMax, percentage: domainMax > 0 ? (domainScore / domainMax) * 100 : 0 };
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Educational Assessment of Children with Autism (EACA)</h1>
                <p className="text-gray-600">Comprehensive autism-specific educational assessment</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Assessment Domains */}
            {template.domains.map((domain, domainIndex) => (
              <div key={domainIndex} className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{domain.name}</h2>
                <div className="border border-black">
                  <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                    <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">ID</div>
                    <div className="col-span-5 border-r border-black p-2 text-center font-bold text-xs">Skill</div>
                    <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Score</div>
                    <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Max</div>
                    <div className="col-span-2 p-2 text-center font-bold text-xs">Remarks</div>
                  </div>
                  {domain.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-5 border-r border-black p-2 text-xs">
                          {item.skill}
                        </div>
                        <div className="col-span-2 border-r border-black p-2">
                          <input
                            type="text"
                            value={item.score}
                            onChange={(e) => handleItemChange(domainIndex, itemIndex, 'score', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-2 border-r border-black p-2 text-center text-xs">
                          {item.maxScore}
                        </div>
                        <div className="col-span-2 p-2">
                          <input
                            type="text"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(domainIndex, itemIndex, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                            placeholder="Notes"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total Scores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Scores</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Score</label>
                  <input
                    type="text"
                    value={template.totalScore}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Score</label>
                  <input
                    type="text"
                    value={template.maxTotalScore}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Percentage</label>
                <input
                  type="text"
                  value={`${Math.round(template.percentage)}%`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 transition-colors"
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
                EDUCATIONAL ASSESSMENT OF CHILDREN WITH AUTISM (EACA)
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-purple-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-purple-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-purple-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Description</h2>
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed text-sm">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Domains Preview with Progress Bars */}
            {template.domains.map((domain, domainIndex) => {
              const domainScore = getDomainScore(domain);
              return (
                <div key={domainIndex} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">{domain.name}</h2>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Score: {domainScore.score}/{domainScore.max}</span>
                      <span>{Math.round(domainScore.percentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${domainScore.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="border border-black">
                    <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                      <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">ID</div>
                      <div className="col-span-5 border-r border-black p-1 text-center font-bold text-xs">Skill</div>
                      <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Score</div>
                      <div className="col-span-2 border-r border-black p-1 text-center font-bold text-xs">Max</div>
                      <div className="col-span-2 p-1 text-center font-bold text-xs">Remarks</div>
                    </div>
                    {domain.items.map((item, itemIndex) => (
                      <div key={item.id} className="border-b border-black">
                        <div className="grid grid-cols-12">
                          <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                            {item.id}
                          </div>
                          <div className="col-span-5 border-r border-black p-1 text-xs">
                            {item.skill}
                          </div>
                          <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                            {item.score}
                          </div>
                          <div className="col-span-2 border-r border-black p-1 text-center text-xs">
                            {item.maxScore}
                          </div>
                          <div className="col-span-2 p-1 text-center text-xs">
                            {item.remarks}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Overall Progress Visualization */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Assessment Results</h2>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {Math.round(template.percentage)}%
                  </div>
                  <div className="text-gray-600">Overall Score: {template.totalScore}/{template.maxTotalScore}</div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                    style={{ width: `${template.percentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {template.percentage >= 10 && `${Math.round(template.percentage)}%`}
                    </span>
                  </div>
                </div>

                {/* Percentage Labels */}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-purple-50 rounded-lg p-6">
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

export default EACAAutismTemplate;
