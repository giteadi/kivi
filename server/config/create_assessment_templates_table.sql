-- Enhanced Assessment Templates Table Structure
-- Add missing columns for comprehensive template management

-- First, add missing columns to existing kivi_templates table
ALTER TABLE `kivi_templates` 
ADD COLUMN IF NOT EXISTS `category` varchar(100) DEFAULT NULL AFTER `type`,
ADD COLUMN IF NOT EXISTS `icon` varchar(50) DEFAULT NULL AFTER `category`,
ADD COLUMN IF NOT EXISTS `formula_config` longtext DEFAULT NULL AFTER `template_data`,
ADD COLUMN IF NOT EXISTS `scoring_rules` longtext DEFAULT NULL AFTER `formula_config`,
ADD COLUMN IF NOT EXISTS `age_range` varchar(100) DEFAULT NULL AFTER `scoring_rules`,
ADD COLUMN IF NOT EXISTS `languages` json DEFAULT NULL AFTER `age_range`,
ADD COLUMN IF NOT EXISTS `is_active` tinyint(1) DEFAULT 1 AFTER `status`,
ADD COLUMN IF NOT EXISTS `sort_order` int(11) DEFAULT 0 AFTER `is_active`;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category ON kivi_templates(category);
CREATE INDEX IF NOT EXISTS idx_is_active ON kivi_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_sort_order ON kivi_templates(sort_order);

-- Update existing records to set is_active = 1 for active templates
UPDATE kivi_templates SET is_active = 1 WHERE status = 'active';
UPDATE kivi_templates SET is_active = 0 WHERE status = 'inactive';

-- Insert all assessment templates from frontend with proper structure
INSERT INTO `kivi_templates` (`name`, `type`, `category`, `description`, `icon`, `template_data`, `formula_config`, `scoring_rules`, `age_range`, `languages`, `status`, `is_active`, `sort_order`) VALUES 
('ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY', 'RIPA-Primary', 'Cognitive', 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.', '🧠', 
JSON_OBJECT(
  'id', 'RIPA-Primary',
  'name', 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
  'description', 'The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning.',
  'category', 'Cognitive',
  'icon', '🧠',
  'subtests', JSON_ARRAY(
    'Attention', 'Memory', 'Orientation', 'Language', 'Communication', 'Problem Solving', 'Abstract Reasoning'
  ),
  'scoring', JSON_OBJECT(
    'type', 'standardized',
    'range', '1-19',
    'interpretation', JSON_OBJECT(
      '1-5', 'Severe Deficit',
      '6-10', 'Moderate Deficit', 
      '11-14', 'Mild Deficit',
      '15-19', 'Average/Above Average'
    )
  )
),
JSON_OBJECT(
  'compositeScore', JSON_OBJECT(
    'formula', 'SUM(subtest_scores) / COUNT(subtest_scores)',
    'weights', JSON_OBJECT(
      'Attention', 0.15,
      'Memory', 0.20,
      'Orientation', 0.10,
      'Language', 0.25,
      'Communication', 0.15,
      'Problem Solving', 0.10,
      'Abstract Reasoning', 0.05
    )
  )
),
JSON_OBJECT(
  'ageNorms', true,
  'standardScores', true,
  'percentileRanks', true,
  'interpretationRanges', JSON_ARRAY(
    JSON_OBJECT('range', '1-5', 'label', 'Severe Deficit', 'color', '#dc2626'),
    JSON_OBJECT('range', '6-10', 'label', 'Moderate Deficit', 'color', '#f97316'),
    JSON_OBJECT('range', '11-14', 'label', 'Mild Deficit', 'color', '#eab308'),
    JSON_OBJECT('range', '15-19', 'label', 'Average/Above Average', 'color', '#22c55e')
  )
),
'5-12 years', 
JSON_ARRAY('English', 'Hindi'), 
'active', 1, 1),

('ADHD-DSM5 Checklist', 'ADHT-BSM', 'ADHD', 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity', '📋',
JSON_OBJECT(
  'id', 'ADHT-BSM',
  'name', 'ADHD-DSM5 Checklist',
  'description', 'DSM-5 ADHD Checklist with checkbox-based criteria selection for inattention and hyperactivity',
  'category', 'ADHD',
  'icon', '📋',
  'sections', JSON_ARRAY(
    JSON_OBJECT(
      'name', 'Inattention',
      'criteria', JSON_ARRAY(
        'Often fails to give close attention to details',
        'Often has difficulty sustaining attention',
        'Often does not seem to listen when spoken to directly',
        'Often does not follow through on instructions',
        'Often has difficulty organizing tasks',
        'Often avoids tasks requiring sustained mental effort',
        'Often loses things necessary for tasks',
        'Often easily distracted by extraneous stimuli',
        'Often forgetful in daily activities'
      ),
      'requiredForDiagnosis', 6
    ),
    JSON_OBJECT(
      'name', 'Hyperactivity-Impulsivity',
      'criteria', JSON_ARRAY(
        'Often fidgets with or taps hands or feet',
        'Often leaves seat in situations when remaining seated is expected',
        'Often runs about or climbs in inappropriate situations',
        'Often unable to play or engage in leisure activities quietly',
        'Often "on the go" or acts as if "driven by a motor"',
        'Often talks excessively',
        'Often blurts out an answer before question completed',
        'Often has difficulty waiting for turn',
        'Often interrupts or intrudes on others'
      ),
      'requiredForDiagnosis', 6
    )
  )
),
JSON_OBJECT(
  'inattentionScore', JSON_OBJECT('formula', 'COUNT(criteria_checked)', 'max', 9),
  'hyperactivityScore', JSON_OBJECT('formula', 'COUNT(criteria_checked)', 'max', 9),
  'totalScore', JSON_OBJECT('formula', 'inattentionScore + hyperactivityScore', 'max', 18)
),
JSON_OBJECT(
  'diagnosticCriteria', true,
  'ageSpecific', true,
  'crossSetting', true,
  'impairmentRequired', true,
  'interpretation', JSON_OBJECT(
    '0-2', 'Unlikely ADHD',
    '3-5', 'Possible ADHD',
    '6-9', 'Likely ADHD',
    '10+', 'Very Likely ADHD'
  )
),
'4-18 years',
JSON_ARRAY('English', 'Hindi', 'Spanish'),
'active', 1, 2),

('Aston Index Assessment', 'Aston-Index', 'Educational', 'The Aston Index procedures are designed to be used by class teachers, psychologists, and others who wish to identify children with special educational needs.', '📚',
JSON_OBJECT(
  'id', 'Aston-Index',
  'name', 'Aston Index Assessment',
  'description', 'The Aston Index procedures are designed to be used by class teachers, psychologists, and others who wish to identify children with special educational needs.',
  'category', 'Educational',
  'icon', '📚',
  'subtests', JSON_ARRAY(
    'Visual Perception', 'Auditory Perception', 'Motor Skills', 'Language Development', 'Cognitive Skills'
  )
),
JSON_OBJECT(
  'totalScore', JSON_OBJECT('formula', 'SUM(subtest_scores)', 'max', 100),
  'percentileScore', JSON_OBJECT('formula', '(totalScore / 100) * 100')
),
JSON_OBJECT(
  'ageNorms', true,
  'standardScores', true,
  'specialEducationIdentification', true
),
'5-16 years',
JSON_ARRAY('English'),
'active', 1, 3),

('WRAT5-India Blue Form', 'WRAT5', 'Academic', 'Wide Range Achievement Test 5 - India Blue Form for assessing reading, spelling, and math skills', '✏️',
JSON_OBJECT(
  'id', 'WRAT5',
  'name', 'WRAT5-India Blue Form',
  'description', 'Wide Range Achievement Test 5 - India Blue Form for assessing reading, spelling, and math skills',
  'category', 'Academic',
  'icon', '✏️',
  'subtests', JSON_ARRAY(
    'Word Reading', 'Sentence Comprehension', 'Spelling', 'Math Computation'
  )
),
JSON_OBJECT(
  'readingRaw', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 55),
  'spellingRaw', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 42),
  'mathRaw', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 45),
  'compositeRaw', JSON_OBJECT('formula', 'readingRaw + spellingRaw + mathRaw')
),
JSON_OBJECT(
  'standardScores', true,
  'percentileRanks', true,
  'ageEquivalents', true,
  'gradeEquivalents', true,
  'confidenceIntervals', true
),
'5-94 years',
JSON_ARRAY('English'),
'active', 1, 4),

('ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-SECONDARY', 'RIPA-Secondary', 'Cognitive', 'The RIPA-2 is a structured, criterion-referenced test that provides baseline information and can be used to identify cognitive-linguistic deficits in adolescents and adults.', '🧠',
JSON_OBJECT(
  'id', 'RIPA-Secondary',
  'name', 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-SECONDARY',
  'description', 'The RIPA-2 is a structured, criterion-referenced test that provides baseline information and can be used to identify cognitive-linguistic deficits in adolescents and adults.',
  'category', 'Cognitive',
  'icon', '🧠',
  'subtests', JSON_ARRAY(
    'Attention', 'Memory', 'Orientation', 'Language', 'Communication', 'Problem Solving', 'Abstract Reasoning'
  )
),
JSON_OBJECT(
  'compositeScore', JSON_OBJECT('formula', 'SUM(subtest_scores) / COUNT(subtest_scores)')
),
JSON_OBJECT(
  'ageNorms', true,
  'standardScores', true,
  'adolescentAdultNorms', true
),
'13-21 years',
JSON_ARRAY('English'),
'active', 1, 5),

('ADHD Rating Scale-4', 'ADHD-Rating-4', 'ADHD', 'ADHD Rating Scale-4 for assessing attention deficit hyperactivity disorder symptoms', '📊',
JSON_OBJECT(
  'id', 'ADHD-Rating-4',
  'name', 'ADHD Rating Scale-4',
  'description', 'ADHD Rating Scale-4 for assessing attention deficit hyperactivity disorder symptoms',
  'category', 'ADHD',
  'icon', '📊',
  'subscales', JSON_ARRAY('Inattention', 'Hyperactivity/Impulsivity')
),
JSON_OBJECT(
  'inattentionTScore', JSON_OBJECT('formula', 'SUM(inattention_items) * 2 + 40'),
  'hyperactivityTScore', JSON_OBJECT('formula', 'SUM(hyperactivity_items) * 2 + 40'),
  'combinedTScore', JSON_OBJECT('formula', '(inattentionTScore + hyperactivityTScore) / 2')
),
JSON_OBJECT(
  'tScores', true,
  'percentileRanks', true,
  'severityLevels', true
),
'5-18 years',
JSON_ARRAY('English'),
'active', 1, 6),

('Vineland Social Maturity Scale-Indian', 'VSMS-Indian', 'Social', 'Vineland Social Maturity Scale adapted for Indian population to assess social competence', '👥',
JSON_OBJECT(
  'id', 'VSMS-Indian',
  'name', 'Vineland Social Maturity Scale-Indian',
  'description', 'Vineland Social Maturity Scale adapted for Indian population to assess social competence',
  'category', 'Social',
  'icon', '👥',
  'domains', JSON_ARRAY(
    'Self-Help General', 'Self-Help Dressing', 'Self-Help Eating', 'Self-Help Skills',
    'Communication', 'Socialization', 'Occupational Skills', 'Self-Direction'
  )
),
JSON_OBJECT(
  'socialAge', JSON_OBJECT('formula', 'SUM(domain_scores) / 12'),
  'socialQuotient', JSON_OBJECT('formula', '(socialAge / chronologicalAge) * 100')
),
JSON_OBJECT(
  'socialAgeEquivalent', true,
  'socialQuotient', true,
  'indianNorms', true
),
'0-18 years',
JSON_ARRAY('English', 'Hindi'),
'active', 1, 7),

('Gessel Developmental Schedule', 'Gessel-Developmental', 'Developmental', 'Developmental assessment tool for evaluating child development milestones', '👶',
JSON_OBJECT(
  'id', 'Gessel-Developmental',
  'name', 'Gessel Developmental Schedule',
  'description', 'Developmental assessment tool for evaluating child development milestones',
  'category', 'Developmental',
  'icon', '👶',
  'areas', JSON_ARRAY(
    'Motor Behavior', 'Adaptive Behavior', 'Language Behavior', 'Personal-Social Behavior'
  )
),
JSON_OBJECT(
  'developmentalQuotient', JSON_OBJECT('formula', '(developmentalAge / chronologicalAge) * 100')
),
JSON_OBJECT(
  'developmentalAge', true,
  'developmentalQuotient', true,
  'milestoneTracking', true
),
'0-6 years',
JSON_ARRAY('English'),
'active', 1, 8),

('Developmental Test of Visual Perception-2', 'DTVP-2', 'Visual', 'Assesses visual perception and visual-motor integration skills in children', '👁️',
JSON_OBJECT(
  'id', 'DTVP-2',
  'name', 'Developmental Test of Visual Perception-2',
  'description', 'Assesses visual perception and visual-motor integration skills in children',
  'category', 'Visual',
  'icon', '👁️',
  'subtests', JSON_ARRAY(
    'Eye-Hand Coordination', 'Figure-Ground', 'Form Constancy', 'Position in Space',
    'Spatial Relations', 'Visual Closure', 'Visual-Motor Speed', 'Visual-Motor Integration'
  )
),
JSON_OBJECT(
  'visualPerceptionIndex', JSON_OBJECT('formula', 'SUM(visual_subtests) / 5'),
  'visualMotorIndex', JSON_OBJECT('formula', 'SUM(visual_motor_subtests) / 3'),
  'generalVisualPerceptionIndex', JSON_OBJECT('formula', '(visualPerceptionIndex + visualMotorIndex) / 2')
),
JSON_OBJECT(
  'standardScores', true,
  'percentileRanks', true,
  'ageEquivalents', true
),
'4-10 years',
JSON_ARRAY('English'),
'active', 1, 9),

('Bhatia Battery of Performance Tests', 'Bhatia-Battery', 'Cognitive', 'Performance test battery for assessing cognitive abilities in Indian context', '🔋',
JSON_OBJECT(
  'id', 'Bhatia-Battery',
  'name', 'Bhatia Battery of Performance Tests',
  'description', 'Performance test battery for assessing cognitive abilities in Indian context',
  'category', 'Cognitive',
  'icon', '🔋',
  'tests', JSON_ARRAY(
    'Kohs Block Design', 'Alexander Passalong', 'Bender-Gestalt', 'Draw-A-Person',
    'Seguin Form Board', 'Victoria Visual Motor Test'
  )
),
JSON_OBJECT(
  'performanceIQ', JSON_OBJECT('formula', 'SUM(test_scores) / COUNT(test_scores)')
),
JSON_OBJECT(
  'indianNorms', true,
  'performanceIQ', true,
  'nonVerbalAssessment', true
),
'8-18 years',
JSON_ARRAY('English', 'Hindi'),
'active', 1, 10),

('Malin Intelligence Scale', 'Malin-Intelligence', 'Intelligence', 'Indian adaptation of Wechsler Intelligence Scale for Children', '🧩',
JSON_OBJECT(
  'id', 'Malin-Intelligence',
  'name', 'Malin Intelligence Scale',
  'description', 'Indian adaptation of Wechsler Intelligence Scale for Children',
  'category', 'Intelligence',
  'icon', '🧩',
  'subtests', JSON_ARRAY(
    'Information', 'Comprehension', 'Arithmetic', 'Similarities', 'Vocabulary', 'Digit Span',
    'Picture Completion', 'Picture Arrangement', 'Block Design', 'Object Assembly', 'Coding'
  )
),
JSON_OBJECT(
  'verbalIQ', JSON_OBJECT('formula', 'SUM(verbal_subtests) / 6'),
  'performanceIQ', JSON_OBJECT('formula', 'SUM(performance_subtests) / 5'),
  'fullScaleIQ', JSON_OBJECT('formula', '(verbalIQ + performanceIQ) / 2')
),
JSON_OBJECT(
  'verbalIQ', true,
  'performanceIQ', true,
  'fullScaleIQ', true,
  'indianNorms', true
),
'6-16 years',
JSON_ARRAY('English', 'Hindi'),
'active', 1, 11),

('Draw-A-Person Test', 'Draw-A-Person', 'Projective', 'Projective test assessing cognitive development through drawing', '🎨',
JSON_OBJECT(
  'id', 'Draw-A-Person',
  'name', 'Draw-A-Person Test',
  'description', 'Projective test assessing cognitive development through drawing',
  'category', 'Projective',
  'icon', '🎨',
  'elements', JSON_ARRAY(
    'Head', 'Eyes', 'Nose', 'Mouth', 'Body', 'Arms', 'Legs', 'Fingers', 'Clothing', 'Accessories'
  )
),
JSON_OBJECT(
  'developmentalAge', JSON_OBJECT('formula', 'COUNT(expected_elements_present) * 0.5 + 3')
),
JSON_OBJECT(
  'developmentalAge', true,
  'projectiveInterpretation', true,
  'cognitiveAssessment', true
),
'3-15 years',
JSON_ARRAY('English'),
'active', 1, 12),

('Raven Coloured Progressive Matrices', 'Raven-Coloured', 'Intelligence', 'Non-verbal test of observational ability and clear thinking', '🔲',
JSON_OBJECT(
  'id', 'Raven-Coloured',
  'name', 'Raven Coloured Progressive Matrices',
  'description', 'Non-verbal test of observational ability and clear thinking',
  'category', 'Intelligence',
  'icon', '🔲',
  'sets', JSON_ARRAY('A', 'Ab', 'B', 'C', 'D', 'E'),
  'itemsPerSet', 12
),
JSON_OBJECT(
  'rawScore', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 36),
  'percentileRank', JSON_OBJECT('formula', 'LOOKUP(rawScore, norm_table)')
),
JSON_OBJECT(
  'nonVerbalIQ', true,
  'percentileRanks', true,
  'cultureFair', true
),
'5-11 years',
JSON_ARRAY('English', 'Hindi'),
'active', 1, 13),

('Alexander Passalong Test', 'Alexander-Passalong', 'Motor', 'Performance test assessing spatial and motor coordination abilities', '🤲',
JSON_OBJECT(
  'id', 'Alexander-Passalong',
  'name', 'Alexander Passalong Test',
  'description', 'Performance test assessing spatial and motor coordination abilities',
  'category', 'Motor',
  'icon', '🤲',
  'trials', 3
),
JSON_OBJECT(
  'averageTime', JSON_OBJECT('formula', 'SUM(completion_times) / 3'),
  'accuracyScore', JSON_OBJECT('formula', 'SUM(correct_placements) / 3')
),
JSON_OBJECT(
  'motorCoordination', true,
  'spatialAbility', true,
  'timedPerformance', true
),
'8-18 years',
JSON_ARRAY('English'),
'active', 1, 14),

('Differential Aptitude Tests', 'Differential-Aptitude', 'Aptitude', 'Battery of tests measuring various aptitudes and abilities', '📏',
JSON_OBJECT(
  'id', 'Differential-Aptitude',
  'name', 'Differential Aptitude Tests',
  'description', 'Battery of tests measuring various aptitudes and abilities',
  'category', 'Aptitude',
  'icon', '📏',
  'tests', JSON_ARRAY(
    'Verbal Reasoning', 'Numerical Ability', 'Abstract Reasoning', 'Clerical Speed',
    'Mechanical Reasoning', 'Space Relations', 'Language Usage', 'Perceptual Speed'
  )
),
JSON_OBJECT(
  'aptitudeProfile', JSON_OBJECT('formula', 'ARRAY(test_scores)')
),
JSON_OBJECT(
  'careerGuidance', true,
  'aptitudeProfile', true,
  'strengthWeaknessAnalysis', true
),
'12-18 years',
JSON_ARRAY('English'),
'active', 1, 15),

('Kohs Block Design Test', 'Kohs-Block', 'Intelligence', 'Non-verbal intelligence test using colored blocks', '🧱',
JSON_OBJECT(
  'id', 'Kohs-Block',
  'name', 'Kohs Block Design Test',
  'description', 'Non-verbal intelligence test using colored blocks',
  'category', 'Intelligence',
  'icon', '🧱',
  'designs', 16,
  'timeLimit', JSON_OBJECT('perDesign', '2 minutes')
),
JSON_OBJECT(
  'performanceScore', JSON_OBJECT('formula', 'SUM(correct_designs) + TIME_BONUS'),
  'iqEstimate', JSON_OBJECT('formula', 'LOOKUP(performanceScore, iq_table)')
),
JSON_OBJECT(
  'nonVerbalIQ', true,
  'performanceBased', true,
  'timeBonus', true
),
'8-18 years',
JSON_ARRAY('English'),
'active', 1, 16),

('Raven Standard Progressive Matrices', 'Standard-Progressive', 'Intelligence', 'Advanced non-verbal test of analytical reasoning', '🔳',
JSON_OBJECT(
  'id', 'Standard-Progressive',
  'name', 'Raven Standard Progressive Matrices',
  'description', 'Advanced non-verbal test of analytical reasoning',
  'category', 'Intelligence',
  'icon', '🔳',
  'sets', JSON_ARRAY('A', 'B', 'C', 'D', 'E'),
  'itemsPerSet', 12
),
JSON_OBJECT(
  'rawScore', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 60),
  'percentileRank', JSON_OBJECT('formula', 'LOOKUP(rawScore, norm_table)')
),
JSON_OBJECT(
  'nonVerbalIQ', true,
  'percentileRanks', true,
  'analyticalReasoning', true
),
'6-65 years',
JSON_ARRAY('English'),
'active', 1, 17),

('Bender Gestalt Test', 'Bender-Gestalt', 'Visual-Motor', 'Visual-motor gestalt test assessing neurological functioning', '🌀',
JSON_OBJECT(
  'id', 'Bender-Gestalt',
  'name', 'Bender Gestalt Test',
  'description', 'Visual-motor gestalt test assessing neurological functioning',
  'category', 'Visual-Motor',
  'icon', '🌀',
  'figures', 9
),
JSON_OBJECT(
  'developmentalLevel', JSON_OBJECT('formula', 'COUNT(devotional_errors) + COUNT(rotation_errors)')
),
JSON_OBJECT(
  'neurologicalScreening', true,
  'developmentalAssessment', true,
  'visualMotorIntegration', true
),
'5-11 years',
JSON_ARRAY('English'),
'active', 1, 18),

('Goodenough Harris Draw-A-Man Test', 'Goodenough-Harris', 'Projective', 'Drawing test assessing intellectual development', '👤',
JSON_OBJECT(
  'id', 'Goodenough-Harris',
  'name', 'Goodenough Harris Draw-A-Man Test',
  'description', 'Drawing test assessing intellectual development',
  'category', 'Projective',
  'icon', '👤',
  'elements', JSON_ARRAY(
    'Head', 'Eyes', 'Nose', 'Mouth', 'Hair', 'Body', 'Arms', 'Legs', 'Joints', 'Clothing'
  )
),
JSON_OBJECT(
  'mentalAge', JSON_OBJECT('formula', 'COUNT(elements_present) * 0.8 + 3')
),
JSON_OBJECT(
  'mentalAge', true,
  'projectiveInterpretation', true,
  'intellectualAssessment', true
),
'3-15 years',
JSON_ARRAY('English'),
'active', 1, 19),

('Seguin Form Board Test', 'Seguin-Form', 'Motor', 'Performance test assessing form discrimination and motor skills', '🔷',
JSON_OBJECT(
  'id', 'Seguin-Form',
  'name', 'Seguin Form Board Test',
  'description', 'Performance test assessing form discrimination and motor skills',
  'category', 'Motor',
  'icon', '🔷',
  'forms', 10
),
JSON_OBJECT(
  'performanceScore', JSON_OBJECT('formula', 'SUM(correct_placements) + TIME_BONUS')
),
JSON_OBJECT(
  'formDiscrimination', true,
  'motorSkills', true,
  'timedPerformance', true
),
'8-18 years',
JSON_ARRAY('English'),
'active', 1, 20),

('Victoria Visual Motor Test', 'Victoria-Visual', 'Visual-Motor', 'Assesses visual-motor integration and coordination', '👀',
JSON_OBJECT(
  'id', 'Victoria-Visual',
  'name', 'Victoria Visual Motor Test',
  'description', 'Assesses visual-motor integration and coordination',
  'category', 'Visual-Motor',
  'icon', '👀',
  'items', 27
),
JSON_OBJECT(
  'vmiScore', JSON_OBJECT('formula', 'SUM(correct_copies)', 'max', 27)
),
JSON_OBJECT(
  'visualMotorIntegration', true,
  'coordinationAssessment', true
),
'4-18 years',
JSON_ARRAY('English'),
'active', 1, 21),

('P.G.I. Memory Scale', 'Memory-Scale', 'Memory', 'Memory assessment scale for various memory functions', '🧠',
JSON_OBJECT(
  'id', 'Memory-Scale',
  'name', 'P.G.I. Memory Scale',
  'description', 'Memory assessment scale for various memory functions',
  'category', 'Memory',
  'icon', '🧠',
  'subtests', JSON_ARRAY(
    'Remote Memory', 'Recent Memory', 'Retention of Paired Associates', 'Recognition',
    'Immediate Memory', 'Delayed Recall'
  )
),
JSON_OBJECT(
  'memoryQuotient', JSON_OBJECT('formula', 'SUM(subtest_scores) / COUNT(subtests)')
),
JSON_OBJECT(
  'memoryAssessment', true,
  'quotientScore', true,
  'multipleMemoryTypes', true
),
'8-60 years',
JSON_ARRAY('English'),
'active', 1, 22),

('NIMHANS Brain Dysfunction Test', 'NIMHANS-Brain', 'Neuropsychological', 'Comprehensive neuropsychological assessment battery', '🧬',
JSON_OBJECT(
  'id', 'NIMHANS-Brain',
  'name', 'NIMHANS Brain Dysfunction Test',
  'description', 'Comprehensive neuropsychological assessment battery',
  'category', 'Neuropsychological',
  'icon', '🧬',
  'functions', JSON_ARRAY(
    'Attention', 'Memory', 'Executive Function', 'Language', 'Visuospatial', 'Motor'
  )
),
JSON_OBJECT(
  'brainIndex', JSON_OBJECT('formula', 'SUM(function_scores) / COUNT(function_scores)')
),
JSON_OBJECT(
  'neuropsychological', true,
  'comprehensiveBattery', true,
  'indianNorms', true
),
'16-60 years',
JSON_ARRAY('English'),
'active', 1, 23),

('Comprehensive Language Assessment', 'Comprehensive-Language', 'Language', 'Comprehensive battery of tests for diagnosing language difficulties in children', '🗣️',
JSON_OBJECT(
  'id', 'Comprehensive-Language',
  'name', 'Comprehensive Language Assessment',
  'description', 'Comprehensive battery of tests for diagnosing language difficulties in children',
  'category', 'Language',
  'icon', '🗣️',
  'domains', JSON_ARRAY(
    'Receptive Language', 'Expressive Language', 'Pragmatics', 'Phonology', 'Syntax', 'Semantics'
  )
),
JSON_OBJECT(
  'languageQuotient', JSON_OBJECT('formula', 'SUM(domain_scores) / COUNT(domain_scores)')
),
JSON_OBJECT(
  'languageAssessment', true,
  'comprehensiveBattery', true,
  'multipleDomains', true
),
'3-18 years',
JSON_ARRAY('English'),
'active', 1, 24),

('EACA AUTISM ASSESSMENT', 'ADHDT2', 'ADHD', 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring', '📝',
JSON_OBJECT(
  'id', 'ADHDT2',
  'name', 'EACA AUTISM ASSESSMENT',
  'description', 'Attention-Deficit/Hyperactivity Disorder Test-Second Edition with comprehensive scoring',
  'category', 'ADHD',
  'icon', '📝'
),
JSON_OBJECT(
  'adhdIndex', JSON_OBJECT('formula', '(inattentionScore + hyperactivityScore) / 2')
),
JSON_OBJECT(
  'comprehensiveScoring', true,
  'adhdAssessment', true
),
'6-18 years',
JSON_ARRAY('English'),
'active', 1, 25),

('Bender Gestalt Test (BKT)', 'BKT', 'Motor', 'Motor coordination and kinesthetic perception assessment', '✏️',
JSON_OBJECT(
  'id', 'BKT',
  'name', 'Bender Gestalt Test (BKT)',
  'description', 'Motor coordination and kinesthetic perception assessment',
  'category', 'Motor',
  'icon', '✏️',
  'figures', 9
),
JSON_OBJECT(
  'motorScore', JSON_OBJECT('formula', 'SUM(accuracy_scores)')
),
JSON_OBJECT(
  'motorCoordination', true,
  'kinestheticPerception', true
),
'5-11 years',
JSON_ARRAY('English'),
'active', 1, 26),

('Raven\'s Coloured Progressive Matrices', 'Ravens-CPM', 'Cognitive', 'Non-verbal assessment of eductive ability and problem-solving skills', '🧩',
JSON_OBJECT(
  'id', 'Ravens-CPM',
  'name', 'Raven\'s Coloured Progressive Matrices',
  'description', 'Non-verbal assessment of eductive ability and problem-solving skills',
  'category', 'Cognitive',
  'icon', '🧩',
  'sets', JSON_ARRAY('A', 'Ab', 'B', 'C', 'D', 'E'),
  'itemsPerSet', 12
),
JSON_OBJECT(
  'educativeAbility', JSON_OBJECT('formula', 'SUM(correct_answers)', 'max', 36)
),
JSON_OBJECT(
  'nonVerbalReasoning', true,
  'problemSolving', true
),
'5-11 years',
JSON_ARRAY('English'),
'active', 1, 27),

('Gilliam Autism Rating Scale - 3', 'GARS-3', 'Autism', 'Comprehensive assessment tool for identifying autism spectrum disorders', '🧩',
JSON_OBJECT(
  'id', 'GARS-3',
  'name', 'Gilliam Autism Rating Scale - 3',
  'description', 'Comprehensive assessment tool for identifying autism spectrum disorders',
  'category', 'Autism',
  'icon', '🧩',
  'subscales', JSON_ARRAY(
    'Stereotyped Behaviors', 'Communication', 'Social Interaction', 'Developmental Disturbances'
  )
),
JSON_OBJECT(
  'autismIndex', JSON_OBJECT('formula', 'SUM(subscale_scores)')
),
JSON_OBJECT(
  'autismAssessment', true,
  'comprehensiveRating', true
),
'3-22 years',
JSON_ARRAY('English'),
'active', 1, 28),

('Brown Executive Function/Attention Scales', 'Brown-EF-A', 'Executive', 'Comprehensive assessment of executive function and attention processes', '🧠',
JSON_OBJECT(
  'id', 'Brown-EF-A',
  'name', 'Brown Executive Function/Attention Scales',
  'description', 'Comprehensive assessment of executive function and attention processes',
  'category', 'Executive',
  'icon', '🧠',
  'clusters', JSON_ARRAY(
    'Activation', 'Focus', 'Effort', 'Emotion', 'Memory', 'Action'
  )
),
JSON_OBJECT(
  'executiveFunctionIndex', JSON_OBJECT('formula', 'SUM(cluster_scores)')
),
JSON_OBJECT(
  'executiveFunction', true,
  'attentionAssessment', true
),
'3-18 years',
JSON_ARRAY('English'),
'active', 1, 29),

('Early Academic Competency Assessment', 'EACA', 'Academic', 'Comprehensive screening tool for early academic skills and school readiness', '📚',
JSON_OBJECT(
  'id', 'EACA',
  'name', 'Early Academic Competency Assessment',
  'description', 'Comprehensive screening tool for early academic skills and school readiness',
  'category', 'Academic',
  'icon', '📚',
  'domains', JSON_ARRAY(
    'Pre-Reading', 'Pre-Writing', 'Mathematics', 'Language', 'Social Skills'
  )
),
JSON_OBJECT(
  'readinessIndex', JSON_OBJECT('formula', 'SUM(domain_scores)')
),
JSON_OBJECT(
  'schoolReadiness', true,
  'earlyAcademic', true
),
'4-6 years',
JSON_ARRAY('English'),
'active', 1, 30),

('Educational Assessment of Children with Autism (EACA)', 'EACA-Autism', 'Autism', 'Comprehensive assessment of children with autism focusing on the triad of impairments across 7 domains', '🧩',
JSON_OBJECT(
  'id', 'EACA-Autism',
  'name', 'Educational Assessment of Children with Autism (EACA)',
  'description', 'Comprehensive assessment of children with autism focusing on the triad of impairments across 7 domains',
  'category', 'Autism',
  'icon', '🧩',
  'domains', JSON_ARRAY(
    'Social Interaction', 'Communication', 'Imagination', 'Behavior', 'Cognition', 'Sensory', 'Motor'
  )
),
JSON_OBJECT(
  'autismSeverity', JSON_OBJECT('formula', 'SUM(domain_scores)')
),
JSON_OBJECT(
  'autismAssessment', true,
  'educationalFocus', true
),
'3-18 years',
JSON_ARRAY('English'),
'active', 1, 31),

('Nelson-Denny Reading Test', 'Nelson-Denny', 'Reading', 'Comprehensive assessment of reading comprehension, vocabulary, and reading rate', '📖',
JSON_OBJECT(
  'id', 'Nelson-Denny',
  'name', 'Nelson-Denny Reading Test',
  'description', 'Comprehensive assessment of reading comprehension, vocabulary, and reading rate',
  'category', 'Reading',
  'icon', '📖',
  'subtests', JSON_ARRAY(
    'Vocabulary', 'Comprehension', 'Reading Rate'
  )
),
JSON_OBJECT(
  'readingIndex', JSON_OBJECT('formula', 'SUM(subtest_scores)')
),
JSON_OBJECT(
  'readingAssessment', true,
  'comprehensiveBattery', true
),
'9-18 years',
JSON_ARRAY('English'),
'active', 1, 32),

('TEST OF AUDITORY PROCESSING SKILLS-TAPS-3', 'TAPS-3', 'Auditory', 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion', '👂',
JSON_OBJECT(
  'id', 'TAPS-3',
  'name', 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
  'description', 'Comprehensive auditory processing assessment for phonological skills, memory abilities, and auditory cohesion',
  'category', 'Auditory',
  'icon', '👂',
  'subtests', JSON_ARRAY(
    'Phonological Awareness', 'Phonemic Awareness', 'Memory', 'Cohesion'
  )
),
JSON_OBJECT(
  'auditoryProcessingIndex', JSON_OBJECT('formula', 'SUM(subtest_scores)')
),
JSON_OBJECT(
  'auditoryProcessing', true,
  'phonologicalSkills', true
),
'4-18 years',
JSON_ARRAY('English'),
'active', 1, 33),

('TEST OF WRITTEN LANGUAGE (TOWL-4)', 'TOWL-4', 'Writing', 'The TOWL-4 is a norm-referenced, reliable, and valid test of written language measuring seven skill areas and three composite scores.', '✍️',
JSON_OBJECT(
  'id', 'TOWL-4',
  'name', 'TEST OF WRITTEN LANGUAGE (TOWL-4)',
  'description', 'The TOWL-4 is a norm-referenced, reliable, and valid test of written language measuring seven skill areas and three composite scores.',
  'category', 'Writing',
  'icon', '✍️',
  'subtests', JSON_ARRAY(
    'Vocabulary', 'Spelling', 'Punctuation', 'Logical Sentences', 'Sentence Combining', 'Paragraph Writing'
  )
),
JSON_OBJECT(
  'writtenLanguageIndex', JSON_OBJECT('formula', 'SUM(subtest_scores)')
),
JSON_OBJECT(
  'writingAssessment', true,
  'normReferenced', true
),
'9-18 years',
JSON_ARRAY('English'),
'active', 1, 34),

('VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3', 'VABS-3', 'Behavior', 'Individual assessment of adaptive behaviour measuring day-to-day activities necessary for self-care and social interaction.', '👥',
JSON_OBJECT(
  'id', 'VABS-3',
  'name', 'VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3',
  'description', 'Individual assessment of adaptive behaviour measuring day-to-day activities necessary for self-care and social interaction.',
  'category', 'Behavior',
  'icon', '👥',
  'domains', JSON_ARRAY(
    'Communication', 'Daily Living Skills', 'Socialization', 'Motor Skills', 'Adaptive Behavior'
  )
),
JSON_OBJECT(
  'adaptiveBehaviorIndex', JSON_OBJECT('formula', 'SUM(domain_scores)')
),
JSON_OBJECT(
  'adaptiveBehavior', true,
  'dailyLiving', true
),
'0-90 years',
JSON_ARRAY('English'),
'active', 1, 35),

('WECHSLER\'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India', 'WISC-4', 'Intelligence', 'Norm-referenced, individually administered test of intelligence for children with verbal and performance subtests.', '🧠',
JSON_OBJECT(
  'id', 'WISC-4',
  'name', 'WECHSLER\'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India',
  'description', 'Norm-referenced, individually administered test of intelligence for children with verbal and performance subtests.',
  'category', 'Intelligence',
  'icon', '🧠',
  'subtests', JSON_ARRAY(
    'Similarities', 'Vocabulary', 'Comprehension', 'Information', 'Word Reasoning', 'Digit Span',
    'Letter-Number Sequencing', 'Coding', 'Symbol Search', 'Block Design', 'Picture Concepts', 'Matrix Reasoning'
  )
),
JSON_OBJECT(
  'verbalComprehension', JSON_OBJECT('formula', 'SUM(verbal_subtests) / 5'),
  'perceptualReasoning', JSON_OBJECT('formula', 'SUM(perceptual_subtests) / 3'),
  'workingMemory', JSON_OBJECT('formula', 'SUM(working_memory_subtests) / 2'),
  'processingSpeed', JSON_OBJECT('formula', 'SUM(processing_speed_subtests) / 2'),
  'fullScaleIQ', JSON_OBJECT('formula', '(verbalComprehension + perceptualReasoning + workingMemory + processingSpeed) / 4')
),
JSON_OBJECT(
  'intelligenceAssessment', true,
  'indianNorms', true,
  'comprehensiveBattery', true
),
'6-16 years',
JSON_ARRAY('English'),
'active', 1, 36),

('WJ-III - TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY', 'WJ-3', 'Achievement', 'Norm-referenced individually administered tests measuring academic achievement across reading, math, and writing.', '📊',
JSON_OBJECT(
  'id', 'WJ-3',
  'name', 'WJ-III - TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY',
  'description', 'Norm-referenced individually administered tests measuring academic achievement across reading, math, and writing.',
  'category', 'Achievement',
  'icon', '📊',
  'clusters', JSON_ARRAY(
    'Broad Reading', 'Broad Math', 'Broad Written Language', 'Oral Expression', 'Listening Comprehension'
  )
),
JSON_OBJECT(
  'achievementIndex', JSON_OBJECT('formula', 'SUM(cluster_scores)')
),
JSON_OBJECT(
  'academicAchievement', true,
  'normReferenced', true
),
'2-90 years',
JSON_ARRAY('English'),
'active', 1, 37),

('WOODCOCK-JOHNSON TESTS OF COGNITIVE ABILITIES IV (WJ-Cog)', 'WJ-Cog', 'Cognitive', '18 tests measuring different aspects of cognitive ability based on CHC theory, with cluster scores for interpretative purposes.', '🧠',
JSON_OBJECT(
  'id', 'WJ-Cog',
  'name', 'WOODCOCK-JOHNSON TESTS OF COGNITIVE ABILITIES IV (WJ-Cog)',
  'description', '18 tests measuring different aspects of cognitive ability based on CHC theory, with cluster scores for interpretative purposes.',
  'category', 'Cognitive',
  'icon', '🧠',
  'clusters', JSON_ARRAY(
    'Comprehension-Knowledge', 'Long-Term Retrieval', 'Visual-Spatial Thinking', 'Auditory Processing',
    'Processing Speed', 'Short-Term Memory', 'Fluid Reasoning', 'Quantitative Reasoning'
  )
),
JSON_OBJECT(
  'cognitiveIndex', JSON_OBJECT('formula', 'SUM(cluster_scores)')
),
JSON_OBJECT(
  'cognitiveAbilities', true,
  'CHCTheory', true
),
'2-90 years',
JSON_ARRAY('English'),
'active', 1, 38),

('WOODCOCK JOHNSON IV TESTS OF ACHIEVEMENT (WJ-Ach)', 'WJ-Ach', 'Achievement', 'Comprehensive set of individually administered tests to measure educational achievement in reading, mathematics, written language, and academic skills.', '📚',
JSON_OBJECT(
  'id', 'WJ-Ach',
  'name', 'WOODCOCK JOHNSON IV TESTS OF ACHIEVEMENT (WJ-Ach)',
  'description', 'Comprehensive set of individually administered tests to measure educational achievement in reading, mathematics, written language, and academic skills.',
  'category', 'Achievement',
  'icon', '📚',
  'clusters', JSON_ARRAY(
    'Basic Reading Skills', 'Reading Comprehension', 'Broad Reading', 'Math Calculation Skills',
    'Math Problem Solving', 'Broad Mathematics', 'Written Expression', 'Broad Written Language'
  )
),
JSON_OBJECT(
  'achievementIndex', JSON_OBJECT('formula', 'SUM(cluster_scores)')
),
JSON_OBJECT(
  'academicAchievement', true,
  'comprehensiveBattery', true
),
'2-90 years',
JSON_ARRAY('English'),
'active', 1, 39),

('WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)', 'WRAT5', 'Achievement', 'Norm-referenced test measuring basic academic skills of word reading, sentence comprehension, spelling, and math computation.', '📝',
JSON_OBJECT(
  'id', 'WRAT5',
  'name', 'WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)',
  'description', 'Norm-referenced test measuring basic academic skills of word reading, sentence comprehension, spelling, and math computation.',
  'category', 'Achievement',
  'icon', '📝',
  'subtests', JSON_ARRAY(
    'Word Reading', 'Sentence Comprehension', 'Spelling', 'Math Computation'
  )
),
JSON_OBJECT(
  'basicSkillsIndex', JSON_OBJECT('formula', 'SUM(subtest_scores)')
),
JSON_OBJECT(
  'basicAcademicSkills', true,
  'normReferenced', true
),
'5-94 years',
JSON_ARRAY('English'),
'active', 1, 40),

('WOODCOCK READING MASTERY TESTS-II (WRMT-II)', 'WRMT2', 'Reading', 'Individually administered, timed tests measuring Basic Skills, Reading Comprehension, Oral Reading Fluency and Listening Comprehension.', '📖',
JSON_OBJECT(
  'id', 'WRMT2',
  'name', 'WOODCOCK READING MASTERY TESTS-II (WRMT-II)',
  'description', 'Individually administered, timed tests measuring Basic Skills, Reading Comprehension, Oral Reading Fluency and Listening Comprehension.',
  'category', 'Reading',
  'icon', '📖',
  'subtests', JSON_ARRAY(
    'Visual-Auditory Learning', 'Letter Identification', 'Word Identification', 'Word Attack',
    'Word Comprehension', 'Passage Comprehension', 'Oral Reading Fluency'
  )
),
JSON_OBJECT(
  'readingMasteryIndex', JSON_OBJECT('formula', 'SUM(subtest_scores)')
),
JSON_OBJECT(
  'readingMastery', true,
  'timedTests', true
),
'5-75 years',
JSON_ARRAY('English'),
'active', 1, 41),

('DIAGNOSTIC ASSESSMENT REPORT', 'DiagnosticReport', 'Diagnostic', 'Comprehensive diagnostic assessment report based on DSM-5 criteria and standardized test results.', '🧠',
JSON_OBJECT(
  'id', 'DiagnosticReport',
  'name', 'DIAGNOSTIC ASSESSMENT REPORT',
  'description', 'Comprehensive diagnostic assessment report based on DSM-5 criteria and standardized test results.',
  'category', 'Diagnostic',
  'icon', '🧠',
  'sections', JSON_ARRAY(
    'Client Information', 'Background History', 'Assessment Results', 'Diagnostic Impressions',
    'Recommendations', 'Prognosis'
  )
),
JSON_OBJECT(
  'diagnosticSummary', JSON_OBJECT('formula', 'CONCATENATE(assessment_results, diagnostic_impressions)')
),
JSON_OBJECT(
  'diagnosticReport', true,
  'dsm5Criteria', true
),
'All ages',
JSON_ARRAY('English'),
'active', 1, 42),

('SUMMARY OF EVALUATION', 'EvaluationSummary', 'Summary', 'Comprehensive summary of evaluation results across multiple assessment instruments including WJ-IV COG, WJ-IV ACH, and Brown\'s EF/A Scale.', '📊',
JSON_OBJECT(
  'id', 'EvaluationSummary',
  'name', 'SUMMARY OF EVALUATION',
  'description', 'Comprehensive summary of evaluation results across multiple assessment instruments including WJ-IV COG, WJ-IV ACH, and Brown\'s EF/A Scale.',
  'category', 'Summary',
  'icon', '📊',
  'instruments', JSON_ARRAY(
    'WJ-IV COG', 'WJ-IV ACH', 'Brown EF/A Scale'
  )
),
JSON_OBJECT(
  'evaluationSummary', JSON_OBJECT('formula', 'AGGREGATE(instrument_results)')
),
JSON_OBJECT(
  'comprehensiveSummary', true,
  'multiInstrument', true
),
'All ages',
JSON_ARRAY('English'),
'active', 1, 43);

-- Show summary of inserted templates
SELECT 
  COUNT(*) as total_templates,
  COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_templates,
  GROUP_CONCAT(DISTINCT category ORDER BY category) as categories
FROM kivi_templates 
WHERE type IN ('RIPA-Primary', 'ADHT-BSM', 'Aston-Index', 'WRAT5', 'RIPA-Secondary', 'ADHD-Rating-4', 'VSMS-Indian', 'Gessel-Developmental', 'DTVP-2', 'Bhatia-Battery', 'Malin-Intelligence', 'Draw-A-Person', 'Raven-Coloured', 'Alexander-Passalong', 'Differential-Aptitude', 'Kohs-Block', 'Standard-Progressive', 'Bender-Gestalt', 'Goodenough-Harris', 'Seguin-Form', 'Victoria-Visual', 'Memory-Scale', 'NIMHANS-Brain', 'Comprehensive-Language', 'ADHDT2', 'BKT', 'Ravens-CPM', 'GARS-3', 'Brown-EF-A', 'EACA', 'EACA-Autism', 'Nelson-Denny', 'TAPS-3', 'TOWL-4', 'VABS-3', 'WISC-4', 'WJ-3', 'WJ-Cog', 'WJ-Ach', 'WRAT5', 'WRMT2', 'DiagnosticReport', 'EvaluationSummary');
