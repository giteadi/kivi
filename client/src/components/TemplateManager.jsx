import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiCopy, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import RIPAPrimaryTemplate from './RIPAPrimaryTemplate';
import ADHDT2Template from './ADHDT2Template';
import ADHTBSMTemplate from './ADHTBSMTemplate';
import AstonIndexTemplate from './AstonIndexTemplate';
import BKTTemplate from './BKTTemplate';
import RavensCPMTemplate from './RavensCPMTemplate';
import GARS3Template from './GARS3Template';
import BrownEFAScaleTemplate from './BrownEFAScaleTemplate';
import EACATemplate from './EACATemplate';
import EACAAutismTemplate from './EACAAutismTemplate';
import NelsonDennyReadingTestTemplate from './NelsonDennyReadingTestTemplate';
import TAPS3Template from './TAPS3Template';
import TOWL4Template from './TOWL4Template';
import VABS3Template from './VABS3Template';
import AssessmentReportGenerator from './AssessmentReportGenerator';
import TemplateTypeSelector from './TemplateTypeSelector';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit', 'report'
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'preview'

  // Static templates data for design purposes
  const staticTemplates = [
    {
      id: 1,
      name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
      type: 'RIPA-Primary',
      description: 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.',
      template_data: {
        type: 'RIPA-Primary',
        name: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: `The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning. It can be used to develop and guide rehabilitation goals and objectives based on individual strengths and weaknesses.`,
        subtests: [
          {
            name: 'Immediate Memory',
            description: 'In this subtest, the child is required to repeat numbers, words and sentences of increasing length and complexity.',
            rawScore: 0,
            standardScore: 0,
            percentileRank: 0,
            items: [
              { id: 1, task: 'Repeat 2-digit number', response: '', maxScore: 2 },
              { id: 2, task: 'Repeat 3-digit number', response: '', maxScore: 3 },
              { id: 3, task: 'Repeat 4-digit number', response: '', maxScore: 4 },
              { id: 4, task: 'Repeat 2-word sequence', response: '', maxScore: 2 },
              { id: 5, task: 'Repeat 3-word sequence', response: '', maxScore: 3 },
              { id: 6, task: 'Repeat 4-word sequence', response: '', maxScore: 4 },
              { id: 7, task: 'Repeat simple sentence', response: '', maxScore: 3 },
              { id: 8, task: 'Repeat complex sentence', response: '', maxScore: 4 }
            ]
          },
          {
            name: 'Recent Memory',
            description: 'In this subtest, the child is required to recall specific newly acquired information relative to his or her environment and daily activity. Each question requires a verbal response which is assessed for accuracy and appropriateness.',
            rawScore: 0,
            standardScore: 0,
            percentileRank: 0,
            items: [
              { id: 9, task: 'Recall daily activities', response: '', maxScore: 3 },
              { id: 10, task: 'Recall recent events', response: '', maxScore: 3 },
              { id: 11, task: 'Recall personal information', response: '', maxScore: 2 },
              { id: 12, task: 'Recall environmental details', response: '', maxScore: 3 },
              { id: 13, task: 'Recall temporal information', response: '', maxScore: 2 },
              { id: 14, task: 'Recall spatial information', response: '', maxScore: 3 },
              { id: 15, task: 'Recall functional information', response: '', maxScore: 2 },
              { id: 16, task: 'Recall social information', response: '', maxScore: 3 }
            ]
          },
          {
            name: 'Recall of General Information',
            description: 'This subtest assesses the child\'s ability to recall general information in remote memory.',
            rawScore: 0,
            standardScore: 0,
            percentileRank: 0,
            items: [
              { id: 17, task: 'General knowledge question 1', response: '', maxScore: 2 },
              { id: 18, task: 'General knowledge question 2', response: '', maxScore: 2 },
              { id: 19, task: 'General knowledge question 3', response: '', maxScore: 2 },
              { id: 20, task: 'General knowledge question 4', response: '', maxScore: 2 },
              { id: 21, task: 'General knowledge question 5', response: '', maxScore: 2 },
              { id: 22, task: 'General knowledge question 6', response: '', maxScore: 2 },
              { id: 23, task: 'General knowledge question 7', response: '', maxScore: 2 },
              { id: 24, task: 'General knowledge question 8', response: '', maxScore: 2 }
            ]
          },
          {
            name: 'Spatial Orientation',
            description: 'In this subtest, the child answers questions related to spatial concepts and orientation. Elicitation of accurate responses requires recall from both recent and remote memory. Spatial concepts require organization skills, including categorization and sequencing.',
            rawScore: 0,
            standardScore: 0,
            percentileRank: 0,
            items: [
              { id: 25, task: 'Identify left/right', response: '', maxScore: 2 },
              { id: 26, task: 'Identify positions', response: '', maxScore: 2 },
              { id: 27, task: 'Spatial relationships', response: '', maxScore: 3 },
              { id: 28, task: 'Directional concepts', response: '', maxScore: 2 },
              { id: 29, task: 'Object positioning', response: '', maxScore: 3 },
              { id: 30, task: 'Environmental orientation', response: '', maxScore: 2 },
              { id: 31, task: 'Body orientation', response: '', maxScore: 2 },
              { id: 32, task: 'Spatial sequencing', response: '', maxScore: 3 }
            ]
          }
        ],
        memoryQuotient: 0,
        compositeScore: 0,
        tScore: 0,
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 9,
      name: 'ADHD-DSM5 Checklist',
      type: 'ADHT-BSM',
      description: 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity',
      template_data: {
        type: 'ADHT-BSM',
        name: 'ADHT-DSM 5 Checklist',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        inattentionCriteria: [
          { id: 1, symptom: 'Often fails to give close attention to details or makes careless mistakes', checked: false },
          { id: 2, symptom: 'Often has trouble sustaining attention in tasks or activities', checked: false },
          { id: 3, symptom: 'Often does not seem to listen when spoken to directly', checked: false },
          { id: 4, symptom: 'Often does not follow through on instructions and fails to finish tasks', checked: false },
          { id: 5, symptom: 'Often has trouble organizing tasks and activities', checked: false },
          { id: 6, symptom: 'Often avoids, dislikes, or is reluctant to do tasks that require mental effort', checked: false },
          { id: 7, symptom: 'Often loses things necessary for tasks or activities', checked: false },
          { id: 8, symptom: 'Is often easily distracted by external stimuli', checked: false },
          { id: 9, symptom: 'Is often forgetful in daily activities', checked: false }
        ],
        hyperactivityCriteria: [
          { id: 10, symptom: 'Often fidgets with or taps hands or feet or squirms in seat', checked: false },
          { id: 11, symptom: 'Often leaves seat in situations when remaining seated is expected', checked: false },
          { id: 12, symptom: 'Often runs about or climbs in situations where it is not appropriate', checked: false },
          { id: 13, symptom: 'Unable to play or engage in leisure activities quietly', checked: false },
          { id: 14, symptom: 'Is often "on the go" or acts as if "driven by a motor"', checked: false },
          { id: 15, symptom: 'Often talks excessively', checked: false },
          { id: 16, symptom: 'Often blurts out an answer before a question has been completed', checked: false },
          { id: 17, symptom: 'Has trouble waiting for their turn', checked: false },
          { id: 18, symptom: 'Often interrupts or intrudes on others', checked: false }
        ],
        remarks: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 10,
      name: 'Aston Index Assessment',
      type: 'Aston-Index',
      description: 'Comprehensive battery of tests for diagnosing language difficulties in children',
      template_data: {
        type: 'Aston-Index',
        name: 'Aston Index Assessment',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Aston Index is a comprehensive battery of tests for diagnosing language difficulties in children.',
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
        conclusions: 'Based on the assessment results, the student shows strengths in certain areas while requiring support in others.',
        recommendations: 'Recommendations include targeted interventions to strengthen specific language and cognitive skills identified during assessment.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 12,
      name: 'EACA AUTISM ASSESSMENT',
      type: 'ADHDT2',
      description: 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring',
      template_data: {
        type: 'ADHDT2',
        name: 'ADHDT-2 Assessment',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        subscales: [
          { name: 'Inattention', rawScore: 0, percentileRank: 0, scaledScore: 0 },
          { name: 'Hyperactivity/Impulsivity', rawScore: 0, percentileRank: 0, scaledScore: 0 }
        ],
        adhdIndex: 0,
        remark: '',
        disclaimer: 'The scores listed in the table imply that it is \'very likely\' that the student has symptoms of ADHD.'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 11,
      name: 'Bender Gestalt Test (BKT)',
      type: 'BKT',
      description: 'Motor coordination and kinesthetic perception assessment',
      template_data: {
        type: 'BKT',
        name: 'Basic Kinesthetic Test',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Basic Kinesthetic Test (BKT) is an assessment tool designed to evaluate kinesthetic perception and motor coordination abilities in children.',
        grossMotorSkills: [
          { id: 1, test: 'Balance on one foot (right)', score: '', remarks: '' },
          { id: 2, test: 'Balance on one foot (left)', score: '', remarks: '' },
          { id: 3, test: 'Hop on one foot (right)', score: '', remarks: '' },
          { id: 4, test: 'Hop on one foot (left)', score: '', remarks: '' },
          { id: 5, test: 'Jump forward with both feet', score: '', remarks: '' },
          { id: 6, test: 'Throw ball forward', score: '', remarks: '' },
          { id: 7, test: 'Catch ball with both hands', score: '', remarks: '' }
        ],
        fineMotorSkills: [
          { id: 8, test: 'Finger tapping (right hand)', score: '', remarks: '' },
          { id: 9, test: 'Finger tapping (left hand)', score: '', remarks: '' },
          { id: 10, test: 'Touch finger to thumb (right)', score: '', remarks: '' },
          { id: 11, test: 'Touch finger to thumb (left)', score: '', remarks: '' },
          { id: 12, test: 'Copy simple shapes', score: '', remarks: '' },
          { id: 13, test: 'Draw a person', score: '', remarks: '' }
        ],
        bodyAwareness: [
          { id: 14, test: 'Identify body parts', score: '', remarks: '' },
          { id: 15, test: 'Left-right discrimination', score: '', remarks: '' },
          { id: 16, test: 'Body coordination', score: '', remarks: '' },
          { id: 17, test: 'Spatial orientation', score: '', remarks: '' }
        ],
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Raven\'s Coloured Progressive Matrices',
      type: 'Ravens-CPM',
      description: 'Non-verbal assessment of eductive ability and problem-solving skills',
      template_data: {
        type: 'Ravens-CPM',
        name: 'Raven\'s Coloured Progressive Matrices',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'Raven\'s Coloured Progressive Matrices (CPM) is a non-verbal test designed to assess eductive ability.',
        sections: [
          {
            name: 'Set A',
            items: [
              { id: 1, question: 'Pattern Completion 1', answer: '', correct: 6 },
              { id: 2, question: 'Pattern Completion 2', answer: '', correct: 2 },
              { id: 3, question: 'Pattern Completion 3', answer: '', correct: 4 },
              { id: 4, question: 'Pattern Completion 4', answer: '', correct: 1 },
              { id: 5, question: 'Pattern Completion 5', answer: '', correct: 3 },
              { id: 6, question: 'Pattern Completion 6', answer: '', correct: 5 },
              { id: 7, question: 'Pattern Completion 7', answer: '', correct: 2 },
              { id: 8, question: 'Pattern Completion 8', answer: '', correct: 6 },
              { id: 9, question: 'Pattern Completion 9', answer: '', correct: 4 },
              { id: 10, question: 'Pattern Completion 10', answer: '', correct: 1 },
              { id: 11, question: 'Pattern Completion 11', answer: '', correct: 3 },
              { id: 12, question: 'Pattern Completion 12', answer: '', correct: 5 }
            ]
          },
          {
            name: 'Set AB',
            items: [
              { id: 13, question: 'Pattern Completion 13', answer: '', correct: 4 },
              { id: 14, question: 'Pattern Completion 14', answer: '', correct: 2 },
              { id: 15, question: 'Pattern Completion 15', answer: '', correct: 6 },
              { id: 16, question: 'Pattern Completion 16', answer: '', correct: 1 },
              { id: 17, question: 'Pattern Completion 17', answer: '', correct: 3 },
              { id: 18, question: 'Pattern Completion 18', answer: '', correct: 5 },
              { id: 19, question: 'Pattern Completion 19', answer: '', correct: 2 },
              { id: 20, question: 'Pattern Completion 20', answer: '', correct: 4 },
              { id: 21, question: 'Pattern Completion 21', answer: '', correct: 6 },
              { id: 22, question: 'Pattern Completion 22', answer: '', correct: 1 },
              { id: 23, question: 'Pattern Completion 23', answer: '', correct: 3 },
              { id: 24, question: 'Pattern Completion 24', answer: '', correct: 5 }
            ]
          },
          {
            name: 'Set B',
            items: [
              { id: 25, question: 'Pattern Completion 25', answer: '', correct: 6 },
              { id: 26, question: 'Pattern Completion 26', answer: '', correct: 4 },
              { id: 27, question: 'Pattern Completion 27', answer: '', correct: 2 },
              { id: 28, question: 'Pattern Completion 28', answer: '', correct: 1 },
              { id: 29, question: 'Pattern Completion 29', answer: '', correct: 3 },
              { id: 30, question: 'Pattern Completion 30', answer: '', correct: 5 },
              { id: 31, question: 'Pattern Completion 31', answer: '', correct: 2 },
              { id: 32, question: 'Pattern Completion 32', answer: '', correct: 6 },
              { id: 33, question: 'Pattern Completion 33', answer: '', correct: 4 },
              { id: 34, question: 'Pattern Completion 34', answer: '', correct: 1 },
              { id: 35, question: 'Pattern Completion 35', answer: '', correct: 3 },
              { id: 36, question: 'Pattern Completion 36', answer: '', correct: 5 }
            ]
          }
        ],
        rawScore: 0,
        percentileRank: 0,
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 7,
      name: 'Gilliam Autism Rating Scale - 3',
      type: 'GARS-3',
      description: 'Comprehensive assessment tool for identifying autism spectrum disorders',
      template_data: {
        type: 'GARS-3',
        name: 'Gilliam Autism Rating Scale - 3',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Gilliam Autism Rating Scale, Third Edition (GARS-3) is a standardized instrument used to identify autism spectrum disorders.',
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
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 8,
      name: 'Brown Executive Function/Attention Scales',
      type: 'Brown-EF-A',
      description: 'Comprehensive assessment of executive function and attention processes',
      template_data: {
        type: 'Brown-EF-A',
        name: 'Brown Executive Function/Attention Scales',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Brown Executive Function/Attention Scales (Brown EF/A Scales) is a comprehensive assessment tool designed to evaluate executive function and attention processes.',
        subscales: [
          {
            name: 'Organization',
            items: [
              { id: 1, description: 'Has difficulty organizing materials for school/work', frequency: '', impact: '' },
              { id: 2, description: 'Loses or misplaces important items', frequency: '', impact: '' },
              { id: 3, description: 'Has trouble keeping workspace organized', frequency: '', impact: '' },
              { id: 4, description: 'Struggles to organize thoughts before speaking/writing', frequency: '', impact: '' },
              { id: 5, description: 'Has difficulty planning multi-step tasks', frequency: '', impact: '' },
              { id: 6, description: 'Forgets to bring necessary items to activities', frequency: '', impact: '' },
              { id: 7, description: 'Has messy backpack, desk, or room', frequency: '', impact: '' },
              { id: 8, description: 'Struggles with organizing digital files/documents', frequency: '', impact: '' }
            ]
          },
          {
            name: 'Time Management',
            items: [
              { id: 9, description: 'Has difficulty estimating time needed for tasks', frequency: '', impact: '' },
              { id: 10, description: 'Often runs late to appointments or activities', frequency: '', impact: '' },
              { id: 11, description: 'Procrastinates on starting tasks', frequency: '', impact: '' },
              { id: 12, description: 'Has trouble completing tasks on time', frequency: '', impact: '' },
              { id: 13, description: 'Gets absorbed in one activity, loses track of time', frequency: '', impact: '' },
              { id: 14, description: 'Has difficulty breaking large tasks into smaller steps', frequency: '', impact: '' },
              { id: 15, description: 'Rushes through tasks at the last minute', frequency: '', impact: '' },
              { id: 16, description: 'Has trouble establishing daily routines', frequency: '', impact: '' }
            ]
          },
          {
            name: 'Working Memory',
            items: [
              { id: 17, description: 'Forgets instructions soon after hearing them', frequency: '', impact: '' },
              { id: 18, description: 'Has trouble remembering multiple steps', frequency: '', impact: '' },
              { id: 19, description: 'Loses track of what they were saying', frequency: '', impact: '' },
              { id: 20, description: 'Forgets information while reading', frequency: '', impact: '' },
              { id: 21, description: 'Has difficulty holding information in mind', frequency: '', impact: '' },
              { id: 22, description: 'Forgets what they were supposed to do next', frequency: '', impact: '' },
              { id: 23, description: 'Has trouble recalling recent events', frequency: '', impact: '' },
              { id: 24, description: 'Forgets appointments or commitments', frequency: '', impact: '' }
            ]
          },
          {
            name: 'Emotional Regulation',
            items: [
              { id: 25, description: 'Has sudden mood changes', frequency: '', impact: '' },
              { id: 26, description: 'Overreacts to minor frustrations', frequency: '', impact: '' },
              { id: 27, description: 'Has difficulty calming down when upset', frequency: '', impact: '' },
              { id: 28, description: 'Is easily frustrated by small problems', frequency: '', impact: '' },
              { id: 29, description: 'Has explosive reactions to stress', frequency: '', impact: '' },
              { id: 30, description: 'Has difficulty managing anxiety', frequency: '', impact: '' },
              { id: 31, description: 'Shows excessive emotional responses', frequency: '', impact: '' },
              { id: 32, description: 'Has difficulty with emotional self-control', frequency: '', impact: '' }
            ]
          },
          {
            name: 'Task Initiation',
            items: [
              { id: 33, description: 'Has trouble getting started on tasks', frequency: '', impact: '' },
              { id: 34, description: 'Avoids starting difficult or boring tasks', frequency: '', impact: '' },
              { id: 35, description: 'Delays beginning assignments or projects', frequency: '', impact: '' },
              { id: 36, description: 'Has difficulty initiating daily routines', frequency: '', impact: '' },
              { id: 37, description: 'Waits until last minute to start', frequency: '', impact: '' },
              { id: 38, description: 'Has trouble transitioning between activities', frequency: '', impact: '' },
              { id: 39, description: 'Appears "stuck" when starting tasks', frequency: '', impact: '' },
              { id: 40, description: 'Needs external prompts to begin activities', frequency: '', impact: '' }
            ]
          },
          {
            name: 'Sustained Attention',
            items: [
              { id: 41, description: 'Has difficulty maintaining focus during tasks', frequency: '', impact: '' },
              { id: 42, description: 'Gets easily distracted by external stimuli', frequency: '', impact: '' },
              { id: 43, description: 'Loses focus during conversations', frequency: '', impact: '' },
              { id: 44, description: 'Has trouble completing reading assignments', frequency: '', impact: '' },
              { id: 45, description: 'Mind wanders during important activities', frequency: '', impact: '' },
              { id: 46, description: 'Has trouble staying on task', frequency: '', impact: '' },
              { id: 47, description: 'Frequently daydreams or zones out', frequency: '', impact: '' },
              { id: 48, description: 'Has trouble maintaining attention in meetings/classes', frequency: '', impact: '' }
            ]
          }
        ],
        executiveFunctionIndex: 0,
        attentionIndex: 0,
        overallIndex: 0,
        severityLevel: '',
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 8,
      name: 'Early Academic Competency Assessment',
      type: 'EACA',
      description: 'Comprehensive screening tool for early academic skills and school readiness',
      template_data: {
        type: 'EACA',
        name: 'Early Academic Competency Assessment',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Early Academic Competency Assessment (EACA) is a comprehensive screening tool designed to evaluate early academic skills and school readiness.',
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
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 9,
      name: 'Educational Assessment of Children with Autism (EACA)',
      type: 'EACA-Autism',
      description: 'Comprehensive assessment of children with autism focusing on the triad of impairments across 7 domains',
      template_data: {
        type: 'EACA-Autism',
        name: 'Educational Assessment of Children with Autism (EACA)',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Educational Assessment of Children with Autism (EACA) consists of a checklist of skill behaviours that are functionally relevant for such children. With the focus on the triad of impairments (impairment in social interaction, delay in language and communication, and limited interests and activities) in autism, EACA views how the impairments may impact acquisition of learning skills. The test contains 48 items and have been categorized within 7 domains namely: Attention Skills, Imitation Skills, Language and Communication Skills, Cognitive Skills, Play Skills, Self-help Skills, and Behaviour Skills.',
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
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 13,
      name: 'Nelson-Denny Reading Test',
      type: 'Nelson-Denny',
      description: 'Comprehensive assessment of reading comprehension, vocabulary, and reading rate',
      template_data: {
        type: 'Nelson-Denny',
        name: 'Nelson-Denny Reading Test',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: 'The Nelson-Denny Reading Test is a standardized assessment designed to measure reading comprehension, vocabulary, and reading rate.',
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
            { id: 10, word: 'implement', selected: '', correct: 'execute' }
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
          timeLimit: 60
        },
        totalScore: 0,
        overallReadingLevel: '',
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 14,
      name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
      type: 'TAPS-3',
      description: 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion',
      template_data: {
        type: 'TAPS-3',
        name: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
        studentName: '',
        examinerName: '',
        testDate: new Date().toISOString().split('T')[0],
        description: `The Test of Auditory Processing Skills (Third Edition; TAPS-3) is a measure of auditory skill important to the development, use, and understanding of the language used in academic instruction. It includes subtests designed to assess basic phonological skills (which are important to learning to read), memory abilities (essential to processing information), and auditory cohesion (which requires not only understanding, but also the ability to use inference, deduction and abstraction to comprehend the meaning of verbally presented information). The scores below serve to show a student's performance on these auditory tasks in comparison to a normative sample of his same age peers, as well as to compare his performance on different subtests.`,
        subtests: [
          {
            name: 'Word Discrimination',
            category: 'Phonological',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 36,
            items: [
              { id: 1, item: 'Word pair 1', response: '', correct: true },
              { id: 2, item: 'Word pair 2', response: '', correct: true },
              { id: 3, item: 'Word pair 3', response: '', correct: true },
              { id: 4, item: 'Word pair 4', response: '', correct: true },
              { id: 5, item: 'Word pair 5', response: '', correct: true },
              { id: 6, item: 'Word pair 6', response: '', correct: true },
              { id: 7, item: 'Word pair 7', response: '', correct: true },
              { id: 8, item: 'Word pair 8', response: '', correct: true },
              { id: 9, item: 'Word pair 9', response: '', correct: true },
              { id: 10, item: 'Word pair 10', response: '', correct: true },
              { id: 11, item: 'Word pair 11', response: '', correct: true },
              { id: 12, item: 'Word pair 12', response: '', correct: true }
            ]
          },
          {
            name: 'Phonological Segmentation',
            category: 'Phonological',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 30,
            items: [
              { id: 13, item: 'Segment word 1', response: '', correct: true },
              { id: 14, item: 'Segment word 2', response: '', correct: true },
              { id: 15, item: 'Segment word 3', response: '', correct: true },
              { id: 16, item: 'Segment word 4', response: '', correct: true },
              { id: 17, item: 'Segment word 5', response: '', correct: true },
              { id: 18, item: 'Segment word 6', response: '', correct: true },
              { id: 19, item: 'Segment word 7', response: '', correct: true },
              { id: 20, item: 'Segment word 8', response: '', correct: true },
              { id: 21, item: 'Segment word 9', response: '', correct: true },
              { id: 22, item: 'Segment word 10', response: '', correct: true }
            ]
          },
          {
            name: 'Phonological Blending',
            category: 'Phonological',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 30,
            items: [
              { id: 23, item: 'Blend sounds 1', response: '', correct: true },
              { id: 24, item: 'Blend sounds 2', response: '', correct: true },
              { id: 25, item: 'Blend sounds 3', response: '', correct: true },
              { id: 26, item: 'Blend sounds 4', response: '', correct: true },
              { id: 27, item: 'Blend sounds 5', response: '', correct: true },
              { id: 28, item: 'Blend sounds 6', response: '', correct: true },
              { id: 29, item: 'Blend sounds 7', response: '', correct: true },
              { id: 30, item: 'Blend sounds 8', response: '', correct: true },
              { id: 31, item: 'Blend sounds 9', response: '', correct: true },
              { id: 32, item: 'Blend sounds 10', response: '', correct: true }
            ]
          },
          {
            name: 'Number Memory Forward',
            category: 'Memory',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 30,
            items: [
              { id: 33, item: 'Repeat 2 numbers', response: '', correct: true },
              { id: 34, item: 'Repeat 3 numbers', response: '', correct: true },
              { id: 35, item: 'Repeat 4 numbers', response: '', correct: true },
              { id: 36, item: 'Repeat 5 numbers', response: '', correct: true },
              { id: 37, item: 'Repeat 6 numbers', response: '', correct: true },
              { id: 38, item: 'Repeat 7 numbers', response: '', correct: true },
              { id: 39, item: 'Repeat 8 numbers', response: '', correct: true },
              { id: 40, item: 'Repeat 9 numbers', response: '', correct: true },
              { id: 41, item: 'Repeat 10 numbers', response: '', correct: true }
            ]
          },
          {
            name: 'Number Memory Reversed',
            category: 'Memory',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 18,
            items: [
              { id: 42, item: 'Reverse 2 numbers', response: '', correct: true },
              { id: 43, item: 'Reverse 3 numbers', response: '', correct: true },
              { id: 44, item: 'Reverse 4 numbers', response: '', correct: true },
              { id: 45, item: 'Reverse 5 numbers', response: '', correct: true },
              { id: 46, item: 'Reverse 6 numbers', response: '', correct: true },
              { id: 47, item: 'Reverse 7 numbers', response: '', correct: true }
            ]
          },
          {
            name: 'Word Memory',
            category: 'Memory',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 24,
            items: [
              { id: 48, item: 'Recall 2 words', response: '', correct: true },
              { id: 49, item: 'Recall 3 words', response: '', correct: true },
              { id: 50, item: 'Recall 4 words', response: '', correct: true },
              { id: 51, item: 'Recall 5 words', response: '', correct: true },
              { id: 52, item: 'Recall 6 words', response: '', correct: true },
              { id: 53, item: 'Recall 7 words', response: '', correct: true },
              { id: 54, item: 'Recall 8 words', response: '', correct: true }
            ]
          },
          {
            name: 'Sentence Memory',
            category: 'Memory',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 30,
            items: [
              { id: 55, item: 'Recall sentence 1', response: '', correct: true },
              { id: 56, item: 'Recall sentence 2', response: '', correct: true },
              { id: 57, item: 'Recall sentence 3', response: '', correct: true },
              { id: 58, item: 'Recall sentence 4', response: '', correct: true },
              { id: 59, item: 'Recall sentence 5', response: '', correct: true },
              { id: 60, item: 'Recall sentence 6', response: '', correct: true },
              { id: 61, item: 'Recall sentence 7', response: '', correct: true },
              { id: 62, item: 'Recall sentence 8', response: '', correct: true },
              { id: 63, item: 'Recall sentence 9', response: '', correct: true },
              { id: 64, item: 'Recall sentence 10', response: '', correct: true }
            ]
          },
          {
            name: 'Auditory Comprehension',
            category: 'Cohesion',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 30,
            items: [
              { id: 65, item: 'Comprehension 1', response: '', correct: true },
              { id: 66, item: 'Comprehension 2', response: '', correct: true },
              { id: 67, item: 'Comprehension 3', response: '', correct: true },
              { id: 68, item: 'Comprehension 4', response: '', correct: true },
              { id: 69, item: 'Comprehension 5', response: '', correct: true },
              { id: 70, item: 'Comprehension 6', response: '', correct: true },
              { id: 71, item: 'Comprehension 7', response: '', correct: true },
              { id: 72, item: 'Comprehension 8', response: '', correct: true },
              { id: 73, item: 'Comprehension 9', response: '', correct: true },
              { id: 74, item: 'Comprehension 10', response: '', correct: true }
            ]
          },
          {
            name: 'Auditory Reasoning',
            category: 'Cohesion',
            rawScore: 0,
            scaledScore: 0,
            percentileRank: 0,
            maxScore: 18,
            items: [
              { id: 75, item: 'Reasoning 1', response: '', correct: true },
              { id: 76, item: 'Reasoning 2', response: '', correct: true },
              { id: 77, item: 'Reasoning 3', response: '', correct: true },
              { id: 78, item: 'Reasoning 4', response: '', correct: true },
              { id: 79, item: 'Reasoning 5', response: '', correct: true },
              { id: 80, item: 'Reasoning 6', response: '', correct: true }
            ]
          }
        ],
        phonologicIndex: 0,
        memoryIndex: 0,
        cohesionIndex: 0,
        overallIndex: 0,
        interpretation: '',
        conclusions: '',
        recommendations: ''
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 15,
      name: 'TEST OF WRITTEN LANGUAGE (TOWL-4)',
      type: 'TOWL-4',
      description: 'The TOWL-4 is a norm-referenced, reliable, and valid test of written language measuring seven skill areas and three composite scores.',
      template_data: {
        type: 'TOWL-4',
        name: 'TEST OF WRITTEN LANGUAGE (TOWL-4)',
        studentName: '',
        examinerName: '',
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
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 16,
      name: 'VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3',
      type: 'VABS-3',
      description: 'Individual assessment of adaptive behaviour measuring day-to-day activities necessary for self-care and social interaction.',
      template_data: {
        type: 'VABS-3',
        name: 'VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3',
        studentName: '',
        examinerName: '',
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
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Use static templates for design purposes
    loadStaticTemplates();
  }, [searchTerm, filterType]);

  const loadStaticTemplates = () => {
    setLoading(true);
    // Filter templates based on search and filter
    let filteredTemplates = staticTemplates;
    
    if (searchTerm) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType) {
      filteredTemplates = filteredTemplates.filter(template =>
        template.type === filterType
      );
    }
    
    setTemplates(filteredTemplates);
    setLoading(false);
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(true);
    setViewMode('template-select');
  };

  const handleTemplateTypeSelect = (type) => {
    setSelectedTemplate({ template_data: { type } });
    setViewMode('edit');
  };

  const handleViewTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(false);
    setShowCreateForm(false);
    setViewMode('view');
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setShowCreateForm(false);
    setViewMode('edit');
  };

  const handleGenerateReport = (template) => {
    setSelectedTemplate(template);
    setIsEditing(false);
    setShowCreateForm(false);
    setViewMode('view');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTemplate(null);
    setIsEditing(false);
    setShowCreateForm(false);
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setTemplates(prev => [...prev, newTemplate]);
    toast.success('Template duplicated successfully (Design Mode)');
  };

  const handleDeleteTemplate = (template) => {
    if (window.confirm(`Are you sure you want to delete "${template.name}"? (Design Mode)`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      toast.success('Template deleted successfully (Design Mode)');
    }
  };

  const handleTemplateSave = (templateData) => {
    if (isEditing && selectedTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, template_data: templateData, updated_at: new Date().toISOString() }
          : t
      ));
      toast.success('Template updated successfully (Design Mode)');
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now(),
        name: templateData.name || 'Untitled Template',
        type: templateData.type || 'ADHDT2',
        description: templateData.description || 'No description',
        template_data: templateData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully (Design Mode)');
    }
    handleBackToList();
  };

  const handleTemplateCancel = () => {
    handleBackToList();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'RIPA-Primary':
        return <FiFileText className="w-5 h-5 text-emerald-500" />;
      case 'ADHT-BSM':
        return <FiFileText className="w-5 h-5 text-green-500" />;
      case 'BKT':
        return <FiFileText className="w-5 h-5 text-orange-500" />;
      case 'Ravens-CPM':
        return <FiFileText className="w-5 h-5 text-indigo-500" />;
      case 'GARS-3':
        return <FiFileText className="w-5 h-5 text-red-500" />;
      case 'Brown-EF-A':
        return <FiFileText className="w-5 h-5 text-yellow-500" />;
      case 'EACA':
        return <FiFileText className="w-5 h-5 text-teal-500" />;
      case 'Nelson-Denny':
        return <FiFileText className="w-5 h-5 text-cyan-500" />;
      case 'TAPS-3':
        return <FiFileText className="w-5 h-5 text-teal-500" />;
      case 'TOWL-4':
        return <FiFileText className="w-5 h-5 text-indigo-500" />;
      case 'VABS-3':
        return <FiFileText className="w-5 h-5 text-purple-500" />;
      case 'EACA-Autism':
        return <FiFileText className="w-5 h-5 text-purple-500" />;
      default:
        return <FiFileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type, templateName) => {
    if (type === 'RIPA-Primary' || templateName?.toLowerCase().includes('ripa')) {
      return 'bg-emerald-100 text-emerald-800';
    }
    if (type === 'ADHT-BSM' || templateName?.toLowerCase().includes('dsm')) {
      return 'bg-green-100 text-green-800';
    }
    if (type === 'Aston-Index' || templateName?.toLowerCase().includes('aston')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (type === 'BKT' || templateName?.toLowerCase().includes('bkt')) {
      return 'bg-orange-100 text-orange-800';
    }
    if (type === 'Ravens-CPM' || templateName?.toLowerCase().includes('raven')) {
      return 'bg-indigo-100 text-indigo-800';
    }
    if (type === 'GARS-3' || templateName?.toLowerCase().includes('gars')) {
      return 'bg-red-100 text-red-800';
    }
    if (type === 'Brown-EF-A' || templateName?.toLowerCase().includes('brown')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (type === 'EACA-Autism' || templateName?.toLowerCase().includes('autism')) {
      return 'bg-purple-100 text-purple-800';
    }
    if (type === 'EACA' || templateName?.toLowerCase().includes('eaca')) {
      return 'bg-teal-100 text-teal-800';
    }
    if (type === 'Nelson-Denny' || templateName?.toLowerCase().includes('nelson')) {
      return 'bg-cyan-100 text-cyan-800';
    }
    if (type === 'TAPS-3' || templateName?.toLowerCase().includes('taps')) {
      return 'bg-teal-100 text-teal-800';
    }
    if (type === 'TOWL-4' || templateName?.toLowerCase().includes('towl')) {
      return 'bg-indigo-100 text-indigo-800';
    }
    if (type === 'VABS-3' || templateName?.toLowerCase().includes('vineland')) {
      return 'bg-purple-100 text-purple-800';
    }
    switch (type) {
      case 'ADHDT2':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === 'template-select') {
    return (
      <TemplateTypeSelector
        onSelect={handleTemplateTypeSelect}
        onCancel={handleBackToList}
      />
    );
  }

  if (viewMode === 'edit' || showCreateForm) {
    const templateType = selectedTemplate?.template_data?.type || 
                        (selectedTemplate?.name?.toLowerCase().includes('dsm') ? 'ADHT-BSM' : 
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('dsm') ? 'ADHT-BSM' : 
                         selectedTemplate?.name?.toLowerCase().includes('aston') ? 'Aston-Index' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('aston') ? 'Aston-Index' :
                         selectedTemplate?.name?.toLowerCase().includes('bkt') ? 'BKT' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('bkt') ? 'BKT' :
                         selectedTemplate?.name?.toLowerCase().includes('raven') ? 'Ravens-CPM' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('raven') ? 'Ravens-CPM' :
                         selectedTemplate?.name?.toLowerCase().includes('gars') ? 'GARS-3' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('gars') ? 'GARS-3' :
                         selectedTemplate?.name?.toLowerCase().includes('brown') ? 'Brown-EF-A' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('brown') ? 'Brown-EF-A' :
                         selectedTemplate?.name?.toLowerCase().includes('eaca') && !selectedTemplate?.name?.toLowerCase().includes('autism') ? 'EACA' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('eaca') && !selectedTemplate?.template_data?.name?.toLowerCase().includes('autism') ? 'EACA' :
                         selectedTemplate?.name?.toLowerCase().includes('autism') ? 'EACA-Autism' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('autism') ? 'EACA-Autism' :
                         selectedTemplate?.name?.toLowerCase().includes('nelson') ? 'Nelson-Denny' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('nelson') ? 'Nelson-Denny' :
                         selectedTemplate?.name?.toLowerCase().includes('taps') ? 'TAPS-3' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('taps') ? 'TAPS-3' :
                         selectedTemplate?.name?.toLowerCase().includes('ripa') ? 'RIPA-Primary' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('ripa') ? 'RIPA-Primary' :
                         selectedTemplate?.name?.toLowerCase().includes('towl') ? 'TOWL-4' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('towl') ? 'TOWL-4' :
                         selectedTemplate?.name?.toLowerCase().includes('vineland') ? 'VABS-3' :
                         selectedTemplate?.template_data?.name?.toLowerCase().includes('vineland') ? 'VABS-3' : 'ADHDT2');
    
    if (templateType === 'RIPA-Primary') {
      return (
        <RIPAPrimaryTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'ADHT-BSM') {
      return (
        <ADHTBSMTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'Aston-Index') {
      return (
        <AstonIndexTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'BKT') {
      return (
        <BKTTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'Ravens-CPM') {
      return (
        <RavensCPMTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'GARS-3') {
      return (
        <GARS3Template
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'Brown-EF-A') {
      return (
        <BrownEFAScaleTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'EACA-Autism') {
      return (
        <EACAAutismTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'EACA') {
      return (
        <EACATemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'Nelson-Denny') {
      return (
        <NelsonDennyReadingTestTemplate
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'TAPS-3') {
      return (
        <TAPS3Template
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'TOWL-4') {
      return (
        <TOWL4Template
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }

    if (templateType === 'VABS-3') {
      return (
        <VABS3Template
          onSave={handleTemplateSave}
          onCancel={handleTemplateCancel}
          studentName={selectedTemplate?.template_data?.studentName || 'ABC'}
          examinerName={selectedTemplate?.template_data?.examinerName || 'Dr. Smith'}
        />
      );
    }
    
    return (
      <ADHDT2Template
        templateData={selectedTemplate?.template_data}
        onSave={handleTemplateSave}
        onCancel={handleTemplateCancel}
        isEditing={isEditing}
      />
    );
  }

  if (viewMode === 'view' && selectedTemplate) {
    return (
      <AssessmentReportGenerator
        template={selectedTemplate.template_data}
        studentName={selectedTemplate.template_data?.studentName || 'Student'}
        examinerName={selectedTemplate.template_data?.examinerName || 'Examiner'}
        testDate={selectedTemplate.template_data?.testDate || new Date().toISOString().split('T')[0]}
        onEdit={() => handleEditTemplate(selectedTemplate)}
      />
    );
  }

  // Main return for template list view
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Assessment Templates</h1>
            <p className="text-gray-600 mt-2">Manage and create assessment templates</p>
          </div>
          <button
            onClick={handleCreateTemplate}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Create Template</span>
          </button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">All Types</option>
                <option value="ADHDT2">ADHDT-2</option>
                <option value="ADHT-BSM">ADHT-BSM</option>
                <option value="Aston-Index">Aston Index</option>
                <option value="BKT">BKT</option>
                <option value="Ravens-CPM">Raven's CPM</option>
                <option value="GARS-3">GARS-3</option>
                <option value="Brown-EF-A">Brown EF-A Scale</option>
                <option value="EACA">EACA</option>
                <option value="Nelson-Denny">Nelson-Denny</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Templates List */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(template.type)}
                      <div>
                        <h3 className="font-semibold text-gray-800">{template.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(template.type, template.name)}`}>
                          {template.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewTemplate(template)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="View Template"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditTemplate(template)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      title="Edit Template"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleGenerateReport(template)}
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
                      title="Generate Report"
                    >
                      <FiFileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateTemplate(template)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                      title="Duplicate Template"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTemplate(template)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      title="Delete Template"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;
