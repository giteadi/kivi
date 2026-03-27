import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const TOWL4Template = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'TEST OF WRITTEN LANGUAGE (TOWL-4)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The TOWL-4 is a norm-referenced, reliable, and valid test of written language. The Test of Written Language-TOWL-4 is an inclusive assessment measuring seven skill areas, and several components of written language which are later combined to form three composite scores: Contrived Writing, Spontaneous Writing and Overall Writing. The composites are reported as quotients, with average scores ranging from 90-110 with a standard deviation of 15 points. The subtests have an average range of 8-12 with a standard deviation of 3 points.`,
    
    subtests: [
      {
        name: 'Vocabulary (VO)',
        description: 'The student writes a sentence that incorporates a stimulus word.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        items: [
          { id: 1, stimulusWord: 'adventure', studentSentence: '', maxScore: 5 },
          { id: 2, stimulusWord: 'discovery', studentSentence: '', maxScore: 5 },
          { id: 3, stimulusWord: 'friendship', studentSentence: '', maxScore: 5 },
          { id: 4, stimulusWord: 'challenge', studentSentence: '', maxScore: 5 },
          { id: 5, stimulusWord: 'achievement', studentSentence: '', maxScore: 5 },
          { id: 6, stimulusWord: 'curiosity', studentSentence: '', maxScore: 5 }
        ]
      },
      {
        name: 'Spelling (SP)',
        description: 'The student writes sentences from dictation, taking particular care to make proper use of spelling rules.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 35,
        items: [
          { id: 7, dictatedSentence: 'The beautiful garden flourished in springtime.', studentResponse: '', maxScore: 7 },
          { id: 8, dictatedSentence: 'Yesterday, the children played enthusiastically in the park.', studentResponse: '', maxScore: 7 },
          { id: 9, dictatedSentence: 'The scientist discovered an extraordinary phenomenon.', studentResponse: '', maxScore: 7 },
          { id: 10, dictatedSentence: 'Their determination led to magnificent accomplishments.', studentResponse: '', maxScore: 7 },
          { id: 11, dictatedSentence: 'The mysterious treasure was hidden beneath ancient ruins.', studentResponse: '', maxScore: 7 }
        ]
      },
      {
        name: 'Punctuation (PT)',
        description: 'The student writes sentences from dictation, taking particular care to make proper use of punctuation and capitalization rules.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 25,
        items: [
          { id: 12, dictatedSentence: 'after school we went to the library', studentResponse: '', maxScore: 5 },
          { id: 13, dictatedSentence: 'my friend sarah loves reading books', studentResponse: '', maxScore: 5 },
          { id: 14, dictatedSentence: 'the dog barked loudly at the stranger', studentResponse: '', maxScore: 5 },
          { id: 15, dictatedSentence: 'are you coming to the party tonight', studentResponse: '', maxScore: 5 },
          { id: 16, dictatedSentence: 'what an amazing performance', studentResponse: '', maxScore: 5 }
        ]
      },
      {
        name: 'Logical Sentences (LS)',
        description: 'The student edits an illogical sentence so that it makes better sense.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 20,
        items: [
          { id: 17, illogicalSentence: 'The fish climbed the tree to catch a bird.', correctedSentence: '', maxScore: 4 },
          { id: 18, illogicalSentence: 'The ice cream was hot and spicy.', correctedSentence: '', maxScore: 4 },
          { id: 19, illogicalSentence: 'The car flew across the ocean to reach the island.', correctedSentence: '', maxScore: 4 },
          { id: 20, illogicalSentence: 'The flowers sang beautifully in the garden.', correctedSentence: '', maxScore: 4 },
          { id: 21, illogicalSentence: 'The rock slept peacefully on the soft pillow.', correctedSentence: '', maxScore: 4 }
        ]
      },
      {
        name: 'Sentence Combining (SC)',
        description: 'The student integrates the meaning of several short sentences into one grammatically correct written sentence.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 25,
        items: [
          { id: 22, sentences: ['The boy ran. He was fast. He reached the park.'], combinedSentence: '', maxScore: 5 },
          { id: 23, sentences: ['The girl studied. She worked hard. She passed the test.'], combinedSentence: '', maxScore: 5 },
          { id: 24, sentences: ['The dog barked. It was loud. The mailman arrived.'], combinedSentence: '', maxScore: 5 },
          { id: 25, sentences: ['The sun set. It was beautiful. The sky glowed.'], combinedSentence: '', maxScore: 5 },
          { id: 26, sentences: ['The rain fell. It was heavy. The streets flooded.'], combinedSentence: '', maxScore: 5 }
        ]
      },
      {
        name: 'Contextual Conventions (CC)',
        description: 'The student writes a story in response to a stimulus picture. Points are earned for satisfying specific arbitrary requirements relative to orthographic and grammatic conventions.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 30,
        storyPrompt: 'Write a story about the picture shown. Focus on proper spelling, punctuation, and grammar.',
        studentStory: '',
        conventions: [
          { id: 27, convention: 'Capitalization at beginning of sentences', achieved: false, points: 5 },
          { id: 28, convention: 'End punctuation', achieved: false, points: 5 },
          { id: 29, convention: 'Correct spelling', achieved: false, points: 10 },
          { id: 30, convention: 'Proper grammar usage', achieved: false, points: 10 }
        ]
      },
      {
        name: 'Story Composition (ST)',
        description: 'The student writes a story in response to a stimulus picture. Points are earned for story elements such as plot, characters, and setting.',
        rawScore: 0,
        scaledScore: 0,
        percentileRank: 0,
        maxScore: 35,
        storyPrompt: 'Write a creative story about the picture shown. Include characters, setting, and plot.',
        studentStory: '',
        storyElements: [
          { id: 31, element: 'Character development', achieved: false, points: 10 },
          { id: 32, element: 'Setting description', achieved: false, points: 8 },
          { id: 33, element: 'Plot sequence', achieved: false, points: 10 },
          { id: 34, element: 'Story resolution', achieved: false, points: 7 }
        ]
      }
    ],
    
    compositeScores: {
      contrivedWriting: {
        quotient: 0,
        percentileRank: 0,
        description: 'Measures the smallest units of written discourse including vocabulary, spelling, punctuation, logical sentences and sentence combining.'
      },
      spontaneousWriting: {
        quotient: 0,
        percentileRank: 0,
        description: 'Measures functional writing ability as related to an actual passage including contextual conventions and story composition.'
      },
      overallWriting: {
        quotient: 0,
        percentileRank: 0,
        description: 'Combines all subtests and provides an overall quotient related to writing achievement.'
      }
    },
    
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

  const handleSubtestItemResponse = (subtestIndex, itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, sIndex) => 
        sIndex === subtestIndex 
          ? {
              ...subtest,
              items: subtest.items.map((item, iIndex) => 
                iIndex === itemIndex ? { ...item, [item.studentSentence ? 'studentSentence' : item.correctedSentence ? 'correctedSentence' : item.combinedSentence ? 'combinedSentence' : item.studentResponse ? 'studentResponse' : 'studentStory']: value } : item
              )
            }
          : subtest
      )
    }));
  };

  const handleStoryResponse = (subtestIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, sIndex) => 
        sIndex === subtestIndex ? { ...subtest, studentStory: value } : subtest
      )
    }));
  };

  const handleConventionToggle = (subtestIndex, conventionIndex) => {
    setTemplate(prev => ({
      ...prev,
      subtests: prev.subtests.map((subtest, sIndex) => 
        sIndex === subtestIndex 
          ? {
              ...subtest,
              conventions: subtest.conventions.map((convention, cIndex) => 
                cIndex === conventionIndex ? { ...convention, achieved: !convention.achieved } : convention
              )
            }
          : subtest
      )
    }));
  };

  const calculateSubtestScores = () => {
    const updatedSubtests = template.subtests.map(subtest => {
      let rawScore = 0;
      
      if (subtest.name === 'Contextual Conventions' || subtest.name === 'Story Composition') {
        // Calculate based on achieved conventions/story elements
        const items = subtest.conventions || subtest.storyElements;
        rawScore = items.filter(item => item.achieved).reduce((sum, item) => sum + item.points, 0);
      } else {
        // Calculate based on item responses
        rawScore = subtest.items.reduce((sum, item) => {
          const response = item.studentSentence || item.correctedSentence || item.combinedSentence || item.studentResponse || '';
          // Simple scoring: if response exists, give full points
          return sum + (response.trim() ? item.maxScore : 0);
        }, 0);
      }
      
      return { ...subtest, rawScore };
    });
    
    setTemplate(prev => ({ ...prev, subtests: updatedSubtests }));
  };

  const calculateCompositeScores = () => {
    const { subtests } = template;
    
    // Contrived Writing: Subtests 1-5 (Vocabulary, Spelling, Punctuation, Logical Sentences, Sentence Combining)
    const contrivedRawScore = subtests.slice(0, 5).reduce((sum, subtest) => sum + subtest.rawScore, 0);
    const contrivedQuotient = Math.round((contrivedRawScore / 135) * 100 + 50); // Simplified calculation
    
    // Spontaneous Writing: Subtests 6-7 (Contextual Conventions, Story Composition)
    const spontaneousRawScore = subtests.slice(5, 7).reduce((sum, subtest) => sum + subtest.rawScore, 0);
    const spontaneousQuotient = Math.round((spontaneousRawScore / 65) * 100 + 50); // Simplified calculation
    
    // Overall Writing: All subtests
    const overallRawScore = subtests.reduce((sum, subtest) => sum + subtest.rawScore, 0);
    const overallQuotient = Math.round((overallRawScore / 200) * 100 + 50); // Simplified calculation
    
    setTemplate(prev => ({
      ...prev,
      compositeScores: {
        contrivedWriting: {
          ...prev.compositeScores.contrivedWriting,
          quotient: contrivedQuotient,
          percentileRank: Math.round(((contrivedQuotient - 100) / 15) * 34 + 50) // Simplified percentile
        },
        spontaneousWriting: {
          ...prev.compositeScores.spontaneousWriting,
          quotient: spontaneousQuotient,
          percentileRank: Math.round(((spontaneousQuotient - 100) / 15) * 34 + 50)
        },
        overallWriting: {
          ...prev.compositeScores.overallWriting,
          quotient: overallQuotient,
          percentileRank: Math.round(((overallQuotient - 100) / 15) * 34 + 50)
        }
      }
    }));
  };

  const handleSave = () => {
    calculateSubtestScores();
    calculateCompositeScores();
    onSave(template);
  };

  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('subtests');

  if (!isEditing) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
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
          <div className="grid grid-cols-2 gap-4">
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
            <h3 className="text-lg font-semibold mb-3">Composite Scores</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(template.compositeScores).map(([key, score]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800">{score.description.split(' ')[0]}</h4>
                  <p className="text-2xl font-bold text-blue-600">{score.quotient}</p>
                  <p className="text-sm text-gray-600">Percentile: {score.percentileRank}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Subtest Results</h3>
            <div className="space-y-3">
              {template.subtests.map((subtest, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{subtest.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{subtest.description}</p>
                  <p className="text-lg font-semibold">Raw Score: {subtest.rawScore}/{subtest.maxScore}</p>
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
            onClick={() => setActiveTab('composites')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'composites'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Composite Scores
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

      <div className="grid grid-cols-2 gap-4 mb-6">
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

      {activeTab === 'subtests' && (
        <div className="space-y-6">
          {template.subtests.map((subtest, subtestIndex) => (
            <div key={subtestIndex} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{subtest.name}</h3>
              <p className="text-gray-600 mb-4">{subtest.description}</p>
              
              {subtest.studentStory !== undefined ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {subtest.storyPrompt}
                  </label>
                  <textarea
                    value={subtest.studentStory}
                    onChange={(e) => handleStoryResponse(subtestIndex, e.target.value)}
                    rows={6}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                    placeholder="Write the story here..."
                  />
                  
                  {(subtest.conventions || subtest.storyElements) && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Scoring Criteria:</h4>
                      <div className="space-y-2">
                        {(subtest.conventions || subtest.storyElements).map((item, itemIndex) => (
                          <label key={itemIndex} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={item.achieved}
                              onChange={() => handleConventionToggle(subtestIndex, itemIndex)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>{item.element || item.convention} ({item.points} points)</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {subtest.items.map((item, itemIndex) => (
                    <div key={item.id} className="border rounded p-3">
                      {item.stimulusWord && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Write a sentence using: <strong>{item.stimulusWord}</strong>
                          </label>
                          <input
                            type="text"
                            value={item.studentSentence}
                            onChange={(e) => handleSubtestItemResponse(subtestIndex, itemIndex, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            placeholder="Enter sentence..."
                          />
                        </div>
                      )}
                      
                      {item.dictatedSentence && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Write this sentence: <em>"{item.dictatedSentence}"</em>
                          </label>
                          <textarea
                            value={item.studentResponse}
                            onChange={(e) => handleSubtestItemResponse(subtestIndex, itemIndex, e.target.value)}
                            rows={2}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            placeholder="Write the sentence as dictated..."
                          />
                        </div>
                      )}
                      
                      {item.illogicalSentence && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct this sentence: <em>"{item.illogicalSentence}"</em>
                          </label>
                          <input
                            type="text"
                            value={item.correctedSentence}
                            onChange={(e) => handleSubtestItemResponse(subtestIndex, itemIndex, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            placeholder="Write the corrected sentence..."
                          />
                        </div>
                      )}
                      
                      {item.sentences && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Combine these sentences:
                          </label>
                          <div className="mb-2">
                            {item.sentences.map((sentence, sIndex) => (
                              <p key={sIndex} className="text-gray-600">• {sentence}</p>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={item.combinedSentence}
                            onChange={(e) => handleSubtestItemResponse(subtestIndex, itemIndex, e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                            placeholder="Combine into one sentence..."
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'composites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {Object.entries(template.compositeScores).map(([key, score]) => (
              <div key={key} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {key === 'contrivedWriting' ? 'Contrived Writing' : 
                   key === 'spontaneousWriting' ? 'Spontaneous Writing' : 'Overall Writing'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{score.description}</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quotient</label>
                    <input
                      type="number"
                      value={score.quotient}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        compositeScores: {
                          ...prev.compositeScores,
                          [key]: { ...score, quotient: parseInt(e.target.value) || 0 }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Percentile Rank</label>
                    <input
                      type="number"
                      value={score.percentileRank}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        compositeScores: {
                          ...prev.compositeScores,
                          [key]: { ...score, percentileRank: parseInt(e.target.value) || 0 }
                        }
                      }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    />
                  </div>
                </div>
              </div>
            ))}
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
              placeholder="Enter your interpretation of the test results..."
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

export default TOWL4Template;
