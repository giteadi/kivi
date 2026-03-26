import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const EACATemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Early Academic Competency Assessment',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Early Academic Competency Assessment (EACA) is a comprehensive screening tool designed to evaluate early academic skills and school readiness in young children. The assessment measures foundational skills in reading, writing, mathematics, and language development that are critical for academic success.`,
    domains: [
      {
        name: 'Pre-Reading Skills',
        items: [
          { id: 1, skill: 'Letter Recognition', score: '', maxScore: 26, remarks: '' },
          { id: 2, skill: 'Letter Sounds', score: '', maxScore: 26, remarks: '' },
          { id: 3, skill: 'Print Awareness', score: '', maxScore: 10, remarks: '' },
          { id: 4, skill: 'Phonological Awareness', score: '', maxScore: 15, remarks: '' },
          { id: 5, skill: 'Rhyming Skills', score: '', maxScore: 10, remarks: '' },
          { id: 6, skill: 'Syllable Segmentation', score: '', maxScore: 8, remarks: '' },
          { id: 7, skill: 'Beginning Sounds', score: '', maxScore: 12, remarks: '' },
          { id: 8, skill: 'Sight Word Recognition', score: '', maxScore: 20, remarks: '' }
        ]
      },
      {
        name: 'Pre-Writing Skills',
        items: [
          { id: 9, skill: 'Fine Motor Control', score: '', maxScore: 10, remarks: '' },
          { id: 10, skill: 'Pencil Grip', score: '', maxScore: 5, remarks: '' },
          { id: 11, skill: 'Hand Dominance', score: '', maxScore: 3, remarks: '' },
          { id: 12, skill: 'Shape Drawing', score: '', maxScore: 8, remarks: '' },
          { id: 13, skill: 'Letter Formation', score: '', maxScore: 15, remarks: '' },
          { id: 14, skill: 'Name Writing', score: '', maxScore: 5, remarks: '' },
          { id: 15, skill: 'Copying Patterns', score: '', maxScore: 10, remarks: '' },
          { id: 16, skill: 'Drawing Skills', score: '', maxScore: 8, remarks: '' }
        ]
      },
      {
        name: 'Early Mathematics',
        items: [
          { id: 17, skill: 'Number Recognition', score: '', maxScore: 20, remarks: '' },
          { id: 18, skill: 'Counting Skills', score: '', maxScore: 15, remarks: '' },
          { id: 19, skill: 'One-to-One Correspondence', score: '', maxScore: 10, remarks: '' },
          { id: 20, skill: 'Basic Addition', score: '', maxScore: 10, remarks: '' },
          { id: 21, skill: 'Basic Subtraction', score: '', maxScore: 10, remarks: '' },
          { id: 22, skill: 'Pattern Recognition', score: '', maxScore: 8, remarks: '' },
          { id: 23, skill: 'Shape Recognition', score: '', maxScore: 10, remarks: '' },
          { id: 24, skill: 'Measurement Concepts', score: '', maxScore: 5, remarks: '' }
        ]
      },
      {
        name: 'Language Development',
        items: [
          { id: 25, skill: 'Receptive Vocabulary', score: '', maxScore: 25, remarks: '' },
          { id: 26, skill: 'Expressive Vocabulary', score: '', maxScore: 25, remarks: '' },
          { id: 27, skill: 'Sentence Structure', score: '', maxScore: 15, remarks: '' },
          { id: 28, skill: 'Following Directions', score: '', maxScore: 10, remarks: '' },
          { id: 29, skill: 'Story Comprehension', score: '', maxScore: 10, remarks: '' },
          { id: 30, skill: 'Oral Expression', score: '', maxScore: 10, remarks: '' },
          { id: 31, skill: 'Grammar Usage', score: '', maxScore: 8, remarks: '' },
          { id: 32, skill: 'Social Communication', score: '', maxScore: 10, remarks: '' }
        ]
      },
      {
        name: 'Cognitive Skills',
        items: [
          { id: 33, skill: 'Visual Memory', score: '', maxScore: 10, remarks: '' },
          { id: 34, skill: 'Auditory Memory', score: '', maxScore: 10, remarks: '' },
          { id: 35, skill: 'Spatial Awareness', score: '', maxScore: 8, remarks: '' },
          { id: 36, skill: 'Problem Solving', score: '', maxScore: 10, remarks: '' },
          { id: 37, skill: 'Attention Span', score: '', maxScore: 10, remarks: '' },
          { id: 38, skill: 'Processing Speed', score: '', maxScore: 8, remarks: '' },
          { id: 39, skill: 'Classification Skills', score: '', maxScore: 8, remarks: '' },
          { id: 40, skill: 'Sequential Memory', score: '', maxScore: 8, remarks: '' }
        ]
      }
    ],
    totalScore: 0,
    maxTotalScore: 0,
    competencyLevel: '',
    readinessLevel: '',
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
    let maxTotalScore = 0;
    
    template.domains.forEach(domain => {
      domain.items.forEach(item => {
        const score = parseInt(item.score) || 0;
        totalScore += score;
        maxTotalScore += item.maxScore;
      });
    });
    
    const percentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    const competencyLevel = getCompetencyLevel(percentage);
    const readinessLevel = getReadinessLevel(percentage);
    
    setTemplate(prev => ({
      ...prev,
      totalScore,
      maxTotalScore,
      competencyLevel,
      readinessLevel
    }));
  };

  const getCompetencyLevel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Satisfactory';
    if (percentage >= 60) return 'Needs Improvement';
    return 'Significant Support Needed';
  };

  const getReadinessLevel = (percentage) => {
    if (percentage >= 85) return 'Well Prepared';
    if (percentage >= 75) return 'Prepared';
    if (percentage >= 65) return 'Somewhat Prepared';
    if (percentage >= 50) return 'Developing';
    return 'Not Ready';
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
                <h1 className="text-2xl font-bold text-gray-800">Early Academic Competency Assessment</h1>
                <p className="text-gray-600">Comprehensive early academic skills evaluation</p>
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
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
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
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500"
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
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competency Level</label>
                  <input
                    type="text"
                    value={template.competencyLevel}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Readiness Level</label>
                  <input
                    type="text"
                    value={template.readinessLevel}
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
                EARLY ACADEMIC COMPETENCY ASSESSMENT REPORT
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-teal-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-teal-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-teal-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Domains Preview */}
            {template.domains.map((domain, domainIndex) => (
              <div key={domainIndex} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{domain.name}</h2>
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
            ))}

            {/* Total Scores Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Results</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-teal-800 mb-2">Total Score</h3>
                  <p className="text-2xl font-bold text-teal-600">{template.totalScore}/{template.maxTotalScore}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Percentage</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {template.maxTotalScore > 0 ? Math.round((template.totalScore / template.maxTotalScore) * 100) : 0}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Competency Level</h3>
                  <p className="text-lg font-bold text-green-600">{template.competencyLevel}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Readiness Level</h3>
                  <p className="text-lg font-bold text-purple-600">{template.readinessLevel}</p>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-teal-50 rounded-lg p-6">
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

export default EACATemplate;
