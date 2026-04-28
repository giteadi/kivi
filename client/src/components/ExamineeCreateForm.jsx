import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiSave, 
  FiX, 
  FiUser, 
  FiMail, 
  FiCalendar,
  FiMapPin,
  FiChevronDown,
  FiInfo,
  FiCheckCircle,
  FiPhone,
  FiFileText
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import api from '../services/api';
import { fetchPatients } from '../store/slices/patientSlice';
import Sidebar from './Sidebar';

const ExamineeCreateForm = ({ onSave, onCancel, activeItem = 'patients', setActiveItem, examineeId = null, isEditMode = false }) => {
  console.log('🚀 ExamineeCreateForm MOUNTED!');
  console.log('📍 Props:', { examineeId, isEditMode, activeItem });
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('demographics');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState({ years: 0, months: 0 });
  
  // Centers state for dynamic center selection
  const [centers, setCenters] = useState([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  
  // State for Evaluation tab checkboxes and Other inputs
  const [evaluationData, setEvaluationData] = useState({
    academicConcerns: { other: false, otherText: '' },
    cognitiveEvaluation: { other: false, otherText: '' },
    behaviourConcerns: { other: false, otherText: '' },
    mentalHealth: { other: false, otherText: '' },
    developmentalDelay: { other: false, otherText: '' },
    languageConcerns: { other: false, otherText: '' },
    speechConcerns: { other: false, otherText: '' },
    physicalConcerns: { other: false, otherText: '' },
    substanceAbuse: { other: false, otherText: '' },
    employment: { other: false, otherText: '' }
  });

  // State for Evaluation sub-tabs and Diagnoses
  const [evaluationSubTab, setEvaluationSubTab] = useState('reasonsForTesting');
  const [diagnosisData, setDiagnosisData] = useState({
    autismSpectrum: {
      aspergers: false,
      autistic: false,
      childhoodDisintegrative: false,
      pervasiveDevelopmental: false,
      retts: false,
      other: false,
      otherText: ''
    },
    behaviourEmotional: {
      adhd: false,
      conduct: false,
      disruptive: false,
      emotional: false,
      intermittentExplosive: false,
      kleptomania: false,
      oppositionalDefiant: false,
      pathologicalGambling: false,
      pyromania: false,
      trichotillomania: false,
      other: false,
      otherText: ''
    },
    giftedTalented: {
      gifted: false,
      other: false,
      otherText: ''
    },
    intellectualDisability: {
      borderline: false,
      cognitiveDelay: false,
      mild: false,
      moderate: false,
      profound: false,
      severe: false,
      other: false,
      otherText: ''
    },
    languageDelay: {
      expressive: false,
      delay: false,
      mixed: false,
      phonological: false,
      other: false,
      otherText: ''
    },
    learningDisability: {
      reading: false,
      mathematics: false,
      disorder: false,
      writing: false,
      nonverbal: false,
      other: false,
      otherText: ''
    },
    moodRelated: {
      acuteStress: false,
      agoraphobia: false,
      anorexia: false,
      bipolar: false,
      bulimia: false,
      conversion: false,
      cyclothymic: false,
      depressive: false,
      dysthymic: false,
      generalizedAnxiety: false,
      majorDepressive: false,
      ocd: false,
      pain: false,
      panic: false,
      ptsd: false,
      separationAnxiety: false,
      socialPhobia: false,
      somatization: false,
      specificPhobia: false,
      other: false,
      otherText: ''
    },
    motorDelay: {
      developmentalCoordination: false,
      dyspraxia: false,
      motorDelay: false,
      paraplegia: false,
      quadriplegia: false,
      stereotypic: false,
      other: false,
      otherText: ''
    },
    personalityDisorders: {
      antisocial: false,
      avoidant: false,
      borderline: false,
      dependent: false,
      histrionic: false,
      narcissistic: false,
      ocd: false,
      ocpd: false,
      paranoid: false,
      schizoid: false,
      schizotypal: false,
      other: false,
      otherText: ''
    },
    schizophrenia: {
      briefPsychotic: false,
      delusional: false,
      schizoaffective: false,
      catatonic: false,
      disorganized: false,
      paranoid: false,
      residual: false,
      undifferentiated: false,
      schizophreniform: false,
      other: false,
      otherText: ''
    },
    speech: {
      aphasia: false,
      apraxia: false,
      articulation: false,
      brocas: false,
      centralAuditory: false,
      dysarthria: false,
      fluency: false,
      receptive: false,
      voice: false,
      other: false,
      otherText: ''
    },
    substanceAbuse: {
      alcoholAbuse: false,
      alcoholDependence: false,
      polysubstanceAbuse: false,
      polysubstanceDependence: false,
      substanceAbuse: false,
      substanceDependence: false,
      other: false,
      otherText: ''
    },
    traumaticBrainInjury: {
      tbi: false,
      mild: false,
      moderate: false,
      severe: false,
      other: false,
      otherText: ''
    },
    other: {
      adjustment: false,
      cognitive: false,
      creutzfeldtJakob: false,
      alzheimers: false,
      depersonalization: false,
      dissociative: false,
      epilepsy: false,
      factitious: false,
      genderIdentity: false,
      huntingtons: false,
      leftStroke: false,
      leftEpilepsy: false,
      mildCognitive: false,
      parkinsons: false,
      picks: false,
      insomnia: false,
      rightStroke: false,
      rightEpilepsy: false,
      seizure: false,
      stroke: false,
      tic: false,
      tourettes: false,
      vascularDementia: false,
      other: false,
      otherText: ''
    }
  });
  const [expandedDiagnoses, setExpandedDiagnoses] = useState({
    autismSpectrum: true,
    behaviourEmotional: true,
    giftedTalented: true,
    intellectualDisability: true,
    languageDelay: true,
    learningDisability: true,
    moodRelated: true,
    motorDelay: true,
    personalityDisorders: true,
    schizophrenia: true,
    speech: true,
    substanceAbuse: true,
    traumaticBrainInjury: true,
    other: true
  });

  // State for History sub-tabs
  const [historySubTab, setHistorySubTab] = useState('referral');

  // State for History Other fields
  const [historyOtherData, setHistoryOtherData] = useState({
    // Language/Development
    birthInformationOther: false,
    birthInformationOtherText: '',
    developmentalMilestonesOther: false,
    developmentalMilestonesOtherText: '',
    developmentalHistoryOther: false,
    developmentalHistoryOtherText: '',
    exposedToEnglishOther: false,
    exposedToEnglishOtherText: '',
    speakingEnglishOther: false,
    speakingEnglishOtherText: '',
    // Referral
    referralSourceOther: false,
    referralSourceOtherText: '',
    // Education
    educationHistoryOther: false,
    educationHistoryOtherText: '',
    motherEducationOther: false,
    motherEducationOtherText: '',
    fatherEducationOther: false,
    fatherEducationOtherText: '',
    schoolPlacementOther: false,
    schoolPlacementOtherText: '',
    // Health
    healthHistoryOther: false,
    healthHistoryOtherText: '',
    visionResultOther: false,
    visionResultOtherText: '',
    hearingResultOther: false,
    hearingResultOtherText: '',
    // Employment
    employmentStatusOther: false,
    employmentStatusOtherText: '',
    employmentHistoryOther: false,
    employmentHistoryOtherText: ''
  });

  // State for Referral fields
  const [referralData, setReferralData] = useState({
    referralSourceName: '',
    referralSourceRole: '',
    schoolRelatedConcerns: false,
    speechConcerns: false,
    languageConcerns: false,
    socialEmotionalConcerns: false,
    cognitiveConcerns: false,
    physicalConcerns: false,
    vocationalRehabilitationLegal: false
  });

  // State for Referral Reason text
  const [referralReasonText, setReferralReasonText] = useState('');

  // State for Sample Report Sentence
  const [showSampleReport, setShowSampleReport] = useState(false);

  // State for Current Living Arrangements
  const [currentLivingArrangement, setCurrentLivingArrangement] = useState('');
  const [currentLivingArrangementOther, setCurrentLivingArrangementOther] = useState('');

  // State for Language/Development Sample Report Sentence
  const [showLanguageSampleReport, setShowLanguageSampleReport] = useState(false);
  const [showDevelopmentSampleReport, setShowDevelopmentSampleReport] = useState(false);
  const [languageSampleReportSentence, setLanguageSampleReportSentence] = useState('');
  const [languageSampleReportData, setLanguageSampleReportData] = useState({
    primaryLanguage: '',
    exposedToEnglish: 'not_specified',
    exposedToEnglishOther: '',
    speakingEnglish: 'not_specified',
    speakingEnglishOther: '',
    fluencyRating: 'not_specified',
    fluencyRatingOther: '',
    birthComplications: 'with no apparent complications',
    birthComplicationsOther: '',
    milestoneSitting: 'unknown',
    milestoneCrawling: 'unknown',
    milestoneStanding: 'unknown',
    milestoneWalking: 'unknown',
    milestoneBabbling: 'unknown',
    milestoneFirstWords: 'unknown',
    milestoneShortSentences: 'unknown',
    milestoneEating: 'unknown',
    milestoneSelfFeeding: 'unknown',
    milestoneToiletAwake: 'unknown',
    milestoneStayDry: 'unknown',
    milestoneSocial: 'unknown',
    additionalInfo: ''
  });

  // State for Education Sample Report Sentence
  const [showEducationSampleReport, setShowEducationSampleReport] = useState(false);
  const [educationSampleReportSentence, setEducationSampleReportSentence] = useState('');
  const [educationSampleReportData, setEducationSampleReportData] = useState({
    currentYear: '',
    schoolName: '',
    motherEducation: '',
    motherEducationOther: '',
    fatherEducation: '',
    fatherEducationOther: '',
    examineeCompleted: false,
    motherCompleted: false,
    fatherCompleted: false,
    schoolPlacement: '',
    placementDuration: '',
    currentResults: '',
    currentSchoolName: '',
    currentAttendance: '',
    currentPerformance: '',
    currentDifficulties: '',
    pastAttendance: '',
    pastPerformance: '',
    pastDifficulties: '',
    testPerformanceReading: 'not_specified',
    testPerformanceMath: 'not_specified',
    testPerformanceLanguage: 'not_specified',
    testPerformanceOther: 'not_specified',
    pastTestReading: 'not_specified',
    pastTestMath: 'not_specified',
    pastTestLanguage: 'not_specified',
    pastTestOther: 'not_specified',
    schoolChanges: '',
    retainedYears: '',
    nurseryExperience: '',
    preschoolExperience: '',
    personalStrengths: [],
    personalWeaknesses: [],
    peerStrengths: [],
    peerWeaknesses: [],
    learningDisabilities: [],
    additionalInfo: ''
  });

  // State for Health Sample Report Sentence
  const [showHealthSampleReport, setShowHealthSampleReport] = useState(false);
  const [healthSampleReportSentence, setHealthSampleReportSentence] = useState('');
  const [healthSampleReportData, setHealthSampleReportData] = useState({
    healthHistorySource: '',
    healthHistorySourceOther: '',
    visionDate: '',
    visionResult: '',
    visionResultOther: '',
    hearingDate: '',
    hearingResult: '',
    hearingResultOther: '',
    sensoryDysfunction: 'no_history',
    sensoryHistory: [],
    motorDysfunction: 'no_history',
    fineMotorHistory: [],
    grossMotorHistory: [],
    pastDiagnosed: [],
    currentDiagnosed: [],
    pastTreated: [],
    currentTreated: [],
    psychiatricPast: [],
    psychiatricCurrent: [],
    psychiatricPastTreated: [],
    psychiatricCurrentTreated: [],
    neurologicalPast: [],
    neurologicalCurrent: [],
    neurologicalPastTreated: [],
    neurologicalCurrentTreated: [],
    otherPast: [],
    otherCurrent: [],
    otherPastTreated: [],
    otherCurrentTreated: [],
    currentMedications: '',
    additionalInfo: ''
  });

  // State for Employment Sample Report Sentence
  const [showEmploymentSampleReport, setShowEmploymentSampleReport] = useState(false);
  const [employmentSampleReportSentence, setEmploymentSampleReportSentence] = useState('');
  const [employmentSampleReportData, setEmploymentSampleReportData] = useState({
    employmentStatus: '',
    employmentStatusOther: '',
    currentJob: '',
    jobDuration: '',
    previousJobs: '',
    employmentHistorySource: '',
    employmentHistorySourceOther: '',
    additionalInfo: ''
  });

  // Handler for History Other checkboxes
  const handleHistoryOtherChange = (field, checked) => {
    setHistoryOtherData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Handler for History Other text inputs
  const handleHistoryOtherTextChange = (field, text) => {
    setHistoryOtherData(prev => ({
      ...prev,
      [field]: text
    }));
  };

  // Handler for Referral fields
  const handleReferralChange = (field, checked) => {
    setReferralData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleReferralTextChange = (field, text) => {
    setReferralData(prev => ({
      ...prev,
      [field]: text
    }));
  };

  // Handler for Evaluation checkboxes
  const handleEvaluationFieldChange = (category, field, checked) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: checked }
    }));
  };

  const handleEvaluationChange = (category, checked) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], other: checked }
    }));
  };

  const handleEvaluationTextChange = (category, text) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], otherText: text }
    }));
  };

  // Generate dynamic sample report sentence based on selected concerns
  const generateSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const sourceName = referralData.referralSourceName || 'Mr. Smith';
    const sourceRole = referralData.referralSourceRole || 'teacher';
    
    // Build concerns list based on referralData checkboxes
    const concerns = [];
    
    if (referralData.schoolRelatedConcerns) {
      concerns.push('school-related concerns');
    }
    if (referralData.speechConcerns) {
      concerns.push('speech concerns');
    }
    if (referralData.languageConcerns) {
      concerns.push('language concerns');
    }
    if (referralData.socialEmotionalConcerns) {
      concerns.push('social/emotional concerns');
    }
    if (referralData.cognitiveConcerns) {
      concerns.push('cognitive concerns');
    }
    if (referralData.physicalConcerns) {
      concerns.push('physical concerns');
    }
    if (referralData.vocationalRehabilitationLegal) {
      concerns.push('vocational/rehabilitation/legal issues');
    }
    
    // Build the sentence with proper grammar
    let concernsText = '';
    if (concerns.length === 0) {
      concernsText = 'school-related concerns and speech concerns';
    } else if (concerns.length === 1) {
      concernsText = concerns[0];
    } else if (concerns.length === 2) {
      concernsText = `${concerns[0]} and ${concerns[1]}`;
    } else {
      const lastConcern = concerns[concerns.length - 1];
      const otherConcerns = concerns.slice(0, -1).join(', ');
      concernsText = `${otherConcerns}, and ${lastConcern}`;
    }
    
    return `${firstName} was referred for an evaluation by {${sourceName}}, his/her {${sourceRole}}, secondary to {${concernsText}}.`;
  };

  // Handler for Personal Sample Report Sentence text inputs
  // Handler for Language/Development Sample Report Sentence
  const handleLanguageSampleReportTextChange = (field, value) => {
    setLanguageSampleReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate Language-only sample report sentence (for Language section)
  const generateLanguageOnlySampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const primaryLanguage = languageSampleReportData.primaryLanguage || 'English';
    const exposedToEnglish = languageSampleReportData.exposedToEnglish === 'not_specified' ? 'since birth' : 
      languageSampleReportData.exposedToEnglish === 'since_birth' ? 'since birth' :
      languageSampleReportData.exposedToEnglish === 'one_to_three' ? 'for one to three years' :
      languageSampleReportData.exposedToEnglish === 'four_to_five' ? 'for four to five years' :
      languageSampleReportData.exposedToEnglish === 'longer_than_five' ? 'for longer than five years' :
      languageSampleReportData.exposedToEnglish === 'other' ? 'other' : 'since birth';
    const speakingEnglish = languageSampleReportData.speakingEnglish === 'not_specified' ? 'since first talking' :
      languageSampleReportData.speakingEnglish === 'since_first_talking' ? 'since first talking' :
      languageSampleReportData.speakingEnglish === 'one_to_three' ? 'for one to three years' :
      languageSampleReportData.speakingEnglish === 'four_to_five' ? 'for four to five years' :
      languageSampleReportData.speakingEnglish === 'longer_than_five' ? 'for longer than five years' :
      languageSampleReportData.speakingEnglish === 'other' ? 'other' : 'since first talking';
    
    return `${firstName}'s primary language is {${primaryLanguage}}. He has been exposed to English {${exposedToEnglish}} and speaking English {${speakingEnglish}}.`;
  };

  // Generate Development-only sample report sentence (for Development section)
  const generateDevelopmentOnlySampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const birthComplications = languageSampleReportData.birthComplications || 'with no apparent complications';
    
    const getMilestoneText = (value) => {
      if (value === 'early') return 'earlier than expected';
      if (value === 'typical') return 'within the expected time frame';
      if (value === 'late') return 'later than expected';
      return 'unknown';
    };
    
    const sitting = getMilestoneText(languageSampleReportData.milestoneSitting);
    const crawling = getMilestoneText(languageSampleReportData.milestoneCrawling);
    const babbling = getMilestoneText(languageSampleReportData.milestoneBabbling);
    const firstWords = getMilestoneText(languageSampleReportData.milestoneFirstWords);
    const social = languageSampleReportData.milestoneSocial === 'atypical' ? 'atypical' :
                  languageSampleReportData.milestoneSocial === 'typical' ? 'typical' :
                  languageSampleReportData.milestoneSocial === 'delayed' ? 'delayed' : 'unknown';
    
    return `${firstName} was born {${birthComplications}}. ${firstName} began {sitting alone} and {crawling} {${sitting}}. He began {babbling} and {speaking first words} {${firstWords}}. His development of social interaction skills has been {${social}} when compared to peers.`;
  };

  // Generate Language/Development sample report sentence (combined - for backward compatibility)
  const generateLanguageSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const primaryLanguage = languageSampleReportData.primaryLanguage || 'English';
    const exposedToEnglish = languageSampleReportData.exposedToEnglish === 'not_specified' ? 'since birth' :
      languageSampleReportData.exposedToEnglish === 'since_birth' ? 'since birth' :
      languageSampleReportData.exposedToEnglish === 'one_to_three' ? 'for one to three years' :
      languageSampleReportData.exposedToEnglish === 'four_to_five' ? 'for four to five years' :
      languageSampleReportData.exposedToEnglish === 'longer_than_five' ? 'for longer than five years' :
      languageSampleReportData.exposedToEnglish === 'other' ? (languageSampleReportData.exposedToEnglishOther || 'other') : 'since birth';
    const speakingEnglish = languageSampleReportData.speakingEnglish === 'not_specified' ? 'since first talking' :
      languageSampleReportData.speakingEnglish === 'since_first_talking' ? 'since first talking' :
      languageSampleReportData.speakingEnglish === 'one_to_three' ? 'for one to three years' :
      languageSampleReportData.speakingEnglish === 'four_to_five' ? 'for four to five years' :
      languageSampleReportData.speakingEnglish === 'longer_than_five' ? 'for longer than five years' :
      languageSampleReportData.speakingEnglish === 'other' ? (languageSampleReportData.speakingEnglishOther || 'other') : 'since first talking';
    const birthComplications = languageSampleReportData.birthComplications || 'with no apparent complications';
    
    const getMilestoneText = (value) => {
      if (value === 'early') return 'earlier than expected';
      if (value === 'typical') return 'within the expected time frame';
      if (value === 'late') return 'later than expected';
      return 'unknown';
    };
    
    const sitting = getMilestoneText(languageSampleReportData.milestoneSitting);
    const crawling = getMilestoneText(languageSampleReportData.milestoneCrawling);
    const babbling = getMilestoneText(languageSampleReportData.milestoneBabbling);
    const firstWords = getMilestoneText(languageSampleReportData.milestoneFirstWords);
    const social = languageSampleReportData.milestoneSocial === 'atypical' ? 'atypical' :
                  languageSampleReportData.milestoneSocial === 'typical' ? 'typical' :
                  languageSampleReportData.milestoneSocial === 'delayed' ? 'delayed' : 'unknown';
    
    return `${firstName}'s primary language is {${primaryLanguage}}. He has been exposed to English {${exposedToEnglish}} and speaking English {${speakingEnglish}}. ${firstName} was born {${birthComplications}}. ${firstName} began {sitting alone} and {crawling} {${sitting}}. He began {babbling} and {speaking first words} {${firstWords}}. His development of social interaction skills has been {${social}} when compared to peers.`;
  };

  // Handler for Education Sample Report Sentence
  const handleEducationSampleReportTextChange = (field, value) => {
    setEducationSampleReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationSampleReportCheckboxChange = (field, checked) => {
    setEducationSampleReportData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleEducationArrayChange = (field, value) => {
    setEducationSampleReportData(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  // Generate Education sample report sentence
  const generateEducationSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const currentYear = educationSampleReportData.currentYear || 'Year 3';
    const schoolName = educationSampleReportData.schoolName || 'Oak Tree Primary School';
    const motherEducation = educationSampleReportData.motherEducation === 'other'
      ? (educationSampleReportData.motherEducationOther || 'other')
      : (educationSampleReportData.motherEducation || 'graduate');
    const fatherEducation = educationSampleReportData.fatherEducation === 'other'
      ? (educationSampleReportData.fatherEducationOther || 'other')
      : (educationSampleReportData.fatherEducation || 'high school graduate');
    
    const strengths = educationSampleReportData.personalStrengths.length > 0 
      ? educationSampleReportData.personalStrengths.join(', ') 
      : 'mathematics, science, and art';
    const weaknesses = educationSampleReportData.personalWeaknesses.length > 0 
      ? educationSampleReportData.personalWeaknesses.join(', ') 
      : 'language';
    const peerStrengths = educationSampleReportData.peerStrengths.length > 0 
      ? educationSampleReportData.peerStrengths.join(', ') 
      : 'art';
    const peerWeaknesses = educationSampleReportData.peerWeaknesses.length > 0 
      ? educationSampleReportData.peerWeaknesses.join(', ') 
      : 'language';
    const disabilities = educationSampleReportData.learningDisabilities.length > 0 
      ? educationSampleReportData.learningDisabilities.join(' and ') 
      : 'reading and writing';
    
    return `${firstName} is currently in {${currentYear}} at {${schoolName}}. His mother is a {${motherEducation}} and his father is a {${fatherEducation}}. Thus far ${firstName} has demonstrated personal strengths in {${strengths}}, and weakness in {${weaknesses}}. When compared to his peers, he has shown strength in {${peerStrengths}} and weakness in {${peerWeaknesses}}. He has been diagnosed with a learning disability (or disorder) in the following areas: {${disabilities}}.`;
  };

  // Generate Education Level sample report sentence (for Highest Level of Education section)
  const generateEducationLevelSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const currentYear = educationSampleReportData.currentYear || 'Year 3';
    const schoolName = educationSampleReportData.schoolName || 'Oak Tree Primary School';
    const motherEducation = educationSampleReportData.motherEducation === 'other'
      ? (educationSampleReportData.motherEducationOther || 'other')
      : (educationSampleReportData.motherEducation || 'graduate');
    const fatherEducation = educationSampleReportData.fatherEducation === 'other'
      ? (educationSampleReportData.fatherEducationOther || 'other')
      : (educationSampleReportData.fatherEducation || 'high school graduate');

    return `${firstName} is currently in {${currentYear}} at {${schoolName}}. His mother is a {${motherEducation}} and his father is a {${fatherEducation}}.`;
  };

  // Generate School Placement sample report sentence (for School/Class Placement section)
  const generateSchoolPlacementSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const schoolPlacement = educationSampleReportData.schoolPlacement || 'in both general and special education classrooms';
    const currentResults = educationSampleReportData.currentResults || 'obtains average grades';
    const currentAttendance = educationSampleReportData.currentAttendance || 'good attendance';
    const currentDifficulties = educationSampleReportData.currentDifficulties || 'occasional interpersonal difficulties';
    const pastDifficulties = educationSampleReportData.pastDifficulties || 'many unexcused absences';
    
    return `${firstName} is placed {${schoolPlacement}} and {${currentResults}}. He currently has {${currentAttendance}} and has {${currentDifficulties}}. He is experiencing {minor academic difficulties}. Previously, he had {${pastDifficulties}} at school and had {frequent episodes of significant behaviour problems}. He experienced {many academic difficulties}.`;
  };

  // Handler for Health Sample Report Sentence
  const handleHealthSampleReportTextChange = (field, value) => {
    setHealthSampleReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHealthSampleReportCheckboxChange = (field, checked) => {
    setHealthSampleReportData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleHealthArrayChange = (field, value) => {
    setHealthSampleReportData(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  // Generate Health sample report sentence
  const generateHealthSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const healthHistorySource = healthSampleReportData.healthHistorySource === 'other'
      ? (healthSampleReportData.healthHistorySourceOther || 'other')
      : (healthSampleReportData.healthHistorySource || 'his mother');
    const visionResult = healthSampleReportData.visionResult === 'other'
      ? (healthSampleReportData.visionResultOther || 'other')
      : (healthSampleReportData.visionResult || 'that he has normal visual acuity');
    const hearingResult = healthSampleReportData.hearingResult === 'other'
      ? (healthSampleReportData.hearingResultOther || 'other')
      : (healthSampleReportData.hearingResult || 'within normal limits with the assistance of a hearing aid');
    const sensoryHistory = healthSampleReportData.sensoryHistory.length > 0 
      ? healthSampleReportData.sensoryHistory.join(', ') 
      : 'visual perceptual dysfunction';
    const motorDysfunction = healthSampleReportData.motorDysfunction === 'no_history' ? 'No history of motor dysfunction was reported' : 'A history of motor dysfunction was reported';
    const pastDiagnosed = healthSampleReportData.pastDiagnosed.length > 0 
      ? healthSampleReportData.pastDiagnosed.join(', ') 
      : 'asthma';
    const pastTreated = healthSampleReportData.pastTreated.length > 0 
      ? healthSampleReportData.pastTreated.join(', ') 
      : 'asthma';
    const currentDiagnosed = healthSampleReportData.currentDiagnosed.length > 0 
      ? healthSampleReportData.currentDiagnosed.join(', ') 
      : 'Attention-Deficit Hyperactivity Disorder';
    
    return `${firstName}'s health history was provided by {${healthHistorySource}}. ${firstName}'s most recent vision screening revealed {${visionResult}}. ${firstName}'s most recent hearing screening revealed that he hears {${hearingResult}}. Reported sensory problems include {${sensoryHistory}}. {${motorDysfunction}}. ${firstName} was previously diagnosed with {${pastDiagnosed}}. He received treatment for {${pastTreated}}. ${firstName} is currently diagnosed with {${currentDiagnosed}}.`;
  };

  // Handler for Employment Sample Report Sentence
  const handleEmploymentSampleReportTextChange = (field, value) => {
    setEmploymentSampleReportData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Generate Employment sample report sentence
  const generateEmploymentSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const employmentStatus = employmentSampleReportData.employmentStatus === 'other'
      ? (employmentSampleReportData.employmentStatusOther || 'other')
      : (employmentSampleReportData.employmentStatus || 'employed');
    const currentJob = employmentSampleReportData.currentJob || 'software engineer';
    const jobDuration = employmentSampleReportData.jobDuration || '2 years';
    const employmentHistorySource = employmentSampleReportData.employmentHistorySource === 'other'
      ? (employmentSampleReportData.employmentHistorySourceOther || 'other')
      : (employmentSampleReportData.employmentHistorySource || 'self-report');
    
    return `${firstName} is currently ${employmentStatus} as a {${currentJob}} for {${jobDuration}}. Employment history was provided by {${employmentHistorySource}}.`;
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    examineeId: '',
    gender: '',
    birthDate: '',
    schoolName: '',
    grade: '',
    languageOfTesting: '',
    customLanguage: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    customField1: '',
    customField2: '',
    customField3: '',
    customField4: '',
    status: 'active',
    registrationDate: '',
    comment: '',
    account: 'CENTRIX CENTRE',
    requiresAssessment: false,
    requiresTherapy: false
  });

  // Calculate age when birth date changes
  useEffect(() => {
    if (formData.birthDate) {
      const birth = new Date(formData.birthDate);
      const today = new Date();
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      setAge({ years, months });
    } else {
      setAge({ years: 0, months: 0 });
    }
  }, [formData.birthDate]);

  // Fetch examinee data in edit mode
  useEffect(() => {
    const fetchExamineeData = async () => {
      if (isEditMode && examineeId) {
        setIsLoading(true);
        try {
          const response = await api.getPatient(examineeId);
          if (response.success && response.data) {
            const patient = response.data;
            
            // Parse JSON fields
            let evalData = patient.evaluation_data;
            let diagData = patient.diagnosis_data;
            let histData = patient.history_data;
            
            console.log('🔍 EDIT MODE DEBUG:');
            console.log('📊 Raw evalData:', evalData, 'Type:', typeof evalData);
            console.log('📊 Raw diagData:', diagData, 'Type:', typeof diagData);
            console.log('📊 Raw histData:', histData, 'Type:', typeof histData);
            
            if (typeof evalData === 'string') {
              try { evalData = JSON.parse(evalData); console.log('✅ Parsed evalData:', evalData); } catch (e) { console.error('❌ Error parsing evalData:', e); evalData = {}; }
            }
            if (typeof diagData === 'string') {
              try { diagData = JSON.parse(diagData); console.log('✅ Parsed diagData:', diagData); } catch (e) { console.error('❌ Error parsing diagData:', e); diagData = {}; }
            }
            if (typeof histData === 'string') {
              try { histData = JSON.parse(histData); console.log('✅ Parsed histData:', histData); } catch (e) { console.error('❌ Error parsing histData:', e); histData = {}; }
            }
            
            // Set form data
            setFormData({
              firstName: patient.first_name || '',
              middleName: patient.middle_name || '',
              lastName: patient.last_name || '',
              examineeId: patient.student_id || '',
              gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '',
              birthDate: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
              schoolName: patient.school_name || '',
              grade: patient.grade || '',
              languageOfTesting: patient.language_of_testing || '',
              customLanguage: patient.custom_language || '',
              email: patient.email || '',
              phone: patient.phone || '',
              address: patient.address || '',
              city: patient.city || '',
              state: patient.state || '',
              zipCode: patient.zip_code || '',
              emergencyContactName: patient.emergency_contact_name || '',
              emergencyContactPhone: patient.emergency_contact_phone || '',
              emergencyContactRelation: patient.emergency_contact_relation || '',
              customField1: patient.custom_field_1 || '',
              customField2: patient.custom_field_2 || '',
              customField3: patient.custom_field_3 || '',
              customField4: patient.custom_field_4 || '',
              status: patient.status || 'active',
              registrationDate: patient.registration_date ? new Date(patient.registration_date).toISOString().split('T')[0] : '',
              comment: patient.comment || '',
              account: patient.centre_name || 'CENTRIX CENTRE',
              requiresAssessment: patient.requires_assessment || false,
              requiresTherapy: patient.requires_therapy || false
            });
            
            // Set evaluation data with safe merging
            const safeEvalData = evalData || {};
            setEvaluationData(prev => ({
              academicConcerns: { ...prev.academicConcerns, ...(safeEvalData.academicConcerns || {}) },
              cognitiveEvaluation: { ...prev.cognitiveEvaluation, ...(safeEvalData.cognitiveEvaluation || {}) },
              behaviourConcerns: { ...prev.behaviourConcerns, ...(safeEvalData.behaviourConcerns || {}) },
              mentalHealth: { ...prev.mentalHealth, ...(safeEvalData.mentalHealth || {}) },
              developmentalDelay: { ...prev.developmentalDelay, ...(safeEvalData.developmentalDelay || {}) },
              languageConcerns: { ...prev.languageConcerns, ...(safeEvalData.languageConcerns || {}) },
              speechConcerns: { ...prev.speechConcerns, ...(safeEvalData.speechConcerns || {}) },
              physicalConcerns: { ...prev.physicalConcerns, ...(safeEvalData.physicalConcerns || {}) },
              substanceAbuse: { ...prev.substanceAbuse, ...(safeEvalData.substanceAbuse || {}) },
              employment: { ...prev.employment, ...(safeEvalData.employment || {}) }
            }));
            
            // Set diagnosis data - expand all categories in edit mode and load saved selections
            if (isEditMode) {
              setExpandedDiagnoses({
                autismSpectrum: true,
                behaviourEmotional: true,
                giftedTalented: true,
                intellectualDisability: true,
                languageDelay: true,
                learningDisability: true,
                moodRelated: true,
                motorDelay: true,
                personalityDisorders: true,
                schizophrenia: true,
                speech: true,
                substanceAbuse: true,
                traumaticBrainInjury: true,
                other: true
              });
              if (diagData && Object.keys(diagData).length > 0) {
                setDiagnosisData(prev => ({
                  ...prev,
                  ...diagData
                }));
              }
            } else if (diagData && Object.keys(diagData).length > 0) {
              setExpandedDiagnoses(prev => ({
                ...prev,
                ...diagData
              }));
              setDiagnosisData(prev => ({
                ...prev,
                ...diagData
              }));
            }
            
            // Set history data
            if (histData && Object.keys(histData).length > 0) {
              console.log('📝 Setting history data. Keys:', Object.keys(histData));
              console.log('📝 histData content:', JSON.stringify(histData, null, 2));
              
              setHistoryOtherData(prev => ({
                ...prev,
                ...histData
              }));
              
              // Set referral data
              setReferralData(prev => ({
                ...prev,
                referralSourceName: histData.referralSourceName || '',
                referralSourceRole: histData.referralSourceRole || '',
                schoolRelatedConcerns: histData.schoolRelatedConcerns || false,
                speechConcerns: histData.speechConcerns || false,
                languageConcerns: histData.languageConcerns || false,
                socialEmotionalConcerns: histData.socialEmotionalConcerns || false,
                cognitiveConcerns: histData.cognitiveConcerns || false,
                physicalConcerns: histData.physicalConcerns || false,
                vocationalRehabilitationLegal: histData.vocationalRehabilitationLegal || false
              }));
              console.log('✅ Referral data set');
              
              // Set referral reason text
              if (histData.referralReasonText) {
                setReferralReasonText(histData.referralReasonText);
                console.log('✅ Referral reason text set');
              }
              
              // Set language sample report data
              if (histData.languageSampleReportData) {
                console.log('📝 Setting language sample report data:', histData.languageSampleReportData);
                setLanguageSampleReportData(prev => ({
                  ...prev,
                  ...histData.languageSampleReportData
                }));
                console.log('✅ Language sample report data set');
              } else {
                console.log('⚠️ No languageSampleReportData in histData');
              }
              
              // Set education sample report data
              if (histData.educationSampleReportData) {
                console.log('📝 Setting education sample report data:', histData.educationSampleReportData);
                setEducationSampleReportData(prev => ({
                  ...prev,
                  ...histData.educationSampleReportData
                }));
                console.log('✅ Education sample report data set');
              } else {
                console.log('⚠️ No educationSampleReportData in histData');
              }
              
              // Set health sample report data
              if (histData.healthSampleReportData) {
                console.log('📝 Setting health sample report data:', histData.healthSampleReportData);
                setHealthSampleReportData(prev => ({
                  ...prev,
                  ...histData.healthSampleReportData
                }));
                console.log('✅ Health sample report data set');
              } else {
                console.log('⚠️ No healthSampleReportData in histData');
              }
              
              // Set employment sample report data
              if (histData.employmentSampleReportData) {
                console.log('📝 Setting employment sample report data:', histData.employmentSampleReportData);
                setEmploymentSampleReportData(prev => ({
                  ...prev,
                  ...histData.employmentSampleReportData
                }));
                console.log('✅ Employment sample report data set');
              } else {
                console.log('⚠️ No employmentSampleReportData in histData');
              }
            } else {
              console.log('⚠️ No history data or empty histData');
            }
          }
        } catch (error) {
          console.error('Error fetching examinee data:', error);
          setErrors({ submit: 'Failed to load examinee data' });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchExamineeData();
  }, [isEditMode, examineeId]);

  // Fetch centers on mount
  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoadingCenters(true);
      const response = await api.getClinics();
      if (response.success && response.data) {
        setCenters(response.data);
        // If user has a center_id, pre-select it
        if (user?.center_id) {
          const userCenter = response.data.find(c => c.id === user.center_id);
          if (userCenter) {
            setFormData(prev => ({ ...prev, account: userCenter.name }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    } finally {
      setLoadingCenters(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleOtherChange = (category, checked) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], other: checked }
    }));
  };

  const handleOtherTextChange = (category, text) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], otherText: text }
    }));
  };

  const toggleDiagnosisCategory = (category) => {
    setExpandedDiagnoses(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleDiagnosis = (category, subOption) => {
    setDiagnosisData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subOption]: !prev[category][subOption]
      }
    }));
  };

  const handleDiagnosisTextChange = (category, value) => {
    setDiagnosisData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        otherText: value
      }
    }));
  };

  const addDiagnosisOption = (category) => {
    const text = diagnosisData[category].otherText;
    if (text && text.trim()) {
      const key = text.trim().replace(/\s+/g, '_').toLowerCase();
      setDiagnosisData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: true,
          otherText: ''
        }
      }));
    }
  };

  const removeDiagnosisOption = (category, key) => {
    setDiagnosisData(prev => {
      const newData = { ...prev[category] };
      delete newData[key];
      return {
        ...prev,
        [category]: newData
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.birthDate) newErrors.birthDate = 'Birth Date is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('💾 CREATE/UPDATE EXAMINEE - Starting Submit Process');
    console.log('📍 Mode:', isEditMode ? 'EDIT' : 'CREATE');
    console.log('📍 Examinee ID:', examineeId);
    
    if (!validateForm()) {
      console.log('❌ Validation Failed');
      return;
    }
    
    console.log('✅ Validation Passed');
    console.log('📤 Current Form Data:', formData);
    console.log('📤 Current Evaluation Data:', evaluationData);
    console.log('📤 Current Diagnosis Data (expandedDiagnoses):', expandedDiagnoses);
    console.log('📤 Current History Other Data:', historyOtherData);
    console.log('📤 Current Referral Data:', referralData);
    
    setIsSaving(true);
    try {
      const apiData = {
        studentId: formData.examineeId,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        gender: formData.gender.toLowerCase(),
        dateOfBirth: formData.birthDate,
        schoolName: formData.schoolName,
        grade: formData.grade,
        languageOfTesting: formData.languageOfTesting,
        customLanguage: formData.customLanguage,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactRelation: formData.emergencyContactRelation,
        customField1: formData.customField1,
        customField2: formData.customField2,
        customField3: formData.customField3,
        customField4: formData.customField4,
        status: formData.status,
        registrationDate: formData.registrationDate,
        comment: formData.comment,
        centreName: formData.account,
        requiresAssessment: formData.requiresAssessment,
        requiresTherapy: formData.requiresTherapy,
        evaluationData: evaluationData,
        diagnosisData: diagnosisData,
        historyData: {
          ...historyOtherData,
          ...referralData,
          referralReasonText: referralReasonText,
          languageSampleReportData: languageSampleReportData,
          languageSampleReportSentence: languageSampleReportSentence,
          educationSampleReportData: educationSampleReportData,
          educationSampleReportSentence: educationSampleReportSentence,
          healthSampleReportData: healthSampleReportData,
          healthSampleReportSentence: healthSampleReportSentence,
          employmentSampleReportData: employmentSampleReportData,
          employmentSampleReportSentence: employmentSampleReportSentence
        }
      };

      console.log('📦 API Data to Send:', JSON.stringify(apiData, null, 2));
      console.log('📊 Data Sizes:');
      console.log('  - evaluationData:', JSON.stringify(apiData.evaluationData).length, 'bytes');
      console.log('  - diagnosisData:', JSON.stringify(apiData.diagnosisData).length, 'bytes');
      console.log('  - historyData:', JSON.stringify(apiData.historyData).length, 'bytes');

      let response;
      if (isEditMode && examineeId) {
        // Update existing examinee
        console.log('🔧 Method: PUT (Update)');
        console.log('🌐 API Endpoint:', `/students/${examineeId}`);
        response = await api.request(`/students/${examineeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData)
        });
      } else {
        // Create new examinee
        console.log('🔧 Method: POST (Create)');
        console.log('🌐 API Endpoint:', '/students');
        response = await api.request('/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiData)
        });
      }

      console.log('📥 API Response:', response);
      const result = response;

      if (result.success) {
        console.log('✅ Submit Successful!');
        console.log('📦 Result Data:', result.data);
        // Refresh the patients list
        dispatch(fetchPatients());
        onSave && onSave(result.data);
      } else {
        console.error('❌ Submit Failed:', result.message);
        setErrors({ submit: result.message || `Failed to ${isEditMode ? 'update' : 'create'} examinee` });
      }
    } catch (error) {
      console.error(`❌ Submit Error (${isEditMode ? 'update' : 'create'}):`, error);
      console.error('❌ Error Stack:', error.stack);
      setErrors({ submit: `An error occurred while ${isEditMode ? 'updating' : 'creating'} the examinee` });
    } finally {
      setIsSaving(false);
      console.log('💾 Submit Process Complete');
    }
  };

  const tabs = [
    { id: 'demographics', label: 'Demographics' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'history', label: 'History' }
  ];

  const inputClass = (field) => `
    w-full px-3 py-2 border rounded-lg text-sm transition-all duration-200
    ${errors[field] 
      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
    }
    outline-none
  `;

  const labelClass = "block text-xs font-medium text-gray-600 mb-1";
  const requiredMark = <span className="text-red-500 ml-0.5">*</span>;

  // Debug logs for rendering
  console.log('🎨 RENDER DEBUG:');
  console.log('📍 activeTab:', activeTab);
  console.log('📍 historySubTab:', historySubTab);
  console.log('📍 isEditMode:', isEditMode);
  console.log('📍 isLoading:', isLoading);
  console.log('📍 languageSampleReportData:', languageSampleReportData);
  console.log('📍 educationSampleReportData:', educationSampleReportData);
  console.log('📍 healthSampleReportData:', healthSampleReportData);
  console.log('📍 employmentSampleReportData:', employmentSampleReportData);

  // Show loading state while fetching data in edit mode
  if (isLoading) {
    console.log('⏳ Showing loading state...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading examinee data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        sidebarCollapsed={false}
        setSidebarCollapsed={() => {}}
      />
      
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onCancel}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <h1 className="text-xl font-semibold text-gray-900">{isEditMode ? 'Edit Examinee' : 'New Examinee'}</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : (isEditMode ? 'Update' : 'Save')}</span>
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b bg-gray-50/50">
            <div className="flex px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'demographics' && (
                <motion.div
                  key="demographics"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Personal Info */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className={labelClass}>
                            First Name{requiredMark}
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            className={inputClass('firstName')}
                            placeholder="First"
                          />
                          {errors.firstName && (
                            <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div className="col-span-1">
                          <label className={labelClass}>Middle Name</label>
                          <input
                            type="text"
                            value={formData.middleName}
                            onChange={(e) => handleChange('middleName', e.target.value)}
                            className={inputClass('middleName')}
                            placeholder="Middle"
                          />
                        </div>
                        
                        <div className="col-span-1">
                          <label className={labelClass}>
                            Last Name{requiredMark}
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            className={inputClass('lastName')}
                            placeholder="Last"
                          />
                          {errors.lastName && (
                            <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Examinee ID</label>
                        <input
                          type="text"
                          value={formData.examineeId}
                          onChange={(e) => handleChange('examineeId', e.target.value)}
                          className={inputClass('examineeId')}
                          placeholder="Auto-generated if empty"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>
                            Gender{requiredMark}
                          </label>
                          <div className="relative">
                            <select
                              value={formData.gender}
                              onChange={(e) => handleChange('gender', e.target.value)}
                              className={`${inputClass('gender')} appearance-none`}
                            >
                              <option value="">Please Select...</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.gender && (
                            <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
                          )}
                        </div>

                        <div>
                          <label className={labelClass}>
                            Birth Date{requiredMark}
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              value={formData.birthDate}
                              onChange={(e) => handleChange('birthDate', e.target.value)}
                              className={`${inputClass('birthDate')} pr-10`}
                            />
                            <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                          {errors.birthDate && (
                            <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>
                          )}
                        </div>
                      </div>

                      {formData.birthDate && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <FiInfo className="w-4 h-4" />
                          <span>Age: {age.years} years {age.months} months</span>
                        </div>
                      )}

                      <div>
                        <label className={labelClass}>School Name</label>
                        <input
                          type="text"
                          value={formData.schoolName}
                          onChange={(e) => handleChange('schoolName', e.target.value)}
                          className={inputClass('schoolName')}
                          placeholder="Enter school name"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Grade</label>
                        <input
                          type="text"
                          value={formData.grade}
                          onChange={(e) => handleChange('grade', e.target.value)}
                          className={inputClass('grade')}
                          placeholder="Enter grade"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Language of Testing</label>
                        <div className="relative">
                          <select
                            value={formData.languageOfTesting}
                            onChange={(e) => handleChange('languageOfTesting', e.target.value)}
                            className={`${inputClass('languageOfTesting')} appearance-none`}
                          >
                            <option value="">Please Select...</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Bilingual">Bilingual</option>
                            <option value="Other">Other</option>
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {formData.languageOfTesting === 'Other' && (
                          <input
                            type="text"
                            value={formData.customLanguage || ''}
                            onChange={(e) => handleChange('customLanguage', e.target.value)}
                            className={`${inputClass('customLanguage')} mt-2`}
                            placeholder="Please specify language..."
                          />
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Email</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={`${inputClass('email')} pl-10`}
                            placeholder="email@example.com"
                          />
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Phone</label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={`${inputClass('phone')} pl-10`}
                            placeholder="Enter phone number"
                          />
                          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className={inputClass('address')}
                          placeholder="Enter street address"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className={labelClass}>City</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={inputClass('city')}
                            placeholder="City"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className={labelClass}>State</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={inputClass('state')}
                            placeholder="State"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className={labelClass}>Zip Code</label>
                          <input
                            type="text"
                            value={formData.zipCode}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className={inputClass('zipCode')}
                            placeholder="Zip"
                          />
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2 pt-4">
                        Emergency Contact
                      </h3>

                      <div>
                        <label className={labelClass}>Emergency Contact Name</label>
                        <input
                          type="text"
                          value={formData.emergencyContactName}
                          onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                          className={inputClass('emergencyContactName')}
                          placeholder="Enter emergency contact name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Emergency Contact Phone</label>
                          <input
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                            className={inputClass('emergencyContactPhone')}
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Relation</label>
                          <input
                            type="text"
                            value={formData.emergencyContactRelation}
                            onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                            className={inputClass('emergencyContactRelation')}
                            placeholder="Relation to examinee"
                          />
                        </div>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2 pt-4">
                        Additional Information
                      </h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Custom Field 1</label>
                          <input
                            type="text"
                            value={formData.customField1}
                            onChange={(e) => handleChange('customField1', e.target.value)}
                            className={inputClass('customField1')}
                            placeholder="Custom field 1"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Custom Field 2</label>
                          <input
                            type="text"
                            value={formData.customField2}
                            onChange={(e) => handleChange('customField2', e.target.value)}
                            className={inputClass('customField2')}
                            placeholder="Custom field 2"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Custom Field 3</label>
                          <input
                            type="text"
                            value={formData.customField3}
                            onChange={(e) => handleChange('customField3', e.target.value)}
                            className={inputClass('customField3')}
                            placeholder="Custom field 3"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Custom Field 4</label>
                          <input
                            type="text"
                            value={formData.customField4}
                            onChange={(e) => handleChange('customField4', e.target.value)}
                            className={inputClass('customField4')}
                            placeholder="Custom field 4"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Status</label>
                          <div className="relative">
                            <select
                              value={formData.status}
                              onChange={(e) => handleChange('status', e.target.value)}
                              className={`${inputClass('status')} appearance-none`}
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Registration Date</label>
                          <input
                            type="date"
                            value={formData.registrationDate}
                            onChange={(e) => handleChange('registrationDate', e.target.value)}
                            className={inputClass('registrationDate')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Comment</label>
                        <textarea
                          value={formData.comment}
                          onChange={(e) => handleChange('comment', e.target.value)}
                          rows={4}
                          className={inputClass('comment')}
                          placeholder="Enter any additional comments..."
                          maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {500 - formData.comment.length} characters remaining
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Account & Centers */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2">
                        Account Information
                      </h3>

                      <div>
                        <label className={labelClass}>Center / Account *</label>
                        <div className="relative">
                          <select
                            value={formData.account}
                            onChange={(e) => handleChange('account', e.target.value)}
                            disabled={loadingCenters || centers.length === 0}
                            className={`${inputClass('account')} bg-white pl-10 font-medium text-gray-700 cursor-pointer appearance-none`}
                          >
                            <option value="">Select Center</option>
                            {centers.map((center) => (
                              <option key={center.id} value={center.name}>
                                {center.name}
                              </option>
                            ))}
                          </select>
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          {loadingCenters && (
                            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-gray-400">Loading...</span>
                          )}
                        </div>
                        {centers.length === 0 && !loadingCenters && (
                          <p className="text-xs text-red-500 mt-1">No centers available. Please check your connection.</p>
                        )}
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b pb-2 pt-4">
                        Service Requirements
                      </h3>

                      <div className="space-y-3 pt-2">
                        <label className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.requiresAssessment}
                            onChange={(e) => handleChange('requiresAssessment', e.target.checked)}
                            className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-blue-900">Assessment Required</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.requiresTherapy}
                            onChange={(e) => handleChange('requiresTherapy', e.target.checked)}
                            className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-emerald-900">Therapy Required</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'evaluation' && (
                <motion.div
                  key="evaluation"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  {/* Sub Tabs */}
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                    <button 
                      onClick={() => setEvaluationSubTab('reasonsForTesting')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        evaluationSubTab === 'reasonsForTesting'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Reasons For Testing
                    </button>
                    <button 
                      onClick={() => setEvaluationSubTab('diagnoses')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        evaluationSubTab === 'diagnoses'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Diagnoses
                    </button>
                  </div>

                  {evaluationSubTab === 'reasonsForTesting' && (
                    <>
                      <h3 className="text-sm font-semibold text-blue-800 mb-4">
                        Reason(s) for Testing (Mark all that apply)
                      </h3>

                      {/* Academic Concerns */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Academic Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.maths}
                          onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'maths', e.target.checked)}
                        />
                        Maths
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.writing}
                          onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'writing', e.target.checked)}
                        />
                        Writing
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.reading}
                          onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'reading', e.target.checked)}
                        />
                        Reading
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.general}
                          onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.other}
                          onChange={(e) => handleEvaluationChange('academicConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.academicConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.academicConcerns.otherText}
                          onChange={(e) => handleEvaluationTextChange('academicConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Cognitive Evaluation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Cognitive Evaluation:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.intellectualDisability}
                          onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'intellectualDisability', e.target.checked)}
                        />
                        Intellectual Disability
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.giftedTalented}
                          onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'giftedTalented', e.target.checked)}
                        />
                        Gifted and Talented
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.traumaticBrainInjury}
                          onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'traumaticBrainInjury', e.target.checked)}
                        />
                        Traumatic Brain Injury
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.general}
                          onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.other}
                          onChange={(e) => handleEvaluationChange('cognitiveEvaluation', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.cognitiveEvaluation.other && (
                        <input
                          type="text"
                          value={evaluationData.cognitiveEvaluation.otherText}
                          onChange={(e) => handleEvaluationTextChange('cognitiveEvaluation', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Behaviour Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Behaviour Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.behaviourConcerns.aggression}
                          onChange={(e) => handleEvaluationFieldChange('behaviourConcerns', 'aggression', e.target.checked)}
                        />
                        Aggression
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.behaviourConcerns.attentionHyperactivity}
                          onChange={(e) => handleEvaluationFieldChange('behaviourConcerns', 'attentionHyperactivity', e.target.checked)}
                        />
                        Attention/Hyperactivity
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.behaviourConcerns.general}
                          onChange={(e) => handleEvaluationFieldChange('behaviourConcerns', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.behaviourConcerns.other}
                          onChange={(e) => handleEvaluationChange('behaviourConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.behaviourConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.behaviourConcerns.otherText}
                          onChange={(e) => handleEvaluationTextChange('behaviourConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mental Health Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Mental Health Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.mentalHealth.anxiety}
                          onChange={(e) => handleEvaluationFieldChange('mentalHealth', 'anxiety', e.target.checked)}
                        />
                        Anxiety
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.mentalHealth.depression}
                          onChange={(e) => handleEvaluationFieldChange('mentalHealth', 'depression', e.target.checked)}
                        />
                        Depression
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.mentalHealth.general}
                          onChange={(e) => handleEvaluationFieldChange('mentalHealth', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.mentalHealth.other}
                          onChange={(e) => handleEvaluationChange('mentalHealth', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.mentalHealth.other && (
                        <input
                          type="text"
                          value={evaluationData.mentalHealth.otherText}
                          onChange={(e) => handleEvaluationTextChange('mentalHealth', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Developmental Delay */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Developmental Delay:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.developmentalDelay.motor}
                          onChange={(e) => handleEvaluationFieldChange('developmentalDelay', 'motor', e.target.checked)}
                        />
                        Motor
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.developmentalDelay.physicalGrowth}
                          onChange={(e) => handleEvaluationFieldChange('developmentalDelay', 'physicalGrowth', e.target.checked)}
                        />
                        Physical/Growth
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.developmentalDelay.general}
                          onChange={(e) => handleEvaluationFieldChange('developmentalDelay', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.developmentalDelay.other}
                          onChange={(e) => handleEvaluationChange('developmentalDelay', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.developmentalDelay.other && (
                        <input
                          type="text"
                          value={evaluationData.developmentalDelay.otherText}
                          onChange={(e) => handleEvaluationTextChange('developmentalDelay', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Language Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Language Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.languageConcerns.receptive}
                          onChange={(e) => handleEvaluationFieldChange('languageConcerns', 'receptive', e.target.checked)}
                        />
                        Receptive
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.languageConcerns.expressive}
                          onChange={(e) => handleEvaluationFieldChange('languageConcerns', 'expressive', e.target.checked)}
                        />
                        Expressive
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.languageConcerns.general}
                          onChange={(e) => handleEvaluationFieldChange('languageConcerns', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.languageConcerns.other}
                          onChange={(e) => handleEvaluationChange('languageConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.languageConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.languageConcerns.otherText}
                          onChange={(e) => handleEvaluationTextChange('languageConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Speech Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Speech Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.speechConcerns.articulation}
                          onChange={(e) => handleEvaluationFieldChange('speechConcerns', 'articulation', e.target.checked)}
                        />
                        Articulation
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.speechConcerns.fluency}
                          onChange={(e) => handleEvaluationFieldChange('speechConcerns', 'fluency', e.target.checked)}
                        />
                        Fluency
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.speechConcerns.general}
                          onChange={(e) => handleEvaluationFieldChange('speechConcerns', 'general', e.target.checked)}
                        />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={evaluationData.speechConcerns.other}
                          onChange={(e) => handleEvaluationChange('speechConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.speechConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.speechConcerns.otherText}
                          onChange={(e) => handleEvaluationTextChange('speechConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Physical Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Physical Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Health
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Motor Functioning
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Pain
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.physicalConcerns.other}
                          onChange={(e) => handleOtherChange('physicalConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.physicalConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.physicalConcerns.otherText}
                          onChange={(e) => handleOtherTextChange('physicalConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Substance Abuse */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Substance Abuse:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Alcohol
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Illegal Drugs
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Prescription Drugs
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.substanceAbuse.other}
                          onChange={(e) => handleOtherChange('substanceAbuse', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.substanceAbuse.other && (
                        <input
                          type="text"
                          value={evaluationData.substanceAbuse.otherText}
                          onChange={(e) => handleOtherTextChange('substanceAbuse', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Employment */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Employment:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Internal Applicant
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        External Applicant
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Professional Development
                      </label>
                    </div>
                  </div>

                  {/* Other Reason */}
                  <div className="mt-6">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Other Reason(s) for Testing (Please Specify):
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter other reasons..."
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      500 characters remaining
                    </div>
                  </div>

                  {/* Preference Checkbox */}
                  <div className="mt-4 pt-4 border-t">
                    <label className="flex items-start gap-3 text-sm text-gray-700">
                      <input type="checkbox" className="mt-0.5 rounded border-gray-300" />
                      <span>I prefer to not provide referral information for this examinee, or reason for testing information is not currently known</span>
                    </label>
                  </div>
                </>
              )}

              {evaluationSubTab === 'diagnoses' && (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Please select a diagnosis for this examinee. You may select more than one diagnosis.
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Click the [+] to expand and [-] to collapse a category.
                  </p>

                  {/* Autism Spectrum Disorder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('autismSpectrum')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.autismSpectrum ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Autism Spectrum Disorder</span>
                    </button>
                    {expandedDiagnoses.autismSpectrum && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.aspergers}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'aspergers')}
                          />
                          Asperger's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.autistic}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'autistic')}
                          />
                          Autistic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.childhoodDisintegrative}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'childhoodDisintegrative')}
                          />
                          Childhood Disintegrative Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.pervasiveDevelopmental}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'pervasiveDevelopmental')}
                          />
                          Pervasive Developmental Delay/Disability
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.retts}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'retts')}
                          />
                          Rett's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.autismSpectrum.other}
                            onChange={() => toggleDiagnosis('autismSpectrum', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('autismSpectrum', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.autismSpectrum.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.autismSpectrum.otherText}
                              onChange={(e) => handleDiagnosisTextChange('autismSpectrum', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('autismSpectrum')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Behaviour/Emotional Disorder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('behaviourEmotional')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.behaviourEmotional ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Behaviour/Emotional Disorder</span>
                    </button>
                    {expandedDiagnoses.behaviourEmotional && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.adhd}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'adhd')}
                          />
                          Attention Deficit/Hyperactivity Disorder (any type)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.conduct}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'conduct')}
                          />
                          Conduct Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.disruptive}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'disruptive')}
                          />
                          Disruptive Behavior Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.emotional}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'emotional')}
                          />
                          Emotional Disturbance
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.intermittentExplosive}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'intermittentExplosive')}
                          />
                          Intermittent Explosive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.kleptomania}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'kleptomania')}
                          />
                          Kleptomania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.oppositionalDefiant}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'oppositionalDefiant')}
                          />
                          Oppositional Defiant Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.pathologicalGambling}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'pathologicalGambling')}
                          />
                          Pathological Gambling
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.pyromania}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'pyromania')}
                          />
                          Pyromania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.trichotillomania}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'trichotillomania')}
                          />
                          Trichotillomania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.behaviourEmotional.other}
                            onChange={() => toggleDiagnosis('behaviourEmotional', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('behaviourEmotional', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.behaviourEmotional.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.behaviourEmotional.otherText}
                              onChange={(e) => handleDiagnosisTextChange('behaviourEmotional', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('behaviourEmotional')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Intellectual Disability */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('intellectualDisability')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.intellectualDisability ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Intellectual Disability</span>
                    </button>
                    {expandedDiagnoses.intellectualDisability && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.borderline}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'borderline')}
                          />
                          Borderline Intellectual Functioning
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.cognitiveDelay}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'cognitiveDelay')}
                          />
                          Cognitive Developmental Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.mild}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'mild')}
                          />
                          Intellectual Disability Mild (formerly called Mild Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.moderate}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'moderate')}
                          />
                          Intellectual Disability Moderate (formerly called Moderate Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.profound}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'profound')}
                          />
                          Intellectual Disability Profound (formerly called Profound Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.severe}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'severe')}
                          />
                          Intellectual Disability Severe (formerly called Severe Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.intellectualDisability.other}
                            onChange={() => toggleDiagnosis('intellectualDisability', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('intellectualDisability', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.intellectualDisability.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.intellectualDisability.otherText}
                              onChange={(e) => handleDiagnosisTextChange('intellectualDisability', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('intellectualDisability')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Gifted and Talented */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('giftedTalented')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.giftedTalented ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Gifted and Talented</span>
                    </button>
                    {expandedDiagnoses.giftedTalented && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.giftedTalented.gifted}
                            onChange={() => toggleDiagnosis('giftedTalented', 'gifted')}
                          />
                          Gifted
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.giftedTalented.other}
                            onChange={() => toggleDiagnosis('giftedTalented', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('giftedTalented', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.giftedTalented.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.giftedTalented.otherText}
                              onChange={(e) => handleDiagnosisTextChange('giftedTalented', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('giftedTalented')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Language Delay/Disorder */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('languageDelay')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.languageDelay ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Language Delay/Disorder</span>
                    </button>
                    {expandedDiagnoses.languageDelay && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.languageDelay.expressive}
                            onChange={() => toggleDiagnosis('languageDelay', 'expressive')}
                          />
                          Expressive Language Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.languageDelay.delay}
                            onChange={() => toggleDiagnosis('languageDelay', 'delay')}
                          />
                          Language Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.languageDelay.mixed}
                            onChange={() => toggleDiagnosis('languageDelay', 'mixed')}
                          />
                          Mixed Receptive/Expressive Language Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.languageDelay.phonological}
                            onChange={() => toggleDiagnosis('languageDelay', 'phonological')}
                          />
                          Phonological Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.languageDelay.other}
                            onChange={() => toggleDiagnosis('languageDelay', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('languageDelay', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.languageDelay.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.languageDelay.otherText}
                              onChange={(e) => handleDiagnosisTextChange('languageDelay', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('languageDelay')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Learning Disability */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('learningDisability')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.learningDisability ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Learning Disability</span>
                    </button>
                    {expandedDiagnoses.learningDisability && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.reading}
                            onChange={() => toggleDiagnosis('learningDisability', 'reading')}
                          />
                          Learning Disability in Reading/Reading Disorder/Dyslexia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.mathematics}
                            onChange={() => toggleDiagnosis('learningDisability', 'mathematics')}
                          />
                          Learning Disability in Mathematics/Mathematics Disorder/Dyscalculia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.disorder}
                            onChange={() => toggleDiagnosis('learningDisability', 'disorder')}
                          />
                          Learning Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.writing}
                            onChange={() => toggleDiagnosis('learningDisability', 'writing')}
                          />
                          Learning Disability in Writing/Disorder of Written Expression/Orthographic Impairment
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.nonverbal}
                            onChange={() => toggleDiagnosis('learningDisability', 'nonverbal')}
                          />
                          Nonverbal Learning Disability
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.learningDisability.other}
                            onChange={() => toggleDiagnosis('learningDisability', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('learningDisability', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.learningDisability.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.learningDisability.otherText}
                              onChange={(e) => handleDiagnosisTextChange('learningDisability', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('learningDisability')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mood Related Disorders */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('moodRelated')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.moodRelated ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Mood Related Disorders</span>
                    </button>
                    {expandedDiagnoses.moodRelated && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.acuteStress}
                            onChange={() => toggleDiagnosis('moodRelated', 'acuteStress')}
                          />
                          Acute Stress Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.agoraphobia}
                            onChange={() => toggleDiagnosis('moodRelated', 'agoraphobia')}
                          />
                          Agoraphobia without a History of Panic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.anorexia}
                            onChange={() => toggleDiagnosis('moodRelated', 'anorexia')}
                          />
                          Anorexia Nervosa
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.bipolar}
                            onChange={() => toggleDiagnosis('moodRelated', 'bipolar')}
                          />
                          Bipolar Disorder (I, II, & NOS)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.bulimia}
                            onChange={() => toggleDiagnosis('moodRelated', 'bulimia')}
                          />
                          Bulimia Nervosa
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.conversion}
                            onChange={() => toggleDiagnosis('moodRelated', 'conversion')}
                          />
                          Conversion Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.cyclothymic}
                            onChange={() => toggleDiagnosis('moodRelated', 'cyclothymic')}
                          />
                          Cyclothymic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.depressive}
                            onChange={() => toggleDiagnosis('moodRelated', 'depressive')}
                          />
                          Depressive/Mood Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.dysthymic}
                            onChange={() => toggleDiagnosis('moodRelated', 'dysthymic')}
                          />
                          Dysthymic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.generalizedAnxiety}
                            onChange={() => toggleDiagnosis('moodRelated', 'generalizedAnxiety')}
                          />
                          Generalized Anxiety Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.majorDepressive}
                            onChange={() => toggleDiagnosis('moodRelated', 'majorDepressive')}
                          />
                          Major Depressive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.ocd}
                            onChange={() => toggleDiagnosis('moodRelated', 'ocd')}
                          />
                          Obsessive Compulsive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.pain}
                            onChange={() => toggleDiagnosis('moodRelated', 'pain')}
                          />
                          Pain Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.panic}
                            onChange={() => toggleDiagnosis('moodRelated', 'panic')}
                          />
                          Panic Disorder Without Agoraphobia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.ptsd}
                            onChange={() => toggleDiagnosis('moodRelated', 'ptsd')}
                          />
                          Posttraumatic Stress Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.separationAnxiety}
                            onChange={() => toggleDiagnosis('moodRelated', 'separationAnxiety')}
                          />
                          Separation Anxiety Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.socialPhobia}
                            onChange={() => toggleDiagnosis('moodRelated', 'socialPhobia')}
                          />
                          Social Phobia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.somatization}
                            onChange={() => toggleDiagnosis('moodRelated', 'somatization')}
                          />
                          Somatization Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.specificPhobia}
                            onChange={() => toggleDiagnosis('moodRelated', 'specificPhobia')}
                          />
                          Specific Phobia (Animals, Objects, Etc.)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.moodRelated.other}
                            onChange={() => toggleDiagnosis('moodRelated', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('moodRelated', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.moodRelated.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.moodRelated.otherText}
                              onChange={(e) => handleDiagnosisTextChange('moodRelated', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('moodRelated')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Motor Delay/Impairment */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('motorDelay')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.motorDelay ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Motor Delay/Impairment</span>
                    </button>
                    {expandedDiagnoses.motorDelay && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.developmentalCoordination}
                            onChange={() => toggleDiagnosis('motorDelay', 'developmentalCoordination')}
                          />
                          Developmental Coordination Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.dyspraxia}
                            onChange={() => toggleDiagnosis('motorDelay', 'dyspraxia')}
                          />
                          Dyspraxia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.motorDelay}
                            onChange={() => toggleDiagnosis('motorDelay', 'motorDelay')}
                          />
                          Motor Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.paraplegia}
                            onChange={() => toggleDiagnosis('motorDelay', 'paraplegia')}
                          />
                          Paraplegia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.quadriplegia}
                            onChange={() => toggleDiagnosis('motorDelay', 'quadriplegia')}
                          />
                          Quadriplegia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.stereotypic}
                            onChange={() => toggleDiagnosis('motorDelay', 'stereotypic')}
                          />
                          Stereotypic Movement Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.motorDelay.other}
                            onChange={() => toggleDiagnosis('motorDelay', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('motorDelay', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.motorDelay.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.motorDelay.otherText}
                              onChange={(e) => handleDiagnosisTextChange('motorDelay', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('motorDelay')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Personality Disorders */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('personalityDisorders')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.personalityDisorders ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Personality Disorders</span>
                    </button>
                    {expandedDiagnoses.personalityDisorders && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.antisocial}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'antisocial')}
                          />
                          Antisocial Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.avoidant}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'avoidant')}
                          />
                          Avoidant Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.borderline}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'borderline')}
                          />
                          Borderline Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.dependent}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'dependent')}
                          />
                          Dependent Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.histrionic}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'histrionic')}
                          />
                          Histrionic Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.narcissistic}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'narcissistic')}
                          />
                          Narcissistic Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.ocd}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'ocd')}
                          />
                          Obsessive Compulsive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.ocpd}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'ocpd')}
                          />
                          Obsessive Compulsive Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.paranoid}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'paranoid')}
                          />
                          Paranoid Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.schizoid}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'schizoid')}
                          />
                          Schizoid Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.schizotypal}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'schizotypal')}
                          />
                          Schizotypal Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.personalityDisorders.other}
                            onChange={() => toggleDiagnosis('personalityDisorders', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('personalityDisorders', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.personalityDisorders.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.personalityDisorders.otherText}
                              onChange={(e) => handleDiagnosisTextChange('personalityDisorders', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('personalityDisorders')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Schizophrenia */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('schizophrenia')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.schizophrenia ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Schizophrenia</span>
                    </button>
                    {expandedDiagnoses.schizophrenia && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.briefPsychotic}
                            onChange={() => toggleDiagnosis('schizophrenia', 'briefPsychotic')}
                          />
                          Brief Psychotic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.delusional}
                            onChange={() => toggleDiagnosis('schizophrenia', 'delusional')}
                          />
                          Delusional Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.schizoaffective}
                            onChange={() => toggleDiagnosis('schizophrenia', 'schizoaffective')}
                          />
                          Schizoaffective Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.catatonic}
                            onChange={() => toggleDiagnosis('schizophrenia', 'catatonic')}
                          />
                          Schizophrenia - Catatonic Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.disorganized}
                            onChange={() => toggleDiagnosis('schizophrenia', 'disorganized')}
                          />
                          Schizophrenia - Disorganized Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.paranoid}
                            onChange={() => toggleDiagnosis('schizophrenia', 'paranoid')}
                          />
                          Schizophrenia - Paranoid Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.residual}
                            onChange={() => toggleDiagnosis('schizophrenia', 'residual')}
                          />
                          Schizophrenia - Residual Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.undifferentiated}
                            onChange={() => toggleDiagnosis('schizophrenia', 'undifferentiated')}
                          />
                          Schizophrenia - Undifferentiated Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.schizophreniform}
                            onChange={() => toggleDiagnosis('schizophrenia', 'schizophreniform')}
                          />
                          Schizophreniform Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.schizophrenia.other}
                            onChange={() => toggleDiagnosis('schizophrenia', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('schizophrenia', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.schizophrenia.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.schizophrenia.otherText}
                              onChange={(e) => handleDiagnosisTextChange('schizophrenia', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('schizophrenia')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Speech */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('speech')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.speech ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Speech Disorder</span>
                    </button>
                    {expandedDiagnoses.speech && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.aphasia}
                            onChange={() => toggleDiagnosis('speech', 'aphasia')}
                          />
                          Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.apraxia}
                            onChange={() => toggleDiagnosis('speech', 'apraxia')}
                          />
                          Apraxia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.articulation}
                            onChange={() => toggleDiagnosis('speech', 'articulation')}
                          />
                          Articulation Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.brocas}
                            onChange={() => toggleDiagnosis('speech', 'brocas')}
                          />
                          Broca's Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.centralAuditory}
                            onChange={() => toggleDiagnosis('speech', 'centralAuditory')}
                          />
                          Central Auditory Processing Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.dysarthria}
                            onChange={() => toggleDiagnosis('speech', 'dysarthria')}
                          />
                          Dysarthria
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.fluency}
                            onChange={() => toggleDiagnosis('speech', 'fluency')}
                          />
                          Fluency Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.receptive}
                            onChange={() => toggleDiagnosis('speech', 'receptive')}
                          />
                          Receptive Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.voice}
                            onChange={() => toggleDiagnosis('speech', 'voice')}
                          />
                          Voice Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.speech.other}
                            onChange={() => toggleDiagnosis('speech', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('speech', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.speech.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.speech.otherText}
                              onChange={(e) => handleDiagnosisTextChange('speech', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('speech')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Substance Abuse */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('substanceAbuse')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.substanceAbuse ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Substance Abuse</span>
                    </button>
                    {expandedDiagnoses.substanceAbuse && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.alcoholAbuse}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'alcoholAbuse')}
                          />
                          Alcohol Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.alcoholDependence}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'alcoholDependence')}
                          />
                          Alcohol Dependence Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.polysubstanceAbuse}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'polysubstanceAbuse')}
                          />
                          Polysubstance Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.polysubstanceDependence}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'polysubstanceDependence')}
                          />
                          Polysubstance Dependence Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.substanceAbuse}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'substanceAbuse')}
                          />
                          Substance Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.substanceDependence}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'substanceDependence')}
                          />
                          Substance Dependence Disorder (Alcohol, drugs, or inhalants)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.substanceAbuse.other}
                            onChange={() => toggleDiagnosis('substanceAbuse', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('substanceAbuse', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.substanceAbuse.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.substanceAbuse.otherText}
                              onChange={(e) => handleDiagnosisTextChange('substanceAbuse', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('substanceAbuse')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Traumatic Brain Injury */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('traumaticBrainInjury')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.traumaticBrainInjury ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Traumatic Brain Injury</span>
                    </button>
                    {expandedDiagnoses.traumaticBrainInjury && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.traumaticBrainInjury.tbi}
                            onChange={() => toggleDiagnosis('traumaticBrainInjury', 'tbi')}
                          />
                          Traumatic Brain Injury
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.traumaticBrainInjury.mild}
                            onChange={() => toggleDiagnosis('traumaticBrainInjury', 'mild')}
                          />
                          Traumatic Brain Injury - Mild Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.traumaticBrainInjury.moderate}
                            onChange={() => toggleDiagnosis('traumaticBrainInjury', 'moderate')}
                          />
                          Traumatic Brain Injury - Moderate Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.traumaticBrainInjury.severe}
                            onChange={() => toggleDiagnosis('traumaticBrainInjury', 'severe')}
                          />
                          Traumatic Brain Injury - Severe Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.traumaticBrainInjury.other}
                            onChange={() => toggleDiagnosis('traumaticBrainInjury', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('traumaticBrainInjury', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.traumaticBrainInjury.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.traumaticBrainInjury.otherText}
                              onChange={(e) => handleDiagnosisTextChange('traumaticBrainInjury', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('traumaticBrainInjury')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Other */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('other')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.other ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Other</span>
                    </button>
                    {expandedDiagnoses.other && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.adjustment}
                            onChange={() => toggleDiagnosis('other', 'adjustment')}
                          />
                          Adjustment Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.cognitive}
                            onChange={() => toggleDiagnosis('other', 'cognitive')}
                          />
                          Cognitive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.creutzfeldtJakob}
                            onChange={() => toggleDiagnosis('other', 'creutzfeldtJakob')}
                          />
                          Creutzfeldt-Jakob Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.alzheimers}
                            onChange={() => toggleDiagnosis('other', 'alzheimers')}
                          />
                          Dementia of the Alzheimer's Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.depersonalization}
                            onChange={() => toggleDiagnosis('other', 'depersonalization')}
                          />
                          Depersonalization Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.dissociative}
                            onChange={() => toggleDiagnosis('other', 'dissociative')}
                          />
                          Dissociative Identity Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.epilepsy}
                            onChange={() => toggleDiagnosis('other', 'epilepsy')}
                          />
                          Epilepsy, Not Specified
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.factitious}
                            onChange={() => toggleDiagnosis('other', 'factitious')}
                          />
                          Factitious Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.genderIdentity}
                            onChange={() => toggleDiagnosis('other', 'genderIdentity')}
                          />
                          Gender Identity Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.huntingtons}
                            onChange={() => toggleDiagnosis('other', 'huntingtons')}
                          />
                          Huntington's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.leftStroke}
                            onChange={() => toggleDiagnosis('other', 'leftStroke')}
                          />
                          Left Cerebral Vascular Accident (Stroke)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.leftEpilepsy}
                            onChange={() => toggleDiagnosis('other', 'leftEpilepsy')}
                          />
                          Left Temporal Lobe Epilepsy
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.mildCognitive}
                            onChange={() => toggleDiagnosis('other', 'mildCognitive')}
                          />
                          Mild Cognitive Impairment
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.parkinsons}
                            onChange={() => toggleDiagnosis('other', 'parkinsons')}
                          />
                          Parkinson's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.picks}
                            onChange={() => toggleDiagnosis('other', 'picks')}
                          />
                          Pick's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.insomnia}
                            onChange={() => toggleDiagnosis('other', 'insomnia')}
                          />
                          Primary Insomnia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.rightStroke}
                            onChange={() => toggleDiagnosis('other', 'rightStroke')}
                          />
                          Right Cerebral Vascular Accident (Stroke)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.rightEpilepsy}
                            onChange={() => toggleDiagnosis('other', 'rightEpilepsy')}
                          />
                          Right Temporal Lobe Epilepsy
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.seizure}
                            onChange={() => toggleDiagnosis('other', 'seizure')}
                          />
                          Seizure Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.stroke}
                            onChange={() => toggleDiagnosis('other', 'stroke')}
                          />
                          Stroke, Not Specified
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.tic}
                            onChange={() => toggleDiagnosis('other', 'tic')}
                          />
                          Tic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.tourettes}
                            onChange={() => toggleDiagnosis('other', 'tourettes')}
                          />
                          Tourette's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.vascularDementia}
                            onChange={() => toggleDiagnosis('other', 'vascularDementia')}
                          />
                          Vascular Dementia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300"
                            checked={diagnosisData.other.other}
                            onChange={() => toggleDiagnosis('other', 'other')}
                          />
                          Other
                          <button
                            type="button"
                            onClick={() => removeDiagnosisOption('other', 'other')}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ✕
                          </button>
                        </label>
                        {diagnosisData.other.other && (
                          <div className="ml-6 w-full space-y-2">
                            <input
                              type="text"
                              value={diagnosisData.other.otherText}
                              onChange={(e) => handleDiagnosisTextChange('other', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => addDiagnosisOption('other')}
                              className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              + Add as new checkbox option
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <p className="text-sm text-gray-500 italic">
                    Entry is optional. Values entered here only appear on specific product reports. <span className="text-blue-600 cursor-pointer">Learn More.</span>
                  </p>

                  {/* History Sub-tabs */}
                  <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-fit">
                    <button 
                      onClick={() => setHistorySubTab('referral')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'referral'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Referral
                    </button>
                    <button 
                      onClick={() => setHistorySubTab('personal')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'personal'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Personal
                    </button>
                    <button 
                      onClick={() => setHistorySubTab('language')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'language'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Language/Development
                    </button>
                    <button 
                      onClick={() => setHistorySubTab('education')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'education'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Education
                    </button>
                    <button 
                      onClick={() => setHistorySubTab('health')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'health'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Health
                    </button>
                    <button 
                      onClick={() => setHistorySubTab('employment')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        historySubTab === 'employment'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      Employment
                    </button>
                  </div>

                  {/* Sample Report Sentence */}
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <button 
                      onClick={() => setShowSampleReport(!showSampleReport)}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-xs font-medium">{showSampleReport ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-xs">Sample Report Sentence</span>
                    </button>
                    
                    {showSampleReport && (
                      <div className="p-4 bg-white border-t">
                        <p className="text-xs text-gray-600 mb-3 italic bg-gray-50 p-3 rounded border">
                          {generateSampleReportSentence()}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          This sentence is automatically generated from the Referral Source and Referral Reason(s) fields below.
                        </p>
                      </div>
                    )}
                  </div>

                  {historySubTab === 'referral' && (
                    <>
                      {/* Referral Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Referral Source */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Referral Source</h3>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Name of the Referral Source:</label>
                            <input
                              type="text"
                              value={referralData.referralSourceName}
                              onChange={(e) => handleReferralTextChange('referralSourceName', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Role of the Referral Source:</label>
                            <select
                              value={referralData.referralSourceRole}
                              onChange={(e) => handleReferralTextChange('referralSourceRole', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="">Please Select...</option>
                              <option value="teacher">Teacher</option>
                              <option value="parent">Parent</option>
                              <option value="physician">Physician</option>
                              <option value="psychologist">Psychologist</option>
                              <option value="therapist">Therapist</option>
                            </select>
                          </div>

                          {/* Other checkbox for Referral Source */}
                          <div className="pt-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={historyOtherData.referralSourceOther}
                                onChange={(e) => handleHistoryOtherChange('referralSourceOther', e.target.checked)}
                              />
                              Other
                            </label>
                            {historyOtherData.referralSourceOther && (
                              <input
                                type="text"
                                value={historyOtherData.referralSourceOtherText}
                                onChange={(e) => handleHistoryOtherTextChange('referralSourceOtherText', e.target.value)}
                                placeholder="Please specify referral source name..."
                                className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}
                          </div>
                        </div>

                        {/* Referral Reason(s) */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-blue-800">Referral Reason(s)</h3>

                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.schoolRelatedConcerns}
                                onChange={(e) => handleReferralChange('schoolRelatedConcerns', e.target.checked)}
                              />
                              School Related Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.speechConcerns}
                                onChange={(e) => handleReferralChange('speechConcerns', e.target.checked)}
                              />
                              Speech Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.languageConcerns}
                                onChange={(e) => handleReferralChange('languageConcerns', e.target.checked)}
                              />
                              Language Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.socialEmotionalConcerns}
                                onChange={(e) => handleReferralChange('socialEmotionalConcerns', e.target.checked)}
                              />
                              Social/Emotional Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.cognitiveConcerns}
                                onChange={(e) => handleReferralChange('cognitiveConcerns', e.target.checked)}
                              />
                              Cognitive Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.physicalConcerns}
                                onChange={(e) => handleReferralChange('physicalConcerns', e.target.checked)}
                              />
                              Physical Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                checked={referralData.vocationalRehabilitationLegal}
                                onChange={(e) => handleReferralChange('vocationalRehabilitationLegal', e.target.checked)}
                              />
                              Vocational/Rehabilitation/Legal Issues
                            </label>
                          </div>

                          {/* Text field for other referral reasons */}
                          <div className="mt-4 pt-3 border-t">
                            <label className="block text-xs text-gray-600 mb-2">
                              Other Referral Reason(s) (Please Specify):
                            </label>
                            <textarea
                              rows={3}
                              value={referralReasonText}
                              onChange={(e) => setReferralReasonText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="Enter additional referral reasons..."
                              maxLength={500}
                            />
                            <div className="text-xs text-gray-500 mt-1 text-right">
                              {500 - referralReasonText.length} characters remaining
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {historySubTab === 'personal' && (
                    <>
                      {/* Personal Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Family Information */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Family Information</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Marital Status:</label>
                              <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                <option value="">Please Select...</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                                <option value="widowed">Widowed</option>
                                <option value="separated">Separated</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Number of children:</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Number of siblings in home:</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Number of other adults in home:</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Current Living Arrangements:</label>
                            <select 
                              value={currentLivingArrangement}
                              onChange={(e) => setCurrentLivingArrangement(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="">Please Select...</option>
                              <option value="parents">With parents</option>
                              <option value="relatives">With relatives</option>
                              <option value="foster">Foster home</option>
                              <option value="group">Group home</option>
                              <option value="independent">Independent living</option>
                              <option value="institution">Institution</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          {/* Show input field when "Other" is selected */}
                          {currentLivingArrangement === 'other' && (
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Please specify:</label>
                              <input
                                type="text"
                                value={currentLivingArrangementOther}
                                onChange={(e) => setCurrentLivingArrangementOther(e.target.value)}
                                placeholder="Enter living arrangement details..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Length of time in current living arrangements (years):</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Length of time in current living arrangements (months):</label>
                              <input
                                type="number"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">How many times have custodial arrangements changed in the last three years?:</label>
                            <input
                              type="number"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Parent or Guardian Contact Information */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Parent or Guardian Contact Information</h3>
                          
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Name:</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Address:</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">City, Region, Postcode:</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Telephone:</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {historySubTab === 'language' && (
                    <>
                      {/* Sample Report Sentence for Language/Development */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <button
                          onClick={() => setShowLanguageSampleReport(!showLanguageSampleReport)}
                          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                        >
                          <span className="text-xs font-medium">{showLanguageSampleReport ? '⊟' : '⊞'}</span>
                          <span className="font-medium text-xs">Sample Report Sentence</span>
                        </button>

                        {showLanguageSampleReport && (
                          <div className="p-4 bg-white border-t">
                            <textarea
                              value={languageSampleReportSentence || generateLanguageSampleReportSentence()}
                              onChange={(e) => setLanguageSampleReportSentence(e.target.value)}
                              placeholder="Sample report sentence will be generated here..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This sentence is automatically generated from the Language and Development fields below. You can edit it as needed.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Language Section */}
                            <div className="mb-6">
                              <h4 className="text-xs font-semibold text-blue-700 mb-3">Language</h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Primary Language:</label>
                                  <input
                                    type="text"
                                    value={languageSampleReportData.primaryLanguage}
                                    onChange={(e) => handleLanguageSampleReportTextChange('primaryLanguage', e.target.value)}
                                    placeholder="e.g., English"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className="block text-xs text-gray-600 mb-1">Exposed to English:</label>
                                <select 
                                  value={languageSampleReportData.exposedToEnglish}
                                  onChange={(e) => handleLanguageSampleReportTextChange('exposedToEnglish', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                  <option value="not_specified">Not Specified</option>
                                  <option value="since_birth">Since Birth</option>
                                  <option value="one_to_three">For One to Three Years</option>
                                  <option value="four_to_five">For Four to Five Years</option>
                                  <option value="longer_than_five">For Longer Than Five Years</option>
                                  <option value="other">Other</option>
                                </select>
                                {languageSampleReportData.exposedToEnglish === 'other' && (
                                  <input
                                    type="text"
                                    value={languageSampleReportData.exposedToEnglishOther || ''}
                                    onChange={(e) => handleLanguageSampleReportTextChange('exposedToEnglishOther', e.target.value)}
                                    placeholder="Please specify..."
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                  />
                                )}
                              </div>

                              <div className="mb-4">
                                <label className="block text-xs text-gray-600 mb-1">Speaking English:</label>
                                <select 
                                  value={languageSampleReportData.speakingEnglish}
                                  onChange={(e) => handleLanguageSampleReportTextChange('speakingEnglish', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                  <option value="not_specified">Not Specified</option>
                                  <option value="since_first_talking">Since First Talking</option>
                                  <option value="one_to_three">For One to Three Years</option>
                                  <option value="four_to_five">For Four to Five Years</option>
                                  <option value="longer_than_five">For Longer Than Five Years</option>
                                  <option value="other">Other</option>
                                </select>
                                {languageSampleReportData.speakingEnglish === 'other' && (
                                  <input
                                    type="text"
                                    value={languageSampleReportData.speakingEnglishOther || ''}
                                    onChange={(e) => handleLanguageSampleReportTextChange('speakingEnglishOther', e.target.value)}
                                    placeholder="Please specify..."
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                  />
                                )}
                              </div>

                              <div className="mb-4">
                                <label className="block text-xs text-gray-600 mb-1">Examiner Rating of English Fluency:</label>
                                <select 
                                  value={languageSampleReportData.fluencyRating}
                                  onChange={(e) => handleLanguageSampleReportTextChange('fluencyRating', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                  <option value="not_specified">Not Specified</option>
                                  <option value="adequate">Adequate</option>
                                  <option value="somewhat_adequate">Somewhat Adequate</option>
                                  <option value="poor">Poor</option>
                                  <option value="other">Other</option>
                                </select>
                                {languageSampleReportData.fluencyRating === 'other' && (
                                  <input
                                    type="text"
                                    value={languageSampleReportData.fluencyRatingOther || ''}
                                    onChange={(e) => handleLanguageSampleReportTextChange('fluencyRatingOther', e.target.value)}
                                    placeholder="Please specify..."
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Development Section */}
                            <div className="mb-4">
                              <h4 className="text-xs font-semibold text-blue-700 mb-3">Development</h4>
                              
                              <div className="mb-4">
                                <label className="block text-xs text-gray-600 mb-1">Birth Information:</label>
                                <select 
                                  value={languageSampleReportData.birthComplications}
                                  onChange={(e) => handleLanguageSampleReportTextChange('birthComplications', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                  <option value="with no apparent complications">Was Born With No Apparent Complications</option>
                                  <option value="was born premature">Was Born Premature</option>
                                  <option value="weighed less than 5 1/2 pounds at birth">Weighed Less Than 5 1/2 Pounds at Birth</option>
                                  <option value="spent time in a neonatal intensive care unit">Spent Time in a Neonatal Intensive Care Unit</option>
                                  <option value="required assistance with breathing">Required Assistance With Breathing</option>
                                  <option value="was born past due date">Was Born Past Due Date</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>

                              <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-700 mb-2 block">Developmental Milestones:</label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {[
                                    { key: 'milestoneSitting', label: 'Sitting Alone' },
                                    { key: 'milestoneCrawling', label: 'Crawling' },
                                    { key: 'milestoneStanding', label: 'Standing Alone' },
                                    { key: 'milestoneWalking', label: 'Walking Alone' },
                                    { key: 'milestoneBabbling', label: 'Babbling' },
                                    { key: 'milestoneFirstWords', label: 'Speaking First Words' },
                                    { key: 'milestoneShortSentences', label: 'Speaking Short Sentences' },
                                    { key: 'milestoneEating', label: 'Eating Solids' },
                                    { key: 'milestoneSelfFeeding', label: 'Self-Feeding' },
                                    { key: 'milestoneToiletAwake', label: 'Using Toilet When Awake' },
                                    { key: 'milestoneStayDry', label: 'Staying Dry at Night' },
                                  ].map((milestone) => (
                                    <div key={milestone.key} className="space-y-1">
                                      <label className="text-xs text-gray-600">{milestone.label}</label>
                                      <div className="flex gap-2">
                                        {['early', 'typical', 'late', 'unknown'].map((option) => (
                                          <label key={option} className="flex items-center gap-1 text-xs cursor-pointer">
                                            <input 
                                              type="radio" 
                                              name={milestone.key}
                                              value={option}
                                              checked={languageSampleReportData[milestone.key] === option}
                                              onChange={(e) => handleLanguageSampleReportTextChange(milestone.key, e.target.value)}
                                              className="rounded border-gray-300"
                                            />
                                            <span className="capitalize">{option}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="mt-4">
                                  <label className="text-xs text-gray-600">Social Interaction</label>
                                  <div className="flex gap-2">
                                    {['atypical', 'typical', 'delayed', 'unknown'].map((option) => (
                                      <label key={option} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="radio" 
                                          name="milestoneSocial"
                                          value={option}
                                          checked={languageSampleReportData.milestoneSocial === option}
                                          onChange={(e) => handleLanguageSampleReportTextChange('milestoneSocial', e.target.value)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{option}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="mt-4">
                                <label className="block text-xs text-gray-600 mb-1">Additional Information:</label>
                                <textarea
                                  value={languageSampleReportData.additionalInfo}
                                  onChange={(e) => handleLanguageSampleReportTextChange('additionalInfo', e.target.value)}
                                  placeholder="Enter any additional details..."
                                  rows="2"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                            </div>
                          

                      {/* Language Content */}
                      <div className="space-y-6">
                        <h3 className="text-sm font-semibold text-blue-800">Language</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Other Languages Spoken (Besides Primary Language):</label>
                            <input
                              type="text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-xs text-gray-600 mb-1">Exposed to English:</label>
                            <div className="space-y-1">
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                not specified
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                since birth
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                for one to three years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                for four to five years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                for longer than five years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="exposedToEnglish" className="rounded border-gray-300" />
                                other
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-xs text-gray-600 mb-1">Speaking English:</label>
                            <div className="space-y-1">
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                not specified
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                since first talking
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                for one to three years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                for four to five years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                for longer than five years
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="radio" name="speakingEnglish" className="rounded border-gray-300" />
                                other
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs text-gray-600 mb-1">Examiner rating of Examinee's English language fluency to complete test administration:</label>
                          <div className="space-y-1">
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="radio" name="englishFluency" className="rounded border-gray-300" />
                              not specified
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="radio" name="englishFluency" className="rounded border-gray-300" />
                              adequate
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="radio" name="englishFluency" className="rounded border-gray-300" />
                              somewhat adequate
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="radio" name="englishFluency" className="rounded border-gray-300" />
                              poor
                            </label>
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-blue-800 pt-4 border-t">Development</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Developmental History According to:</label>
                            <select 
                              value={historyOtherData.developmentalHistoryOther ? 'other' : ''}
                              onChange={(e) => {
                                if (e.target.value === 'other') {
                                  handleHistoryOtherChange('developmentalHistoryOther', true);
                                } else {
                                  handleHistoryOtherChange('developmentalHistoryOther', false);
                                }
                              }}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            >
                              <option value="">Please Select...</option>
                              <option value="parent">Parent</option>
                              <option value="guardian">Guardian</option>
                              <option value="self">Self</option>
                              <option value="records">Medical records</option>
                              <option value="other">Other</option>
                            </select>
                            {historyOtherData.developmentalHistoryOther && (
                              <input
                                type="text"
                                value={historyOtherData.developmentalHistoryOtherText}
                                onChange={(e) => handleHistoryOtherTextChange('developmentalHistoryOtherText', e.target.value)}
                                placeholder="Please specify..."
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs text-gray-600">Birth Information:</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              was born with no apparent complications
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              was born premature
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              weighed less than 5 1/2 pounds at birth
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              spent time in a neonatal intensive care unit
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              required assistance with breathing
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              was born past due date
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300"
                                checked={historyOtherData.birthInformationOther}
                                onChange={(e) => handleHistoryOtherChange('birthInformationOther', e.target.checked)}
                              />
                              other
                            </label>
                            {historyOtherData.birthInformationOther && (
                              <input
                                type="text"
                                value={historyOtherData.birthInformationOtherText}
                                onChange={(e) => handleHistoryOtherTextChange('birthInformationOtherText', e.target.value)}
                                placeholder="Please specify..."
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-xs text-gray-600">Developmental Milestones:</label>
                          <div className="space-y-2">
                            {[
                              'sitting alone', 'crawling', 'standing alone', 'walking alone',
                              'babbling', 'speaking first words', 'speaking short sentences',
                              'eating solids', 'self-feeding', 'using toilet when awake',
                              'staying dry at night', 'social interaction', 'other'
                            ].map((milestone) => (
                              <div key={milestone} className={`grid gap-2 items-center ${milestone === 'other' ? 'grid-cols-1' : 'grid-cols-5'}`}>
                                {milestone !== 'other' && (
                                  <>
                                    <span className="text-xs text-gray-700 capitalize">{milestone}:</span>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={milestone} className="rounded border-gray-300" />
                                      early
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={milestone} className="rounded border-gray-300" />
                                      typical
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={milestone} className="rounded border-gray-300" />
                                      late
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={milestone} className="rounded border-gray-300" defaultChecked />
                                      unknown
                                    </label>
                                  </>
                                )}
                                {milestone === 'other' && (
                                  <>
                                    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={historyOtherData.developmentalMilestonesOther}
                                        onChange={(e) => handleHistoryOtherChange('developmentalMilestonesOther', e.target.checked)}
                                      />
                                      other
                                    </label>
                                    {historyOtherData.developmentalMilestonesOther && (
                                      <input
                                        type="text"
                                        value={historyOtherData.developmentalMilestonesOtherText}
                                        onChange={(e) => handleHistoryOtherTextChange('developmentalMilestonesOtherText', e.target.value)}
                                        placeholder="Please specify..."
                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {historySubTab === 'education' && (
                    <>
                      {/* Sample Report Sentence */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <button
                          onClick={() => setShowEducationSampleReport(!showEducationSampleReport)}
                          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                        >
                          <span className="text-xs font-medium">{showEducationSampleReport ? '⊟' : '⊞'}</span>
                          <span className="font-medium text-xs">Sample Report Sentence</span>
                        </button>

                        {showEducationSampleReport && (
                          <div className="p-4 bg-white border-t">
                            <textarea
                              value={educationSampleReportSentence || generateEducationSampleReportSentence()}
                              onChange={(e) => setEducationSampleReportSentence(e.target.value)}
                              placeholder="Sample report sentence will be generated here..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This sentence is automatically generated from the Education fields below. You can edit it as needed.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Education Content */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Educational History According to:</label>
                          <select 
                            value={historyOtherData.educationHistoryOther ? 'other' : ''}
                            onChange={(e) => {
                              if (e.target.value === 'other') {
                                handleHistoryOtherChange('educationHistoryOther', true);
                              } else {
                                handleHistoryOtherChange('educationHistoryOther', false);
                              }
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="">Please Select...</option>
                            <option value="parent">Parent</option>
                            <option value="guardian">Guardian</option>
                            <option value="self">Self</option>
                            <option value="school">School Records</option>
                            <option value="other">Other</option>
                          </select>
                          {historyOtherData.educationHistoryOther && (
                            <input
                              type="text"
                              value={historyOtherData.educationHistoryOtherText}
                              onChange={(e) => handleHistoryOtherTextChange('educationHistoryOtherText', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                            />
                          )}
                        </div>

                        {/* Highest Level of Education */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Highest Level of Education</h3>

                          {/* Sample Report Sentence */}
                          <div className="border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                              <span className="text-xs font-medium">⊞</span>
                              <span className="font-medium text-xs">Sample Report Sentence</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs text-gray-600">Examinee:</label>
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="none">None</option>
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="highschool">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                                <option value="postgraduate">Post Graduate</option>
                              </select>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                Completed Programme
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs text-gray-600">Mother:</label>
                              <select
                                value={educationSampleReportData.motherEducation}
                                onChange={(e) => handleEducationSampleReportTextChange('motherEducation', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              >
                                <option value="">Please Select...</option>
                                <option value="none">None</option>
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="highschool">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                                <option value="postgraduate">Post Graduate</option>
                                <option value="other">Other</option>
                              </select>
                              {educationSampleReportData.motherEducation === 'other' && (
                                <input
                                  type="text"
                                  value={educationSampleReportData.motherEducationOther || ''}
                                  onChange={(e) => handleEducationSampleReportTextChange('motherEducationOther', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              )}
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                Completed Programme
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs text-gray-600">Father:</label>
                              <select
                                value={educationSampleReportData.fatherEducation}
                                onChange={(e) => handleEducationSampleReportTextChange('fatherEducation', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              >
                                <option value="">Please Select...</option>
                                <option value="none">None</option>
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="highschool">High School</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                                <option value="postgraduate">Post Graduate</option>
                                <option value="other">Other</option>
                              </select>
                              {educationSampleReportData.fatherEducation === 'other' && (
                                <input
                                  type="text"
                                  value={educationSampleReportData.fatherEducationOther || ''}
                                  onChange={(e) => handleEducationSampleReportTextChange('fatherEducationOther', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              )}
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                Completed Programme
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* School/Class Placement */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">School/Class Placement</h3>
                          
                          {/* Sample Report Sentence */}
                          <div className="border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                              <span className="text-xs font-medium">⊞</span>
                              <span className="font-medium text-xs">Sample Report Sentence</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">School/Class Placement:</label>
                              <select 
                                value={historyOtherData.schoolPlacementOther ? 'other' : ''}
                                onChange={(e) => {
                                  if (e.target.value === 'other') {
                                    handleHistoryOtherChange('schoolPlacementOther', true);
                                  } else {
                                    handleHistoryOtherChange('schoolPlacementOther', false);
                                  }
                                }}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              >
                                <option value="">Please Select...</option>
                                <option value="regular">Regular</option>
                                <option value="gifted">Gifted/Talented</option>
                                <option value="special">Special Education</option>
                                <option value="remedial">Remedial</option>
                                <option value="other">Other</option>
                              </select>
                              {historyOtherData.schoolPlacementOther && (
                                <input
                                  type="text"
                                  value={historyOtherData.schoolPlacementOtherText}
                                  onChange={(e) => handleHistoryOtherTextChange('schoolPlacementOtherText', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              )}
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Length of time in selected placement:</label>
                              <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Current (or Last Known) Results:</label>
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                                <option value="incomplete">Incomplete</option>
                                <option value="withdrawn">Withdrawn</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* School Performance */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">School Performance</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Current</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Name of Current School:</label>
                                  <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Current Interpersonal/Behavioural Difficulties:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="none">None</option>
                                    <option value="mild">Mild</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="severe">Severe</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Current Attendance:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Current Academic Performance:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="average">Average</option>
                                    <option value="below">Below Average</option>
                                    <option value="poor">Poor</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Past</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Past Attendance:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="fair">Fair</option>
                                    <option value="poor">Poor</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Past Interpersonal/Behavioural Difficulties:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="none">None</option>
                                    <option value="mild">Mild</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="severe">Severe</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Past Academic Performance:</label>
                                  <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                    <option value="">Please Select...</option>
                                    <option value="excellent">Excellent</option>
                                    <option value="good">Good</option>
                                    <option value="average">Average</option>
                                    <option value="below">Below Average</option>
                                    <option value="poor">Poor</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Standardised Achievement Test Performance */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Standardised Achievement Test Performance</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Most Recent Standardised Achievement Test Performance</h4>
                              <div className="space-y-2">
                                {['Reading', 'Math', 'Language', 'Other'].map((subject) => (
                                  <div key={subject} className="grid grid-cols-5 gap-2 items-center">
                                    <span className="text-xs text-gray-700">{subject}:</span>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`recent${subject}`} className="rounded border-gray-300" defaultChecked />
                                      not specified
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`recent${subject}`} className="rounded border-gray-300" />
                                      above average
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`recent${subject}`} className="rounded border-gray-300" />
                                      average
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`recent${subject}`} className="rounded border-gray-300" />
                                      below average
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Standardised Achievement Test Performance in the Past</h4>
                              <div className="space-y-2">
                                {['Reading', 'Math', 'Language', 'Other'].map((subject) => (
                                  <div key={`past${subject}`} className="grid grid-cols-5 gap-2 items-center">
                                    <span className="text-xs text-gray-700">{subject}:</span>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`past${subject}`} className="rounded border-gray-300" defaultChecked />
                                      not specified
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`past${subject}`} className="rounded border-gray-300" />
                                      above average
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`past${subject}`} className="rounded border-gray-300" />
                                      average
                                    </label>
                                    <label className="flex items-center gap-1 text-xs text-gray-700">
                                      <input type="radio" name={`past${subject}`} className="rounded border-gray-300" />
                                      below average
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Other</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-gray-700">Frequency of Changing Schools</h4>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Examinee has attended:</label>
                                <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                  <option value="">Please Select...</option>
                                  <option value="1">1 school</option>
                                  <option value="2-3">2-3 schools</option>
                                  <option value="4-5">4-5 schools</option>
                                  <option value="6+">6 or more schools</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-gray-700">Early Education</h4>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Nursery Experience:</label>
                                <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                  <option value="">Please Select...</option>
                                  <option value="none">None</option>
                                  <option value="less1">Less than 1 year</option>
                                  <option value="1-2">1-2 years</option>
                                  <option value="2+">2+ years</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Preschool Experience:</label>
                                <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                  <option value="">Please Select...</option>
                                  <option value="none">None</option>
                                  <option value="less1">Less than 1 year</option>
                                  <option value="1-2">1-2 years</option>
                                  <option value="2+">2+ years</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-2">School Retention</h4>
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">Retained in Years:</label>
                              <input type="number" className="w-20 px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>
                          </div>
                        </div>

                        {/* Academic Performance - Strengths and Weaknesses */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Academic Performance - Strengths and Weaknesses</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Strengths */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-gray-700">Personal Strengths (select up to three):</h4>
                              <div className="space-y-1">
                                {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                  <label key={`strength-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Personal Weaknesses */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-gray-700">Personal Weaknesses (select up to three):</h4>
                              <div className="space-y-1">
                                {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                  <label key={`weakness-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths Compared to Peers */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-gray-700">Strengths Compared to Peers (select up to three):</h4>
                              <div className="space-y-1">
                                {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                  <label key={`peer-strength-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Weaknesses Compared to Peers */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-gray-700">Weaknesses Compared to Peers (select up to three):</h4>
                              <div className="space-y-1">
                                {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                  <label key={`peer-weakness-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    {item}
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Diagnosed Specific Learning Disorders/Disabilities */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium text-gray-700">Diagnosed Specific Learning Disorders/Disabilities:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {['reading', 'writing', 'mathematics', 'other', 'other', 'other'].map((item, index) => (
                                <label key={`disability-${index}`} className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  {item} {index > 2 ? index - 2 : ''}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {historySubTab === 'health' && (
                    <>
                      {/* Sample Report Sentence */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <button
                          onClick={() => setShowHealthSampleReport(!showHealthSampleReport)}
                          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                        >
                          <span className="text-xs font-medium">{showHealthSampleReport ? '⊟' : '⊞'}</span>
                          <span className="font-medium text-xs">Sample Report Sentence</span>
                        </button>

                        {showHealthSampleReport && (
                          <div className="p-4 bg-white border-t">
                            <textarea
                              value={healthSampleReportSentence || generateHealthSampleReportSentence()}
                              onChange={(e) => setHealthSampleReportSentence(e.target.value)}
                              placeholder="Sample report sentence will be generated here..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This sentence is automatically generated from the Health fields below. You can edit it as needed.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Health Content */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Health History According to:</label>
                          <select
                            value={healthSampleReportData.healthHistorySource}
                            onChange={(e) => handleHealthSampleReportTextChange('healthHistorySource', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="">Please Select...</option>
                            <option value="his mother">Mother</option>
                            <option value="his father">Father</option>
                            <option value="his guardian">Guardian</option>
                            <option value="self">Self</option>
                            <option value="records">Medical Records</option>
                            <option value="other">Other</option>
                          </select>
                          {healthSampleReportData.healthHistorySource === 'other' && (
                            <input
                              type="text"
                              value={healthSampleReportData.healthHistorySourceOther || ''}
                              onChange={(e) => handleHealthSampleReportTextChange('healthHistorySourceOther', e.target.value)}
                              placeholder="Please specify..."
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                            />
                          )}
                        </div>

                        {/* Vision and Hearing Conditions */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Vision and Hearing Conditions</h3>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Vision */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <label className="block text-xs text-gray-600">Date of Vision Screening:</label>
                                <input
                                  type="text"
                                  value={healthSampleReportData.visionDate}
                                  onChange={(e) => handleHealthSampleReportTextChange('visionDate', e.target.value)}
                                  className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Results of Vision Screening:</label>
                                <select
                                  value={healthSampleReportData.visionResult}
                                  onChange={(e) => handleHealthSampleReportTextChange('visionResult', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                >
                                  <option value="">Please Select...</option>
                                  <option value="that he has normal visual acuity">Normal visual acuity</option>
                                  <option value="normal visual acuity with the aid of corrective lenses">Normal visual acuity with corrective lenses</option>
                                  <option value="a need for follow-up vision screening">Need for follow-up vision screening</option>
                                  <option value="a need for a complete vision examination">Need for complete vision examination</option>
                                  <option value="other">Other</option>
                                </select>
                                {healthSampleReportData.visionResult === 'other' && (
                                  <input
                                    type="text"
                                    value={healthSampleReportData.visionResultOther || ''}
                                    onChange={(e) => handleHealthSampleReportTextChange('visionResultOther', e.target.value)}
                                    placeholder="Please specify..."
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Hearing */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <label className="block text-xs text-gray-600">Date of Hearing Screening:</label>
                                <input
                                  type="text"
                                  value={healthSampleReportData.hearingDate}
                                  onChange={(e) => handleHealthSampleReportTextChange('hearingDate', e.target.value)}
                                  className="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Results of Hearing Screening:</label>
                                <select
                                  value={healthSampleReportData.hearingResult}
                                  onChange={(e) => handleHealthSampleReportTextChange('hearingResult', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                                >
                                  <option value="">Please Select...</option>
                                  <option value="within normal limits">Within normal limits</option>
                                  <option value="within normal limits with the assistance of a hearing aid">Within normal limits when aided</option>
                                  <option value="needs a referral to assess the functioning of the inner ear">Needs referral for inner ear assessment</option>
                                  <option value="a need for a follow-up hearing screening">Need for follow-up hearing screening</option>
                                  <option value="further assessment needed; refer to audiologist">Further assessment needed</option>
                                  <option value="other">Other</option>
                                </select>
                                {healthSampleReportData.hearingResult === 'other' && (
                                  <input
                                    type="text"
                                    value={healthSampleReportData.hearingResultOther || ''}
                                    onChange={(e) => handleHealthSampleReportTextChange('hearingResultOther', e.target.value)}
                                    placeholder="Please specify..."
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sensory or Motor Conditions */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Sensory or Motor Conditions</h3>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Sensory Conditions */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-gray-700">Sensory Conditions</h4>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                no history of sensory dysfunction
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                a history of sensory dysfunction
                              </label>
                              <div className="space-y-1 ml-4">
                                <label className="block text-xs text-gray-600">Sensory History:</label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  sensory modulation dysfunction
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  sensory integration dysfunction
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  visual perceptual dysfunction
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  visual processing
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  auditory processing
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  other
                                </label>
                              </div>
                            </div>

                            {/* Motor Conditions */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-medium text-gray-700">Motor Conditions</h4>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                no history of motor dysfunction
                              </label>
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                                a history of motor dysfunction
                              </label>
                              <div className="space-y-1 ml-4">
                                <label className="block text-xs text-gray-600">Fine-Motor History:</label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor hand strength
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor manipulation of objects
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor handwriting
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  other
                                </label>
                              </div>
                              <div className="space-y-1 ml-4">
                                <label className="block text-xs text-gray-600">Gross-Motor History:</label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor coordination
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor endurance
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor strength
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor motor planning
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor balance
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  poor postural control
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  difficulty learning to ride a bicycle
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  other
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Health Conditions */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Health Conditions</h3>
                          
                          {/* Sample Report Sentence */}
                          <div className="border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                              <span className="text-xs font-medium">⊞</span>
                              <span className="font-medium text-xs">Sample Report Sentence</span>
                            </button>
                          </div>

                          {/* General checkboxes */}
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              No history of medical, psychiatric, or neurological problems
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Medical, psychiatric, and neurological history is unknown
                            </label>
                          </div>

                          {/* Medical Conditions Table */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-blue-700 bg-gray-100 p-2">Medical Conditions</h4>
                            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 border-b pb-1">
                              <span className="col-span-1">Condition</span>
                              <span className="text-center">Diagnosed in the Past</span>
                              <span className="text-center">Diagnosed Currently</span>
                              <span className="text-center">Previously Treated</span>
                              <span className="text-center">Currently Being Treated</span>
                            </div>
                            {[
                              'Alcohol use disorder', 'Allergy (severe)', 'Asthma', 'Balance difficulties',
                              'Cerebral palsy', 'Cleft palate', 'Chromosomal abnormalities',
                              'Chronic obstructive pulmonary disease', 'Delirium', 'Diabetes', 'Dizziness',
                              'Down syndrome', 'Drug use disorder', 'Ear infections (chronic)',
                              'Eating disorder', 'Fetal alcohol syndrome', 'Headaches', 'Heart disease',
                              'HIV infection', "Huntington's disease", 'Hypertension', 'Lead poisoning',
                              'Lupus', 'Medical concerns (general)', 'Multiple sclerosis',
                              'Muscular dystrophy', 'Pain (back or chronic)', "Parkinson's disease",
                              'Sleeping problems', 'Spina bifida', 'Stroke (cerebrovascular accident)',
                              'Transient ischemic attack'
                            ].map((condition) => (
                              <div key={condition} className="grid grid-cols-5 gap-2 items-center py-1 border-b border-gray-100">
                                <span className="text-xs text-gray-700">{condition}</span>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              </div>
                            ))}
                            <div className="grid grid-cols-5 gap-2 items-center py-1">
                              <span className="text-xs text-gray-700">Other</span>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                            </div>
                            <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" placeholder="Please specify other medical condition..." />
                          </div>

                          {/* Psychiatric/Psychological Conditions Table */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-blue-700 bg-gray-100 p-2">Psychiatric / Psychological Conditions</h4>
                            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 border-b pb-1">
                              <span className="col-span-1">Condition</span>
                              <span className="text-center">Diagnosed in the Past</span>
                              <span className="text-center">Diagnosed Currently</span>
                              <span className="text-center">Previously Treated</span>
                              <span className="text-center">Currently Being Treated</span>
                            </div>
                            {[
                              'Anxiety', "Asperger's Disorder", 'Attention-deficit hyperactivity disorder',
                              'Autism spectrum disorder', 'Bipolar disorder', 'Depression',
                              'Executive functioning disorder', 'Generalized anxiety disorder',
                              'Pervasive Developmental Disorder', 'Post-traumatic stress disorder',
                              'Schizophrenia'
                            ].map((condition) => (
                              <div key={condition} className="grid grid-cols-5 gap-2 items-center py-1 border-b border-gray-100">
                                <span className="text-xs text-gray-700">{condition}</span>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              </div>
                            ))}
                            <div className="grid grid-cols-5 gap-2 items-center py-1">
                              <span className="text-xs text-gray-700">Other</span>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                            </div>
                            <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" placeholder="Please specify other psychiatric/psychological condition..." />
                          </div>

                          {/* Neurological Conditions Table */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-blue-700 bg-gray-100 p-2">Neurological Conditions</h4>
                            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 border-b pb-1">
                              <span className="col-span-1">Condition</span>
                              <span className="text-center">Diagnosed in the Past</span>
                              <span className="text-center">Diagnosed Currently</span>
                              <span className="text-center">Previously Treated</span>
                              <span className="text-center">Currently Being Treated</span>
                            </div>
                            {[
                              'Brain insult', 'Brain tumor', 'Concussion', 'Loss of consciousness',
                              'Memory difficulties', 'Neuroimaging findings (inconclusive)',
                              'Neurological exam (abnormal)', 'Seizure disorder', 'Seizures or convulsions',
                              'Sensory-motor difficulties', 'Sensory processing problems', 'Tic (motor)',
                              'Traumatic brain injury'
                            ].map((condition) => (
                              <div key={condition} className="grid grid-cols-5 gap-2 items-center py-1 border-b border-gray-100">
                                <span className="text-xs text-gray-700">{condition}</span>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              </div>
                            ))}
                            <div className="grid grid-cols-5 gap-2 items-center py-1">
                              <span className="text-xs text-gray-700">Other</span>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                            </div>
                            <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" placeholder="Please specify other neurological condition..." />
                          </div>

                          {/* Other / Related Conditions Table */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold text-blue-700 bg-gray-100 p-2">Other / Related Conditions</h4>
                            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-600 border-b pb-1">
                              <span className="col-span-1">Condition</span>
                              <span className="text-center">Diagnosed in the Past</span>
                              <span className="text-center">Diagnosed Currently</span>
                              <span className="text-center">Previously Treated</span>
                              <span className="text-center">Currently Being Treated</span>
                            </div>
                            {[
                              'Auditory processing disorder', 'Cognitive delay', 'Dysphagia',
                              'Feeding difficulties', 'Hearing difficulty (allergy-related)',
                              'Intellectual disability', 'Pressure equalization (P/E) tubes'
                            ].map((condition) => (
                              <div key={condition} className="grid grid-cols-5 gap-2 items-center py-1 border-b border-gray-100">
                                <span className="text-xs text-gray-700">{condition}</span>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                                <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              </div>
                            ))}
                            <div className="grid grid-cols-5 gap-2 items-center py-1">
                              <span className="text-xs text-gray-700">Other</span>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                              <div className="flex justify-center"><input type="checkbox" className="rounded border-gray-300" /></div>
                            </div>
                            <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" placeholder="Please specify other related condition..." />
                          </div>

                          {/* All Current Medications */}
                          <div className="space-y-2">
                            <label className="block text-xs text-gray-600">All Current Medications:</label>
                            <textarea 
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              maxLength={255}
                            />
                            <p className="text-xs text-gray-500 text-right">255 Characters remaining</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {historySubTab === 'employment' && (
                    <>
                      {/* Sample Report Sentence */}
                      <div className="border rounded-lg overflow-hidden mb-4">
                        <button
                          onClick={() => setShowEmploymentSampleReport(!showEmploymentSampleReport)}
                          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                        >
                          <span className="text-xs font-medium">{showEmploymentSampleReport ? '⊟' : '⊞'}</span>
                          <span className="font-medium text-xs">Sample Report Sentence</span>
                        </button>

                        {showEmploymentSampleReport && (
                          <div className="p-4 bg-white border-t">
                            <textarea
                              value={employmentSampleReportSentence || generateEmploymentSampleReportSentence()}
                              onChange={(e) => setEmploymentSampleReportSentence(e.target.value)}
                              placeholder="Sample report sentence will be generated here..."
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              This sentence is automatically generated from the Employment fields below. You can edit it as needed.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Employment Content */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Current Employment */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-blue-800">Current Employment</h3>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Status:</label>
                              <select
                                value={employmentSampleReportData.employmentStatus}
                                onChange={(e) => handleEmploymentSampleReportTextChange('employmentStatus', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              >
                                <option value="">Please Select...</option>
                                <option value="employed">Employed</option>
                                <option value="unemployed">Unemployed</option>
                                <option value="self-employed">Self-Employed</option>
                                <option value="retired">Retired</option>
                                <option value="student">Student</option>
                                <option value="other">Other</option>
                              </select>
                              {employmentSampleReportData.employmentStatus === 'other' && (
                                <input
                                  type="text"
                                  value={employmentSampleReportData.employmentStatusOther || ''}
                                  onChange={(e) => handleEmploymentSampleReportTextChange('employmentStatusOther', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              )}
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Work Performance:</label>
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="average">Average</option>
                                <option value="below">Below Average</option>
                                <option value="poor">Poor</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Difficulties Affecting Performance:</label>
                              <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Duration (Years):</label>
                              <input type="number" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Duration (Months):</label>
                              <input type="number" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment History Source:</label>
                              <select
                                value={employmentSampleReportData.employmentHistorySource}
                                onChange={(e) => handleEmploymentSampleReportTextChange('employmentHistorySource', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                              >
                                <option value="">Please Select...</option>
                                <option value="self-report">Self-Report</option>
                                <option value="employer">Employer</option>
                                <option value="records">Employment Records</option>
                                <option value="other">Other</option>
                              </select>
                              {employmentSampleReportData.employmentHistorySource === 'other' && (
                                <input
                                  type="text"
                                  value={employmentSampleReportData.employmentHistorySourceOther || ''}
                                  onChange={(e) => handleEmploymentSampleReportTextChange('employmentHistorySourceOther', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              )}
                            </div>
                          </div>

                          {/* Previous Employment */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-blue-800">Previous Employment</h3>
                            
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Status:</label>
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="fulltime">Full-time</option>
                                <option value="parttime">Part-time</option>
                                <option value="selfemployed">Self-employed</option>
                                <option value="unemployed">Unemployed</option>
                                <option value="retired">Retired</option>
                                <option value="student">Student</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Work Performance:</label>
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="excellent">Excellent</option>
                                <option value="good">Good</option>
                                <option value="average">Average</option>
                                <option value="below">Below Average</option>
                                <option value="poor">Poor</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Difficulties Affecting Performance:</label>
                              <input type="text" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Duration (Years):</label>
                              <input type="number" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>

                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Employment Duration (Months):</label>
                              <input type="number" className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Error Message */}
          {errors.submit && (
            <div className="px-6 py-3 bg-red-50 border-t border-red-100">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <FiInfo className="w-4 h-4" />
                {errors.submit}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export default ExamineeCreateForm;