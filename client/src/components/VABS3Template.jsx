import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const VABS3Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Vineland Adaptive Behaviour Scales are an individual assessment of adaptive behaviour. Adaptive behaviour is defined as performance of the day-to-day activities necessary to take care of oneself and get along with others. Adaptive behaviour is age-based and is defined by the expectations and standards of others. Adaptive behaviour represents the typical performance rather than the ability of the individual - what a person does as opposed to what a person is capable of doing.`,
    
    raters: [
      {
        type: 'Parent Form',
        name: '',
        relationship: 'Parent/Guardian',
        dateCompleted: new Date().toISOString().split('T')[0]
      },
      {
        type: 'Teacher Form',
        name: '',
        relationship: 'Teacher/Educator',
        dateCompleted: new Date().toISOString().split('T')[0]
      }
    ],

    domains: [
      {
        name: 'Communication Skills',
        description: 'Assesses receptive, expressive, and written communication skills',
        subdomains: [
          {
            name: 'Receptive',
            description: 'How individual listens, understands, and responds to verbal communication',
            items: [
              { id: 1, item: 'Follows simple one-step commands', score: 0, maxScore: 2 },
              { id: 2, item: 'Follows two-step commands', score: 0, maxScore: 2 },
              { id: 3, item: 'Understands complex sentences', score: 0, maxScore: 2 },
              { id: 4, item: 'Understands questions about past events', score: 0, maxScore: 2 },
              { id: 5, item: 'Understands stories and conversations', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Expressive',
            description: 'How individual expresses needs, thoughts, and ideas verbally',
            items: [
              { id: 6, item: 'Uses single words', score: 0, maxScore: 2 },
              { id: 7, item: 'Uses two-word phrases', score: 0, maxScore: 2 },
              { id: 8, item: 'Uses complete sentences', score: 0, maxScore: 2 },
              { id: 9, item: 'Tells stories about events', score: 0, maxScore: 2 },
              { id: 10, item: 'Engages in conversations', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Written',
            description: 'How individual reads and writes',
            items: [
              { id: 11, item: 'Recognizes letters', score: 0, maxScore: 2 },
              { id: 12, item: 'Reads simple words', score: 0, maxScore: 2 },
              { id: 13, item: 'Writes name', score: 0, maxScore: 2 },
              { id: 14, item: 'Writes simple sentences', score: 0, maxScore: 2 },
              { id: 15, item: 'Reads and understands text', score: 0, maxScore: 2 }
            ]
          }
        ]
      },
      {
        name: 'Daily Living Skills',
        description: 'Assesses personal, domestic, and community living skills',
        subdomains: [
          {
            name: 'Personal',
            description: 'How individual takes care of personal needs and hygiene',
            items: [
              { id: 16, item: 'Eats independently', score: 0, maxScore: 2 },
              { id: 17, item: 'Dresses independently', score: 0, maxScore: 2 },
              { id: 18, item: 'Manages personal hygiene', score: 0, maxScore: 2 },
              { id: 19, item: 'Uses toilet independently', score: 0, maxScore: 2 },
              { id: 20, item: 'Manages personal care routines', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Domestic',
            description: 'How individual helps with household tasks',
            items: [
              { id: 21, item: 'Puts away toys', score: 0, maxScore: 2 },
              { id: 22, item: 'Helps with simple chores', score: 0, maxScore: 2 },
              { id: 23, item: 'Prepares simple snacks', score: 0, maxScore: 2 },
              { id: 24, item: 'Helps with meal preparation', score: 0, maxScore: 2 },
              { id: 25, item: 'Manages household responsibilities', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Community',
            description: 'How individual functions in community settings',
            items: [
              { id: 26, item: 'Uses money for purchases', score: 0, maxScore: 2 },
              { id: 27, item: 'Uses telephone', score: 0, maxScore: 2 },
              { id: 28, item: 'Navigates familiar places', score: 0, maxScore: 2 },
              { id: 29, item: 'Uses public transportation', score: 0, maxScore: 2 },
              { id: 30, item: 'Manages time and schedules', score: 0, maxScore: 2 }
            ]
          }
        ]
      },
      {
        name: 'Socialization',
        description: 'Assesses interpersonal relationships and social skills',
        subdomains: [
          {
            name: 'Interpersonal Relationships',
            description: 'How individual interacts with others',
            items: [
              { id: 31, item: 'Shows affection to family', score: 0, maxScore: 2 },
              { id: 32, item: 'Plays alongside peers', score: 0, maxScore: 2 },
              { id: 33, item: 'Shares toys and materials', score: 0, maxScore: 2 },
              { id: 34, item: 'Makes friends', score: 0, maxScore: 2 },
              { id: 35, item: 'Maintains friendships', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Play and Leisure Time',
            description: 'How individual engages in recreational activities',
            items: [
              { id: 36, item: 'Engages in solitary play', score: 0, maxScore: 2 },
              { id: 37, item: 'Participates in group games', score: 0, maxScore: 2 },
              { id: 38, item: 'Uses imagination in play', score: 0, maxScore: 2 },
              { id: 39, item: 'Follows game rules', score: 0, maxScore: 2 },
              { id: 40, item: 'Pursues hobbies and interests', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Coping Skills',
            description: 'How individual handles emotions and stress',
            items: [
              { id: 41, item: 'Manages frustration', score: 0, maxScore: 2 },
              { id: 42, item: 'Accepts changes in routine', score: 0, maxScore: 2 },
              { id: 43, item: 'Copes with disappointment', score: 0, maxScore: 2 },
              { id: 44, item: 'Handles criticism', score: 0, maxScore: 2 },
              { id: 45, item: 'Manages stress appropriately', score: 0, maxScore: 2 }
            ]
          }
        ]
      },
      {
        name: 'Motor Skills',
        description: 'Assesses fine and gross motor skills',
        subdomains: [
          {
            name: 'Gross Motor',
            description: 'How individual uses large muscles for movement',
            items: [
              { id: 46, item: 'Walks independently', score: 0, maxScore: 2 },
              { id: 47, item: 'Runs and jumps', score: 0, maxScore: 2 },
              { id: 48, item: 'Climbs stairs', score: 0, maxScore: 2 },
              { id: 49, item: 'Throws and catches balls', score: 0, maxScore: 2 },
              { id: 50, item: 'Participates in sports', score: 0, maxScore: 2 }
            ]
          },
          {
            name: 'Fine Motor',
            description: 'How individual uses hands for precise movements',
            items: [
              { id: 51, item: 'Grasps objects', score: 0, maxScore: 2 },
              { id: 52, item: 'Uses utensils for eating', score: 0, maxScore: 2 },
              { id: 53, item: 'Buttons and zips clothing', score: 0, maxScore: 2 },
              { id: 54, item: 'Uses scissors', score: 0, maxScore: 2 },
              { id: 55, item: 'Writes and draws', score: 0, maxScore: 2 }
            ]
          }
        ]
      }
    ],

    scores: {
      parent: {
        communication: { standardScore: 0, percentileRank: 0, level: '' },
        dailyLiving: { standardScore: 0, percentileRank: 0, level: '' },
        socialization: { standardScore: 0, percentileRank: 0, level: '' },
        motorSkills: { standardScore: 0, percentileRank: 0, level: '' },
        adaptiveBehaviourComposite: { standardScore: 0, percentileRank: 0, level: '' }
      },
      teacher: {
        communication: { standardScore: 0, percentileRank: 0, level: '' },
        dailyLiving: { standardScore: 0, percentileRank: 0, level: '' },
        socialization: { standardScore: 0, percentileRank: 0, level: '' },
        motorSkills: { standardScore: 0, percentileRank: 0, level: '' },
        adaptiveBehaviourComposite: { standardScore: 0, percentileRank: 0, level: '' }
      }
    },

    adaptiveLevels: [
      { value: 'Very Low', range: 'Below 70', color: 'red' },
      { value: 'Moderately Low', range: '70-84', color: 'orange' },
      { value: 'Low Average', range: '85-94', color: 'yellow' },
      { value: 'Average', range: '95-104', color: 'green' },
      { value: 'High Average', range: '105-114', color: 'blue' },
      { value: 'Moderately High', range: '115-129', color: 'purple' },
      { value: 'Very High', range: '130 and above', color: 'indigo' }
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

  const handleRaterChange = (raterIndex, field, value) => {
    setTemplate(prev => ({
      ...prev,
      raters: prev.raters.map((rater, index) => 
        index === raterIndex ? { ...rater, [field]: value } : rater
      )
    }));
  };

  const handleItemScore = (domainIndex, subdomainIndex, itemIndex, score) => {
    setTemplate(prev => ({
      ...prev,
      domains: prev.domains.map((domain, dIndex) => 
        dIndex === domainIndex 
          ? {
              ...domain,
              subdomains: domain.subdomains.map((subdomain, sIndex) => 
                sIndex === subdomainIndex 
                  ? {
                      ...subdomain,
                      items: subdomain.items.map((item, iIndex) => 
                        iIndex === itemIndex ? { ...item, score: parseInt(score) || 0 } : item
                      )
                    }
                  : subdomain
              )
            }
          : domain
      )
    }));
  };

  const calculateDomainScores = (raterType) => {
    const updatedScores = { ...template.scores[raterType] };
    
    template.domains.forEach((domain, domainIndex) => {
      let domainTotalScore = 0;
      let domainMaxScore = 0;
      
      domain.subdomains.forEach(subdomain => {
        subdomain.items.forEach(item => {
          domainTotalScore += item.score;
          domainMaxScore += item.maxScore;
        });
      });
      
      // Calculate standard score (simplified calculation)
      const percentage = (domainTotalScore / domainMaxScore) * 100;
      let standardScore = Math.round((percentage / 100) * 40 + 80); // Scale to 80-120 range
      
      // Calculate percentile rank (simplified)
      let percentileRank = Math.round(((standardScore - 100) / 15) * 34 + 50);
      percentileRank = Math.max(1, Math.min(99, percentileRank));
      
      // Determine adaptive level
      let level = '';
      if (standardScore < 70) level = 'Very Low';
      else if (standardScore < 85) level = 'Moderately Low';
      else if (standardScore < 95) level = 'Low Average';
      else if (standardScore < 105) level = 'Average';
      else if (standardScore < 115) level = 'High Average';
      else if (standardScore < 130) level = 'Moderately High';
      else level = 'Very High';
      
      const domainKey = domain.name.toLowerCase().replace(' ', '');
      updatedScores[domainKey] = { standardScore, percentileRank, level };
    });
    
    // Calculate Adaptive Behaviour Composite (simplified - average of domain scores)
    const domainScores = Object.values(updatedScores).slice(0, 4); // Exclude composite itself
    const avgStandardScore = Math.round(domainScores.reduce((sum, score) => sum + score.standardScore, 0) / domainScores.length);
    const avgPercentileRank = Math.round(domainScores.reduce((sum, score) => sum + score.percentileRank, 0) / domainScores.length);
    
    let compositeLevel = '';
    if (avgStandardScore < 70) compositeLevel = 'Very Low';
    else if (avgStandardScore < 85) compositeLevel = 'Moderately Low';
    else if (avgStandardScore < 95) compositeLevel = 'Low Average';
    else if (avgStandardScore < 105) compositeLevel = 'Average';
    else if (avgStandardScore < 115) compositeLevel = 'High Average';
    else if (avgStandardScore < 130) compositeLevel = 'Moderately High';
    else compositeLevel = 'Very High';
    
    updatedScores.adaptiveBehaviourComposite = { 
      standardScore: avgStandardScore, 
      percentileRank: avgPercentileRank, 
      level: compositeLevel 
    };
    
    setTemplate(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [raterType]: updatedScores
      }
    }));
  };

  const handleScoreChange = (raterType, domain, field, value) => {
    setTemplate(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [raterType]: {
          ...prev.scores[raterType],
          [domain]: {
            ...prev.scores[raterType][domain],
            [field]: field === 'standardScore' || field === 'percentileRank' ? parseInt(value) || 0 : value
          }
        }
      }
    }));
  };

  const handleSave = () => {
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('domains');

  const getLevelColor = (level) => {
    const colors = {
      'Very Low': 'text-red-600 bg-red-50',
      'Moderately Low': 'text-orange-600 bg-orange-50',
      'Low Average': 'text-yellow-600 bg-yellow-50',
      'Average': 'text-green-600 bg-green-50',
      'High Average': 'text-blue-600 bg-blue-50',
      'Moderately High': 'text-purple-600 bg-purple-50',
      'Very High': 'text-indigo-600 bg-indigo-50'
    };
    return colors[level] || 'text-gray-600 bg-gray-50';
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Student Name</label>
              <p className="mt-1 text-lg font-semibold">{template.studentName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Examiner Name</label>
              <p className="mt-1 text-lg font-semibold">{template.examinerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Date</label>
              <p className="mt-1 text-lg font-semibold">{template.testDate}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Raters</h3>
            <div className="grid grid-cols-2 gap-4">
              {template.raters.map((rater, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">{rater.type}</h4>
                  <p className="text-sm text-gray-600">Name: {rater.name || 'Not specified'}</p>
                  <p className="text-sm text-gray-600">Relationship: {rater.relationship}</p>
                  <p className="text-sm text-gray-600">Date: {rater.dateCompleted}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Adaptive Behaviour Scores</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(template.scores).map(([raterType, scores]) => (
                <div key={raterType} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 capitalize">{raterType} Form</h4>
                  <div className="space-y-2">
                    {Object.entries(scores).map(([domain, score]) => (
                      <div key={domain} className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {domain === 'adaptiveBehaviourComposite' ? 'Adaptive Behaviour Composite' :
                           domain === 'communication' ? 'Communication Skills' :
                           domain === 'dailyLiving' ? 'Daily Living Skills' :
                           domain === 'socialization' ? 'Socialization' :
                           domain === 'motorSkills' ? 'Motor Skills' : domain}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{score.standardScore}</span>
                          <span className="text-xs text-gray-500">({score.percentileRank}%)</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(score.level)}`}>
                            {score.level}
                          </span>
                        </div>
                      </div>
                    ))}
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
            onClick={() => setActiveTab('domains')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'domains'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Domains
          </button>
          <button
            onClick={() => setActiveTab('scores')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'scores'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Scores
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

      <div className="grid grid-cols-3 gap-4 mb-6">
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
          <label className="block text-sm font-medium text-gray-700">Examiner Name</label>
          <input
            type="text"
            value={template.examinerName}
            onChange={(e) => handleInputChange('examinerName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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

      {activeTab === 'domains' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Raters Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {template.raters.map((rater, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{rater.type}</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={rater.name}
                        onChange={(e) => handleRaterChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input
                        type="text"
                        value={rater.relationship}
                        onChange={(e) => handleRaterChange(index, 'relationship', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date Completed</label>
                      <input
                        type="date"
                        value={rater.dateCompleted}
                        onChange={(e) => handleRaterChange(index, 'dateCompleted', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Adaptive Behaviour Domains</h3>
            <div className="space-y-6">
              {template.domains.map((domain, domainIndex) => (
                <div key={domainIndex} className="border rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-2">{domain.name}</h4>
                  <p className="text-gray-600 mb-4">{domain.description}</p>
                  
                  <div className="space-y-4">
                    {domain.subdomains.map((subdomain, subdomainIndex) => (
                      <div key={subdomainIndex} className="border rounded p-4">
                        <h5 className="font-semibold mb-2">{subdomain.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{subdomain.description}</p>
                        
                        <div className="space-y-2">
                          {subdomain.items.map((item, itemIndex) => (
                            <div key={item.id} className="flex items-center justify-between">
                              <span className="text-sm flex-1">{item.item}</span>
                              <select
                                value={item.score}
                                onChange={(e) => handleItemScore(domainIndex, subdomainIndex, itemIndex, e.target.value)}
                                className="ml-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                              >
                                <option value="0">0 - Not performed</option>
                                <option value="1">1 - Sometimes/Partially</option>
                                <option value="2">2 - Usually/Independently</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scores' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(template.scores).map(([raterType, scores]) => (
              <div key={raterType} className="border rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold capitalize">{raterType} Form</h3>
                  <button
                    onClick={() => calculateDomainScores(raterType)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Calculate Scores
                  </button>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(scores).map(([domain, score]) => (
                    <div key={domain} className="border rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {domain === 'adaptiveBehaviourComposite' ? 'Adaptive Behaviour Composite' :
                           domain === 'communication' ? 'Communication Skills' :
                           domain === 'dailyLiving' ? 'Daily Living Skills' :
                           domain === 'socialization' ? 'Socialization' :
                           domain === 'motorSkills' ? 'Motor Skills' : domain}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(score.level)}`}>
                          {score.level}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Standard Score</label>
                          <input
                            type="number"
                            value={score.standardScore}
                            onChange={(e) => handleScoreChange(raterType, domain, 'standardScore', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Percentile Rank</label>
                          <input
                            type="number"
                            value={score.percentileRank}
                            onChange={(e) => handleScoreChange(raterType, domain, 'percentileRank', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1 border text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Adaptive Levels Reference</h3>
            <div className="grid grid-cols-7 gap-2">
              {template.adaptiveLevels.map((level, index) => (
                <div key={index} className={`border rounded p-2 text-center ${getLevelColor(level.value)}`}>
                  <div className="font-medium text-xs">{level.value}</div>
                  <div className="text-xs opacity-75">{level.range}</div>
                </div>
              ))}
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
              placeholder="Enter your interpretation of the adaptive behavior assessment results..."
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

export default VABS3Template;
