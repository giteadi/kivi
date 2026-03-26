import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const NelsonDennyReadingTestTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Nelson-Denny Reading Test (Form I & J)',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Nelson-Denny Reading Test Form I and J is a valid and reliable measure of silent reading vocabulary, comprehension, and rate.

Core Subtests and Composite:
• Vocabulary—Students are presented with an opening statement and five answer choices; for example, "A chef works with A. bricks B. music C. clothes D. food E. statues." Students select the option that best completes the opening statement.
• Comprehension—The Comprehension subtest consists of seven reading passages and comprehension questions, each with five answer choices. Students are instructed to read as many passages and answer as many comprehension questions as they can.
• General Reading Ability—This composite is derived by combining index scores from the Vocabulary and Comprehension subtests to achieve a stronger and more reliable index of overall reading ability.`,
    vocabularySubtest: {
      rawScore: 0,
      maxScore: 80,
      standardScore: 0,
      percentileRank: 0,
      descriptiveTerm: '',
      items: [
        { id: 1, word: 'chef works with', question: 'A chef works with A. bricks B. music C. clothes D. food E. statues.', selected: '', correct: 'D' },
        { id: 2, word: 'physician treats', question: 'A physician treats A. diseases B. buildings C. cars D. books E. music.', selected: '', correct: 'A' },
        { id: 3, word: 'author writes', question: 'An author writes A. prescriptions B. books C. music D. plays E. articles.', selected: '', correct: 'B' },
        { id: 4, word: 'musician plays', question: 'A musician plays A. football B. instruments C. games D. movies E. sports.', selected: '', correct: 'B' },
        { id: 5, word: 'teacher educates', question: 'A teacher educates A. patients B. animals C. students D. customers E. clients.', selected: '', correct: 'C' },
        { id: 6, word: 'lawyer defends', question: 'A lawyer defends A. criminals B. patients C. students D. clients E. customers.', selected: '', correct: 'D' },
        { id: 7, word: 'engineer designs', question: 'An engineer designs A. clothes B. food C. buildings D. books E. music.', selected: '', correct: 'C' },
        { id: 8, word: 'artist paints', question: 'An artist paints A. pictures B. buildings C. cars D. books E. music.', selected: '', correct: 'A' },
        { id: 9, word: 'chef prepares', question: 'A chef prepares A. meals B. reports C. lessons D. plans E. schedules.', selected: '', correct: 'A' },
        { id: 10, word: 'doctor diagnoses', question: 'A doctor diagnoses A. problems B. diseases C. situations D. conditions E. symptoms.', selected: '', correct: 'B' }
      ]
    },
    comprehensionSubtest: {
      rawScore: 0,
      maxScore: 36,
      standardScore: 0,
      percentileRank: 0,
      descriptiveTerm: '',
      passages: [
        {
          id: 1,
          title: 'Passage 1',
          questions: [
            { id: 1, question: 'What is the main purpose of this passage?', selected: '', correct: 'A' },
            { id: 2, question: 'According to the author, what is the most important factor?', selected: '', correct: 'C' },
            { id: 3, question: 'What conclusion can be drawn from the information provided?', selected: '', correct: 'B' },
            { id: 4, question: 'What evidence supports the author\'s main argument?', selected: '', correct: 'D' },
            { id: 5, question: 'What is the tone of this passage?', selected: '', correct: 'A' },
            { id: 6, question: 'What assumption does the author make?', selected: '', correct: 'C' }
          ]
        },
        {
          id: 2,
          title: 'Passage 2',
          questions: [
            { id: 7, question: 'What is the primary topic discussed in this passage?', selected: '', correct: 'B' },
            { id: 8, question: 'What relationship does the author describe?', selected: '', correct: 'A' },
            { id: 9, question: 'What is the significance of the mentioned event?', selected: '', correct: 'D' },
            { id: 10, question: 'What contrast does the author present?', selected: '', correct: 'C' },
            { id: 11, question: 'What implication does the author suggest?', selected: '', correct: 'B' },
            { id: 12, question: 'What perspective is missing from the discussion?', selected: '', correct: 'A' }
          ]
        }
      ]
    },
    readingRateSubtest: {
      wordsPerMinute: 0,
      standardScore: 0,
      percentileRank: 0,
      descriptiveTerm: '',
      passageLength: 600,
      timeLimit: 60
    },
    generalReadingAbility: {
      sumOfCoreIndexScores: 0,
      percentileRank: 0,
      standardScore: 0,
      confidenceInterval: '',
      descriptiveTerm: ''
    },
    totalScore: 0,
    overallReadingLevel: '',
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

  const handleVocabularyChange = (itemIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      vocabularySubtest: {
        ...prev.vocabularySubtest,
        items: prev.vocabularySubtest.items.map((item, index) => 
          index === itemIndex ? { ...item, selected: value } : item
        )
      }
    }));
  };

  const handleComprehensionChange = (passageIndex, questionIndex, value) => {
    setTemplate(prev => ({
      ...prev,
      comprehensionSubtest: {
        ...prev.comprehensionSubtest,
        passages: prev.comprehensionSubtest.passages.map((passage, pIndex) => 
          pIndex === passageIndex 
            ? {
                ...passage,
                questions: passage.questions.map((question, qIndex) => 
                  qIndex === questionIndex ? { ...question, selected: value } : question
                )
              }
            : passage
        )
      }
    }));
  };

  const handleReadingRateChange = (field, value) => {
    setTemplate(prev => ({
      ...prev,
      readingRateSubtest: {
        ...prev.readingRateSubtest,
        [field]: value
      }
    }));
  };

  const calculateScores = () => {
    // Vocabulary Subtest Scoring
    let vocabCorrect = 0;
    template.vocabularySubtest.items.forEach(item => {
      if (item.selected === item.correct) {
        vocabCorrect++;
      }
    });
    
    const vocabRawScore = vocabCorrect;
    const vocabStandardScore = calculateStandardScore(vocabRawScore, 80);
    const vocabPercentile = calculatePercentile(vocabStandardScore);
    const vocabDescriptiveTerm = getDescriptiveTerm(vocabPercentile);

    // Comprehension Subtest Scoring
    let compCorrect = 0;
    template.comprehensionSubtest.passages.forEach(passage => {
      passage.questions.forEach(question => {
        if (question.selected === question.correct) {
          compCorrect++;
        }
      });
    });
    
    const compRawScore = compCorrect;
    const compStandardScore = calculateStandardScore(compRawScore, 36);
    const compPercentile = calculatePercentile(compStandardScore);
    const compDescriptiveTerm = getDescriptiveTerm(compPercentile);

    // Reading Rate Subtest Scoring
    const wpm = parseInt(template.readingRateSubtest.wordsPerMinute) || 0;
    const rateStandardScore = calculateRateStandardScore(wpm);
    const ratePercentile = calculatePercentile(rateStandardScore);
    const rateDescriptiveTerm = getDescriptiveTerm(ratePercentile);

    // General Reading Ability Composite
    const sumOfCoreIndexScores = vocabStandardScore + compStandardScore;
    const generalPercentile = calculatePercentile(sumOfCoreIndexScores / 2);
    const generalStandardScore = Math.round(sumOfCoreIndexScores / 2);
    const confidenceInterval = calculateConfidenceInterval(generalStandardScore);
    const generalDescriptiveTerm = getDescriptiveTerm(generalPercentile);

    setTemplate(prev => ({
      ...prev,
      vocabularySubtest: {
        ...prev.vocabularySubtest,
        rawScore: vocabRawScore,
        standardScore: vocabStandardScore,
        percentileRank: vocabPercentile,
        descriptiveTerm: vocabDescriptiveTerm
      },
      comprehensionSubtest: {
        ...prev.comprehensionSubtest,
        rawScore: compRawScore,
        standardScore: compStandardScore,
        percentileRank: compPercentile,
        descriptiveTerm: compDescriptiveTerm
      },
      readingRateSubtest: {
        ...prev.readingRateSubtest,
        standardScore: rateStandardScore,
        percentileRank: ratePercentile,
        descriptiveTerm: rateDescriptiveTerm
      },
      generalReadingAbility: {
        sumOfCoreIndexScores: sumOfCoreIndexScores,
        percentileRank: generalPercentile,
        standardScore: generalStandardScore,
        confidenceInterval: confidenceInterval,
        descriptiveTerm: generalDescriptiveTerm
      },
      totalScore: Math.round((vocabStandardScore + compStandardScore + rateStandardScore) / 3),
      overallReadingLevel: generalDescriptiveTerm
    }));
  };

  const calculateStandardScore = (rawScore, maxScore) => {
    // Convert raw score to standard score (mean=100, SD=15)
    const percentage = (rawScore / maxScore) * 100;
    return Math.round(85 + (percentage - 50) * 0.3); // Simplified conversion
  };

  const calculatePercentile = (standardScore) => {
    // Convert standard score to percentile
    if (standardScore >= 130) return 95;
    if (standardScore >= 120) return 90;
    if (standardScore >= 115) return 84;
    if (standardScore >= 110) return 75;
    if (standardScore >= 105) return 63;
    if (standardScore >= 100) return 50;
    if (standardScore >= 95) return 37;
    if (standardScore >= 90) return 25;
    if (standardScore >= 85) return 16;
    if (standardScore >= 80) return 10;
    if (standardScore >= 75) return 5;
    return 3;
  };

  const getDescriptiveTerm = (percentile) => {
    if (percentile >= 91) return 'Very Superior';
    if (percentile >= 75) return 'Superior';
    if (percentile >= 60) return 'Above Average';
    if (percentile >= 40) return 'Average';
    if (percentile >= 25) return 'Below Average';
    if (percentile >= 10) return 'Poor';
    return 'Very Poor';
  };

  const calculateRateStandardScore = (wpm) => {
    // Convert WPM to standard score
    if (wpm >= 250) return 130;
    if (wpm >= 200) return 115;
    if (wpm >= 150) return 100;
    if (wpm >= 120) return 90;
    if (wpm >= 100) return 85;
    if (wpm >= 80) return 80;
    if (wpm >= 60) return 75;
    return 70;
  };

  const calculateConfidenceInterval = (standardScore) => {
    const lower = Math.round(standardScore - 7);
    const upper = Math.round(standardScore + 7);
    return `${lower} to ${upper}`;
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
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Nelson-Denny Reading Test</h1>
                <p className="text-gray-600">Comprehensive reading assessment tool</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'edit' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter student name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                  <input
                    type="text"
                    value={template.examinerName}
                    onChange={(e) => handleInputChange('examinerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter examiner name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Date</label>
                  <input
                    type="date"
                    value={template.testDate}
                    onChange={(e) => handleInputChange('testDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter test description"
              />
            </div>

            {/* Vocabulary Subtest */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vocabulary Subtest</h2>
              <div className="border border-black">
                <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">No.</div>
                  <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Question</div>
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Answer</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">Correct</div>
                </div>
                {template.vocabularySubtest.items.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {item.id}
                      </div>
                      <div className="col-span-8 border-r border-black p-2 text-xs">
                        {item.question}
                      </div>
                      <div className="col-span-2 border-r border-black p-2">
                        <select
                          value={item.selected}
                          onChange={(e) => handleVocabularyChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500"
                        >
                          <option value="">Select...</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="E">E</option>
                        </select>
                      </div>
                      <div className="col-span-1 p-2 text-center text-xs">
                        {item.correct}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehension Subtest */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Comprehension Subtest</h2>
              {template.comprehensionSubtest.passages.map((passage, passageIndex) => (
                <div key={passage.id} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{passage.title}</h3>
                  <div className="border border-black">
                    <div className="grid grid-cols-12 border-b border-black bg-gray-100">
                      <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">Q.No</div>
                      <div className="col-span-8 border-r border-black p-2 text-center font-bold text-xs">Question</div>
                      <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">Answer</div>
                      <div className="col-span-1 p-2 text-center font-bold text-xs">Correct</div>
                    </div>
                    {passage.questions.map((question, questionIndex) => (
                      <div key={question.id} className="border-b border-black">
                        <div className="grid grid-cols-12">
                          <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                            {question.id}
                          </div>
                          <div className="col-span-8 border-r border-black p-2 text-xs">
                            {question.question}
                          </div>
                          <div className="col-span-2 border-r border-black p-2">
                            <select
                              value={question.selected}
                              onChange={(e) => handleComprehensionChange(passageIndex, questionIndex, e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500"
                            >
                              <option value="">Select...</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </div>
                          <div className="col-span-1 p-2 text-center text-xs">
                            {question.correct}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reading Rate Subtest */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Reading Rate Subtest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Words Per Minute</label>
                  <input
                    type="number"
                    value={template.readingRateSubtest.wordsPerMinute}
                    onChange={(e) => handleReadingRateChange('wordsPerMinute', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter WPM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passage Length</label>
                  <input
                    type="text"
                    value={template.readingRateSubtest.passageLength}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Subtest Scores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest Scores</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">SUBTEST</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">RAW SCORE</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">PERCENTILE RANK</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">STANDARD SCORE</div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Vocabulary
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.vocabularySubtest.rawScore}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.vocabularySubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.vocabularySubtest.standardScore}
                    </div>
                  </div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Comprehension
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.comprehensionSubtest.rawScore}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.comprehensionSubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.comprehensionSubtest.standardScore}
                    </div>
                  </div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Reading Rate
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.readingRateSubtest.wordsPerMinute}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.readingRateSubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.readingRateSubtest.standardScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Reading Ability */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Reading Ability</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">SUM OF CORE INDEX SCORES</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">PERCENTILE RANK</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">STANDARD SCORE</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">95% CONFIDENCE INTERVAL</div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-center text-xs font-bold">
                      {template.generalReadingAbility.sumOfCoreIndexScores}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.generalReadingAbility.percentileRank}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.generalReadingAbility.standardScore}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.generalReadingAbility.confidenceInterval}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-center text-xs font-bold">
                      DESCRIPTIVE TERM
                    </div>
                    <div className="col-span-3 p-2 text-center text-xs font-bold">
                      {template.generalReadingAbility.descriptiveTerm}
                    </div>
                  </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 flex items-center space-x-2 transition-colors"
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
                NELSON DENNY READING TEST (FORM I & J)
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-cyan-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-cyan-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-cyan-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="bg-cyan-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Subtest Scores Table */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest Scores</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">SUBTEST</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">RAW SCORE</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">PERCENTILE RANK</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">STANDARD SCORE</div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Vocabulary
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.vocabularySubtest.rawScore}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.vocabularySubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.vocabularySubtest.standardScore}
                    </div>
                  </div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Comprehension
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.comprehensionSubtest.rawScore}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.comprehensionSubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.comprehensionSubtest.standardScore}
                    </div>
                  </div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-xs">
                      Reading Rate
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.readingRateSubtest.wordsPerMinute}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.readingRateSubtest.percentileRank}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.readingRateSubtest.standardScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* General Reading Ability */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Reading Ability</h2>
              <div className="border border-black">
                <div className="grid grid-cols-5 border-b border-black bg-gray-100">
                  <div className="col-span-2 border-r border-black p-2 text-center font-bold text-xs">SUM OF CORE INDEX SCORES</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">PERCENTILE RANK</div>
                  <div className="col-span-1 border-r border-black p-2 text-center font-bold text-xs">STANDARD SCORE</div>
                  <div className="col-span-1 p-2 text-center font-bold text-xs">95% CONFIDENCE INTERVAL</div>
                </div>
                <div className="border-b border-black">
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-center text-xs font-bold">
                      {template.generalReadingAbility.sumOfCoreIndexScores}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.generalReadingAbility.percentileRank}
                    </div>
                    <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                      {template.generalReadingAbility.standardScore}
                    </div>
                    <div className="col-span-1 p-2 text-center text-xs">
                      {template.generalReadingAbility.confidenceInterval}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 border-r border-black p-2 text-center text-xs font-bold">
                      DESCRIPTIVE TERM
                    </div>
                    <div className="col-span-3 p-2 text-center text-xs font-bold">
                      {template.generalReadingAbility.descriptiveTerm}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {template.interpretation && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
                <div className="bg-cyan-50 rounded-lg p-6">
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

export default NelsonDennyReadingTestTemplate;
