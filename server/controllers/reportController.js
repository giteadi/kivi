const Assessment = require('../models/Assessment');
const Student = require('../models/Student');

class ReportController {
  constructor() {
    this.assessmentModel = new Assessment();
    this.studentModel = new Student();
  }

  // Generate comprehensive assessment report
  async generateAssessmentReport(req, res) {
    try {
      const { assessmentIds, examineeData, options, additionalNotes, interpretationNotes, recommendations } = req.body;
      
      // Fetch assessment details
      const assessments = await this.fetchAssessmentDetails(assessmentIds);
      
      // Generate report content
      const reportContent = await this.generateReportContent({
        assessments,
        examineeData,
        options,
        additionalNotes,
        interpretationNotes,
        recommendations
      });
      
      // For now, return the report as text (in production, this would generate PDF)
      res.json({
        success: true,
        message: 'Report generated successfully',
        data: {
          content: reportContent,
          filename: `Assessment_Report_${examineeData?.name || 'Examinee'}_${new Date().toISOString().split('T')[0]}.pdf`,
          generatedAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Generate report error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Fetch detailed assessment information
  async fetchAssessmentDetails(assessmentIds) {
    try {
      const assessments = [];
      
      for (const id of assessmentIds) {
        const assessment = await this.assessmentModel.getAssessment(id);
        if (assessment) {
          // Add mock scores and interpretations (in real implementation, this would come from database)
          const assessmentWithDetails = {
            ...assessment,
            scores: this.generateMockScores(assessment.assessment_type),
            interpretation: this.generateMockInterpretation(assessment.assessment_type),
            recommendations: this.generateMockRecommendations(assessment.assessment_type)
          };
          assessments.push(assessmentWithDetails);
        }
      }
      
      return assessments;
    } catch (error) {
      console.error('Error fetching assessment details:', error);
      throw error;
    }
  }

  // Generate mock scores based on assessment type
  generateMockScores(assessmentType) {
    const scoreTemplates = {
      'WRAT5': {
        'Reading': { score: 95, percentile: 37, interpretation: 'Average' },
        'Spelling': { score: 88, percentile: 21, interpretation: 'Low Average' },
        'Math': { score: 102, percentile: 55, interpretation: 'Average' }
      },
      'WIAT': {
        'Reading': { score: 98, percentile: 45, interpretation: 'Average' },
        'Math': { score: 105, percentile: 63, interpretation: 'Average' },
        'Writing': { score: 92, percentile: 30, interpretation: 'Low Average' }
      },
      'WISC': {
        'Verbal': { score: 110, percentile: 75, interpretation: 'High Average' },
        'Performance': { score: 95, percentile: 37, interpretation: 'Average' },
        'Full Scale': { score: 103, percentile: 58, interpretation: 'Average' }
      },
      'BASC': {
        'Adaptive': { score: 45, percentile: 32, interpretation: 'Below Average' },
        'Clinical': { score: 65, percentile: 75, interpretation: 'Elevated' }
      },
      'Conners': {
        'Inattention': { score: 72, percentile: 85, interpretation: 'Elevated' },
        'Hyperactivity': { score: 68, percentile: 78, interpretation: 'Elevated' }
      }
    };

    return scoreTemplates[assessmentType] || {
      'Overall': { score: 100, percentile: 50, interpretation: 'Average' }
    };
  }

  // Generate mock interpretation
  generateMockInterpretation(assessmentType) {
    const interpretations = {
      'WRAT5': 'The examinee demonstrates average academic skills in reading and mathematics, with spelling skills in the low average range. This pattern suggests a specific weakness in written expression that may benefit from targeted intervention.',
      'WIAT': 'Assessment results indicate overall average academic achievement. Relative weaknesses in writing and reading suggest the need for supportive strategies in these areas.',
      'WISC': 'Cognitive abilities fall within the average range across domains. Verbal comprehension is notably strong, which can be leveraged in academic interventions.',
      'BASC': 'Adaptive skills are below average while clinical scales are elevated, suggesting difficulties in daily functioning that may require behavioral support.',
      'Conners': 'Elevated scores in both inattention and hyperactivity domains indicate significant attentional concerns that warrant further evaluation and intervention.'
    };

    return interpretations[assessmentType] || 'Assessment results indicate areas of strength and weakness that should be addressed through targeted interventions.';
  }

  // Generate mock recommendations
  generateMockRecommendations(assessmentType) {
    const recommendations = {
      'WRAT5': [
        'Implement specialized spelling instruction using multisensory approaches',
        'Provide additional writing practice with structured feedback',
        'Monitor progress through regular curriculum-based measurements'
      ],
      'WIAT': [
        'Develop individualized reading intervention plan',
        'Provide writing scaffolds and graphic organizers',
        'Consider assistive technology for written expression'
      ],
      'WISC': [
        'Leverage strong verbal skills in learning activities',
        'Provide visual supports for abstract concepts',
        'Implement strength-based learning approaches'
      ],
      'BASC': [
        'Implement behavioral support plan',
        'Teach self-regulation strategies',
        'Provide social skills instruction'
      ],
      'Conners': [
        'Consider formal ADHD evaluation',
        'Implement classroom accommodations',
        'Teach organizational and time management skills'
      ]
    };

    return recommendations[assessmentType] || [
      'Implement individualized support strategies',
      'Monitor progress regularly',
      'Collaborate with parents and teachers'
    ];
  }

  // Generate comprehensive report content
  async generateReportContent({ assessments, examineeData, options, additionalNotes, interpretationNotes, recommendations }) {
    let content = '';
    
    // Header
    content += this.generateReportHeader(examineeData);
    
    // Demographics
    if (options.includeDemographics) {
      content += this.generateDemographicsSection(examineeData);
    }
    
    // Assessment Overview
    if (options.includeAssessmentDetails) {
      content += this.generateAssessmentOverview(assessments);
    }
    
    // Scores and Results
    if (options.includeScores) {
      content += this.generateScoresSection(assessments);
    }
    
    // Interpretation
    if (options.includeInterpretation) {
      content += this.generateInterpretationSection(assessments, interpretationNotes);
    }
    
    // Behavioral Observations
    if (options.includeBehavioralObservations) {
      content += this.generateBehavioralSection(assessments);
    }
    
    // Recommendations
    if (options.includeRecommendations) {
      content += this.generateRecommendationsSection(assessments, recommendations);
    }
    
    // Session History
    if (options.includeSessionHistory) {
      content += this.generateSessionHistorySection(assessments);
    }
    
    // Parent Feedback
    if (options.includeParentFeedback) {
      content += this.generateParentFeedbackSection();
    }
    
    // Next Steps
    if (options.includeNextSteps) {
      content += this.generateNextStepsSection();
    }
    
    // Additional Notes
    if (additionalNotes) {
      content += this.generateAdditionalNotesSection(additionalNotes);
    }
    
    // Footer
    content += this.generateReportFooter();
    
    return content;
  }

  generateReportHeader(examineeData) {
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return `
PSYCHOLOGICAL ASSESSMENT REPORT
================================

Name: ${examineeData?.name || 'Not Provided'}
ID: ${examineeData?.examineeId || 'Not Provided'}
Date of Report: ${date}
Assessment Date(s): ${new Date().toLocaleDateString()}
Examiner: Clinical Assessment Team

CONFIDENTIAL - FOR PROFESSIONAL USE ONLY
================================

`;
  }

  generateDemographicsSection(examineeData) {
    return `
DEMOGRAPHIC INFORMATION
======================

Personal Information:
- Name: ${examineeData?.name || 'Not Provided'}
- Age: ${examineeData?.age || 'Not Provided'}
- Date of Birth: ${examineeData?.birthDate || 'Not Provided'}
- Gender: ${examineeData?.gender || 'Not Provided'}

Contact Information:
- Email: ${examineeData?.email || 'Not Provided'}
- Phone: ${examineeData?.phone || 'Not Provided'}
- Centre: ${examineeData?.centre || 'Not Provided'}

`;
  }

  generateAssessmentOverview(assessments) {
    let content = `
ASSESSMENT OVERVIEW
==================

Number of Assessments: ${assessments.length}

Assessments Administered:
`;

    assessments.forEach((assessment, index) => {
      content += `${index + 1}. ${assessment.assessment_name} (${assessment.assessment_type})\n`;
      content += `   - Date: ${new Date(assessment.scheduled_date).toLocaleDateString()}\n`;
      content += `   - Examiner: ${assessment.examiner}\n`;
      content += `   - Duration: ${assessment.duration} minutes\n`;
      content += `   - Status: ${assessment.status}\n\n`;
    });

    return content;
  }

  generateScoresSection(assessments) {
    let content = `
ASSESSMENT RESULTS
=================

`;

    assessments.forEach(assessment => {
      content += `${assessment.assessment_name}\n`;
      content += `${'='.repeat(assessment.assessment_name.length)}\n\n`;
      
      if (assessment.scores) {
        Object.entries(assessment.scores).forEach(([domain, score]) => {
          content += `${domain}:\n`;
          content += `  - Standard Score: ${score.score}\n`;
          content += `  - Percentile: ${score.percentile}\n`;
          content += `  - Interpretation: ${score.interpretation}\n\n`;
        });
      }
    });

    return content;
  }

  generateInterpretationSection(assessments, customNotes) {
    let content = `
CLINICAL INTERPRETATION
=======================

`;

    assessments.forEach(assessment => {
      content += `${assessment.assessment_name}:\n`;
      content += `${assessment.interpretation}\n\n`;
    });

    if (customNotes) {
      content += `Additional Interpretation:\n${customNotes}\n\n`;
    }

    return content;
  }

  generateBehavioralSection(assessments) {
    return `
BEHAVIORAL OBSERVATIONS
========================

During the assessment sessions, the examinee demonstrated:
- Appropriate attention to task demands
- Cooperative attitude toward testing procedures
- Average level of task persistence
- No significant behavioral difficulties observed

Testing conditions were optimal with minimal distractions.

`;
  }

  generateRecommendationsSection(assessments, customRecommendations) {
    let content = `
RECOMMENDATIONS
===============

`;

    assessments.forEach(assessment => {
      if (assessment.recommendations && assessment.recommendations.length > 0) {
        content += `Based on ${assessment.assessment_name}:\n`;
        assessment.recommendations.forEach((rec, index) => {
          content += `${index + 1}. ${rec}\n`;
        });
        content += '\n';
      }
    });

    if (customRecommendations) {
      content += `Additional Recommendations:\n${customRecommendations}\n\n`;
    }

    return content;
  }

  generateSessionHistorySection(assessments) {
    return `
SESSION HISTORY
===============

Assessment sessions were conducted on:
${assessments.map(a => `- ${new Date(a.scheduled_date).toLocaleDateString()}: ${a.assessment_name} (${a.duration} minutes)`).join('\n')}

Total assessment time: ${assessments.reduce((total, a) => total + a.duration, 0)} minutes

`;
  }

  generateParentFeedbackSection() {
    return `
PARENT/GUARDIAN FEEDBACK
=========================

Parent feedback was obtained regarding:
- Developmental history
- Academic concerns
- Behavioral observations at home
- Social functioning

Note: Specific parent feedback should be obtained and documented here.

`;
  }

  generateNextStepsSection() {
    return `
NEXT STEPS
===========

1. Review results with parents/guardians
2. Implement recommended interventions
3. Monitor progress through regular follow-up
4. Consider additional assessments if needed
5. Coordinate with school personnel for implementation

Follow-up assessment recommended in 6-12 months to monitor progress.

`;
  }

  generateAdditionalNotesSection(notes) {
    return `
ADDITIONAL NOTES
===============

${notes}

`;
  }

  generateReportFooter() {
    return `
REPORT SUMMARY
==============

This assessment provides a comprehensive evaluation of the examinee's current functioning. Results should be interpreted in the context of developmental history, educational background, and current environmental factors.

Prepared by:
Clinical Assessment Team
Kivi Assessment Center

Date: ${new Date().toLocaleDateString()}

This report is confidential and intended for use by qualified professionals only.

================================
End of Report
================================
`;
  }
}

module.exports = ReportController;
