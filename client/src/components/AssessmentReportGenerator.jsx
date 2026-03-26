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
        'ADHD Index = Inattention Standard Score + Hyperactivity/Impulsivity Standard Score',
        'Standard Score Calculation: Raw Score → T-Score (Mean=50, SD=10)',
        'Percentile Rank = Based on Age/Gender Normative Data',
        'ADHD Likelihood Classification: Very High (≥90), High (80-89), Moderate (70-79), Low (60-69), Very Low (<60)',
        'DSM-5 Criteria: Based on Diagnostic and Statistical Manual of Mental Disorders, 5th Edition',
        'Norm-Referenced: Scores compared to standardized sample population'
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
        'DSM-5 Criteria: ≥6 symptoms from either category required for diagnosis',
        'Symptom Duration: Must be present for ≥6 months',
        'Age of Onset: Several symptoms present before age 12',
        'Setting Requirement: Symptoms present in ≥2 settings (home, school, work)',
        'Impairment: Symptoms interfere with social, academic, or occupational functioning',
        'Diagnosis Types: Combined, Predominantly Inattentive, Predominantly Hyperactive/Impulsive'
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

A1 Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities (e.g., overlooks or misses details, work is inaccurate).
A2 Often has difficulty sustaining attention in tasks or play activities (e.g., has difficulty remaining focused during lectures, conversations, or lengthy reading).
A3 Often does not seem to listen when spoken to directly (e.g., mind seems elsewhere, even in the absence of any obvious distraction).
A4 Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace (e.g., starts tasks but quickly loses focus and is easily side-tracked).
A5 Often has difficulty organizing tasks and activities (e.g., difficulty managing sequential tasks; difficulty keeping materials and belongings in order; messy, disorganizedized work; poor time management; fails to meet deadlines).
A6 Often avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort (e.g., schoolwork or homework; for older adolescents and adults, preparing reports, completing forms, reviewing lengthy papers).
A7 Often loses things necessary for tasks or activities (e.g., school materials, pencils, books, tools, wallets, keys, paperwork, eyeglasses, mobile telephones).
A8 Often is easily distracted by extraneous stimuli (for older adolescents and adults, may include unrelated thoughts).
A9 Often is forgetful in daily activities (e.g., doing chores, running errands; for older adolescents and adults, returning calls, paying bills, keeping appointments).

INATTENTION TOTAL: ${inattentionChecked} out of 9

HYPERACTIVITY AND IMPULSIVITY
(Only behaviours occurring for 6 months or more are ticked)

A1 Often fidgets with or taps hands or feet or squirms in seat.
A2 Often leaves seat in situations when remaining seated is expected (e.g., leaves his or her place in the classroom, office or other workplace, or in other situations that require remaining seated).
A3 Often runs about or climbs in situations where it is inappropriate. (Note: In adolescents or adults, may be limited to feeling restless).
A4 Often unable to play or engage in leisure activities quietly.
A5 Is often "on the go" or often acts as if "driven by a motor" (e.g., is unable to be or uncomfortable being still for extended time, as in restaurants, meetings; may be experienced by others as being restless or difficult to keep up with).
A6 Often talks excessively.
A7 Often blurts out an answer before a question has been completed (e.g., completes people's sentences; cannot wait for turn in conversation).
A8 Often has difficulty waiting his or her turn (e.g., while waiting in line).
A9 Often interrupts or intrudes on others (e.g., butts into conversations, games, or activities; may start using other people's things without asking or receiving permission; for adolescents and adults, may intrude into or take over what others are doing).

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
      if (score.includes('years')) return parseInt(score);
      if (score.includes('4 years')) return 4;
      if (score.includes('5/6 years')) return 5.5;
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
        {
          name: 'Mental Age Calculation',
          formula: 'Age Equivalent Scoring',
          description: 'Raw scores converted to mental age equivalents based on normative data'
        },
        {
          name: 'Discrepancy Analysis',
          formula: 'Chronological Age - Mental Age',
          description: 'Difference between actual age and assessed mental age indicates developmental level'
        }
      ],
      analysis: {
        averageMentalAge: averageMentalAge.toFixed(1),
        chronologicalAge,
        discrepancy: discrepancy.toFixed(1),
        interpretationLevel,
        mentalAges
      },
      interpretation: `The average mental age equivalent is ${averageMentalAge.toFixed(1)} years compared to chronological age of ${chronologicalAge} years, indicating a ${interpretationLevel}. This suggests ${discrepancy > 1 ? 'need for targeted intervention' : 'age-appropriate development'}.`
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
        {
          name: 'Gross Motor Score',
          formula: 'Σ (Gross Motor Items)',
          description: 'Sum of all gross motor item scores'
        },
        {
          name: 'Fine Motor Score',
          formula: 'Σ (Fine Motor Items)',
          description: 'Sum of all fine motor item scores'
        },
        {
          name: 'Body Awareness Score',
          formula: 'Σ (Body Awareness Items)',
          description: 'Sum of all body awareness item scores'
        },
        {
          name: 'Performance Percentage',
          formula: '(Total Score / Maximum Score) × 100',
          description: 'Overall percentage indicating motor development level'
        }
      ],
      analysis: {
        grossMotorScore: `${grossScore}/${grossMotorSkills.length * 10}`,
        fineMotorScore: `${fineScore}/${fineMotorSkills.length * 10}`,
        bodyAwarenessScore: `${bodyScore}/${bodyAwareness.length * 10}`,
        totalScore: `${totalScore}/${maxScore}`,
        percentage: `${percentage.toFixed(1)}%`,
        developmentLevel
      },
      interpretation: `The student demonstrates ${developmentLevel.toLowerCase()} motor coordination skills overall. Gross motor performance is ${grossScore >= grossMotorSkills.length * 7 ? 'strong' : 'developing'}, fine motor skills are ${fineScore >= fineMotorSkills.length * 7 ? 'well-developed' : 'emerging'}, and body awareness is ${bodyScore >= bodyAwareness.length * 7 ? 'appropriate' : 'developing'}.`
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
        {
          name: 'Raw Score',
          formula: 'Number of Correct Items',
          description: 'Total count of correctly answered matrix items'
        },
        {
          name: 'Percentile Rank',
          formula: 'Based on Normative Data',
          description: 'Position relative to same-age peers in the normative sample'
        }
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
        {
          name: 'Item Score',
          formula: '(Frequency Score + Severity Score) / 2',
          description: 'Average of frequency and severity ratings per item'
        },
        {
          name: 'Autism Index',
          formula: 'Σ (All Subscale Scores)',
          description: 'Sum of all subscale scores determines overall probability level'
        }
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
        {
          name: 'Frequency Score',
          formula: 'Never=0, Once a month=1, A few times a month=2, Once a week=3, A few times a week=4, Daily=5',
          description: 'Numeric value assigned to frequency of symptom occurrence'
        },
        {
          name: 'Impact Score',
          formula: 'No problems=0, Minor=1, Moderate=2, Major=3, Severe=4',
          description: 'Numeric value assigned to functional impact of symptom'
        },
        {
          name: 'Item Score',
          formula: '(Frequency Score + Impact Score) / 2',
          description: 'Average of frequency and impact ratings per item'
        },
        {
          name: 'Executive Function Index',
          formula: '(Organization + Time Management + Working Memory + Emotional Regulation + Task Initiation) / 5',
          description: 'Average of the first five subscale scores'
        },
        {
          name: 'Severity Ranges',
          formula: 'T-Score Classification',
          description: '<54 Typical | 55-59 Somewhat Atypical | 60-69 Moderately Atypical | 70+ Markedly Atypical'
        }
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
          score: (subscales[5].items || []).reduce((sum, item) => {
            return sum + (getFrequencyScore(item.frequency) + getImpactScore(item.impact)) / 2;
          }, 0)
        } : null
      },
      interpretation: `This report includes cluster T Scores for the Parent rater form selected. Difficulties reflected by each of the clusters T scores are described below:

The scores of Brown Executive Function/Attention Scales fall in the significant problem range. The total composite score indicates ${executiveFunctionIndex >= 60 ? 'somewhat atypical to markedly atypical' : 'typical'} functioning in one or more of the many domains that make up executive functions.

However, this report indicates ${template.studentName || 'the student'} as having difficulty in the clusters of Activation, Focus and Effort.

It must be noted that this screening tool cannot be fully endorsed by the tester. There are two sets of scores reported: those reported by parents and a self-report after being given insight by the tester. They can be used as a rough guide to consider conducting a full ADHD diagnostic evaluation if an individual's Total Composite Score meets or exceeds a T score of 60.

BROWN EXECUTIVE FUNCTION / ATTENTION SCALES
Brown Executive Function/Attention Scales helps screen and assess a wider range of impairments of executive functioning. Brown EF/A Scales measures DSM-5 symptoms of ADHD along with less apparent impairments of executive functioning. It provides an easily understandable, standardized tool to collect information about problems an individual demonstrates or reports with executive functions, self-management functions that support attention in multiple tasks of daily life.

Raters included in this report are listed below:
Parent Form
Self Report

Suggested ranges for clinical interpretation of all of the T Scores are as follows:

BROWN EF/A SCALES T-SCORE PROFILE
T-SCORE RANGE    CLASSIFICATION
70 and above      Markedly atypical (very significant problem)
60-69             Moderately atypical (significant problem)  
55-59             Somewhat atypical (possibly significant problem)
54 and below       Typical (unlikely significant problem)

The Executive Function Index of ${executiveFunctionIndex} and Attention Index of ${attentionIndex} place ${template.studentName || 'the student'} in the ${overallIndex >= 70 ? 'markedly atypical' : overallIndex >= 60 ? 'moderately atypical' : overallIndex >= 55 ? 'somewhat atypical' : 'typical'} range, indicating ${severityLevel.toLowerCase()} executive function and attention difficulties that may warrant ${overallIndex >= 60 ? 'further comprehensive evaluation and intervention planning' : 'monitoring and support as needed'}.`
    };
  };

  // ✅ FIX: EACA Report - function was incomplete/broken in original
  const generateEACAReport = (template) => {
    const domains = template.domains || [];

    const totalScore = domains.reduce((sum, domain) => {
      return sum + (domain.items || []).reduce((dSum, item) => dSum + (parseInt(item.score) || 0), 0);
    }, 0);

    const maxTotalScore = domains.reduce((sum, domain) => {
      return sum + (domain.items || []).reduce((dSum, item) => dSum + (item.maxScore || 0), 0);
    }, 0);

    const percentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    const competencyLevel = template.competencyLevel || '';
    const readinessLevel = template.readinessLevel || '';

    return {
      title: 'Early Academic Competency Assessment Report',
      formulas: [
        {
          name: 'Domain Score',
          formula: 'Σ (Items in Domain)',
          description: 'Sum of all item scores within each academic domain'
        },
        {
          name: 'Total Score',
          formula: 'Σ (All Domain Scores)',
          description: 'Sum of all domain scores across the assessment'
        },
        {
          name: 'Percentage',
          formula: '(Total Score / Maximum Score) × 100',
          description: 'Overall percentage indicating academic competency level'
        },
        {
          name: 'Competency Level',
          formula: 'Based on Percentage Score',
          description: 'Categorical classification of academic readiness based on percentage'
        }
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
        {
          name: 'Vocabulary Raw Score',
          formula: 'Number Correct × 4',
          description: 'Each correct vocabulary item is weighted by a factor of 4'
        },
        {
          name: 'Comprehension Raw Score',
          formula: 'Number Correct × 6',
          description: 'Each correct comprehension item is weighted by a factor of 6'
        },
        {
          name: 'Total Score',
          formula: '(Vocabulary + Comprehension + Reading Rate) / 3',
          description: 'Average of all three subtest scaled scores'
        }
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