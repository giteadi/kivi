import React, { useState } from 'react';
import { FiDownload, FiFileText, FiEye, FiEdit3 } from 'react-icons/fi';

const AssessmentReportGenerator = ({ 
  template, 
  studentName, 
  examinerName, 
  testDate,
  onEdit 
}) => {
  const [activeTab, setActiveTab] = useState('report');
  const [showFormulas, setShowFormulas] = useState(false);

  // Generate report based on template type
  const generateReport = () => {
    switch (template.type) {
      case 'ADHDT2':
        return generateADHDT2Report(template);
      case 'ADHT-BSM':
        return generateADHTBSMReport();
      case 'Aston-Index':
        return generateAstonIndexReport();
      case 'BKT':
        return generateBKTReport(template);
      case 'Ravens-CPM':
        return generateRavensCPMReport(template);
      case 'GARS-3':
        return generateGARS3Report(template);
      case 'Brown-EF-A':
        return generateBrownEFAScaleReport(template);
      case 'EACA':
        return generateEACAReport(template);
      case 'Nelson-Denny':
        return generateNelsonDennyReport(template);
      case 'TAPS-3':
        return generateTAPS3Report(template);
      case 'RIPA-Primary':
        return generateRIPAPrimaryReport(template);
      default:
        return generateADHDT2Report(template);
    }
  };

  // ADHDT-2 Specific Report with Formulas
  const generateADHDT2Report = (template) => {
    const subscales = template.subscales || [];
    const inattention = subscales.find(s => s.name === 'Inattention');
    const hyperactivity = subscales.find(s => s.name === 'Hyperactivity/Impulsivity');
    
    const adhdIndex = template.adhdIndex || 0;
    
    let adhdLikelihood = '';
    if (adhdIndex >= 90) adhdLikelihood = 'Very High';
    else if (adhdIndex >= 80) adhdLikelihood = 'High';
    else if (adhdIndex >= 70) adhdLikelihood = 'Moderate';
    else if (adhdIndex >= 60) adhdLikelihood = 'Low';
    else adhdLikelihood = 'Very Low';

    return {
      title: 'ADHDT-2 Assessment Report',
      formulas: [
        { name: 'ADHD Index', formula: 'Inattention Standard Score + Hyperactivity/Impulsivity Standard Score', description: 'Combined subscale standard scores' },
        { name: 'Standard Score', formula: 'Raw Score → T-Score (Mean=50, SD=10)', description: 'Normalized score based on normative data' },
        { name: 'Percentile Rank', formula: 'Based on Age/Gender Normative Data', description: 'Position relative to same-age/gender peers' },
        { name: 'ADHD Likelihood', formula: 'Very High (≥90), High (80-89), Moderate (70-79), Low (60-69), Very Low (<60)', description: 'Classification based on ADHD Index' },
        { name: 'DSM-5 Criteria', formula: 'Based on Diagnostic and Statistical Manual of Mental Disorders, 5th Edition', description: 'Diagnostic framework used' },
        { name: 'Norm-Referenced', formula: 'Scores compared to standardized sample population', description: 'Standardization basis' }
      ],
      analysis: {
        adhdIndex,
        adhdLikelihood,
        inattentionScore: inattention?.rawScore || 0,
        hyperactivityScore: hyperactivity?.rawScore || 0,
        inattentionPercentile: inattention?.percentileRank || 0,
        hyperactivityPercentile: hyperactivity?.percentileRank || 0
      },
      interpretation: `ATTENTION-DEFICIT / HYPERACTIVITY DISORDER TEST-ADHDT-2

The Attention-Deficit/Hyperactivity Disorder Test-Second Edition (ADHDT-2) is a norm-referenced screening test used to identify persons who have attention-deficit/hyperactivity disorder (ADHDT). It is designed to identify individuals who present severe behavioral problems that may be indicative of ADHD. Its content is based on the definition of ADHD from the DSM-5.

TEST RESULTS
Remark: The scores imply it is '${adhdLikelihood.toLowerCase()}' that ${template.studentName || 'the student'} has symptoms of ADHD.

It must be noted that this checklist cannot be fully endorsed by the tester, as she is in a one-to-one situation, and many of these behaviors cannot be evaluated in that situation. The scores above are those reported by his mother after being given insight by the tester. They can be used as a rough guide for indicators.

ADHD Index: ${adhdIndex}
Inattention Subscale: ${inattention?.rawScore} (Percentile: ${inattention?.percentileRank})
Hyperactivity/Impulsivity Subscale: ${hyperactivity?.rawScore} (Percentile: ${hyperactivity?.percentileRank})

The assessment indicates ${adhdLikelihood.toLowerCase()} likelihood of ADHD based on the combined subscale scores. The Inattention subscale score suggests ${inattention?.percentileRank >= 90 ? 'severe' : inattention?.percentileRank >= 80 ? 'significant' : inattention?.percentileRank >= 70 ? 'moderate' : 'mild'} difficulties in maintaining attention, while the Hyperactivity/Impulsivity subscale indicates ${hyperactivity?.percentileRank >= 90 ? 'severe' : hyperactivity?.percentileRank >= 80 ? 'significant' : hyperactivity?.percentileRank >= 70 ? 'moderate' : 'mild'} problems with impulse control and activity regulation.

These results should be considered in conjunction with other assessment tools and clinical observations for a comprehensive ADHD evaluation.`
    };
  };

  // ADHT-BSM DSM-5 Report with Criteria Analysis
  const generateADHTBSMReport = () => {
    const inattentionCriteria = template.inattentionCriteria || [];
    const hyperactivityCriteria = template.hyperactivityCriteria || [];
    
    const inattentionChecked = inattentionCriteria.filter(c => c.checked).length;
    const hyperactivityChecked = hyperactivityCriteria.filter(c => c.checked).length;
    
    const inattentionMet = inattentionChecked >= 6;
    const hyperactivityMet = hyperactivityChecked >= 6;
    
    let diagnosis = '';
    if (inattentionMet && hyperactivityMet) {
      diagnosis = 'Combined Presentation (Both Inattention and Hyperactivity/Impulsivity)';
    } else if (inattentionMet) {
      diagnosis = 'Predominantly Inattentive Presentation';
    } else if (hyperactivityMet) {
      diagnosis = 'Predominantly Hyperactive/Impulsive Presentation';
    } else {
      diagnosis = 'Insufficient Symptoms for ADHD Diagnosis';
    }

    return {
      title: 'ADHD-DSM 5 Assessment Report',
      formulas: [
        { name: 'DSM-5 Criteria', formula: '≥6 symptoms from either category required for diagnosis', description: 'Minimum symptom threshold' },
        { name: 'Symptom Duration', formula: 'Must be present for ≥6 months', description: 'Temporal requirement' },
        { name: 'Age of Onset', formula: 'Several symptoms present before age 12', description: 'Developmental onset criterion' },
        { name: 'Setting Requirement', formula: 'Symptoms present in ≥2 settings (home, school, work)', description: 'Cross-situational pervasiveness' },
        { name: 'Impairment', formula: 'Symptoms interfere with social, academic, or occupational functioning', description: 'Functional impact criterion' },
        { name: 'Diagnosis Types', formula: 'Combined, Predominantly Inattentive, Predominantly Hyperactive/Impulsive', description: 'DSM-5 presentation specifiers' }
      ],
      analysis: {
        inattentionChecked,
        hyperactivityChecked,
        inattentionMet,
        hyperactivityMet,
        totalInattention: inattentionCriteria.length,
        totalHyperactivity: hyperactivityCriteria.length,
        diagnosis
      },
      interpretation: `ATTENTION-DEFICIT/HYPERACTIVITY DISORDER - DSM 5 CHECKLIST
ADHD DSM-5 Criteria-Parent Completion (American Psychiatric Association, 2013)

INATTENTION
(Only behaviours occurring for 6 months or more are ticked)

A1 Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities.
A2 Often has difficulty sustaining attention in tasks or play activities.
A3 Often does not seem to listen when spoken to directly.
A4 Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace.
A5 Often has difficulty organizing tasks and activities.
A6 Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort.
A7 Often loses things necessary for tasks or activities.
A8 Often is easily distracted by extraneous stimuli.
A9 Often is forgetful in daily activities.

INATTENTION TOTAL: ${inattentionChecked} out of 9

HYPERACTIVITY AND IMPULSIVITY
(Only behaviours occurring for 6 months or more are ticked)

A1 Often fidgets with or taps hands or feet or squirms in seat.
A2 Often leaves seat in situations when remaining seated is expected.
A3 Often runs about or climbs in situations where it is inappropriate.
A4 Often unable to play or engage in leisure activities quietly.
A5 Is often "on the go" or often acts as if "driven by a motor".
A6 Often talks excessively.
A7 Often blurts out an answer before a question has been completed.
A8 Often has difficulty waiting his or her turn.
A9 Often interrupts or intrudes on others.

HYPERACTIVITY AND IMPULSIVITY TOTAL: ${hyperactivityChecked} out of 9

DIAGNOSTIC IMPRESSION:
Based on DSM-5 criteria, ${template.studentName || 'the student'} exhibits ${inattentionChecked} inattention symptoms and ${hyperactivityChecked} hyperactivity/impulsivity symptoms.

${inattentionMet ? '✓' : '✗'} Meets criteria for Inattention (≥6 symptoms required)
${hyperactivityMet ? '✓' : '✗'} Meets criteria for Hyperactivity/Impulsivity (≥6 symptoms required)

DIAGNOSIS: ${diagnosis}

This assessment indicates ${diagnosis === 'Insufficient Symptoms for ADHD Diagnosis' ? 'insufficient symptoms for ADHD diagnosis' : 'symptoms consistent with ' + diagnosis.toLowerCase()}. These findings should be considered in the context of the individual's developmental level, academic performance, and functioning across multiple settings. A comprehensive evaluation including clinical interview, behavioral observations, and additional assessment measures is recommended for definitive diagnosis.`
    };
  };

  // Aston Index Report with Age Equivalents
  const generateAstonIndexReport = () => {
    const generalAbility = template.generalUnderlyingAbility || [];
    
    const calculateMentalAge = (score) => {
      if (!score) return 0;
      if (score.includes('4 years')) return 4;
      if (score.includes('5/6 years')) return 5.5;
      if (score.includes('years')) return parseInt(score) || 0;
      return parseInt(score) || 0;
    };

    const mentalAges = generalAbility.map(item => ({
      test: item.test,
      score: item.score,
      mentalAge: calculateMentalAge(item.score)
    }));

    const averageMentalAge = mentalAges.length > 0
      ? mentalAges.reduce((sum, item) => sum + item.mentalAge, 0) / mentalAges.length
      : 0;
    
    const chronologicalAge = 8;
    const discrepancy = chronologicalAge - averageMentalAge;
    
    let interpretationLevel = '';
    if (discrepancy > 2) interpretationLevel = 'Significant Delay';
    else if (discrepancy > 1) interpretationLevel = 'Mild Delay';
    else interpretationLevel = 'Age Appropriate';

    return {
      title: 'Aston Index Assessment Report',
      formulas: [
        { name: 'Mental Age Calculation', formula: 'Raw Score → Age Equivalent based on normative data', description: 'Converts raw scores to developmental age equivalents' },
        { name: 'Discrepancy Analysis', formula: 'Chronological Age - Mental Age', description: 'Gap between expected and observed development' },
        { name: 'Developmental Classification', formula: 'Significant Delay (>2 years), Mild Delay (1-2 years), Age Appropriate (<1 year)', description: 'Categorization based on discrepancy score' },
        { name: 'Performance Items', formula: 'Scoring based on accuracy and developmental appropriateness', description: 'Qualitative and quantitative scoring' },
        { name: 'Language Assessment', formula: 'Vocabulary, reading, spelling, and phonological skills', description: 'Key language domains assessed' }
      ],
      analysis: {
        averageMentalAge: averageMentalAge.toFixed(1),
        chronologicalAge,
        discrepancy: discrepancy.toFixed(1),
        interpretationLevel,
        mentalAges
      },
      interpretation: `1. ASTON INDEX

The Aston Index is a comprehensive battery of testing and diagnosing language difficulties. The index identifies children with special educational needs, language difficulties, auditory and visual perception difficulties, reading and spelling difficulties. The Aston Index contains 16 tests which help to measure the child's general underlying ability and attainment with reference to the child's mental age. It also examines the pupil's strengths and weaknesses in visual aid and auditory discrimination, motor co-ordination, written language, reading and spelling.

TEST RESULTS-(Level-1)

I. GENERAL UNDERLYING ABILITY AND ATTAINMENT

1. Picture Recognition - ${generalAbility.find(item => item.test === 'Picture Recognition')?.score || 'NA'}
2. Vocabulary - ${generalAbility.find(item => item.test === 'Vocabulary')?.score || 'NA'}
3. Good-enough draw-a-man - ${generalAbility.find(item => item.test === 'Good-enough draw-a-man')?.score || 'NA'}
4. Copying geometric designs - ${generalAbility.find(item => item.test === 'Copying geometric designs')?.score || 'NA'}
5. Grapheme-Phoneme correspondence - ${generalAbility.find(item => item.test === 'Grapheme-Phoneme correspondence')?.score || 'NA'}
6. Schonell's reading test - ${generalAbility.find(item => item.test === "Schonell's reading test")?.score || 'NA'}
7. Schonell's spelling test - ${generalAbility.find(item => item.test === "Schonell's spelling test")?.score || 'NA'}
8. Visual discrimination test - ${generalAbility.find(item => item.test === 'Visual discrimination test')?.score || 'NA'}

II. PERFORMANCE ITEMS

1. Child's laterality - ${template.performanceItems?.find(item => item.test === "Child's laterality")?.score || 'NA'}
2. Copying name - ${template.performanceItems?.find(item => item.test === 'Copying name')?.score || 'NA'}
3. Free writing - ${template.performanceItems?.find(item => item.test === 'Free writing')?.score || 'NA'}
4. Visual sequential memory (pictorial) - ${template.performanceItems?.find(item => item.test === 'Visual sequential memory (pictorial)')?.score || 'NA'}
5. Auditory sequential memory - ${template.performanceItems?.find(item => item.test === 'Auditory sequential memory')?.score || 'NA'}
6. Sound Blending - ${template.performanceItems?.find(item => item.test === 'Sound Blending')?.score || 'NA'}
7. Visual Sequential memory (symbolic) - ${template.performanceItems?.find(item => item.test === 'Visual Sequential memory (symbolic)')?.score || 'NA'}
8. Sound discrimination - ${template.performanceItems?.find(item => item.test === 'Sound discrimination')?.score || 'NA'}
9. Grapho-motor test - ${template.performanceItems?.find(item => item.test === 'Grapho-motor test')?.score || 'NA'}

INTERPRETATION:

General Underlying Ability and Attainment

1. Picture Recognition - ${template.studentName || 'The student'} was able to recognize and give names of ${generalAbility.find(item => item.test === 'Picture Recognition')?.score || 'NA'} pictures and was able to tag common objects in the environment.

2. Vocabulary - ${template.studentName || 'The student'}'s vocabulary was equivalent to that of a ${generalAbility.find(item => item.test === 'Vocabulary')?.score || 'NA'} child.

3. Good-enough draw-a-man test - ${template.studentName || 'The student'}'s mental age was found to be ${generalAbility.find(item => item.test === 'Good-enough draw-a-man')?.score || 'NA'} which is ${chronologicalAge > averageMentalAge ? 'lower than' : 'appropriate for'} chronological age.

4. Copying Geometric designs - ${template.studentName || 'The student'} was able to copy geometric designs with ${generalAbility.find(item => item.test === 'Copying geometric designs')?.score || 'NA'} level performance.

5. Grapheme-Phoneme correspondence - ${generalAbility.find(item => item.test === 'Grapheme-Phoneme correspondence')?.score || 'Could identify the uppercase and lower case letter, but could not say the individual specific sounds.'}

6. Schonell's reading test - ${generalAbility.find(item => item.test === "Schonell's reading test")?.score || 'NA'}

7. Schonell's spelling test - ${generalAbility.find(item => item.test === "Schonell's spelling test")?.score || 'NA'}

8. Visual discrimination test - ${generalAbility.find(item => item.test === 'Visual discrimination test')?.score || 'NA'}

Overall Assessment

The average mental age equivalent is ${averageMentalAge.toFixed(1)} years compared to chronological age of ${chronologicalAge} years, indicating a ${interpretationLevel}. This assessment suggests ${discrepancy > 2 ? 'significant developmental delays requiring comprehensive intervention and support services' : discrepancy > 1 ? 'mild delays that may benefit from targeted support' : 'age-appropriate development with typical academic potential'}.`
    };
  };

  // BKT Report with Motor Coordination Analysis
  const generateBKTReport = (template) => {
    const grossMotorSkills = template.grossMotorSkills || [];
    const fineMotorSkills = template.fineMotorSkills || [];
    const bodyAwareness = template.bodyAwareness || [];
    
    const grossScore = grossMotorSkills.reduce((sum, item) => sum + (parseInt(item.score) || 0), 0);
    const fineScore = fineMotorSkills.reduce((sum, item) => sum + (parseInt(item.score) || 0), 0);
    const bodyScore = bodyAwareness.reduce((sum, item) => sum + (parseInt(item.score) || 0), 0);
    const totalScore = grossScore + fineScore + bodyScore;
    const maxScore = (grossMotorSkills.length + fineMotorSkills.length + bodyAwareness.length) * 10;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    
    let developmentLevel = '';
    if (percentage >= 85) developmentLevel = 'Excellent';
    else if (percentage >= 70) developmentLevel = 'Good';
    else if (percentage >= 55) developmentLevel = 'Average';
    else if (percentage >= 40) developmentLevel = 'Below Average';
    else developmentLevel = 'Needs Improvement';
    
    return {
      title: 'Basic Kinesthetic Test Assessment Report',
      formulas: [
        { name: 'BINET KAMATH TEST OF INTELLIGENCE', formula: 'Mental Age Calculation: Raw Score → Mental Age (months)', description: 'Converts performance to mental age equivalent' },
        { name: 'Intelligence Quotient', formula: 'I.Q. = (Mental Age ÷ Chronological Age) × 100', description: 'Standard IQ formula' },
        { name: 'Basal Age', formula: 'Level at which all test items are passed', description: 'Starting point of measurement' },
        { name: 'Ceiling Age', formula: 'Highest level test can measure', description: 'Upper limit of assessment' },
        { name: 'Motor Coordination', formula: 'Gross Motor + Fine Motor + Body Awareness', description: 'Combined motor skill domains' },
        { name: 'Performance Percentage', formula: '(Total Score ÷ Maximum Score) × 100', description: 'Overall motor performance metric' }
      ],
      analysis: {
        basalAge: template.basalAge || '4 years',
        ceilingAge: template.ceilingAge || '22 years',
        mentalAge: template.mentalAge || '112 months (9 years 4 months)',
        chronologicalAge: template.chronologicalAge || '16 years 2 months',
        intelligenceQuotient: template.intelligenceQuotient || 58,
        grossMotorScore: `${grossScore}/${grossMotorSkills.length * 10}`,
        fineMotorScore: `${fineScore}/${fineMotorSkills.length * 10}`,
        bodyAwarenessScore: `${bodyScore}/${bodyAwareness.length * 10}`,
        totalScore: `${totalScore}/${maxScore}`,
        percentage: `${percentage.toFixed(1)}%`,
        developmentLevel
      },
      interpretation: `BINET KAMATH TEST OF INTELLIGENCE

Is used to assess the Mental Age and Intelligence Quotient (I.Q.) of a child. It consists of various verbal and performance items, beginning at the three-year level.

TEST RESULTS

${template.studentName || 'ABC'} has obtained a Basal Age of ${template.basalAge || '4 years'} and a Ceiling Age of ${template.ceilingAge || '22 years'}. The chronological age is ${template.chronologicalAge || '16 years 2 months'} and the test reveals a Mental Age of ${template.mentalAge || '112 months'}. This corresponds to an I.Q. of ${template.intelligenceQuotient || 58}.

COGNITIVE ASSESSMENT

${template.studentName || 'ABC'} was able to recognize different objects as well as indicate similarities between them. She was enjoying tasks where she was given objects. She could accurately identify different shapes, recognize emotions, and identify missing figures from cards.

${template.studentName || 'ABC'} could not perform tasks such as repeating numbers backwards above 6 digits, or tasks where problem solving was required.

MOTOR COORDINATION ASSESSMENT

Gross Motor Performance: ${grossScore >= grossMotorSkills.length * 7 ? 'Strong' : 'Developing'}
Fine Motor Performance: ${fineScore >= fineMotorSkills.length * 7 ? 'Well-Developed' : 'Emerging'}
Body Awareness: ${bodyScore >= bodyAwareness.length * 7 ? 'Appropriate' : 'Developing'}
Overall Development: ${developmentLevel}

INTERPRETATION

The assessment indicates ${template.intelligenceQuotient >= 90 ? 'superior intellectual functioning' : template.intelligenceQuotient >= 80 ? 'above average intelligence' : template.intelligenceQuotient >= 70 ? 'average intelligence' : template.intelligenceQuotient >= 60 ? 'below average intelligence' : 'borderline intellectual functioning'} with an I.Q. of ${template.intelligenceQuotient || 58}.

Motor coordination skills are at ${percentage.toFixed(1)}% of expected level, indicating ${developmentLevel.toLowerCase()} physical development.`
    };
  };

  // Raven's CPM Specific Report with Formulas
  const generateRavensCPMReport = (template) => {
    const sections = template.sections || [];
    let totalCorrect = 0;
    let totalItems = 0;
    
    sections.forEach(section => {
      (section.items || []).forEach(item => {
        if (parseInt(item.answer) === item.correct) {
          totalCorrect++;
        }
        totalItems++;
      });
    });
    
    const rawScore = totalCorrect;
    const percentileRank = template.percentileRank || 0;
    
    let abilityLevel = '';
    if (percentileRank >= 95) abilityLevel = 'Superior';
    else if (percentileRank >= 75) abilityLevel = 'Above Average';
    else if (percentileRank >= 50) abilityLevel = 'Average';
    else if (percentileRank >= 25) abilityLevel = 'Below Average';
    else abilityLevel = 'Very Low';
    
    return {
      title: "Raven's Coloured Progressive Matrices Assessment Report",
      formulas: [
        { name: 'Raw Score', formula: 'Number of Correct Items', description: 'Total count of correctly answered matrix items' },
        { name: 'Percentile Rank', formula: 'Based on Normative Data', description: 'Position relative to same-age peers in the normative sample' }
      ],
      analysis: {
        rawScore: `${rawScore}/${totalItems}`,
        percentileRank: `${percentileRank}th`,
        abilityLevel
      },
      interpretation: `The student's non-verbal reasoning ability is classified as ${abilityLevel.toLowerCase()}, performing at the ${percentileRank}th percentile compared to same-age peers. This indicates ${abilityLevel.toLowerCase()} eductive ability and problem-solving skills.`
    };
  };

  // GARS-3 Specific Report with Formulas
  const generateGARS3Report = (template) => {
    const subscales = template.subscales || [];

    function getFrequencyScore(frequency) {
      const scores = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, 'Very Often': 4 };
      return scores[frequency] || 0;
    }
    
    function getSeverityScore(severity) {
      const scores = { 'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3, 'Very Severe': 4 };
      return scores[severity] || 0;
    }

    let totalScore = 0;
    subscales.forEach(subscale => {
      (subscale.items || []).forEach(item => {
        const freqScore = getFrequencyScore(item.frequency);
        const sevScore = getSeverityScore(item.severity);
        totalScore += (freqScore + sevScore) / 2;
      });
    });
    
    const autismIndex = Math.round(totalScore);
    const probabilityLevel = template.probabilityLevel || '';
    
    return {
      title: 'Gilliam Autism Rating Scale - 3 Assessment Report',
      formulas: [
        { name: 'Item Score', formula: '(Frequency Score + Severity Score) / 2', description: 'Average of frequency and severity ratings per item' },
        { name: 'Autism Index', formula: 'Σ (All Subscale Scores)', description: 'Sum of all subscale scores determines overall probability level' }
      ],
      analysis: {
        autismIndex,
        probabilityLevel,
        subscaleScores: subscales.map(subscale => ({
          name: subscale.name,
          score: (subscale.items || []).reduce((sum, item) => {
            return sum + (getFrequencyScore(item.frequency) + getSeverityScore(item.severity)) / 2;
          }, 0)
        }))
      },
      interpretation: `The GARS-3 assessment indicates a ${probabilityLevel.toLowerCase()} probability of autism spectrum disorder. The Autism Index score of ${autismIndex} suggests ${probabilityLevel.toLowerCase()} likelihood of ASD based on the observed behaviors across multiple domains.`
    };
  };

  // Brown EF-A Scale Specific Report with Formulas
  const generateBrownEFAScaleReport = (template) => {
    const subscales = template.subscales || [];

    function getFrequencyScore(frequency) {
      const scores = { 'Never': 0, 'Once a month': 1, 'A few times a month': 2, 'Once a week': 3, 'A few times a week': 4, 'Daily': 5 };
      return scores[frequency] || 0;
    }
    
    function getImpactScore(impact) {
      const scores = { 'No problems': 0, 'Minor problems': 1, 'Moderate problems': 2, 'Major problems': 3, 'Severe problems': 4 };
      return scores[impact] || 0;
    }

    let efScore = 0;
    let attentionScore = 0;
    
    subscales.forEach((subscale, index) => {
      let subscaleScore = 0;
      (subscale.items || []).forEach(item => {
        const freqScore = getFrequencyScore(item.frequency);
        const impactScore = getImpactScore(item.impact);
        subscaleScore += (freqScore + impactScore) / 2;
      });
      
      if (index < 5) efScore += subscaleScore;
      if (index === 5) attentionScore += subscaleScore;
    });
    
    const executiveFunctionIndex = Math.round(efScore / 5);
    const attentionIndex = Math.round(attentionScore);
    const overallIndex = Math.round((efScore + attentionScore) / 6);
    const severityLevel = template.severityLevel || '';
    
    return {
      title: 'Brown Executive Function/Attention Scales Assessment Report',
      formulas: [
        { name: 'Frequency Score', formula: 'Never=0, Once a month=1, A few times a month=2, Once a week=3, A few times a week=4, Daily=5', description: 'Numeric value assigned to frequency of symptom occurrence' },
        { name: 'Impact Score', formula: 'No problems=0, Minor=1, Moderate=2, Major=3, Severe=4', description: 'Numeric value assigned to functional impact of symptom' },
        { name: 'Item Score', formula: '(Frequency Score + Impact Score) / 2', description: 'Average of frequency and impact ratings per item' },
        { name: 'Executive Function Index', formula: '(Organization + Time Management + Working Memory + Emotional Regulation + Task Initiation) / 5', description: 'Average of the first five subscale scores' },
        { name: 'Severity Ranges', formula: 'T-Score Classification', description: '<54 Typical | 55-59 Somewhat Atypical | 60-69 Moderately Atypical | 70+ Markedly Atypical' }
      ],
      analysis: {
        executiveFunctionIndex,
        attentionIndex,
        overallIndex,
        severityLevel,
        subscaleDetails: subscales.slice(0, 5).map((subscale) => ({
          name: subscale.name,
          score: (subscale.items || []).reduce((sum, item) => {
            return sum + (getFrequencyScore(item.frequency) + getImpactScore(item.impact)) / 2;
          }, 0)
        })),
        attentionSubscale: subscales[5] ? {
          name: subscales[5].name,
          score: attentionScore
        } : null
      },
      interpretation: `The Brown EF/A Scales assessment indicates ${severityLevel.toLowerCase()} executive function difficulties. The Executive Function Index of ${executiveFunctionIndex} and Attention Index of ${attentionIndex} suggest ${severityLevel.toLowerCase()} challenges in executive functioning and attention regulation. These findings should be interpreted in the context of the individual's overall cognitive profile and functional demands.`
    };
  };

  // EACA Report
  const generateEACAReport = (template) => {
    const domains = template.domains || [];

    let totalScore = 0;
    let maxTotalScore = 0;

    domains.forEach(domain => {
      (domain.items || []).forEach(item => {
        totalScore += parseInt(item.score) || 0;
        maxTotalScore += item.maxScore || 0;
      });
    });

    const percentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    const competencyLevel = template.competencyLevel || '';
    const readinessLevel = template.readinessLevel || '';

    return {
      title: 'Early Academic Competency Assessment Report',
      formulas: [
        { name: 'Domain Score', formula: 'Σ (Items in Domain)', description: 'Sum of all item scores within each academic domain' },
        { name: 'Total Score', formula: 'Σ (All Domain Scores)', description: 'Sum of all domain scores across the assessment' },
        { name: 'Percentage', formula: '(Total Score / Maximum Score) × 100', description: 'Overall percentage indicating academic competency level' },
        { name: 'Competency Level', formula: 'Based on Percentage Score', description: 'Categorical classification of academic readiness based on percentage' }
      ],
      analysis: {
        totalScore: `${totalScore}/${maxTotalScore}`,
        percentage: `${percentage.toFixed(1)}%`,
        competencyLevel,
        readinessLevel,
        domainScores: domains.map(domain => ({
          name: domain.name,
          score: (domain.items || []).reduce((sum, item) => sum + (parseInt(item.score) || 0), 0),
          maxScore: (domain.items || []).reduce((sum, item) => sum + (item.maxScore || 0), 0)
        }))
      },
      interpretation: `The EACA assessment indicates ${competencyLevel.toLowerCase()} academic competency with ${readinessLevel.toLowerCase()} school readiness. The overall performance of ${percentage.toFixed(1)}% suggests ${competencyLevel.toLowerCase()} foundational skills for academic success.`
    };
  };

  // Nelson-Denny Specific Report with Formulas
  const generateNelsonDennyReport = (template) => {
    const vocabularySubtest = template.vocabularySubtest || {};
    const comprehensionSubtest = template.comprehensionSubtest || {};
    const readingRateSubtest = template.readingRateSubtest || {};
    
    const totalScore = template.totalScore || 0;
    const overallReadingLevel = template.overallReadingLevel || '';
    
    return {
      title: 'Nelson-Denny Reading Test Assessment Report',
      formulas: [
        { name: 'Vocabulary Raw Score', formula: 'Number Correct × 4', description: 'Each correct vocabulary item is weighted by a factor of 4' },
        { name: 'Comprehension Raw Score', formula: 'Number Correct × 6', description: 'Each correct comprehension item is weighted by a factor of 6' },
        { name: 'Total Score', formula: '(Vocabulary + Comprehension + Reading Rate) / 3', description: 'Average of all three subtest scaled scores' }
      ],
      analysis: {
        vocabularyScore: vocabularySubtest.scaledScore || 0,
        comprehensionScore: comprehensionSubtest.scaledScore || 0,
        readingRateScore: readingRateSubtest.scaledScore || 0,
        totalScore,
        overallReadingLevel,
        gradeEquivalent: vocabularySubtest.gradeEquivalent || ''
      },
      interpretation: `The Nelson-Denny Reading Test indicates ${overallReadingLevel.toLowerCase()} reading proficiency with a grade equivalent of ${vocabularySubtest.gradeEquivalent || 'N/A'}. Vocabulary skills are ${vocabularySubtest.percentileRank >= 50 ? 'at' : 'below'} grade level, while comprehension is ${comprehensionSubtest.percentileRank >= 50 ? 'at' : 'below'} expectations.`
    };
  };

  const report = generateReport();

  // TAPS-3 Specific Report
  const generateTAPS3Report = (template) => {
    const subtests = template.subtests || [];
    const phonologicIndex = template.phonologicIndex || 0;
    const memoryIndex = template.memoryIndex || 0;
    const cohesionIndex = template.cohesionIndex || 0;
    const overallIndex = template.overallIndex || 0;

    let performanceRange = '';
    if (overallIndex >= 115) performanceRange = 'above average';
    else if (overallIndex >= 85) performanceRange = 'average';
    else if (overallIndex >= 70) performanceRange = 'below average';
    else performanceRange = 'significantly below average';

    return {
      title: 'TEST OF AUDITORY PROCESSING SKILLS-TAPS-3',
      formulas: [
        { name: 'Phonologic Index', formula: 'Average of Phonological Subtests Standard Scores', description: 'Word Discrimination + Phonological Segmentation + Phonological Blending' },
        { name: 'Memory Index', formula: 'Average of Memory Subtests Standard Scores', description: 'Number Memory Forward + Number Memory Reversed + Word Memory + Sentence Memory' },
        { name: 'Cohesion Index', formula: 'Average of Cohesion Subtests Standard Scores', description: 'Auditory Comprehension + Auditory Reasoning' },
        { name: 'Overall Index', formula: 'Average of All Index Scores', description: 'Combined performance across all domains' },
        { name: 'Scaled Score', formula: 'Raw Score → Scaled Score (1-20)', description: 'Normalized score based on normative data' },
        { name: 'Standard Score', formula: 'Scaled Score → Standard Score (Mean=100, SD=15)', description: 'Standardized score for comparison' }
      ],
      analysis: {
        phonologicIndex,
        memoryIndex,
        cohesionIndex,
        overallIndex,
        performanceRange,
        subtests: subtests.map(subtest => ({
          name: subtest.name,
          rawScore: subtest.rawScore,
          scaledScore: subtest.scaledScore,
          percentileRank: subtest.percentileRank
        }))
      },
      interpretation: `TEST OF AUDITORY PROCESSING SKILLS-TAPS-3

The Test of Auditory Processing Skills (Third Edition; TAPS-3) is a measure of auditory skill important to the development, use, and understanding of the language used in academic instruction. It includes subtests designed to assess basic phonological skills (which are important to learning to read), memory abilities (essential to processing information), and auditory cohesion (which requires not only understanding, but also the ability to use inference, deduction and abstraction to comprehend the meaning of verbally presented information). The scores below serve to show ${template.studentName || 'ABC'}'s performance on these auditory tasks in comparison to a normative sample of his same age peers, as well as to compare his performance on different subtests.

SUBTEST AND INDEX RESULTS

SUBTEST RESULTS
${subtests.map(subtest => 
  `${subtest.name.padEnd(25)} ${subtest.rawScore.toString().padStart(8)} ${subtest.scaledScore.toString().padStart(12)} ${subtest.percentileRank.toString().padStart(14)}`
).join('\n')}

Phonologic Index Standard Score + = ${phonologicIndex}
Memory Index Standard Score † = ${memoryIndex}
Cohesion Index Standard Score * = ${cohesionIndex}
Overall Index Score + = ${overallIndex}

PERCENTILE RANKS
${subtests.map(subtest => subtest.percentileRank).join('          ')}

Remark: ${template.studentName || 'ABC'}'s Overall TAPS-3 Index Standard Score is ${overallIndex}, is in the ${performanceRange} range (85-115 average) for his chronological age.`
    };
  };

  // RIPA-Primary Specific Report
  const generateRIPAPrimaryReport = (template) => {
    const memoryQuotient = template.memoryQuotient || 0;
    const compositeScore = template.compositeScore || 0;
    const tScore = template.tScore || 0;
    const interpretation = template.interpretation || '';

    return {
      title: 'ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY',
      formulas: [
        { name: 'Memory Quotient', formula: 'Average of Subtest Standard Scores', description: 'Combined performance across all subtests' },
        { name: 'Composite Score', formula: 'Sum of Standard Scores', description: 'Overall performance measure' },
        { name: 'T-Score', formula: '(Standard Score - 100) / 15 * 10 + 50', description: 'Standardized score with mean=50, SD=10' }
      ],
      analysis: {
        memoryQuotient,
        compositeScore,
        tScore,
        interpretation
      },
      interpretation: `ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY

The RIPA-A quantifies & describes cognitive-linguistic deficits in individuals between the ages of 5-0 and 12-11 who face difficulties in attention, memory, orientation, language and communication, problem solving and abstract reasoning. It can be used to develop and guide rehabilitation goals and objectives based on individual strengths and weaknesses.

TEST RESULTS
Memory Quotient: ${memoryQuotient}
Composite Score: ${compositeScore}
T-Score: T-${tScore}

Interpretation: ${template.studentName || 'ABC'}'s RIPA-P scores imply '${interpretation}' deficits in the areas of information processing skills (memory).`
    };
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Assessment Report</h1>
                <p className="text-gray-600">{report.title}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFormulas(!showFormulas)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  showFormulas ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiFileText className="w-4 h-4" />
                <span>Formulas</span>
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'report' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <FiEye className="w-4 h-4" />
                <span>Report</span>
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center space-x-2 transition-colors"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {showFormulas && (
          <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assessment Formulas & Analysis</h2>
            <div className="space-y-4">
              {report.formulas.map((formula, index) => (
                <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-800">{formula.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{formula.formula}</p>
                  <p className="text-sm text-gray-700">{formula.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            {/* Student Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Student Name:</span>
                  <p className="text-lg font-semibold text-gray-900">{studentName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Examiner:</span>
                  <p className="text-lg font-semibold text-gray-900">{examinerName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Test Date:</span>
                  <p className="text-lg font-semibold text-gray-900">{testDate}</p>
                </div>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>

              {template.type === 'ADHDT2' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">ADHD Index</h3>
                      <p className="text-2xl font-bold text-blue-600">{report.analysis.adhdIndex}</p>
                      <p className="text-sm text-blue-700">Likelihood: {report.analysis.adhdLikelihood}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Subscale Scores</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Inattention: {report.analysis.inattentionScore} (PR: {report.analysis.inattentionPercentile})</p>
                        <p className="text-sm">Hyperactivity: {report.analysis.hyperactivityScore} (PR: {report.analysis.hyperactivityPercentile})</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'ADHT-BSM' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Symptom Count</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Inattention: {report.analysis.inattentionChecked}/{report.analysis.totalInattention}</p>
                        <p className="text-sm">Hyperactivity: {report.analysis.hyperactivityChecked}/{report.analysis.totalHyperactivity}</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">DSM-5 Diagnosis</h3>
                      <p className="text-lg font-bold text-purple-600">{report.analysis.diagnosis}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'Aston-Index' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Age Analysis</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Mental Age: {report.analysis.averageMentalAge} years</p>
                        <p className="text-sm">Chronological Age: {report.analysis.chronologicalAge} years</p>
                        <p className="text-sm">Discrepancy: {report.analysis.discrepancy} years</p>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">Development Level</h3>
                      <p className="text-lg font-bold text-orange-600">{report.analysis.interpretationLevel}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'BKT' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-2">Motor Scores</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Gross Motor: {report.analysis.grossMotorScore}</p>
                        <p className="text-sm">Fine Motor: {report.analysis.fineMotorScore}</p>
                        <p className="text-sm">Body Awareness: {report.analysis.bodyAwarenessScore}</p>
                      </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-2">Overall Development</h3>
                      <p className="text-lg font-bold text-red-600">{report.analysis.developmentLevel}</p>
                      <p className="text-sm">Overall Score: {report.analysis.percentage}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'Ravens-CPM' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Raw Score</h3>
                      <p className="text-2xl font-bold text-blue-600">{report.analysis.rawScore}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Ability Level</h3>
                      <p className="text-lg font-bold text-green-600">{report.analysis.abilityLevel}</p>
                      <p className="text-sm text-green-700">Percentile Rank: {report.analysis.percentileRank}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'GARS-3' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Autism Index</h3>
                      <p className="text-2xl font-bold text-blue-600">{report.analysis.autismIndex}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Probability Level</h3>
                      <p className="text-lg font-bold text-purple-600">{report.analysis.probabilityLevel}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'Brown-EF-A' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">EF Index</h3>
                      <p className="text-2xl font-bold text-blue-600">{report.analysis.executiveFunctionIndex}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Attention Index</h3>
                      <p className="text-2xl font-bold text-green-600">{report.analysis.attentionIndex}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Overall Index</h3>
                      <p className="text-2xl font-bold text-purple-600">{report.analysis.overallIndex}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'EACA' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Total Score</h3>
                      <p className="text-2xl font-bold text-blue-600">{report.analysis.totalScore}</p>
                      <p className="text-sm text-blue-700">Percentage: {report.analysis.percentage}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Competency Level</h3>
                      <p className="text-lg font-bold text-green-600">{report.analysis.competencyLevel}</p>
                      <p className="text-sm text-green-700">Readiness: {report.analysis.readinessLevel}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'TAPS-3' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-teal-800 mb-2">Index Scores</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Phonologic Index: {report.analysis.phonologicIndex}</p>
                        <p className="text-sm">Memory Index: {report.analysis.memoryIndex}</p>
                        <p className="text-sm">Cohesion Index: {report.analysis.cohesionIndex}</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-800 mb-2">Overall Performance</h3>
                      <p className="text-lg font-bold text-purple-600">{report.analysis.overallIndex}</p>
                      <p className="text-sm text-purple-700">Range: {report.analysis.performanceRange}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'RIPA-Primary' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-emerald-800 mb-2">Memory Scores</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Memory Quotient: {report.analysis.memoryQuotient}</p>
                        <p className="text-sm">Composite Score: {report.analysis.compositeScore}</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Standardized Score</h3>
                      <p className="text-lg font-bold text-blue-600">T-{report.analysis.tScore}</p>
                      <p className="text-sm text-blue-700">{report.analysis.interpretation}</p>
                    </div>
                  </div>
                </div>
              )}

              {template.type === 'Nelson-Denny' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">Subtest Scores</h3>
                      <div className="space-y-1">
                        <p className="text-sm">Vocabulary: {report.analysis.vocabularyScore}</p>
                        <p className="text-sm">Comprehension: {report.analysis.comprehensionScore}</p>
                        <p className="text-sm">Reading Rate: {report.analysis.readingRateScore}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">Reading Level</h3>
                      <p className="text-lg font-bold text-green-600">{report.analysis.overallReadingLevel}</p>
                      <p className="text-sm text-green-700">Grade Equivalent: {report.analysis.gradeEquivalent}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Interpretation</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {report.interpretation}
                </p>
              </div>
            </div>

            {/* Download Report */}
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors">
                <FiDownload className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentReportGenerator;