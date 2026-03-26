import React, { useState } from 'react';
import { FiSave, FiX, FiEdit3, FiEye, FiFileText } from 'react-icons/fi';

const NelsonDennyReadingTestTemplate = ({
  onSave,
  onCancel,
  studentName = 'ABC',
  examinerName = 'Dr. Smith'
}) => {
  const [template, setTemplate] = useState({
    name: 'Nelson-Denny Reading Test',
    studentName: studentName,
    examinerName: examinerName,
    testDate: new Date().toISOString().split('T')[0],
    description: `The Nelson-Denny Reading Test is a standardized assessment designed to measure reading comprehension, vocabulary, and reading rate for high school and college students. The test consists of three subtests: Vocabulary, Comprehension, and Reading Rate, providing a comprehensive evaluation of reading proficiency.`,
    vocabularySubtest: {
      rawScore: 0,
      maxScore: 80,
      scaledScore: 0,
      percentileRank: 0,
      gradeEquivalent: '',
      items: [
        { id: 1, word: 'abundant', selected: '', correct: 'plentiful' },
        { id: 2, word: 'analyze', selected: '', correct: 'examine' },
        { id: 3, word: 'beneficial', selected: '', correct: 'helpful' },
        { id: 4, word: 'comprehensive', selected: '', correct: 'complete' },
        { id: 5, word: 'determine', selected: '', correct: 'decide' },
        { id: 6, word: 'efficient', selected: '', correct: 'effective' },
        { id: 7, word: 'fundamental', selected: '', correct: 'basic' },
        { id: 8, word: 'genuine', selected: '', correct: 'authentic' },
        { id: 9, word: 'hypothesis', selected: '', correct: 'theory' },
        { id: 10, word: 'implement', selected: '', correct: 'execute' },
        { id: 11, word: 'justification', selected: '', correct: 'reason' },
        { id: 12, word: 'legitimate', selected: '', correct: 'lawful' },
        { id: 13, word: 'modification', selected: '', correct: 'change' },
        { id: 14, word: 'negotiate', selected: '', correct: 'discuss' },
        { id: 15, word: 'obstacle', selected: '', correct: 'barrier' },
        { id: 16, word: 'perspective', selected: '', correct: 'viewpoint' },
        { id: 17, word: 'qualitative', selected: '', correct: 'descriptive' },
        { id: 18, word: 'relevance', selected: '', correct: 'importance' },
        { id: 19, word: 'substantial', selected: '', correct: 'significant' },
        { id: 20, word: 'tangible', selected: '', correct: 'concrete' }
      ]
    },
    comprehensionSubtest: {
      rawScore: 0,
      maxScore: 36,
      scaledScore: 0,
      percentileRank: 0,
      gradeEquivalent: '',
      passages: [
        {
          id: 1,
          title: 'Passage 1: Scientific Discovery',
          questions: [
            { id: 1, question: 'What is the main topic of this passage?', selected: '', correct: 'A' },
            { id: 2, question: 'According to the passage, what was the breakthrough?', selected: '', correct: 'C' },
            { id: 3, question: 'What conclusion can be drawn from the evidence?', selected: '', correct: 'B' },
            { id: 4, question: 'What does the author suggest about future research?', selected: '', correct: 'D' },
            { id: 5, question: 'What is the tone of this passage?', selected: '', correct: 'A' },
            { id: 6, question: 'What assumption does the author make?', selected: '', correct: 'C' }
          ]
        },
        {
          id: 2,
          title: 'Passage 2: Historical Analysis',
          questions: [
            { id: 7, question: 'What period is being discussed?', selected: '', correct: 'B' },
            { id: 8, question: 'What was the primary cause mentioned?', selected: '', correct: 'A' },
            { id: 9, question: 'What evidence supports the author\'s claim?', selected: '', correct: 'D' },
            { id: 10, question: 'What was the outcome described?', selected: '', correct: 'C' },
            { id: 11, question: 'What implication does the author make?', selected: '', correct: 'B' },
            { id: 12, question: 'What perspective is missing from the analysis?', selected: '', correct: 'A' }
          ]
        },
        {
          id: 3,
          title: 'Passage 3: Literary Criticism',
          questions: [
            { id: 13, question: 'What literary device is primarily used?', selected: '', correct: 'C' },
            { id: 14, question: 'What is the author\'s main argument?', selected: '', correct: 'D' },
            { id: 15, question: 'What does the symbol represent?', selected: '', correct: 'A' },
            { id: 16, question: 'What theme is explored throughout?', selected: '', correct: 'B' },
            { id: 17, question: 'What is the significance of the ending?', selected: '', correct: 'C' },
            { id: 18, question: 'What literary tradition does this follow?', selected: '', correct: 'D' }
          ]
        }
      ]
    },
    readingRateSubtest: {
      wordsPerMinute: 0,
      accuracy: 0,
      comprehensionAccuracy: 0,
      scaledScore: 0,
      percentileRank: 0,
      gradeEquivalent: '',
      passageLength: 600,
      timeLimit: 60 // seconds
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
    
    const vocabRawScore = vocabCorrect * 4; // Each item worth 4 points
    const vocabScaledScore = calculateScaledScore(vocabRawScore, 80);
    const vocabPercentile = calculatePercentile(vocabScaledScore);
    const vocabGradeEquivalent = calculateGradeEquivalent(vocabPercentile);

    // Comprehension Subtest Scoring
    let compCorrect = 0;
    template.comprehensionSubtest.passages.forEach(passage => {
      passage.questions.forEach(question => {
        if (question.selected === question.correct) {
          compCorrect++;
        }
      });
    });
    
    const compRawScore = compCorrect * 6; // Each item worth 6 points
    const compScaledScore = calculateScaledScore(compRawScore, 36);
    const compPercentile = calculatePercentile(compScaledScore);
    const compGradeEquivalent = calculateGradeEquivalent(compPercentile);

    // Reading Rate Subtest Scoring
    const wpm = parseInt(template.readingRateSubtest.wordsPerMinute) || 0;
    const accuracy = parseInt(template.readingRateSubtest.accuracy) || 0;
    const compAccuracy = parseInt(template.readingRateSubtest.comprehensionAccuracy) || 0;
    
    const rateScaledScore = calculateRateScaledScore(wpm, accuracy, compAccuracy);
    const ratePercentile = calculatePercentile(rateScaledScore);
    const rateGradeEquivalent = calculateGradeEquivalent(ratePercentile);

    // Total Score
    const totalScore = (vocabScaledScore + compScaledScore + rateScaledScore) / 3;
    const overallLevel = getOverallReadingLevel(totalScore);

    setTemplate(prev => ({
      ...prev,
      vocabularySubtest: {
        ...prev.vocabularySubtest,
        rawScore: vocabRawScore,
        scaledScore: vocabScaledScore,
        percentileRank: vocabPercentile,
        gradeEquivalent: vocabGradeEquivalent
      },
      comprehensionSubtest: {
        ...prev.comprehensionSubtest,
        rawScore: compRawScore,
        scaledScore: compScaledScore,
        percentileRank: compPercentile,
        gradeEquivalent: compGradeEquivalent
      },
      readingRateSubtest: {
        ...prev.readingRateSubtest,
        scaledScore: rateScaledScore,
        percentileRank: ratePercentile,
        gradeEquivalent: rateGradeEquivalent
      },
      totalScore: Math.round(totalScore),
      overallReadingLevel: overallLevel
    }));
  };

  const calculateScaledScore = (rawScore, maxScore) => {
    return Math.round((rawScore / maxScore) * 100);
  };

  const calculatePercentile = (scaledScore) => {
    // Simplified percentile calculation
    if (scaledScore >= 95) return 95;
    if (scaledScore >= 90) return 85;
    if (scaledScore >= 85) return 75;
    if (scaledScore >= 80) return 65;
    if (scaledScore >= 75) return 55;
    if (scaledScore >= 70) return 45;
    if (scaledScore >= 65) return 35;
    if (scaledScore >= 60) return 25;
    if (scaledScore >= 55) return 15;
    return 5;
  };

  const calculateGradeEquivalent = (percentile) => {
    if (percentile >= 90) return '12.9+';
    if (percentile >= 80) return '12.5';
    if (percentile >= 70) return '11.8';
    if (percentile >= 60) return '10.9';
    if (percentile >= 50) return '9.8';
    if (percentile >= 40) return '8.7';
    if (percentile >= 30) return '7.5';
    if (percentile >= 20) return '6.3';
    return '5.0';
  };

  const calculateRateScaledScore = (wpm, accuracy, compAccuracy) => {
    const wpmScore = Math.min((wpm / 250) * 50, 50); // Max 50 points for WPM
    const accuracyScore = (accuracy / 100) * 25; // Max 25 points for accuracy
    const compAccScore = (compAccuracy / 100) * 25; // Max 25 points for comprehension accuracy
    return Math.round(wpmScore + accuracyScore + compAccScore);
  };

  const getOverallReadingLevel = (totalScore) => {
    if (totalScore >= 90) return 'Advanced';
    if (totalScore >= 80) return 'Proficient';
    if (totalScore >= 70) return 'Competent';
    if (totalScore >= 60) return 'Developing';
    if (totalScore >= 50) return 'Emergent';
    return 'Beginning';
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
                  <div className="col-span-3 border-r border-black p-2 text-center font-bold text-xs">Word</div>
                  <div className="col-span-6 border-r border-black p-2 text-center font-bold text-xs">Select Definition</div>
                  <div className="col-span-2 p-2 text-center font-bold text-xs">Correct</div>
                </div>
                {template.vocabularySubtest.items.map((item, index) => (
                  <div key={item.id} className="border-b border-black">
                    <div className="grid grid-cols-12">
                      <div className="col-span-1 border-r border-black p-2 text-center text-xs">
                        {item.id}
                      </div>
                      <div className="col-span-3 border-r border-black p-2 text-center text-xs font-semibold">
                        {item.word}
                      </div>
                      <div className="col-span-6 border-r border-black p-2">
                        <select
                          value={item.selected}
                          onChange={(e) => handleVocabularyChange(index, e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500"
                        >
                          <option value="">Select...</option>
                          <option value="A">A. Option A</option>
                          <option value="B">B. Option B</option>
                          <option value="C">C. Option C</option>
                          <option value="D">D. Option D</option>
                        </select>
                      </div>
                      <div className="col-span-2 p-2 text-center text-xs">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accuracy (%)</label>
                  <input
                    type="number"
                    value={template.readingRateSubtest.accuracy}
                    onChange={(e) => handleReadingRateChange('accuracy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter accuracy"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comprehension Accuracy (%)</label>
                  <input
                    type="number"
                    value={template.readingRateSubtest.comprehensionAccuracy}
                    onChange={(e) => handleReadingRateChange('comprehensionAccuracy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Enter comprehension accuracy"
                    min="0"
                    max="100"
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

            {/* Total Scores */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Scores</h2>
              <div className="grid grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overall Reading Level</label>
                  <input
                    type="text"
                    value={template.overallReadingLevel}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Equivalent</label>
                  <input
                    type="text"
                    value={template.vocabularySubtest.gradeEquivalent}
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
                NELSON-DENNY READING TEST REPORT
              </h1>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600 mb-4">
                <span>Student: <strong className="text-cyan-600">{template.studentName}</strong></span>
                <span>Examiner: <strong className="text-cyan-600">{template.examinerName}</strong></span>
                <span>Date: <strong className="text-cyan-600">{template.testDate}</strong></span>
              </div>
            </div>

            {/* Subtest Results Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Subtest Results</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-cyan-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-cyan-800 mb-2">Vocabulary</h3>
                  <p className="text-sm">Raw Score: {template.vocabularySubtest.rawScore}/80</p>
                  <p className="text-sm">Scaled Score: {template.vocabularySubtest.scaledScore}</p>
                  <p className="text-sm">Percentile: {template.vocabularySubtest.percentileRank}th</p>
                  <p className="text-sm">Grade: {template.vocabularySubtest.gradeEquivalent}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Comprehension</h3>
                  <p className="text-sm">Raw Score: {template.comprehensionSubtest.rawScore}/36</p>
                  <p className="text-sm">Scaled Score: {template.comprehensionSubtest.scaledScore}</p>
                  <p className="text-sm">Percentile: {template.comprehensionSubtest.percentileRank}th</p>
                  <p className="text-sm">Grade: {template.comprehensionSubtest.gradeEquivalent}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Reading Rate</h3>
                  <p className="text-sm">WPM: {template.readingRateSubtest.wordsPerMinute}</p>
                  <p className="text-sm">Accuracy: {template.readingRateSubtest.accuracy}%</p>
                  <p className="text-sm">Scaled Score: {template.readingRateSubtest.scaledScore}</p>
                  <p className="text-sm">Grade: {template.readingRateSubtest.gradeEquivalent}</p>
                </div>
              </div>
            </div>

            {/* Overall Results */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Overall Results</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Total Score</h3>
                  <p className="text-2xl font-bold text-green-600">{template.totalScore}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">Reading Level</h3>
                  <p className="text-lg font-bold text-orange-600">{template.overallReadingLevel}</p>
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
