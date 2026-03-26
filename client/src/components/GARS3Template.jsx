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
    description: `Autism is a developmental disorder characterized by severe and pervasive impairments in communication, social interaction, and a markedly restricted repertoire of activity and interests. The GARS-3 is a norm-referenced screening instrument used to identify persons who have severe behavioural problems that may be indicative of autism spectrum disorders. Its six subscales are related to the Autism Society's definition of autism spectrum disorder (ASD), which describe specific, observable, and measurable behaviours. The subscales are Restricted/Repetitive Behaviours, Social Interaction, Social Communication, Emotional Responses, Cognitive Style, and Maladaptive Speech.
    
The Autism Index mean for the normative sample is 100, with a standard deviation of 15. The higher the Autism Index score, the greater is the probability that the person has ASD. Also, the greater the index score, the more severe the autistic behaviour is.`,
    subscales: [
      {
        name: 'Restricted/Repetitive Behaviours',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 1, description: 'Engages in repetitive motor movements (e.g., hand flapping, body rocking)', rating: 0 },
          { id: 2, description: 'Insists on sameness, routines, or rituals', rating: 0 },
          { id: 3, description: 'Has highly restricted interests (fixated interests that are abnormal in intensity or focus)', rating: 0 },
          { id: 4, description: 'Hyper- or hypo-reactive to sensory input (unusual sensory interests)', rating: 0 },
          { id: 5, description: 'Lines up objects or toys in a specific pattern', rating: 0 },
          { id: 6, description: 'Repeats words or phrases (echolalia)', rating: 0 },
          { id: 7, description: 'Has difficulty with changes in routine', rating: 0 },
          { id: 8, description: 'Shows unusual attachments to objects', rating: 0 }
        ]
      },
      {
        name: 'Social Interaction',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 9, description: 'Has difficulty making eye contact', rating: 0 },
          { id: 10, description: 'Does not respond to name being called', rating: 0 },
          { id: 11, description: 'Has difficulty understanding others feelings', rating: 0 },
          { id: 12, description: 'Prefers to play alone', rating: 0 },
          { id: 13, description: 'Has difficulty making friends', rating: 0 },
          { id: 14, description: 'Does not share interests or achievements', rating: 0 },
          { id: 15, description: 'Has difficulty initiating social interaction', rating: 0 },
          { id: 16, description: 'Does not engage in pretend play', rating: 0 }
        ]
      },
      {
        name: 'Social Communication',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 17, description: 'Has delayed speech development', rating: 0 },
          { id: 18, description: 'Repeats words or phrases heard (echolalia)', rating: 0 },
          { id: 19, description: 'Uses pronouns incorrectly', rating: 0 },
          { id: 20, description: 'Has difficulty expressing needs', rating: 0 },
          { id: 21, description: 'Does not understand jokes or sarcasm', rating: 0 },
          { id: 22, description: 'Has difficulty following conversations', rating: 0 },
          { id: 23, description: 'Speaks in flat or robotic tone', rating: 0 },
          { id: 24, description: 'Has difficulty with back-and-forth conversation', rating: 0 }
        ]
      },
      {
        name: 'Emotional Responses',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 25, description: 'Has frequent emotional outbursts', rating: 0 },
          { id: 26, description: 'Has difficulty calming down when upset', rating: 0 },
          { id: 27, description: 'Shows excessive anxiety', rating: 0 },
          { id: 28, description: 'Has difficulty with transitions between activities', rating: 0 },
          { id: 29, description: 'Becomes upset when routines are changed', rating: 0 },
          { id: 30, description: 'Temper tantrums when frustrated', rating: 0 },
          { id: 31, description: 'Shows unusual sleep patterns', rating: 0 },
          { id: 32, description: 'Has unusual eating habits', rating: 0 }
        ]
      },
      {
        name: 'Cognitive Style',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 33, description: 'Has excellent memory for details', rating: 0 },
          { id: 34, description: 'Thinks in visual terms', rating: 0 },
          { id: 35, description: 'Has difficulty with abstract concepts', rating: 0 },
          { id: 36, description: 'Shows strong interest in patterns', rating: 0 },
          { id: 37, description: 'Has unusual problem-solving approach', rating: 0 },
          { id: 38, description: 'Shows exceptional ability in specific area', rating: 0 },
          { id: 39, description: 'Talks about a single subject excessively', rating: 0 },
          { id: 40, description: 'Displays excellent memory for specific information', rating: 0 }
        ]
      },
      {
        name: 'Maladaptive Speech',
        rawScore: 0,
        scaledScore: 0,
        percentile: 0,
        items: [
          { id: 41, description: 'Engages in self-stimulatory vocalizations', rating: 0 },
          { id: 42, description: 'Has difficulty with personal space in conversation', rating: 0 },
          { id: 43, description: 'Shows inappropriate social communication', rating: 0 },
          { id: 44, description: 'Has difficulty with conversational turn-taking', rating: 0 },
          { id: 45, description: 'Engages in repetitive speech patterns', rating: 0 },
          { id: 46, description: 'Shows unusual vocal intonation or pitch', rating: 0 },
          { id: 47, description: 'Has difficulty with conversational topic maintenance', rating: 0 },
          { id: 48, description: 'Shows deficits in pragmatic language skills', rating: 0 }
        ]
      }
    ],
    autismIndex4: 0,  // Autism Index based on 4 subscales
    autismIndex6: 0,  // Autism Index based on 6 subscales
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

  const handleItemChange = (subscaleIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      subscales: prev.subscales.map((subscale, sIndex) => 
        sIndex === subscaleIndex 
          ? {
              ...subscale,
              items: subscale.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, rating: parseInt(value) || 0 } : item
              )
            }
          : subscale
      )
    }));
  };

  const calculateSubscaleScores = () => {
    const updatedSubscales = template.subscales.map(subscale => {
      const rawScore = subscale.items.reduce((sum, item) => sum + item.rating, 0);
      const scaledScore = calculateScaledScore(rawScore);
      const percentile = calculatePercentile(scaledScore);
      return {
        ...subscale,
        rawScore,
        scaledScore,
        percentile
      };
    });

    // Calculate Autism Indices
    const autismIndex4 = calculateAutismIndex(updatedSubscales.slice(0, 4)); // First 4 subscales
    const autismIndex6 = calculateAutismIndex(updatedSubscales); // All 6 subscales
    const probabilityLevel = getProbabilityLevel(autismIndex6);

    setTemplate(prev => ({
      ...prev,
      subscales: updatedSubscales,
      autismIndex4,
      autismIndex6,
      probabilityLevel
    }));
  };

  const calculateScaledScore = (rawScore) => {
    // Simplified scaling - in real GARS-3 this would use complex normative tables
    return Math.round(rawScore * 1.5 + 5);
  };

  const calculatePercentile = (scaledScore) => {
    // Simplified percentile calculation
    if (scaledScore >= 13) return 84;
    if (scaledScore >= 11) return 50;
    if (scaledScore >= 9) return 37;
    if (scaledScore >= 7) return 16;
    return 3;
  };

  const calculateAutismIndex = (subscales) => {
    const totalScaledScore = subscales.reduce((sum, subscale) => sum + subscale.scaledScore, 0);
    // Convert to Autism Index (mean=100, SD=15)
    return Math.round(totalScaledScore * 2 + 40);
  };

  const getProbabilityLevel = (score) => {
    if (score >= 130) return 'Very Likely';
    if (score >= 115) return 'Likely';
    if (score >= 100) return 'Possible';
    if (score >= 85) return 'Unlikely';
    return 'Very Unlikely';
  };

  const handleSave = () => {
    calculateSubscaleScores();
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
                rows={6}
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
                    <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Behavior Description</div>
                    <div className="col-span-3 p-2 text-center font-bold text-xs">Rating (0-3)</div>
                  </div>
                  {subscale.items.map((item, itemIndex) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                          {item.id}
                        </div>
                        <div className="col-span-8 border-r border-black p-2 text-xs">
                          {item.description}
                        </div>
                        <div className="col-span-3 p-2">
                          <select
                            value={item.rating}
                            onChange={(e) => handleItemChange(subscaleIndex, itemIndex, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-red-500"
                          >
                            <option value={0}>0 - Never</option>
                            <option value={1}>1 - Seldom</option>
                            <option value={2}>2 - Sometimes</option>
                            <option value={3}>3 - Frequently</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Subscale Scores Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscale Scores</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Sub-Scales</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Raw Score</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Scaled Scores</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">%ile</div>
                </div>
                {template.subscales.map((subscale, index) => (
                  <div key={index} className="border-b border-black">
                    <div className="grid grid-cols-5">
                      <div className="col-span-2 border-r border-black p-2 text-xs">
                        {subscale.name}
                      </div>
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {subscale.rawScore}
                      </div>
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {subscale.scaledScore}
                      </div>
                      <div className="col-span-1 p-2 text-center text-xs">
                        {subscale.percentile}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Autism Index */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Autism Index</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AUTISM INDEX (4 SCORES)</label>
                  <input
                    type="text"
                    value={template.autismIndex4}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AUTISM INDEX (6 SCORES)</label>
                  <input
                    type="text"
                    value={template.autismIndex6}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Probability Level</label>
                <input
                  type="text"
                  value={template.probabilityLevel}
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
                GILLIAM AUTISM RATING SCALE - THIRD EDITION (GARS-3)
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-red-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-red-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-red-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Subscale Scores Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscale Scores</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Sub-Scales</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Raw Scale</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Scaled Scores</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">%ile</div>
                </div>
                {template.subscales.map((subscale, index) => (
                  <div key={index} className="border-b border-black">
                    <div className="grid grid-cols-5">
                      <div className="col-span-2 border-r border-black p-2 text-xs">
                        {subscale.name}
                      </div>
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {subscale.rawScore}
                      </div>
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {subscale.scaledScore}
                      </div>
                      <div className="col-span-1 p-2 text-center text-xs">
                        {subscale.percentile}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Autism Index Results */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Autism Index Results</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">AUTISM INDEX (4 SCORES)</h3>
                  <p className="text-2xl font-bold text-red-600">{template.autismIndex4}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">AUTISM INDEX (6 SCORES)</h3>
                  <p className="text-2xl font-bold text-orange-600">{template.autismIndex6}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Probability Level</h3>
                  <p className="text-xl font-bold text-purple-600">{template.probabilityLevel}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {template.probabilityLevel === 'Very Likely' && 'The person shows strong indicators of ASD and requires comprehensive evaluation'}
                    {template.probabilityLevel === 'Likely' && 'The person shows several indicators of ASD and further evaluation is recommended'}
                    {template.probabilityLevel === 'Possible' && 'The person shows some indicators of ASD and monitoring is suggested'}
                    {template.probabilityLevel === 'Unlikely' && 'The person shows few indicators of ASD'}
                    {template.probabilityLevel === 'Very Unlikely' && 'The person shows minimal indicators of ASD'}
                  </p>
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
