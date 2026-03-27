import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText, FiUser, FiCalendar, FiBook, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const DiagnosticReportTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'DIAGNOSTIC ASSESSMENT REPORT',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    age: '',
    grade: '',
    description: `Comprehensive diagnostic assessment report based on DSM-5 criteria and standardized test results. This report includes diagnostic impression, recommendations, and accommodations for educational planning.`,
    
    diagnosticImpression: {
      criteria: 'According to Diagnostic and Statistical Manual of Mental Disorders 5th Edition (DSM-5)',
      diagnosis: 'Autism Spectrum Disorder',
      supportLevel: 'with substantial support',
      deficits: [
        'deficits in social social communication',
        'restricted and repetitive patterns of behaviour'
      ],
      assessmentBasis: 'standard scores obtained during assessment'
    },

    recommendations: [
      {
        category: 'Daily Structure',
        items: [
          'Provide ABC with a daily schedule that is easily accessible',
          'Give him 5-minute prompts before a transition to ease his anxiety around this area of difficulty for him'
        ]
      },
      {
        category: 'Therapeutic Interventions',
        items: [
          'Continue to provide ABC with Occupational Therapy sessions',
          'Provide him with Speech and language therapy to help him build his communication skills',
          'He needs to undergo Remedial sessions for him to cope with his academics',
          'ABC should start with Occupational Therapy at the earliest'
        ]
      },
      {
        category: 'Visual and Behavioral Strategies',
        items: [
          'Use visual strategies to help student focus, understand a change in routine, and help with repetitive behaviour',
          'Use the \'power card\' strategy to teach target behaviour',
          'Use \'circumscribed interests\' (CI\'s) to increase desirable behaviour and academic engagement'
        ]
      },
      {
        category: 'Educational Strategies',
        items: [
          'ABC can attend a Regular school, if accompanied by a shadow teacher',
          'Use a multisensory approach to instructions',
          'Use differentiated instructions',
          'Use strategies like role-play, and video-modelling to help him develop social skills',
          'Reinforce positive behaviour and celebrate strengths'
        ]
      }
    ],

    accommodations: [
      {
        category: 'Assessment Accommodations',
        items: [
          'Extended time of 50% in all in-class assessments to complete tasks, as well as during examinations',
          'Modified question papers',
          'Oral examination can be considered in place of written examination',
          'Provide a writer and reader',
          'Provide a shadow teacher',
          'Supervised rest breaks',
          'Separate room for examinations',
          'Use of calculator',
          'Exemption from Second and Third Languages',
          'Exempted from having to write answers in detail during exams'
        ]
      }
    ],

    disclaimer: 'The above recommended accommodations are based on the standard scores obtained during assessment. However, school will remain best judge of all accommodations that this student needs.',

    interpretation: '',
    conclusions: '',
    additionalNotes: ''
  });

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDiagnosticChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      diagnosticImpression: {
        ...prev.diagnosticImpression,
        [field]: value
      }
    }));
  };

  const handleDeficitsChange = (index, value) => {
    setTemplate(prev => ({
      ...prev,
      diagnosticImpression: {
        ...prev.diagnosticImpression,
        deficits: prev.diagnosticImpression.deficits.map((deficit, i) => 
          i === index ? value : deficit
        )
      }
    }));
  };

  const handleRecommendationChange = (categoryIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      recommendations: prev.recommendations.map((rec, index) => 
        index === categoryIndex 
          ? {
              ...rec,
              items: rec.items.map((item, i) => 
                i === itemIndex ? value : item
              )
            }
          : rec
      )
    }));
  };

  const handleAccommodationChange = (categoryIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      accommodations: prev.accommodations.map((acc, index) => 
        index === categoryIndex 
          ? {
              ...acc,
              items: acc.items.map((item, i) => 
                i === itemIndex ? value : item
              )
            }
          : acc
      )
    }));
  };

  const handleSave = () => {
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('diagnostic');

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
            <h3 className="text-lg font-semibold mb-3">Diagnostic Impression</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-800 mb-3">
                <strong>{template.diagnosticImpression.criteria}</strong>
              </p>
              <p className="text-lg font-bold text-blue-800 mb-3">
                {template.studentName} meets the criteria for <strong>'{template.diagnosticImpression.diagnosis}'</strong>, {template.diagnosticImpression.supportLevel} for both:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                {template.diagnosticImpression.deficits.map((deficit, index) => (
                  <li key={index} className="text-gray-700">{deficit}</li>
                ))}
              </ul>
              <p className="text-sm text-gray-600">
                <em>Based on: {template.diagnosticImpression.assessmentBasis}</em>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            <div className="space-y-4">
              {template.recommendations.map((category, catIndex) => (
                <div key={catIndex} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">{category.category}</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Concessions/Accommodations</h3>
            <div className="space-y-4">
              {template.accommodations.map((category, catIndex) => (
                <div key={catIndex} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">{category.category}</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 mt-4">
              <p className="text-sm text-gray-600 italic">{template.disclaimer}</p>
            </div>
          </div>

          {template.interpretation && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Interpretation</h3>
              <p className="text-gray-700">{template.interpretation}</p>
            </div>
          )}

          {template.additionalNotes && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Notes</h3>
              <p className="text-gray-700">{template.additionalNotes}</p>
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
            onClick={() => setActiveTab('diagnostic')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'diagnostic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiUser className="inline mr-2" />
            Diagnostic
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'recommendations'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiCheckCircle className="inline mr-2" />
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('accommodations')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'accommodations'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiAlertCircle className="inline mr-2" />
            Accommodations
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'notes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiBook className="inline mr-2" />
            Notes
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

      {activeTab === 'diagnostic' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Diagnostic Impression</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnostic Criteria</label>
                <textarea
                  value={template.diagnosticImpression.criteria}
                  onChange={(e) => handleDiagnosticChange('criteria', e.target.value)}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <input
                    type="text"
                    value={template.diagnosticImpression.diagnosis}
                    onChange={(e) => handleDiagnosticChange('diagnosis', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Support Level</label>
                  <input
                    type="text"
                    value={template.diagnosticImpression.supportLevel}
                    onChange={(e) => handleDiagnosticChange('supportLevel', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Identified Deficits</label>
                <div className="space-y-2">
                  {template.diagnosticImpression.deficits.map((deficit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-8">{index + 1}.</span>
                      <input
                        type="text"
                        value={deficit}
                        onChange={(e) => handleDeficitsChange(index, e.target.value)}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                      <button
                        onClick={() => {
                          const newDeficits = template.diagnosticImpression.deficits.filter((_, i) => i !== index);
                          setTemplate(prev => ({
                            ...prev,
                            diagnosticImpression: {
                              ...prev.diagnosticImpression,
                              deficits: newDeficits
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
                        diagnosticImpression: {
                          ...prev.diagnosticImpression,
                          deficits: [...prev.diagnosticImpression.deficits, '']
                        }
                      }));
                    }}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Deficit
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assessment Basis</label>
                <input
                  type="text"
                  value={template.diagnosticImpression.assessmentBasis}
                  onChange={(e) => handleDiagnosticChange('assessmentBasis', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            <div className="space-y-4">
              {template.recommendations.map((category, catIndex) => (
                <div key={catIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{category.category}</h4>
                    <button
                      onClick={() => {
                        const newRecommendations = template.recommendations.filter((_, i) => i !== catIndex);
                        setTemplate(prev => ({
                          ...prev,
                          recommendations: newRecommendations
                        }));
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Category
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 w-8">{itemIndex + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleRecommendationChange(catIndex, itemIndex, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                        <button
                          onClick={() => {
                            const newItems = category.items.filter((_, i) => i !== itemIndex);
                            const newRecommendations = [...template.recommendations];
                            newRecommendations[catIndex] = {
                              ...category,
                              items: newItems
                            };
                            setTemplate(prev => ({
                              ...prev,
                              recommendations: newRecommendations
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
                        const newRecommendations = [...template.recommendations];
                        newRecommendations[catIndex] = {
                          ...category,
                          items: [...category.items, '']
                        };
                        setTemplate(prev => ({
                          ...prev,
                          recommendations: newRecommendations
                        }));
                      }}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Recommendation
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setTemplate(prev => ({
                    ...prev,
                    recommendations: [...prev.recommendations, { category: '', items: [''] }]
                  }));
                }}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'accommodations' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Concessions/Accommodations</h3>
            <div className="space-y-4">
              {template.accommodations.map((category, catIndex) => (
                <div key={catIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{category.category}</h4>
                    <button
                      onClick={() => {
                        const newAccommodations = template.accommodations.filter((_, i) => i !== catIndex);
                        setTemplate(prev => ({
                          ...prev,
                          accommodations: newAccommodations
                        }));
                      }}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Category
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 w-8">{itemIndex + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleAccommodationChange(catIndex, itemIndex, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        />
                        <button
                          onClick={() => {
                            const newItems = category.items.filter((_, i) => i !== itemIndex);
                            const newAccommodations = [...template.accommodations];
                            newAccommodations[catIndex] = {
                              ...category,
                              items: newItems
                            };
                            setTemplate(prev => ({
                              ...prev,
                              accommodations: newAccommodations
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
                        const newAccommodations = [...template.accommodations];
                        newAccommodations[catIndex] = {
                          ...category,
                          items: [...category.items, '']
                        };
                        setTemplate(prev => ({
                          ...prev,
                          accommodations: newAccommodations
                        }));
                      }}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Accommodation
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={() => {
                  setTemplate(prev => ({
                    ...prev,
                    accommodations: [...prev.accommodations, { category: '', items: [''] }]
                  }));
                }}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Disclaimer</label>
            <textarea
              value={template.disclaimer}
              onChange={(e) => handleInputChange('disclaimer', e.target.value)}
              rows={2}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
            />
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interpretation</label>
            <textarea
              value={template.interpretation}
              onChange={(e) => handleInputChange('interpretation', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter your interpretation of the assessment results..."
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={template.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
              placeholder="Enter any additional notes or observations..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticReportTemplate;
