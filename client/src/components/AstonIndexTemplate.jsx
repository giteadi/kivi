import React, { useState } from 'react';
import { FiFileText, FiSave, FiX } from 'react-icons/fi';

const AstonIndexTemplate = ({ 
  onSave, 
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Aston Index Assessment',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children. It provides a systematic approach to identifying specific areas of difficulty in language development, including underlying abilities and attainment levels. The assessment covers various aspects such as picture recognition, vocabulary, visual and auditory memory, sound discrimination, and motor skills, offering valuable insights for educational planning and intervention strategies.`,
    generalUnderlyingAbility: [
      { id: 1, test: 'Picture Recognition', score: '9', remarks: '' },
      { id: 2, test: 'Vocabulary', score: '5/6 years', remarks: '' },
      { id: 3, test: 'Good-enough draw-a-man', score: '4 years(MA)', remarks: '' },
      { id: 4, test: 'Copying geometric designs', score: '6', remarks: '' },
      { id: 5, test: 'Grapheme-Phoneme correspondence', score: 'Could identify the uppercase and lower case letter, but could not say the individual specific sounds', remarks: '' },
      { id: 6, test: 'Schonell\'s reading test', score: 'NA', remarks: '' },
      { id: 7, test: 'Schonell\'s spelling test', score: 'NA', remarks: '' },
      { id: 8, test: 'Visual discrimination test', score: '9', remarks: '' }
    ],
    performanceItems: [
      { id: 9, test: 'Child\'s laterality', score: 'Left', remarks: '' },
      { id: 10, test: 'Copying name', score: '8', remarks: '' },
      { id: 11, test: 'Free writing', score: 'NA', remarks: '' },
      { id: 12, test: 'Visual sequential memory (pictorial)', score: '3', remarks: '' },
      { id: 13, test: 'Auditory sequential memory', score: '6 (8 forward, 4 reverse)', remarks: '' },
      { id: 14, test: 'Sound Blending', score: '4', remarks: '' },
      { id: 15, test: 'Visual Sequential memory (symbolic)', score: '7', remarks: '' },
      { id: 16, test: 'Sound discrimination', score: '9', remarks: '' },
      { id: 17, test: 'Grapho-motor test', score: 'NA', remarks: '' }
    ],
    interpretation: `Interpretation:
General Underlying Ability and Attainment
1. Picture Recognition- On this subtest, ABC was able to recognize and give names of 9 pictures and was able to tag common objects in the environment.
2. Vocabulary- On this subtest ABC's vocabulary was equivalent to that of a 5 year old child.
She showed some difficulty with verbal expression of meaning of words presented to her, and had difficulty in describing and defining words adequately, which was suggestive of underdevelopment of understanding of verbal concepts for ABC.
3. Good-enough draw-a-man test- On this subtest, ABC's mental age was found to be 4 years which is lower than her chronological age.
4. Copying Geometric designs-ABC was able to copy geometric designs and her basic shapes were adequately defined except for her diamond shape. However, she showed difficulty with motor control.`,
    conclusions: '',
    recommendations: ''
  });

  const handleInputChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneralAbilityChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      generalUnderlyingAbility: prev.generalUnderlyingAbility.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handlePerformanceItemChange = (index, field, value) => {
    setTemplate(prev => ({
      ...prev,
      performanceItems: prev.performanceItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = () => {
    const templateData = {
      ...template,
      type: 'Aston-Index',
      createdAt: new Date().toISOString()
    };
    onSave(templateData);
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <FiFileText className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">Aston Index Assessment</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <FiX className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                <FiSave className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name
              </label>
              <input
                type="text"
                value={template.studentName}
                onChange={(e) => handleInputChange('studentName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter student name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Examiner Name
              </label>
              <input
                type="text"
                value={template.examinerName}
                onChange={(e) => handleInputChange('examinerName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter examiner name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Date
              </label>
              <input
                type="date"
                value={template.testDate}
                onChange={(e) => handleInputChange('testDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Assessment Title */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-800">
              ASTON INDEX
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Comprehensive Battery of Tests for Diagnosing Language Difficulties in Children
            </p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Description
            </label>
            <textarea
              value={template.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter assessment description"
            />
          </div>

          {/* Excel-style Table Layout */}
          <div className="border border-black mb-8">
            {/* Header */}
            <div className="bg-purple-50 p-3 text-center font-semibold border-b border-black">
              1. ASTON INDEX
            </div>
            
            {/* Description */}
            <div className="p-4 border-b border-black">
              <p className="text-sm text-gray-700 leading-relaxed">
                The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children. 
                It identifies children with special educational needs, language difficulties, auditory and visual 
                perception difficulties, reading and spelling difficulties. The index contains 16 tests.
              </p>
            </div>

            {/* Section I: General Underlying Ability and Attainment */}
            <div className="border-b border-black">
              <div className="bg-gray-100 p-3 text-center font-semibold border-b border-black">
                SECTION I: GENERAL UNDERLYING ABILITY AND ATTAINMENT
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">S.No</div>
                <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Test</div>
                <div className="col-span-3 p-2 text-center font-bold text-xs">Score</div>
              </div>

              {/* General Ability Items */}
              {template.generalUnderlyingAbility.map((item, index) => (
                <div key={item.id} className="border-b border-black">
                  <div className="grid grid-cols-12">
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {index + 1}
                    </div>
                    <div className="col-span-8 border-r border-black p-2 text-xs">
                      {item.test}
                    </div>
                    <div className="col-span-3 p-2">
                      <input
                        type="text"
                        value={item.score}
                        onChange={(e) => handleGeneralAbilityChange(index, 'score', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        placeholder="Score"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Section II: Performance Items */}
            <div>
              <div className="bg-gray-100 p-3 text-center font-semibold border-b border-black">
                SECTION II: PERFORMANCE ITEMS
              </div>
              
              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">S.No</div>
                <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Test</div>
                <div className="col-span-3 p-2 text-center font-bold text-xs">Score</div>
              </div>

              {/* Performance Items */}
              {template.performanceItems.map((item, index) => (
                <div key={item.id} className="border-b border-black">
                  <div className="grid grid-cols-12">
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {index + 1}
                    </div>
                    <div className="col-span-8 border-r border-black p-2 text-xs">
                      {item.test}
                    </div>
                    <div className="col-span-3 p-2">
                      <input
                        type="text"
                        value={item.score}
                        onChange={(e) => handlePerformanceItemChange(index, 'score', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                        placeholder="Score"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interpretation
            </label>
            <textarea
              value={template.interpretation}
              onChange={(e) => handleInputChange('interpretation', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter interpretation of assessment results..."
            />
          </div>

          {/* Conclusions Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conclusions
            </label>
            <textarea
              value={template.conclusions}
              onChange={(e) => handleInputChange('conclusions', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter conclusions..."
            />
          </div>

          {/* Recommendations Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendations
            </label>
            <textarea
              value={template.recommendations}
              onChange={(e) => handleInputChange('recommendations', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter recommendations..."
            />
          </div>

          {/* Preview Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="text-center mb-4">
                <h5 className="text-lg font-bold text-gray-800">
                  ASTON INDEX ASSESSMENT REPORT
                </h5>
                <p className="text-sm text-gray-600 mt-2">
                  Student: {template.studentName} | Examiner: {template.examinerName} | Date: {template.testDate}
                </p>
              </div>

              {/* Excel-style Preview */}
              <div className="border border-black mb-6">
                <div className="bg-purple-50 p-2 text-center font-semibold text-sm border-b border-black">
                  1. ASTON INDEX
                </div>
                
                <div className="p-3 border-b border-black">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children. 
                    It identifies children with special educational needs, language difficulties, auditory and visual 
                    perception difficulties, reading and spelling difficulties. The index contains 16 tests.
                  </p>
                </div>

                {/* Section I Preview */}
                <div className="border-b border-black">
                  <div className="bg-gray-100 p-2 text-center font-semibold text-sm border-b border-black">
                    SECTION I: GENERAL UNDERLYING ABILITY AND ATTAINMENT
                  </div>
                  <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                    <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                    <div className="col-span-8 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                    <div className="col-span-3 p-1 text-center font-bold text-xs">Score</div>
                  </div>
                  {template.generalUnderlyingAbility.map((item, index) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                          {index + 1}
                        </div>
                        <div className="col-span-8 border-r border-black p-1 text-xs">
                          {item.test}
                        </div>
                        <div className="col-span-3 p-1 text-center text-xs">
                          {item.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section II Preview */}
                <div>
                  <div className="bg-gray-100 p-2 text-center font-semibold text-sm border-b border-black">
                    SECTION II: PERFORMANCE ITEMS
                  </div>
                  <div className="grid grid-cols-12 border-b border-black bg-gray-50">
                    <div className="col-span-1 border-r border-black p-1 text-center font-bold text-xs">S.No</div>
                    <div className="col-span-8 border-r border-black p-1 text-center font-bold text-xs">Test</div>
                    <div className="col-span-3 p-1 text-center font-bold text-xs">Score</div>
                  </div>
                  {template.performanceItems.map((item, index) => (
                    <div key={item.id} className="border-b border-black">
                      <div className="grid grid-cols-12">
                        <div className="col-span-1 border-r border-black p-1 text-center text-xs">
                          {index + 1}
                        </div>
                        <div className="col-span-8 border-r border-black p-1 text-xs">
                          {item.test}
                        </div>
                        <div className="col-span-3 p-1 text-center text-xs">
                          {item.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {template.interpretation && (
                <div className="mb-4">
                  <h6 className="font-semibold text-gray-800 mb-2">Interpretation</h6>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.interpretation}</p>
                </div>
              )}

              {template.conclusions && (
                <div className="mb-4">
                  <h6 className="font-semibold text-gray-800 mb-2">Conclusions</h6>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.conclusions}</p>
                </div>
              )}

              {template.recommendations && (
                <div className="mb-4">
                  <h6 className="font-semibold text-gray-800 mb-2">Recommendations</h6>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{template.recommendations}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstonIndexTemplate;
