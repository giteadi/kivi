# Assessment Report Generation System

## Overview

The Kivi Assessment Platform provides a comprehensive template-based report generation system that allows users to create professional assessment reports using 22 different assessment templates. Each template uses its specific formulas, scoring structures, and interpretation methods.

## Architecture

### System Components

1. **GenerateReportModal.jsx** - Main modal for report generation
2. **AssessmentReportGenerator.jsx** - Template-specific report generation logic
3. **AssignAssessmentModal.jsx** - Assessment assignment with template selection
4. **TemplateManager.jsx** - Central template management

### Data Flow

```
User selects template → getTemplateData() → AssessmentReportGenerator → Professional Report
```

## Template Selection Process

### 1. Dropdown Selection
- User chooses from 22 assessment templates
- Templates are displayed with icons and full names
- Selection triggers `setSelectedTemplate(template)` and `setUseTemplate(true)`

### 2. Template Data Mapping
```javascript
const templateData = getTemplateData(selectedTemplate.id, activeEx, assess);
```

### 3. Report Generation
```javascript
const result = await api.generateReportFromTemplate(selectedTemplate.id, examineeId, customData);
```

## Available Assessment Templates

### Academic Achievement Tests

#### 📝 **WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)**
- **ID**: `WRAT5`
- **Subtests**: Math Computation, Spelling, Word Reading, Sentence Comprehension
- **Scoring**: Raw → Standard → Percentile → Category
- **Use Case**: Basic academic skills assessment

#### 📚 **WOODCOCK JOHNSON IV TESTS OF ACHIEVEMENT (WJ-Ach)**
- **ID**: `WJ-Ach`
- **Areas**: Reading, Mathematics, Written Language
- **Use Case**: Comprehensive achievement assessment

#### 📖 **WOODCOCK READING MASTERY TESTS-II (WRMT-II)**
- **ID**: `WRMT2`
- **Subtests**: Basic Skills, Reading Comprehension, Oral Fluency, Listening
- **Use Case**: Detailed reading assessment

#### 📊 **WJ-III - TESTS OF ACHIEVEMENT FORM C/ BRIEF BATTERY**
- **ID**: `WJ-3`
- **Use Case**: Quick achievement screening

### Cognitive/Intelligence Tests

#### 🧠 **WOODCOCK-JOHNSON TESTS OF COGNITIVE ABILITIES IV (WJ-Cog)**
- **ID**: `WJ-Cog`
- **Theory**: CHC (Cattell-Horn-Carroll) theory
- **Use Case**: Comprehensive cognitive assessment

#### 🧠 **WECHSLER'S INTELLIGENCE SCALE FOR CHILDREN -WISC-IV India**
- **ID**: `WISC-4`
- **Subtests**: Verbal and Performance scales
- **Use Case**: Intelligence testing for children

#### 🧩 **Raven's Coloured Progressive Matrices**
- **ID**: `Ravens-CPM`
- **Type**: Non-verbal assessment
- **Use Case**: Eductive ability and problem-solving

### Language Assessments

#### 🗣️ **Aston Index Assessment**
- **ID**: `Aston-Index`
- **Focus**: Language difficulties in children
- **Use Case**: Language diagnosis

#### 👂 **TEST OF AUDITORY PROCESSING SKILLS-TAPS-3**
- **ID**: `TAPS-3`
- **Areas**: Phonological skills, Memory, Auditory cohesion
- **Use Case**: Auditory processing assessment

#### ✍️ **TEST OF WRITTEN LANGUAGE (TOWL-4)**
- **ID**: `TOWL-4`
- **Areas**: 7 skill areas, 3 composite scores
- **Use Case**: Written language assessment

#### 📖 **Nelson-Denny Reading Test**
- **ID**: `Nelson-Denny`
- **Areas**: Vocabulary, Comprehension, Reading Rate
- **Use Case**: Reading proficiency assessment

### ADHD/Attention Assessments

#### 📋 **ADHD-DSM5 Checklist**
- **ID**: `ADHT-BSM`
- **Criteria**: DSM-5 ADHD criteria
- **Areas**: Inattention, Hyperactivity
- **Use Case**: ADHD screening

#### 📝 **EACA AUTISM ASSESSMENT**
- **ID**: `ADHDT2`
- **Focus**: Attention-Deficit/Hyperactivity Disorder
- **Use Case**: ADHD comprehensive assessment

#### 🧠 **Brown Executive Function/Attention Scales**
- **ID**: `Brown-EF-A`
- **Areas**: Executive function, Attention processes
- **Use Case**: Executive functioning assessment

### Autism Assessments

#### 🧩 **Gilliam Autism Rating Scale - 3**
- **ID**: `GARS-3`
- **Use Case**: Autism spectrum disorder identification

#### 🧩 **Educational Assessment of Children with Autism (EACA)**
- **ID**: `EACA-Autism`
- **Focus**: Triad of impairments across 7 domains
- **Use Case**: Comprehensive autism assessment

### Cognitive-Processing Assessments

#### 🧠 **ROSS INFORMATION PROCESSING ASSESSMENT (RIPA)-PRIMARY**
- **ID**: `RIPA-Primary`
- **Age Range**: 5-0 to 12-11 years
- **Areas**: Attention, Memory, Orientation, Language, Problem Solving
- **Use Case**: Cognitive-linguistic deficits assessment

### Motor/Perceptual Assessments

#### ✏️ **Bender Gestalt Test (BKT)**
- **ID**: `BKT`
- **Areas**: Motor coordination, Kinesthetic perception
- **Use Case**: Visual-motor integration

### Adaptive Behavior

#### 👥 **VINELAND ADAPTIVE BEHAVIOUR SCALES-VABS-3**
- **ID**: `VABS-3`
- **Areas**: Daily living activities, Self-care, Social interaction
- **Use Case**: Adaptive behavior assessment

### Academic Readiness

#### 📚 **Early Academic Competency Assessment**
- **ID**: `EACA`
- **Use Case**: Early academic skills screening

### Summary/Diagnostic Reports

#### 🧠 **DIAGNOSTIC ASSESSMENT REPORT**
- **ID**: `DiagnosticReport`
- **Basis**: DSM-5 criteria, Standardized test results
- **Use Case**: Comprehensive diagnostic reporting

#### 📊 **SUMMARY OF EVALUATION**
- **ID**: `EvaluationSummary`
- **Instruments**: WJ-IV COG, WJ-IV ACH, Brown's EF/A Scale
- **Use Case**: Multi-assessment summary

## Report Generation Process

### Step 1: Template Selection
```javascript
// User selects template from dropdown
const template = ASSESSMENT_TEMPLATES.find(t => t.id === e.target.value);
setSelectedTemplate(template);
setUseTemplate(true);
```

### Step 2: Data Preparation
```javascript
// Get template-specific data structure
const templateData = getTemplateData(selectedTemplate.id, examinee, assessment);
```

### Step 3: Report Generation
```javascript
// Generate report using template-specific logic
switch (template.type) {
  case 'WRAT-5':
    return generateWRAT5Report(template);
  case 'WRMT-II':
    return generateWRMT2Report(template);
  // ... etc for all 22 templates
}
```

## Template-Specific Formulas

### WRAT-5 Scoring Formula
```javascript
// Raw Score → Standard Score → Percentile → Category
mathRaw → mathStd → mathPct → mathCat
spellingRaw → spellingStd → spellingPct → spellingCat
wordReadingRaw → wordReadingStd → wordReadingPct → wordReadingCat
sentenceRaw → sentenceStd → sentencePct → sentenceCat
```

### WRMT-II Scoring Formula
```javascript
// Basic Skills
wordIdentification: { raw, standard, ageEquivalent, rpi, percentileRank, descriptor }
wordAttack: { raw, standard, ageEquivalent, rpi, percentileRank, descriptor }

// Reading Comprehension
antonyms: { raw, standard, ageEquivalent, rpi, percentileRank, descriptor }
// ... other subtests
```

### ADHD-DSM5 Formula
```javascript
// DSM-5 Criteria Scoring
inattention: { score, criteria, interpretation }
hyperactivity: { score, criteria, interpretation }
totalScore: inattention + hyperactivity
```

## Data Structures

### WRAT-5 Data Structure
```javascript
{
  type: 'WRAT-5',
  name: 'WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)',
  studentName: 'John Doe',
  examinerName: 'Dr. Smith',
  testDate: '2026-03-27',
  scores: {
    mathRaw: '30',
    mathStd: '84',
    mathPct: '14',
    mathCat: 'Low Average',
    // ... other subtest scores
  }
}
```

### Diagnostic Report Data Structure
```javascript
{
  type: 'Diagnostic Report',
  name: 'DIAGNOSTIC ASSESSMENT REPORT',
  diagnosticImpression: {
    criteria: 'DSM-5',
    diagnosis: 'Autism Spectrum Disorder',
    supportLevel: 'with substantial support',
    deficits: [/* array of deficits */]
  },
  recommendations: [/* array of recommendations */],
  accommodations: [/* array of accommodations */]
}
```

## Report Output Format

### Professional Report Elements
1. **Header**: Template name, student details, test date
2. **Scores Section**: Template-specific score presentation
3. **Analysis**: Interpretation based on template formulas
4. **Recommendations**: Template-specific recommendations
5. **Interpretation**: Professional summary

### Example WRAT-5 Report Output
```
WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)
Student: John Doe
Examiner: Dr. Smith
Date: 2026-03-27

SUBTEST SCORES:
Math Computation: Raw=30, Standard=84, Percentile=14, Category=Low Average
Spelling: Raw=22, Standard=73, Percentile=4, Category=Very Low
Word Reading: Raw=32, Standard=68, Percentile=2, Category=Extremely Low
Sentence Comprehension: Raw=8, Standard=85, Percentile=16, Category=Low Average

INTERPRETATION:
The WRAT-5 assessment provides a comprehensive evaluation of basic academic skills...
```

## Implementation Details

### Custom Dropdown System
- Professional appearance with icons
- Smooth animations and transitions
- Click outside to close functionality
- Proper z-index management
- Scrollable for long lists

### Template Management
- Centralized template definitions
- Consistent naming across components
- Easy addition of new templates
- Template metadata (icons, descriptions, categories)

### Error Handling
- Template not found fallback
- Graceful degradation for missing data
- User-friendly error messages
- Debug logging for troubleshooting

## Usage Examples

### Generating a WRAT-5 Report
```javascript
// 1. User selects "WIDE RANGE ACHIEVEMENT TEST- WRAT-5 (ENGLISH)"
// 2. System calls getTemplateData('WRAT5', examinee, assessment)
// 3. AssessmentReportGenerator.generateWRAT5Report() processes data
// 4. Professional WRAT-5 report is generated with proper formatting
```

### Generating a Diagnostic Report
```javascript
// 1. User selects "DIAGNOSTIC ASSESSMENT REPORT"
// 2. System calls getTemplateData('DiagnosticReport', examinee, assessment)
// 3. AssessmentReportGenerator.generateDiagnosticReport() processes data
// 4. Comprehensive diagnostic report with DSM-5 criteria is generated
```

## Future Enhancements

### Planned Features
1. **Custom Template Builder**: Allow users to create custom templates
2. **Advanced Analytics**: More sophisticated interpretation algorithms
3. **Multi-language Support**: Reports in multiple languages
4. **Export Options**: PDF, Word, Excel export formats
5. **Template Sharing**: Share custom templates between users

### Scalability Considerations
- Modular template system allows easy addition of new assessments
- Standardized data structures ensure consistency
- Component-based architecture supports customization
- API-based approach enables integration with external systems

## Troubleshooting

### Common Issues
1. **Template Not Found**: Check template ID spelling in switch statement
2. **Missing Data**: Ensure all required score fields are populated
3. **Dropdown Positioning**: Check z-index and overflow settings
4. **Report Generation**: Verify template data mapping

### Debug Tools
- Console logging for template selection
- Template data validation
- Error boundary handling
- Performance monitoring

## Conclusion

The Kivi Assessment Report Generation System provides a robust, scalable, and professional solution for generating assessment reports across 22 different template types. Each template uses its specific formulas and interpretation methods, ensuring accurate and meaningful reports for clinicians, educators, and assessment professionals.

The system's modular architecture allows for easy expansion and customization while maintaining consistency and reliability across all report types.
