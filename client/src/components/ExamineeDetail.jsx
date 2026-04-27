import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2, FiFileText, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiEdit3, FiDownload, FiFile, FiImage, FiX, FiEye, FiSave, FiChevronDown, FiInfo } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatient } from '../store/slices/patientSlice';
import { fetchAssessments, toggleAssessmentSelection, clearSelection, selectAllAssessments, createAssessment, deleteAssessment, generateAssessmentReport, updateAssessment } from '../store/slices/assessmentSlice';
import { useToast } from './Toast';
import AssignAssessmentModal from './AssignAssessmentModal';
import GenerateReportModal from './GenerateReportModal';
import EditAssessmentModal from './EditAssessmentModal';
import api from '../services/api';

const ExamineeDetail = ({ examineeId, onBack, onEditExaminee }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { currentPatient, isLoading: patientLoading, error: patientError } = useSelector((state) => state.patients);
  const { assessments, isLoading: assessmentLoading, error: assessmentError, selectedAssessments } = useSelector((state) => state.assessments);
  
  // Tab states
  const [activeTab, setActiveTab] = useState('demographics');
  const [evaluationSubTab, setEvaluationSubTab] = useState('reasonsForTesting');
  const [historySubTab, setHistorySubTab] = useState('referral');
  
  // Form states - populated from currentPatient
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
  
  const [evaluationData, setEvaluationData] = useState({
    academicConcerns: { maths: false, general: false, writing: false, reading: false, other: false, otherText: '' },
    cognitiveEvaluation: { intellectualDisability: false, general: false, giftedTalented: false, traumaticBrainInjury: false, other: false, otherText: '' },
    behaviourConcerns: { aggression: false, general: false, attentionHyperactivity: false, other: false, otherText: '' },
    mentalHealth: { anxiety: false, general: false, depression: false, other: false, otherText: '' },
    developmentalDelay: { motor: false, general: false, physicalGrowth: false, other: false, otherText: '' },
    languageConcerns: { receptive: false, general: false, expressive: false, other: false, otherText: '' },
    speechConcerns: { articulation: false, general: false, fluency: false, other: false, otherText: '' },
    physicalConcerns: { other: false, otherText: '' },
    substanceAbuse: { other: false, otherText: '' },
    employment: { other: false, otherText: '' }
  });
  
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
  
  const [historyData, setHistoryData] = useState({
    referralSourceName: '',
    referralSourceRole: '',
    schoolRelatedConcerns: false,
    speechConcerns: false,
    languageConcerns: false,
    socialEmotionalConcerns: false,
    cognitiveConcerns: false,
    physicalConcerns: false,
    vocationalRehabilitationLegal: false,
    birthInformationOther: false,
    birthInformationOtherText: '',
    developmentalMilestonesOther: false,
    developmentalMilestonesOtherText: ''
  });

  // State for Sample Report Sentence
  const [showSampleReport, setShowSampleReport] = useState(false);

  // State for Current Living Arrangements
  const [currentLivingArrangement, setCurrentLivingArrangement] = useState('');
  const [currentLivingArrangementOther, setCurrentLivingArrangementOther] = useState('');

  // State for Language/Development Sample Report Sentence
  const [showLanguageSampleReport, setShowLanguageSampleReport] = useState(false);
  const [languageSampleReportSentence, setLanguageSampleReportSentence] = useState('');
  const [languageSampleReportData, setLanguageSampleReportData] = useState({
    primaryLanguage: '',
    exposedToEnglish: 'not_specified',
    speakingEnglish: 'not_specified',
    fluencyRating: 'not_specified',
    birthComplications: 'with no apparent complications',
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
    fatherEducation: '',
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
    visionDate: '',
    visionResult: '',
    hearingDate: '',
    hearingResult: '',
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
    currentJob: '',
    jobDuration: '',
    previousJobs: '',
    employmentHistorySource: '',
    additionalInfo: ''
  });

  // State for Personal Sample Report Sentence
  const [showPersonalSampleReport, setShowPersonalSampleReport] = useState(false);
  const [personalSampleReportSentence, setPersonalSampleReportSentence] = useState('');

  // State for Personal Notes
  const [showPersonalNotes, setShowPersonalNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  
  const [age, setAge] = useState({ years: 0, months: 0 });
  const [errors, setErrors] = useState({});
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedAssessmentToEdit, setSelectedAssessmentToEdit] = useState(null);
  const [isEditAssessmentModalOpen, setIsEditAssessmentModalOpen] = useState(false);

  useEffect(() => {
    if (examineeId) {
      dispatch(fetchPatient(examineeId));
      dispatch(fetchAssessments(examineeId));
    }
  }, [dispatch, examineeId]);

  // Populate form data when currentPatient loads
  useEffect(() => {
    if (currentPatient) {
      console.log('🔄 EXAMINEE DETAIL - Loading Patient Data');
      console.log('📦 Raw currentPatient:', currentPatient);
      
      // Parse JSON fields
      let evalData = currentPatient.evaluation_data;
      let diagData = currentPatient.diagnosis_data;
      let histData = currentPatient.history_data;
      
      console.log('📊 Raw Data Types:');
      console.log('  - evaluation_data type:', typeof evalData);
      console.log('  - diagnosis_data type:', typeof diagData);
      console.log('  - history_data type:', typeof histData);
      
      if (typeof evalData === 'string') {
        try { 
          evalData = JSON.parse(evalData); 
          console.log('✅ Parsed evaluation_data:', evalData);
        } catch (e) { 
          console.error('❌ Error parsing evaluation_data:', e);
          evalData = {}; 
        }
      }
      if (typeof diagData === 'string') {
        try { 
          diagData = JSON.parse(diagData); 
          console.log('✅ Parsed diagnosis_data:', diagData);
        } catch (e) { 
          console.error('❌ Error parsing diagnosis_data:', e);
          diagData = {}; 
        }
      }
      if (typeof histData === 'string') {
        try { 
          histData = JSON.parse(histData); 
          console.log('✅ Parsed history_data:', histData);
        } catch (e) { 
          console.error('❌ Error parsing history_data:', e);
          histData = {}; 
        }
      }
      
      console.log('📝 Setting Form Data:');
      const newFormData = {
        firstName: currentPatient.first_name || '',
        middleName: currentPatient.middle_name || '',
        lastName: currentPatient.last_name || '',
        examineeId: currentPatient.student_id || '',
        gender: currentPatient.gender ? currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1) : '',
        birthDate: currentPatient.date_of_birth ? new Date(currentPatient.date_of_birth).toISOString().split('T')[0] : '',
        schoolName: currentPatient.school_name || '',
        grade: currentPatient.grade || '',
        languageOfTesting: currentPatient.language_of_testing || '',
        customLanguage: currentPatient.custom_language || '',
        email: currentPatient.email || '',
        phone: currentPatient.phone || '',
        address: currentPatient.address || '',
        city: currentPatient.city || '',
        state: currentPatient.state || '',
        zipCode: currentPatient.zip_code || '',
        emergencyContactName: currentPatient.emergency_contact_name || '',
        emergencyContactPhone: currentPatient.emergency_contact_phone || '',
        emergencyContactRelation: currentPatient.emergency_contact_relation || '',
        customField1: currentPatient.custom_field_1 || '',
        customField2: currentPatient.custom_field_2 || '',
        customField3: currentPatient.custom_field_3 || '',
        customField4: currentPatient.custom_field_4 || '',
        status: currentPatient.status || 'active',
        registrationDate: currentPatient.registration_date ? new Date(currentPatient.registration_date).toISOString().split('T')[0] : '',
        comment: currentPatient.comment || '',
        account: currentPatient.centre_name || 'CENTRIX CENTRE',
        requiresAssessment: currentPatient.requires_assessment || currentPatient.requiresAssessment || false,
        requiresTherapy: currentPatient.requires_therapy || currentPatient.requiresTherapy || false
      };
      console.log('  Form Data:', newFormData);
      
      // Set form data
      setFormData(newFormData);
      
      console.log('📋 Setting Evaluation Data:');
      console.log('  - academicConcerns:', evalData?.academicConcerns);
      console.log('  - cognitiveEvaluation:', evalData?.cognitiveEvaluation);
      console.log('  - behaviourConcerns:', evalData?.behaviourConcerns);
      
      // Set evaluation data with defaults and merge saved data
      // FIX: Ensure evalData exists and merge properly with defaults
      const safeEvalData = evalData || {};
      console.log('🔍 DEBUG - Saved evaluation_data from API:', JSON.stringify(safeEvalData, null, 2));
      console.log('🔍 DEBUG - Keys in academicConcerns:', Object.keys(safeEvalData.academicConcerns || {}));
      setEvaluationData(prev => {
        const newEvalData = {
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
        };
        console.log('  Final Evaluation Data:', newEvalData);
        console.log('  Final academicConcerns keys:', Object.keys(newEvalData.academicConcerns));
        return newEvalData;
      });
      
      console.log('🏥 Setting Diagnosis Data:');
      // FIX: Ensure diagData is properly merged with defaults for nested structure
      const safeDiagData = diagData || {};
      console.log('🐛 DEBUG - safeDiagData from API:', JSON.stringify(safeDiagData, null, 2));
      
      // Check if data is in old flat format or new nested format
      const isOldFormat = typeof safeDiagData.autismSpectrum === 'boolean';
      console.log('🐛 DEBUG - Is old flat format:', isOldFormat);
      
      let newDiagData;
      
      if (isOldFormat) {
        // Convert old flat format to new nested format
        console.log('🔄 Converting old flat format to new nested format');
        newDiagData = {
          autismSpectrum: {
            aspergers: false,
            autistic: false,
            childhoodDisintegrative: false,
            pervasiveDevelopmental: false,
            retts: false,
            other: false,
            otherText: '',
            // If old format had this as true, mark all sub-options as true for backward compatibility
            ...(safeDiagData.autismSpectrum ? { aspergers: true, autistic: true, childhoodDisintegrative: true, pervasiveDevelopmental: true, retts: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.behaviourEmotional ? { adhd: true, conduct: true, disruptive: true, emotional: true, intermittentExplosive: true, kleptomania: true, oppositionalDefiant: true, pathologicalGambling: true, pyromania: true, trichotillomania: true, other: true } : {})
          },
          giftedTalented: {
            gifted: false,
            other: false,
            otherText: '',
            ...(safeDiagData.giftedTalented ? { gifted: true } : {})
          },
          intellectualDisability: {
            borderline: false,
            cognitiveDelay: false,
            mild: false,
            moderate: false,
            profound: false,
            severe: false,
            other: false,
            otherText: '',
            ...(safeDiagData.intellectualDisability ? { borderline: true, cognitiveDelay: true, mild: true, moderate: true, profound: true, severe: true, other: true } : {})
          },
          languageDelay: {
            expressive: false,
            delay: false,
            mixed: false,
            phonological: false,
            other: false,
            otherText: '',
            ...(safeDiagData.languageDelay ? { expressive: true, delay: true, mixed: true, phonological: true, other: true } : {})
          },
          learningDisability: {
            reading: false,
            mathematics: false,
            disorder: false,
            writing: false,
            nonverbal: false,
            other: false,
            otherText: '',
            ...(safeDiagData.learningDisability ? { reading: true, mathematics: true, disorder: true, writing: true, nonverbal: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.moodRelated ? { acuteStress: true, agoraphobia: true, anorexia: true, bipolar: true, bulimia: true, conversion: true, cyclothymic: true, depressive: true, dysthymic: true, generalizedAnxiety: true, majorDepressive: true, ocd: true, pain: true, panic: true, ptsd: true, separationAnxiety: true, socialPhobia: true, somatization: true, specificPhobia: true, other: true } : {})
          },
          motorDelay: {
            developmentalCoordination: false,
            dyspraxia: false,
            motorDelay: false,
            paraplegia: false,
            quadriplegia: false,
            stereotypic: false,
            other: false,
            otherText: '',
            ...(safeDiagData.motorDelay ? { developmentalCoordination: true, dyspraxia: true, motorDelay: true, paraplegia: true, quadriplegia: true, stereotypic: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.personalityDisorders ? { antisocial: true, avoidant: true, borderline: true, dependent: true, histrionic: true, narcissistic: true, ocd: true, ocpd: true, paranoid: true, schizoid: true, schizotypal: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.schizophrenia ? { briefPsychotic: true, delusional: true, schizoaffective: true, catatonic: true, disorganized: true, paranoid: true, residual: true, undifferentiated: true, schizophreniform: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.speech ? { aphasia: true, apraxia: true, articulation: true, brocas: true, centralAuditory: true, dysarthria: true, fluency: true, receptive: true, voice: true, other: true } : {})
          },
          substanceAbuse: {
            alcoholAbuse: false,
            alcoholDependence: false,
            polysubstanceAbuse: false,
            polysubstanceDependence: false,
            substanceAbuse: false,
            substanceDependence: false,
            other: false,
            otherText: '',
            ...(safeDiagData.substanceAbuse ? { alcoholAbuse: true, alcoholDependence: true, polysubstanceAbuse: true, polysubstanceDependence: true, substanceAbuse: true, substanceDependence: true, other: true } : {})
          },
          traumaticBrainInjury: {
            tbi: false,
            mild: false,
            moderate: false,
            severe: false,
            other: false,
            otherText: '',
            ...(safeDiagData.traumaticBrainInjury ? { tbi: true, mild: true, moderate: true, severe: true, other: true } : {})
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
            otherText: '',
            ...(safeDiagData.other ? { adjustment: true, cognitive: true, creutzfeldtJakob: true, alzheimers: true, depersonalization: true, dissociative: true, epilepsy: true, factitious: true, genderIdentity: true, huntingtons: true, leftStroke: true, leftEpilepsy: true, mildCognitive: true, parkinsons: true, picks: true, insomnia: true, rightStroke: true, rightEpilepsy: true, seizure: true, stroke: true, tic: true, tourettes: true, vascularDementia: true } : {})
          }
        };
      } else {
        // Use new nested format directly
        console.log('✅ Using new nested format');
        newDiagData = {
          autismSpectrum: {
            aspergers: false,
            autistic: false,
            childhoodDisintegrative: false,
            pervasiveDevelopmental: false,
            retts: false,
            other: false,
            otherText: '',
            ...(safeDiagData.autismSpectrum || {})
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
            otherText: '',
            ...(safeDiagData.behaviourEmotional || {})
          },
          giftedTalented: {
            gifted: false,
            other: false,
            otherText: '',
            ...(safeDiagData.giftedTalented || {})
          },
          intellectualDisability: {
            borderline: false,
            cognitiveDelay: false,
            mild: false,
            moderate: false,
            profound: false,
            severe: false,
            other: false,
            otherText: '',
            ...(safeDiagData.intellectualDisability || {})
          },
          languageDelay: {
            expressive: false,
            delay: false,
            mixed: false,
            phonological: false,
            other: false,
            otherText: '',
            ...(safeDiagData.languageDelay || {})
          },
          learningDisability: {
            reading: false,
            mathematics: false,
            disorder: false,
            writing: false,
            nonverbal: false,
            other: false,
            otherText: '',
            ...(safeDiagData.learningDisability || {})
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
            otherText: '',
            ...(safeDiagData.moodRelated || {})
          },
          motorDelay: {
            developmentalCoordination: false,
            dyspraxia: false,
            motorDelay: false,
            paraplegia: false,
            quadriplegia: false,
            stereotypic: false,
            other: false,
            otherText: '',
            ...(safeDiagData.motorDelay || {})
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
            otherText: '',
            ...(safeDiagData.personalityDisorders || {})
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
            otherText: '',
            ...(safeDiagData.schizophrenia || {})
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
            otherText: '',
            ...(safeDiagData.speech || {})
          },
          substanceAbuse: {
            alcoholAbuse: false,
            alcoholDependence: false,
            polysubstanceAbuse: false,
            polysubstanceDependence: false,
            substanceAbuse: false,
            substanceDependence: false,
            other: false,
            otherText: '',
            ...(safeDiagData.substanceAbuse || {})
          },
          traumaticBrainInjury: {
            tbi: false,
            mild: false,
            moderate: false,
            severe: false,
            other: false,
            otherText: '',
            ...(safeDiagData.traumaticBrainInjury || {})
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
            otherText: '',
            ...(safeDiagData.other || {})
          }
        };
      }
      console.log('  Diagnosis Data:', newDiagData);

      // Set diagnosis data
      setDiagnosisData(newDiagData);
      
      // Set history data - FIXED: Merge with defaults to ensure all fields exist
      console.log('📋 Setting History Data (MERGING WITH DEFAULTS):');
      const safeHistData = histData || {};
      setHistoryData(prev => ({
        ...prev,
        ...safeHistData
      }));
      if (safeHistData && Object.keys(safeHistData).length > 0) {
        console.log('  History data keys:', Object.keys(safeHistData));
      }
      
      // Restore personal sample report sentence if it exists in history
      if (histData?.personalSampleReportSentence) {
        console.log('  ✅ Restoring personalSampleReportSentence');
        setPersonalSampleReportSentence(histData.personalSampleReportSentence);
      }

      // Restore personal notes if it exists in history
      if (histData?.personalNotes) {
        console.log('  ✅ Restoring personalNotes');
        setPersonalNotes(histData.personalNotes);
      }
      
      // Restore language/development sample report data if it exists in history
      if (histData?.languageSampleReportData) {
        console.log('  ✅ Restoring languageSampleReportData');
        console.log('     Keys:', Object.keys(histData.languageSampleReportData));
        setLanguageSampleReportData(histData.languageSampleReportData);
      }
      if (histData?.languageSampleReportSentence) {
        console.log('  ✅ Restoring languageSampleReportSentence');
        setLanguageSampleReportSentence(histData.languageSampleReportSentence);
      }
      
      // Restore education sample report data if it exists in history
      if (histData?.educationSampleReportData) {
        console.log('  ✅ Restoring educationSampleReportData');
        console.log('     Keys:', Object.keys(histData.educationSampleReportData));
        setEducationSampleReportData(histData.educationSampleReportData);
      }
      if (histData?.educationSampleReportSentence) {
        console.log('  ✅ Restoring educationSampleReportSentence');
        setEducationSampleReportSentence(histData.educationSampleReportSentence);
      }
      
      // Restore health sample report data if it exists in history
      if (histData?.healthSampleReportData) {
        console.log('  ✅ Restoring healthSampleReportData');
        console.log('     Keys:', Object.keys(histData.healthSampleReportData));
        setHealthSampleReportData(histData.healthSampleReportData);
      }
      if (histData?.healthSampleReportSentence) {
        console.log('  ✅ Restoring healthSampleReportSentence');
        setHealthSampleReportSentence(histData.healthSampleReportSentence);
      }
      
      // Restore employment sample report data if it exists in history
      if (histData?.employmentSampleReportData) {
        console.log('  ✅ Restoring employmentSampleReportData');
        console.log('     Keys:', Object.keys(histData.employmentSampleReportData));
        setEmploymentSampleReportData(histData.employmentSampleReportData);
      }
      if (histData?.employmentSampleReportSentence) {
        console.log('  ✅ Restoring employmentSampleReportSentence');
        setEmploymentSampleReportSentence(histData.employmentSampleReportSentence);
      }
      
      console.log('✅ All data loaded successfully');
    }
  }, [currentPatient]);

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

  // Form handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const isLoading = patientLoading || assessmentLoading;
  const error = patientError || assessmentError;

  const handleEvaluationChange = (category, checked) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], other: checked }
    }));
  };

  const handleEvaluationFieldChange = (category, field, checked) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: checked }
    }));
  };

  const handleEvaluationTextChange = (category, text) => {
    setEvaluationData(prev => ({
      ...prev,
      [category]: { ...prev[category], otherText: text }
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

  const handleDiagnosisTextChange = (category, text) => {
    setDiagnosisData(prev => ({
      ...prev,
      [category]: { ...prev[category], otherText: text }
    }));
  };

  const addDiagnosisOption = (category) => {
    if (diagnosisData[category].otherText && diagnosisData[category].otherText.trim()) {
      const newOption = diagnosisData[category].otherText.trim();
      setDiagnosisData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [newOption]: true,
          other: false,
          otherText: ''
        }
      }));
    }
  };

  const removeDiagnosisOption = (category, option) => {
    setDiagnosisData(prev => {
      const newCategory = { ...prev[category] };
      delete newCategory[option];
      return {
        ...prev,
        [category]: newCategory
      };
    });
  };

  const toggleDiagnosisCategory = (category) => {
    setExpandedDiagnoses(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleHistoryChange = (field, checked) => {
    setHistoryData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleHistoryTextChange = (field, text) => {
    setHistoryData(prev => ({
      ...prev,
      [field]: text
    }));
  };

  // Generate dynamic sample report sentence based on selected concerns
  const generateSampleReportSentence = () => {
    const firstName = formData.firstName || 'Charlie';
    const sourceName = historyData.referralSourceName || 'Mr. Smith';
    const sourceRole = historyData.referralSourceRole || 'teacher';
    
    // Build concerns list based on historyData checkboxes
    const concerns = [];
    
    if (historyData.schoolRelatedConcerns) {
      concerns.push('school-related concerns');
    }
    if (historyData.speechConcerns) {
      concerns.push('speech concerns');
    }
    if (historyData.languageConcerns) {
      concerns.push('language concerns');
    }
    if (historyData.socialEmotionalConcerns) {
      concerns.push('social/emotional concerns');
    }
    if (historyData.cognitiveConcerns) {
      concerns.push('cognitive concerns');
    }
    if (historyData.physicalConcerns) {
      concerns.push('physical concerns');
    }
    if (historyData.vocationalRehabilitationLegal) {
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

  // Generate Language/Development sample report sentence
  const generateLanguageSampleReportSentence = () => {
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
    const birthComplications = languageSampleReportData.birthComplications || 'with no apparent complications';
    
    // Build milestone text
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
    const motherEducation = educationSampleReportData.motherEducation || 'graduate';
    const fatherEducation = educationSampleReportData.fatherEducation || 'high school graduate';
    
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
    const healthHistorySource = healthSampleReportData.healthHistorySource || 'his mother';
    const visionResult = healthSampleReportData.visionResult || 'that he has normal visual acuity';
    const hearingResult = healthSampleReportData.hearingResult || 'within normal limits with the assistance of a hearing aid';
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
    const employmentStatus = employmentSampleReportData.employmentStatus || 'employed';
    const currentJob = employmentSampleReportData.currentJob || 'software engineer';
    const jobDuration = employmentSampleReportData.jobDuration || '2 years';
    const employmentHistorySource = employmentSampleReportData.employmentHistorySource || 'self-report';
    
    return `${firstName} is currently ${employmentStatus} as a {${currentJob}} for {${jobDuration}}. Employment history was provided by {${employmentHistorySource}}.`;
  };

  // Save handler
  const handleSave = async () => {
    console.log('💾 SAVE EXAMINEE - Starting Save Process');
    console.log('📤 Current Form Data:', formData);
    console.log('📤 Current Evaluation Data:', evaluationData);
    console.log('📤 Current Diagnosis Data:', diagnosisData);
    console.log('📤 Current History Data:', historyData);
    
    setIsSaving(true);
    try {
      const apiData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        studentId: formData.examineeId,
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
          ...historyData,
          personalSampleReportSentence: personalSampleReportSentence,
          personalNotes: personalNotes,
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
      console.log('🌐 API Endpoint:', `/students/${examineeId}`);
      console.log('🔧 Method: PUT');

      const response = await api.request(`/students/${examineeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      console.log('📥 API Response:', response);

      if (response.success) {
        console.log('✅ Save Successful!');
        toast.success('Examinee updated successfully!');
        dispatch(fetchPatient(examineeId));
      } else {
        console.error('❌ Save Failed:', response.message);
        toast.error(response.message || 'Failed to update examinee');
      }
    } catch (error) {
      console.error('❌ Save Error:', error);
      console.error('❌ Error Stack:', error.stack);
      toast.error('An error occurred while updating the examinee');
    } finally {
      setIsSaving(false);
      console.log('💾 Save Process Complete');
    }
  };

  // Tab definitions
  const tabs = [
    { id: 'demographics', label: 'Demographics' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'history', label: 'History' }
  ];

  // Input styling
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

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      
      if (isNaN(birthDate.getTime())) {
        return 'Invalid date';
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    } catch (error) {
      return 'Not available';
    }
  };

  // Transform patient data to match component expectations
  const transformPatientData = (patient) => {
    if (!patient) return null;
    
    // Parse JSON fields if they are strings
    let evaluationData = patient.evaluation_data;
    let diagnosisData = patient.diagnosis_data;
    let historyData = patient.history_data;
    
    if (typeof evaluationData === 'string') {
      try { evaluationData = JSON.parse(evaluationData); } catch (e) { evaluationData = null; }
    }
    if (typeof diagnosisData === 'string') {
      try { diagnosisData = JSON.parse(diagnosisData); } catch (e) { diagnosisData = null; }
    }
    if (typeof historyData === 'string') {
      try { historyData = JSON.parse(historyData); } catch (e) { historyData = null; }
    }
    
    return {
      id: patient.id,
      systemId: `SYS${patient.id.toString().padStart(6, '0')}`,
      name: `${patient.first_name || 'Unknown'} ${patient.last_name || 'Unknown'}`,
      birthDate: patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) : 'Not provided',
      age: patient.date_of_birth ? calculateAge(patient.date_of_birth) : 'Not available',
      examineeId: patient.student_id || `STU${patient.id}`,
      gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Not specified',
      schoolName: patient.school_name || '',
      grade: patient.grade || '',
      customField1: patient.custom_field_1 || patient.customField1 || '',
      customField2: patient.custom_field_2 || patient.customField2 || '',
      customField3: patient.custom_field_3 || patient.customField3 || '',
      customField4: patient.custom_field_4 || patient.customField4 || '',
      groups: patient.groups || '',
      legacyId: patient.legacy_id || '',
      email: patient.email || 'Not provided',
      phone: patient.phone || 'Not provided',
      centre: patient.centre_name || 'Centrix Centre',
      address: patient.address || 'Not provided',
      city: patient.city || '',
      state: patient.state || '',
      zipCode: patient.zip_code || '',
      emergencyContactName: patient.emergency_contact_name || '',
      emergencyContactPhone: patient.emergency_contact_phone || '',
      emergencyContactRelation: patient.emergency_contact_relation || '',
      learningNeeds: patient.learning_needs || '',
      supportRequirements: patient.support_requirements || '',
      evaluationData: evaluationData,
      diagnosisData: diagnosisData,
      historyData: historyData,
      comment: patient.comment || ''
    };
  };

  const examineeData = transformPatientData(currentPatient);

  const handleAssignNewAssessment = () => {
    setIsAssignModalOpen(true);
  };

  const handleAssessmentAssigned = () => {
    setIsAssignModalOpen(false);
    // Refresh assessments after assignment
    dispatch(fetchAssessments(examineeId));
  };

  const handleDeleteAssessments = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to delete');
      return;
    }
    
    // Delete each selected assessment
    Promise.all(selectedAssessments.map(id => dispatch(deleteAssessment(id)).unwrap()))
      .then(() => {
        toast.success(`${selectedAssessments.length} assessment(s) deleted successfully!`);
        dispatch(clearSelection());
        // Refresh assessments after deletion
        dispatch(fetchAssessments(examineeId));
      })
      .catch(() => {
        toast.error('Failed to delete assessments');
      });
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessmentToEdit(assessment);
    setIsEditAssessmentModalOpen(true);
  };

  const handleAssessmentUpdated = () => {
    setIsEditAssessmentModalOpen(false);
    setSelectedAssessmentToEdit(null);
    // Refresh assessments after update
    dispatch(fetchAssessments(examineeId));
    toast.success('Assessment updated successfully!');
  };

  const handleGenerateReport = () => {
    if (selectedAssessments.length === 0) {
      toast.error('Please select assessments to generate report');
      return;
    }
    
    setIsReportModalOpen(true);
  };

  const handleAssessmentSelection = (assessmentId) => {
    dispatch(toggleAssessmentSelection(assessmentId));
  };

  const handleSelectAllAssessments = () => {
    if (selectedAssessments.length === assessments.length) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllAssessments());
    }
  };

  // Helper function to render evaluation data
  const renderEvaluationData = () => {
    if (!examineeData?.evaluationData || Object.keys(examineeData.evaluationData).length === 0) {
      return <p className="text-gray-500 text-sm italic">No evaluation data recorded</p>;
    }

    const categories = {
      academicConcerns: 'Academic Concerns',
      cognitiveEvaluation: 'Cognitive Evaluation',
      behaviourConcerns: 'Behaviour Concerns',
      mentalHealth: 'Mental Health',
      developmentalDelay: 'Developmental Delay',
      languageConcerns: 'Language Concerns',
      speechConcerns: 'Speech Concerns',
      physicalConcerns: 'Physical Concerns',
      substanceAbuse: 'Substance Abuse',
      employment: 'Employment'
    };

    const activeEvaluations = Object.entries(examineeData.evaluationData).filter(([key, value]) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'object' && value !== null) {
        return value.other === true || Object.values(value).some(v => v === true);
      }
      return false;
    });

    if (activeEvaluations.length === 0) {
      return <p className="text-gray-500 text-sm italic">No evaluation concerns selected</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeEvaluations.map(([key, value]) => {
          const label = categories[key] || key;
          let displayValue = 'Selected';
          let hasOtherText = false;
          let otherText = '';
          
          if (typeof value === 'object' && value !== null) {
            if (value.other && value.otherText) {
              hasOtherText = true;
              otherText = value.otherText;
            }
            const subSelected = Object.entries(value)
              .filter(([k, v]) => k !== 'other' && k !== 'otherText' && v === true)
              .map(([k]) => k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
            
            if (subSelected.length > 0) {
              displayValue = subSelected.join(', ');
            }
          }
          
          return (
            <div key={key} className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 uppercase">{label}</p>
              <p className="text-sm text-gray-800 mt-1">{displayValue}</p>
              {hasOtherText && (
                <p className="text-sm text-gray-600 mt-1 italic">Other: {otherText}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to render diagnosis data
  const renderDiagnosisData = () => {
    if (!examineeData?.diagnosisData || Object.keys(examineeData.diagnosisData).length === 0) {
      return <p className="text-gray-500 text-sm italic">No diagnoses recorded</p>;
    }
    
    const diagnoses = {
      autismSpectrum: 'Autism Spectrum Disorder',
      behaviourEmotional: 'Behaviour/Emotional Disorder',
      intellectualDisability: 'Intellectual Disability',
      giftedTalented: 'Gifted and Talented',
      languageDelay: 'Language Delay/Disorder',
      learningDisability: 'Learning Disability',
      moodRelated: 'Mood Related Disorder',
      motorDelay: 'Motor Delay/Disorder',
      personalityDisorders: 'Personality Disorders',
      schizophrenia: 'Schizophrenia and Other Psychotic Disorders',
      speech: 'Speech Disorder',
      substanceAbuse: 'Substance Abuse',
      traumaticBrainInjury: 'Traumatic Brain Injury',
      other: 'Other'
    };

    const selectedDiagnoses = Object.entries(examineeData.diagnosisData)
      .filter(([key, value]) => value === true || (typeof value === 'object' && value.selected === true))
      .map(([key]) => diagnoses[key] || key);

    if (selectedDiagnoses.length === 0) {
      return <p className="text-gray-500 text-sm italic">No diagnoses recorded</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {selectedDiagnoses.map((diagnosis, index) => (
          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {diagnosis}
          </span>
        ))}
      </div>
    );
  };

  // Helper function to render history data
  const renderHistoryData = () => {
    if (!examineeData?.historyData) return null;
    
    const hasData = Object.entries(examineeData.historyData).some(([key, value]) => 
      value === true || (typeof value === 'string' && value.length > 0)
    );

    if (!hasData) return <p className="text-gray-500 text-sm italic">No history data recorded</p>;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(examineeData.historyData).map(([key, value]) => {
          if (!value || (typeof value === 'boolean' && !value)) return null;
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return (
            <div key={key} className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-700 uppercase">{label}</p>
              <p className="text-sm text-gray-700 mt-1">{typeof value === 'boolean' ? 'Yes' : value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'report generated':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading examinee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="text-red-800 text-center">
            <p className="text-lg font-medium mb-2">Error Loading Data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <div className="text-yellow-800 text-center">
            <p className="text-lg font-medium mb-2">No Data Available</p>
            <p className="text-sm">Examinee information not found.</p>
            <button 
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-gray-200" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Edit Examinee: {formData.firstName} {formData.lastName}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this examinee?')) {
                      api.deletePatient(examineeId)
                        .then(() => {
                          toast.success('Examinee deleted successfully!');
                          onBack && onBack();
                        })
                        .catch((error) => {
                          toast.error('Failed to delete examinee: ' + error.message);
                        });
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete</span>
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
              {activeTab === 'demographics' && (
                <div className="space-y-6">
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
                        <div>
                          <label className={labelClass}>City</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className={inputClass('city')}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className={labelClass}>State</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            className={inputClass('state')}
                            placeholder="State"
                          />
                        </div>
                        <div>
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

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
                          Emergency Contact
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className={labelClass}>Contact Name</label>
                            <input
                              type="text"
                              value={formData.emergencyContactName}
                              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                              className={inputClass('emergencyContactName')}
                              placeholder="Emergency contact name"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={labelClass}>Phone</label>
                              <input
                                type="tel"
                                value={formData.emergencyContactPhone}
                                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                                className={inputClass('emergencyContactPhone')}
                                placeholder="Contact phone"
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
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
                          Custom Fields
                        </h4>
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
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
                          Additional Information
                        </h4>
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
                            <div className="relative">
                              <input
                                type="date"
                                value={formData.registrationDate}
                                onChange={(e) => handleChange('registrationDate', e.target.value)}
                                className={`${inputClass('registrationDate')} pr-10`}
                              />
                              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
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
                        <label className={labelClass}>Account</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.account}
                            readOnly
                            className={`${inputClass('account')} bg-gray-50 pl-10 font-medium text-gray-700`}
                          />
                          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
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
                          <span className="text-sm font-medium text-blue-900">Assessment</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.requiresTherapy}
                            onChange={(e) => handleChange('requiresTherapy', e.target.checked)}
                            className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-emerald-900">Therapy</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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
                                checked={evaluationData.academicConcerns.general}
                                onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.academicConcerns)
                              .filter(key => !['maths', 'general', 'writing', 'reading', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.academicConcerns[key]}
                                      onChange={(e) => handleEvaluationFieldChange('academicConcerns', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newAcademicConcerns = { ...prev.academicConcerns };
                                        delete newAcademicConcerns[key];
                                        return {
                                          ...prev,
                                          academicConcerns: newAcademicConcerns
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.academicConcerns.otherText}
                                  onChange={(e) => handleEvaluationTextChange('academicConcerns', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.academicConcerns.otherText && evaluationData.academicConcerns.otherText.trim()) {
                                      const newOption = evaluationData.academicConcerns.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        academicConcerns: {
                                          ...prev.academicConcerns,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.cognitiveEvaluation.general}
                                onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.cognitiveEvaluation)
                              .filter(key => !['intellectualDisability', 'general', 'giftedTalented', 'traumaticBrainInjury', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.cognitiveEvaluation[key]}
                                      onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newCognitiveEvaluation = { ...prev.cognitiveEvaluation };
                                        delete newCognitiveEvaluation[key];
                                        return {
                                          ...prev,
                                          cognitiveEvaluation: newCognitiveEvaluation
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.cognitiveEvaluation.otherText}
                                  onChange={(e) => handleEvaluationTextChange('cognitiveEvaluation', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.cognitiveEvaluation.otherText && evaluationData.cognitiveEvaluation.otherText.trim()) {
                                      const newOption = evaluationData.cognitiveEvaluation.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        cognitiveEvaluation: {
                                          ...prev.cognitiveEvaluation,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.behaviourConcerns.general}
                                onChange={(e) => handleEvaluationFieldChange('behaviourConcerns', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.behaviourConcerns)
                              .filter(key => !['aggression', 'general', 'attentionHyperactivity', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.behaviourConcerns[key]}
                                      onChange={(e) => handleEvaluationFieldChange('behaviourConcerns', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newBehaviourConcerns = { ...prev.behaviourConcerns };
                                        delete newBehaviourConcerns[key];
                                        return {
                                          ...prev,
                                          behaviourConcerns: newBehaviourConcerns
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.behaviourConcerns.otherText}
                                  onChange={(e) => handleEvaluationTextChange('behaviourConcerns', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.behaviourConcerns.otherText && evaluationData.behaviourConcerns.otherText.trim()) {
                                      const newOption = evaluationData.behaviourConcerns.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        behaviourConcerns: {
                                          ...prev.behaviourConcerns,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.mentalHealth.general}
                                onChange={(e) => handleEvaluationFieldChange('mentalHealth', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.mentalHealth)
                              .filter(key => !['anxiety', 'general', 'depression', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.mentalHealth[key]}
                                      onChange={(e) => handleEvaluationFieldChange('mentalHealth', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newMentalHealth = { ...prev.mentalHealth };
                                        delete newMentalHealth[key];
                                        return {
                                          ...prev,
                                          mentalHealth: newMentalHealth
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.mentalHealth.otherText}
                                  onChange={(e) => handleEvaluationTextChange('mentalHealth', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.mentalHealth.otherText && evaluationData.mentalHealth.otherText.trim()) {
                                      const newOption = evaluationData.mentalHealth.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        mentalHealth: {
                                          ...prev.mentalHealth,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.developmentalDelay.general}
                                onChange={(e) => handleEvaluationFieldChange('developmentalDelay', 'general', e.target.checked)}
                              />
                              General or Not Specific
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300"
                                checked={evaluationData.developmentalDelay.physicalGrowth}
                                onChange={(e) => handleEvaluationFieldChange('developmentalDelay', 'physicalGrowth', e.target.checked)}
                              />
                              Physical Growth
                            </label>
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.developmentalDelay)
                              .filter(key => !['motor', 'general', 'physicalGrowth', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.developmentalDelay[key]}
                                      onChange={(e) => handleEvaluationFieldChange('developmentalDelay', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newDevelopmentalDelay = { ...prev.developmentalDelay };
                                        delete newDevelopmentalDelay[key];
                                        return {
                                          ...prev,
                                          developmentalDelay: newDevelopmentalDelay
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.developmentalDelay.otherText}
                                  onChange={(e) => handleEvaluationTextChange('developmentalDelay', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.developmentalDelay.otherText && evaluationData.developmentalDelay.otherText.trim()) {
                                      const newOption = evaluationData.developmentalDelay.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        developmentalDelay: {
                                          ...prev.developmentalDelay,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.languageConcerns.general}
                                onChange={(e) => handleEvaluationFieldChange('languageConcerns', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.languageConcerns)
                              .filter(key => !['receptive', 'general', 'expressive', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.languageConcerns[key]}
                                      onChange={(e) => handleEvaluationFieldChange('languageConcerns', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newLanguageConcerns = { ...prev.languageConcerns };
                                        delete newLanguageConcerns[key];
                                        return {
                                          ...prev,
                                          languageConcerns: newLanguageConcerns
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.languageConcerns.otherText}
                                  onChange={(e) => handleEvaluationTextChange('languageConcerns', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.languageConcerns.otherText && evaluationData.languageConcerns.otherText.trim()) {
                                      const newOption = evaluationData.languageConcerns.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        languageConcerns: {
                                          ...prev.languageConcerns,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
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
                                checked={evaluationData.speechConcerns.general}
                                onChange={(e) => handleEvaluationFieldChange('speechConcerns', 'general', e.target.checked)}
                              />
                              General or Not Specific
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
                            {/* Dynamic checkboxes */}
                            {Object.keys(evaluationData.speechConcerns)
                              .filter(key => !['articulation', 'general', 'fluency', 'other', 'otherText'].includes(key))
                              .map(key => (
                                <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      className="rounded border-gray-300"
                                      checked={evaluationData.speechConcerns[key]}
                                      onChange={(e) => handleEvaluationFieldChange('speechConcerns', key, e.target.checked)}
                                    />
                                    {key}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEvaluationData(prev => {
                                        const newSpeechConcerns = { ...prev.speechConcerns };
                                        delete newSpeechConcerns[key];
                                        return {
                                          ...prev,
                                          speechConcerns: newSpeechConcerns
                                        };
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                    title="Remove this option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
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
                              <div className="ml-6 w-full space-y-2">
                                <input
                                  type="text"
                                  value={evaluationData.speechConcerns.otherText}
                                  onChange={(e) => handleEvaluationTextChange('speechConcerns', e.target.value)}
                                  placeholder="Please specify..."
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (evaluationData.speechConcerns.otherText && evaluationData.speechConcerns.otherText.trim()) {
                                      const newOption = evaluationData.speechConcerns.otherText.trim();
                                      setEvaluationData(prev => ({
                                        ...prev,
                                        speechConcerns: {
                                          ...prev.speechConcerns,
                                          [newOption]: true,
                                          other: false,
                                          otherText: ''
                                        }
                                      }));
                                    }
                                  }}
                                  className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  + Add as new checkbox option
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {evaluationSubTab === 'diagnoses' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Please select a diagnosis for this examinee. You may select more than one diagnosis.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.autismSpectrum)
                                .filter(key => !['aspergers', 'autistic', 'childhoodDisintegrative', 'pervasiveDevelopmental', 'retts', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.autismSpectrum[key]}
                                        onChange={() => toggleDiagnosis('autismSpectrum', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('autismSpectrum', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.behaviourEmotional)
                                .filter(key => !['adhd', 'conduct', 'disruptive', 'emotional', 'intermittentExplosive', 'kleptomania', 'oppositionalDefiant', 'pathologicalGambling', 'pyromania', 'trichotillomania', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.behaviourEmotional[key]}
                                        onChange={() => toggleDiagnosis('behaviourEmotional', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('behaviourEmotional', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.intellectualDisability)
                                .filter(key => !['borderline', 'cognitiveDelay', 'mild', 'moderate', 'profound', 'severe', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.intellectualDisability[key]}
                                        onChange={() => toggleDiagnosis('intellectualDisability', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('intellectualDisability', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.giftedTalented)
                                .filter(key => !['gifted', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.giftedTalented[key]}
                                        onChange={() => toggleDiagnosis('giftedTalented', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('giftedTalented', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.languageDelay)
                                .filter(key => !['expressive', 'delay', 'mixed', 'phonological', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.languageDelay[key]}
                                        onChange={() => toggleDiagnosis('languageDelay', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('languageDelay', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.learningDisability)
                                .filter(key => !['reading', 'mathematics', 'disorder', 'writing', 'nonverbal', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.learningDisability[key]}
                                        onChange={() => toggleDiagnosis('learningDisability', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('learningDisability', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.moodRelated)
                                .filter(key => !['acuteStress', 'agoraphobia', 'anorexia', 'bipolar', 'bulimia', 'conversion', 'cyclothymic', 'depressive', 'dysthymic', 'generalizedAnxiety', 'majorDepressive', 'ocd', 'pain', 'panic', 'ptsd', 'separationAnxiety', 'socialPhobia', 'somatization', 'specificPhobia', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.moodRelated[key]}
                                        onChange={() => toggleDiagnosis('moodRelated', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('moodRelated', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.motorDelay)
                                .filter(key => !['developmentalCoordination', 'dyspraxia', 'motorDelay', 'paraplegia', 'quadriplegia', 'stereotypic', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.motorDelay[key]}
                                        onChange={() => toggleDiagnosis('motorDelay', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('motorDelay', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.personalityDisorders)
                                .filter(key => !['antisocial', 'avoidant', 'borderline', 'dependent', 'histrionic', 'narcissistic', 'ocd', 'ocpd', 'paranoid', 'schizoid', 'schizotypal', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.personalityDisorders[key]}
                                        onChange={() => toggleDiagnosis('personalityDisorders', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('personalityDisorders', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.schizophrenia)
                                .filter(key => !['briefPsychotic', 'delusional', 'schizoaffective', 'catatonic', 'disorganized', 'paranoid', 'residual', 'undifferentiated', 'schizophreniform', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.schizophrenia[key]}
                                        onChange={() => toggleDiagnosis('schizophrenia', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('schizophrenia', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                            <span className="font-medium text-sm">Speech</span>
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.speech)
                                .filter(key => !['aphasia', 'apraxia', 'articulation', 'brocas', 'centralAuditory', 'dysarthria', 'fluency', 'receptive', 'voice', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.speech[key]}
                                        onChange={() => toggleDiagnosis('speech', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('speech', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.substanceAbuse)
                                .filter(key => !['alcoholAbuse', 'alcoholDependence', 'polysubstanceAbuse', 'polysubstanceDependence', 'substanceAbuse', 'substanceDependence', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.substanceAbuse[key]}
                                        onChange={() => toggleDiagnosis('substanceAbuse', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('substanceAbuse', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.traumaticBrainInjury)
                                .filter(key => !['tbi', 'mild', 'moderate', 'severe', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.traumaticBrainInjury[key]}
                                        onChange={() => toggleDiagnosis('traumaticBrainInjury', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('traumaticBrainInjury', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
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
                              {/* Dynamic checkboxes */}
                              {Object.keys(diagnosisData.other)
                                .filter(key => !['adjustment', 'cognitive', 'creutzfeldtJakob', 'alzheimers', 'depersonalization', 'dissociative', 'epilepsy', 'factitious', 'genderIdentity', 'huntingtons', 'leftStroke', 'leftEpilepsy', 'mildCognitive', 'parkinsons', 'picks', 'insomnia', 'rightStroke', 'rightEpilepsy', 'seizure', 'stroke', 'tic', 'tourettes', 'vascularDementia', 'other', 'otherText'].includes(key))
                                .map(key => (
                                  <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300"
                                        checked={diagnosisData.other[key]}
                                        onChange={() => toggleDiagnosis('other', key)}
                                      />
                                      {key}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeDiagnosisOption('other', key)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
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
                    <p className="text-sm text-blue-600 italic">
                      Entry is optional. Values entered here only appear on specific product reports. Learn More.
                    </p>

                    {/* History Sub Tabs */}
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
                      <button 
                        onClick={() => setHistorySubTab('referral')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'referral'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Referral
                      </button>
                      <button 
                        onClick={() => setHistorySubTab('personal')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'personal'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Personal
                      </button>
                      <button 
                        onClick={() => setHistorySubTab('languageDevelopment')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'languageDevelopment'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Language/Development
                      </button>
                      <button 
                        onClick={() => setHistorySubTab('education')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'education'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Education
                      </button>
                      <button 
                        onClick={() => setHistorySubTab('health')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'health'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Health
                      </button>
                      <button 
                        onClick={() => setHistorySubTab('employment')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          historySubTab === 'employment'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Employment
                      </button>
                      <button 
                        onClick={() => window.location.href = '/conners'}
                        className="px-4 py-2 rounded-md text-sm font-medium transition-all bg-green-500 text-white hover:bg-green-600 shadow-sm ml-4"
                      >
                        Conners
                      </button>
                    </div>

                    {historySubTab === 'referral' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowSampleReport(!showSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <p className="text-sm text-gray-600 mb-3 italic bg-gray-50 p-3 rounded border">
                                {generateSampleReportSentence()}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence is automatically generated from the Referral Source and Referral Reason(s) fields below.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Referral Source */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-blue-700">Referral Source</h4>
                            
                            <div>
                              <label className={labelClass}>Name of the Referral Source:</label>
                              <input
                                type="text"
                                value={historyData.referralSourceName}
                                onChange={(e) => handleHistoryTextChange('referralSourceName', e.target.value)}
                                className={inputClass('referralSource')}
                                placeholder="Enter referral source name"
                              />
                            </div>

                            <div>
                              <label className={labelClass}>Role of the Referral Source:</label>
                              <div className="relative">
                                <select 
                                  value={historyData.referralSourceRole}
                                  onChange={(e) => handleHistoryTextChange('referralSourceRole', e.target.value)}
                                  className={`${inputClass('referralRole')} appearance-none`}
                                >
                                  <option value="">Please Select...</option>
                                  <option value="Parent">Parent</option>
                                  <option value="Teacher">Teacher</option>
                                  <option value="Doctor">Doctor</option>
                                  <option value="Therapist">Therapist</option>
                                  <option value="Other">Other</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                              </div>
                            </div>
                          </div>

                          {/* Referral Reason(s) */}
                          <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-blue-700">Referral Reason(s)</h4>
                            
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.schoolRelatedConcerns}
                                  onChange={(e) => handleHistoryChange('schoolRelatedConcerns', e.target.checked)}
                                />
                                School Related Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.speechConcerns}
                                  onChange={(e) => handleHistoryChange('speechConcerns', e.target.checked)}
                                />
                                Speech Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.languageConcerns}
                                  onChange={(e) => handleHistoryChange('languageConcerns', e.target.checked)}
                                />
                                Language Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.socialEmotionalConcerns}
                                  onChange={(e) => handleHistoryChange('socialEmotionalConcerns', e.target.checked)}
                                />
                                Social/Emotional Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.cognitiveConcerns}
                                  onChange={(e) => handleHistoryChange('cognitiveConcerns', e.target.checked)}
                                />
                                Cognitive Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.physicalConcerns}
                                  onChange={(e) => handleHistoryChange('physicalConcerns', e.target.checked)}
                                />
                                Physical Concerns
                              </label>
                              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-gray-300"
                                  checked={historyData.vocationalRehabilitationLegal}
                                  onChange={(e) => handleHistoryChange('vocationalRehabilitationLegal', e.target.checked)}
                                />
                                Vocational/Rehabilitation/Legal Issues
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {historySubTab === 'personal' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowPersonalSampleReport(!showPersonalSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showPersonalSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showPersonalSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={personalSampleReportSentence}
                                onChange={(e) => setPersonalSampleReportSentence(e.target.value)}
                                placeholder="Enter sample report sentence..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence can be edited and will appear in reports.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Personal Notes */}
                        <div className="border rounded-lg overflow-hidden">
                          <button 
                            onClick={() => setShowPersonalNotes(!showPersonalNotes)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showPersonalNotes ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Personal Notes</span>
                          </button>
                          
                          {showPersonalNotes && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={personalNotes}
                                onChange={(e) => setPersonalNotes(e.target.value)}
                                placeholder="Add personal notes, observations, or additional information..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px]"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                Add any additional notes or observations here.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {historySubTab === 'languageDevelopment' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowLanguageSampleReport(!showLanguageSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showLanguageSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showLanguageSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={languageSampleReportSentence || generateLanguageSampleReportSentence()}
                                onChange={(e) => setLanguageSampleReportSentence(e.target.value)}
                                placeholder="Sample report sentence will be generated here..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence is automatically generated from the Language and Development fields below. You can edit it as needed.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Language and Development Content */}
                        <h3 className="text-sm font-semibold text-blue-800">Language and Development</h3>
                        <p className="text-xs text-gray-600 mb-4">Language and developmental history can be added here.</p>
                        
                        {/* Language Section */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Language</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className={labelClass}>Primary Language:</label>
                                    <input
                                      type="text"
                                      value={languageSampleReportData.primaryLanguage}
                                      onChange={(e) => handleLanguageSampleReportTextChange('primaryLanguage', e.target.value)}
                                      placeholder="e.g., English"
                                      className={inputClass('primaryLanguage')}
                                    />
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className={labelClass}>Exposed to English:</label>
                                  <select 
                                    value={languageSampleReportData.exposedToEnglish}
                                    onChange={(e) => handleLanguageSampleReportTextChange('exposedToEnglish', e.target.value)}
                                    className={`${inputClass('exposedToEnglish')} appearance-none`}
                                  >
                                    <option value="not_specified">Not Specified</option>
                                    <option value="since_birth">Since Birth</option>
                                    <option value="one_to_three">For One to Three Years</option>
                                    <option value="four_to_five">For Four to Five Years</option>
                                    <option value="longer_than_five">For Longer Than Five Years</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>

                                <div className="mb-4">
                                  <label className={labelClass}>Speaking English:</label>
                                  <select 
                                    value={languageSampleReportData.speakingEnglish}
                                    onChange={(e) => handleLanguageSampleReportTextChange('speakingEnglish', e.target.value)}
                                    className={`${inputClass('speakingEnglish')} appearance-none`}
                                  >
                                    <option value="not_specified">Not Specified</option>
                                    <option value="since_first_talking">Since First Talking</option>
                                    <option value="one_to_three">For One to Three Years</option>
                                    <option value="four_to_five">For Four to Five Years</option>
                                    <option value="longer_than_five">For Longer Than Five Years</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>

                                <div className="mb-4">
                                  <label className={labelClass}>Examiner Rating of English Fluency:</label>
                                  <select 
                                    value={languageSampleReportData.fluencyRating}
                                    onChange={(e) => handleLanguageSampleReportTextChange('fluencyRating', e.target.value)}
                                    className={`${inputClass('fluencyRating')} appearance-none`}
                                  >
                                    <option value="not_specified">Not Specified</option>
                                    <option value="adequate">Adequate</option>
                                    <option value="somewhat_adequate">Somewhat Adequate</option>
                                    <option value="poor">Poor</option>
                                  </select>
                                </div>
                              </div>

                              {/* Development Section */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Development</h4>
                                
                                <div className="mb-4">
                                  <label className={labelClass}>Birth Information:</label>
                                  <select 
                                    value={languageSampleReportData.birthComplications}
                                    onChange={(e) => handleLanguageSampleReportTextChange('birthComplications', e.target.value)}
                                    className={`${inputClass('birthComplications')} appearance-none`}
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
                                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Developmental Milestones:</label>
                                  
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
                                  <label className={labelClass}>Additional Information:</label>
                                  <textarea
                                    value={languageSampleReportData.additionalInfo}
                                    onChange={(e) => handleLanguageSampleReportTextChange('additionalInfo', e.target.value)}
                                    placeholder="Enter any additional details..."
                                    rows="2"
                                    className={inputClass('languageAdditionalInfo')}
                                  />
                                </div>
                              </div>
                        
                        <h4 className="text-sm font-semibold text-blue-700 mt-6">Additional Information</h4>
                        <p className="text-sm text-gray-500">Language and developmental history can be added here.</p>
                      </div>
                    )}

                    {historySubTab === 'education' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowEducationSampleReport(!showEducationSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showEducationSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showEducationSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={educationSampleReportSentence || generateEducationSampleReportSentence()}
                                onChange={(e) => setEducationSampleReportSentence(e.target.value)}
                                placeholder="Sample report sentence will be generated here..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence is automatically generated from the Education fields below. You can edit it as needed.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Education Content */}
                        <h3 className="text-sm font-semibold text-blue-800">Education</h3>
                        
                        {/* Education Level Section */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-blue-700 mb-3">Highest Level of Education</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <label className={labelClass}>Current Year:</label>
                                    <input
                                      type="text"
                                      value={educationSampleReportData.currentYear}
                                      onChange={(e) => handleEducationSampleReportTextChange('currentYear', e.target.value)}
                                      placeholder="e.g., Year 3"
                                      className={inputClass('currentYear')}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>School Name:</label>
                                    <input
                                      type="text"
                                      value={educationSampleReportData.schoolName}
                                      onChange={(e) => handleEducationSampleReportTextChange('schoolName', e.target.value)}
                                      placeholder="e.g., Oak Tree Primary School"
                                      className={inputClass('schoolName')}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className={labelClass}>Mother's Education:</label>
                                    <select 
                                      value={educationSampleReportData.motherEducation}
                                      onChange={(e) => handleEducationSampleReportTextChange('motherEducation', e.target.value)}
                                      className={`${inputClass('motherEducation')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="some high school">Some High School</option>
                                      <option value="high school graduate">High School Graduate</option>
                                      <option value="some college">Some College</option>
                                      <option value="college graduate">College Graduate</option>
                                      <option value="some graduate school">Some Graduate School</option>
                                      <option value="graduate degree">Graduate Degree</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className={labelClass}>Father's Education:</label>
                                    <select 
                                      value={educationSampleReportData.fatherEducation}
                                      onChange={(e) => handleEducationSampleReportTextChange('fatherEducation', e.target.value)}
                                      className={`${inputClass('fatherEducation')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="some high school">Some High School</option>
                                      <option value="high school graduate">High School Graduate</option>
                                      <option value="some college">Some College</option>
                                      <option value="college graduate">College Graduate</option>
                                      <option value="some graduate school">Some Graduate School</option>
                                      <option value="graduate degree">Graduate Degree</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Strengths and Weaknesses Section */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Academic Performance - Strengths and Weaknesses</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="text-xs text-gray-600 mb-2 block">Personal Strengths (select up to three):</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                        <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            checked={educationSampleReportData.personalStrengths.includes(item)}
                                            onChange={() => handleEducationArrayChange('personalStrengths', item)}
                                            className="rounded border-gray-300"
                                          />
                                          <span className="capitalize">{item}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-2 block">Personal Weaknesses (select up to three):</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                        <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            checked={educationSampleReportData.personalWeaknesses.includes(item)}
                                            onChange={() => handleEducationArrayChange('personalWeaknesses', item)}
                                            className="rounded border-gray-300"
                                          />
                                          <span className="capitalize">{item}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="text-xs text-gray-600 mb-2 block">Strengths Compared to Peers (select up to three):</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                        <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            checked={educationSampleReportData.peerStrengths.includes(item)}
                                            onChange={() => handleEducationArrayChange('peerStrengths', item)}
                                            className="rounded border-gray-300"
                                          />
                                          <span className="capitalize">{item}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-600 mb-2 block">Weaknesses Compared to Peers (select up to three):</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music', 'other'].map((item) => (
                                        <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            checked={educationSampleReportData.peerWeaknesses.includes(item)}
                                            onChange={() => handleEducationArrayChange('peerWeaknesses', item)}
                                            className="rounded border-gray-300"
                                          />
                                          <span className="capitalize">{item}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Diagnosed Specific Learning Disorders/Disabilities:</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['reading', 'writing', 'mathematics', 'other', 'other2', 'other3'].map((item) => (
                                      <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={educationSampleReportData.learningDisabilities.includes(item)}
                                          onChange={() => handleEducationArrayChange('learningDisabilities', item)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{item}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4">
                                  <label className={labelClass}>Additional Information:</label>
                                  <textarea
                                    value={educationSampleReportData.additionalInfo}
                                    onChange={(e) => handleEducationSampleReportTextChange('additionalInfo', e.target.value)}
                                    placeholder="Enter any additional details..."
                                    rows="2"
                                    className={inputClass('educationAdditionalInfo')}
                                  />
                                </div>
                              </div>
                        
                        <h4 className="text-sm font-semibold text-blue-700 mt-6">Additional Information</h4>
                        <p className="text-sm text-gray-500">Educational history can be added here.</p>
                      </div>
                    )}

                    {historySubTab === 'health' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowHealthSampleReport(!showHealthSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showHealthSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showHealthSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={healthSampleReportSentence || generateHealthSampleReportSentence()}
                                onChange={(e) => setHealthSampleReportSentence(e.target.value)}
                                placeholder="Sample report sentence will be generated here..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence is automatically generated from the Health fields below. You can edit it as needed.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Health Content */}
                        <h3 className="text-sm font-semibold text-blue-800">Health</h3>
                        
                        {/* Health History Source */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-blue-700 mb-3">Health History According to:</h4>
                          <div>
                            <label className={labelClass}>Source:</label>
                            <select 
                              value={healthSampleReportData.healthHistorySource}
                                    onChange={(e) => handleHealthSampleReportTextChange('healthHistorySource', e.target.value)}
                                    className={`${inputClass('healthHistorySource')} appearance-none`}
                                  >
                                    <option value="">Please Select...</option>
                                    <option value="his mother">Mother</option>
                                    <option value="his father">Father</option>
                                    <option value="his guardian">Guardian</option>
                                    <option value="self">Self</option>
                                    <option value="records">Medical Records</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>

                              {/* Vision and Hearing */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Vision and Hearing Conditions</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className={labelClass}>Date of Vision Screening:</label>
                                    <input
                                      type="text"
                                      value={healthSampleReportData.visionDate}
                                      onChange={(e) => handleHealthSampleReportTextChange('visionDate', e.target.value)}
                                      placeholder="e.g., 01/01/2024"
                                      className={inputClass('visionDate')}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Results of Vision Screening:</label>
                                    <select 
                                      value={healthSampleReportData.visionResult}
                                      onChange={(e) => handleHealthSampleReportTextChange('visionResult', e.target.value)}
                                      className={`${inputClass('visionResult')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="that he has normal visual acuity">Normal visual acuity</option>
                                      <option value="normal visual acuity with the aid of corrective lenses">Normal visual acuity with corrective lenses</option>
                                      <option value="a need for follow-up vision screening">Need for follow-up vision screening</option>
                                      <option value="a need for a complete vision examination">Need for complete vision examination</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className={labelClass}>Date of Hearing Screening:</label>
                                    <input
                                      type="text"
                                      value={healthSampleReportData.hearingDate}
                                      onChange={(e) => handleHealthSampleReportTextChange('hearingDate', e.target.value)}
                                      placeholder="e.g., 01/01/2024"
                                      className={inputClass('hearingDate')}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Results of Hearing Screening:</label>
                                    <select 
                                      value={healthSampleReportData.hearingResult}
                                      onChange={(e) => handleHealthSampleReportTextChange('hearingResult', e.target.value)}
                                      className={`${inputClass('hearingResult')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="within normal limits">Within normal limits</option>
                                      <option value="within normal limits with the assistance of a hearing aid">Within normal limits when aided</option>
                                      <option value="needs a referral to assess the functioning of the inner ear">Needs referral for inner ear assessment</option>
                                      <option value="a need for a follow-up hearing screening">Need for follow-up hearing screening</option>
                                      <option value="further assessment needed; refer to audiologist">Further assessment needed</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Sensory and Motor */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Sensory or Motor Conditions</h4>
                                
                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Sensory Conditions:</label>
                                  <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="sensoryDysfunction"
                                        value="no_history"
                                        checked={healthSampleReportData.sensoryDysfunction === 'no_history'}
                                        onChange={(e) => handleHealthSampleReportTextChange('sensoryDysfunction', e.target.value)}
                                        className="rounded border-gray-300"
                                      />
                                      No history of sensory dysfunction
                                    </label>
                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="sensoryDysfunction"
                                        value="history"
                                        checked={healthSampleReportData.sensoryDysfunction === 'history'}
                                        onChange={(e) => handleHealthSampleReportTextChange('sensoryDysfunction', e.target.value)}
                                        className="rounded border-gray-300"
                                      />
                                      A history of sensory dysfunction
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['sensory modulation dysfunction', 'sensory integration dysfunction', 'visual perceptual dysfunction', 'visual processing', 'auditory processing', 'other'].map((item) => (
                                      <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={healthSampleReportData.sensoryHistory.includes(item)}
                                          onChange={() => handleHealthArrayChange('sensoryHistory', item)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{item}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Motor Conditions:</label>
                                  <div className="flex gap-4 mb-2">
                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="motorDysfunction"
                                        value="no_history"
                                        checked={healthSampleReportData.motorDysfunction === 'no_history'}
                                        onChange={(e) => handleHealthSampleReportTextChange('motorDysfunction', e.target.value)}
                                        className="rounded border-gray-300"
                                      />
                                      No history of motor dysfunction
                                    </label>
                                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name="motorDysfunction"
                                        value="history"
                                        checked={healthSampleReportData.motorDysfunction === 'history'}
                                        onChange={(e) => handleHealthSampleReportTextChange('motorDysfunction', e.target.value)}
                                        className="rounded border-gray-300"
                                      />
                                      A history of motor dysfunction
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Health Conditions */}
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Health Conditions</h4>
                                
                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Medical Conditions - Previously Diagnosed:</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['asthma', 'diabetes', 'heart disease', 'hypertension', 'other'].map((item) => (
                                      <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={healthSampleReportData.pastDiagnosed.includes(item)}
                                          onChange={() => handleHealthArrayChange('pastDiagnosed', item)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{item}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Medical Conditions - Currently Diagnosed:</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['asthma', 'diabetes', 'heart disease', 'hypertension', 'other'].map((item) => (
                                      <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={healthSampleReportData.currentDiagnosed.includes(item)}
                                          onChange={() => handleHealthArrayChange('currentDiagnosed', item)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{item}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className="text-xs text-gray-600 mb-2 block">Psychiatric Conditions - Currently Diagnosed:</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    {['Attention-deficit hyperactivity disorder', 'Autism spectrum disorder', 'Anxiety', 'Depression', 'other'].map((item) => (
                                      <label key={item} className="flex items-center gap-1 text-xs cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          checked={healthSampleReportData.psychiatricCurrent.includes(item)}
                                          onChange={() => handleHealthArrayChange('psychiatricCurrent', item)}
                                          className="rounded border-gray-300"
                                        />
                                        <span className="capitalize">{item}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className={labelClass}>Current Medications:</label>
                                  <textarea
                                    value={healthSampleReportData.currentMedications}
                                    onChange={(e) => handleHealthSampleReportTextChange('currentMedications', e.target.value)}
                                    placeholder="List current medications..."
                                    rows="2"
                                    className={inputClass('currentMedications')}
                                  />
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4">
                                  <label className={labelClass}>Additional Information:</label>
                                  <textarea
                                    value={healthSampleReportData.additionalInfo}
                                    onChange={(e) => handleHealthSampleReportTextChange('additionalInfo', e.target.value)}
                                    placeholder="Enter any additional details..."
                                    rows="2"
                                    className={inputClass('healthAdditionalInfo')}
                                  />
                                </div>
                              </div>
                        
                        <h4 className="text-sm font-semibold text-blue-700 mt-6">Additional Information</h4>
                        <p className="text-sm text-gray-500">Health history can be added here.</p>
                      </div>
                    )}

                    {historySubTab === 'employment' && (
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden mb-4">
                          <button 
                            onClick={() => setShowEmploymentSampleReport(!showEmploymentSampleReport)}
                            className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                          >
                            <span className="text-sm font-medium">{showEmploymentSampleReport ? '⊟' : '⊞'}</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
                          
                          {showEmploymentSampleReport && (
                            <div className="p-4 bg-white border-t">
                              <textarea
                                value={employmentSampleReportSentence || generateEmploymentSampleReportSentence()}
                                onChange={(e) => setEmploymentSampleReportSentence(e.target.value)}
                                placeholder="Sample report sentence will be generated here..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px] italic bg-gray-50"
                              />
                              <p className="text-xs text-gray-500 mt-2">
                                This sentence is automatically generated from the Employment fields below. You can edit it as needed.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Employment Content */}
                        <h3 className="text-sm font-semibold text-blue-800">Employment</h3>
                        <p className="text-sm text-gray-500 mb-4">Employment history can be added here.</p>
                              
                              {/* Employment Information */}
                              <div className="mb-6">
                                <h4 className="text-sm font-semibold text-blue-700 mb-3">Employment Information</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className={labelClass}>Employment Status:</label>
                                    <select 
                                      value={employmentSampleReportData.employmentStatus}
                                      onChange={(e) => handleEmploymentSampleReportTextChange('employmentStatus', e.target.value)}
                                      className={`${inputClass('employmentStatus')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="employed">Employed</option>
                                      <option value="unemployed">Unemployed</option>
                                      <option value="self-employed">Self-Employed</option>
                                      <option value="retired">Retired</option>
                                      <option value="student">Student</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className={labelClass}>Current Job/Position:</label>
                                    <input
                                      type="text"
                                      value={employmentSampleReportData.currentJob}
                                      onChange={(e) => handleEmploymentSampleReportTextChange('currentJob', e.target.value)}
                                      placeholder="e.g., Software Engineer"
                                      className={inputClass('currentJob')}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className={labelClass}>Duration in Current Position:</label>
                                    <input
                                      type="text"
                                      value={employmentSampleReportData.jobDuration}
                                      onChange={(e) => handleEmploymentSampleReportTextChange('jobDuration', e.target.value)}
                                      placeholder="e.g., 2 years"
                                      className={inputClass('jobDuration')}
                                    />
                                  </div>
                                  <div>
                                    <label className={labelClass}>Employment History Source:</label>
                                    <select 
                                      value={employmentSampleReportData.employmentHistorySource}
                                      onChange={(e) => handleEmploymentSampleReportTextChange('employmentHistorySource', e.target.value)}
                                      className={`${inputClass('employmentHistorySource')} appearance-none`}
                                    >
                                      <option value="">Please Select...</option>
                                      <option value="self-report">Self-Report</option>
                                      <option value="employer">Employer</option>
                                      <option value="records">Employment Records</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label className={labelClass}>Previous Jobs:</label>
                                  <textarea
                                    value={employmentSampleReportData.previousJobs}
                                    onChange={(e) => handleEmploymentSampleReportTextChange('previousJobs', e.target.value)}
                                    placeholder="List previous job positions..."
                                    rows="2"
                                    className={inputClass('previousJobs')}
                                  />
                                </div>

                                {/* Additional Info */}
                                <div className="mt-4">
                                  <label className={labelClass}>Additional Information:</label>
                                  <textarea
                                    value={employmentSampleReportData.additionalInfo}
                                    onChange={(e) => handleEmploymentSampleReportTextChange('additionalInfo', e.target.value)}
                                    placeholder="Enter any additional details..."
                                    rows="2"
                                    className={inputClass('employmentAdditionalInfo')}
                                  />
                                </div>
                              </div>
                      </div>
                    )}
                  </motion.div>
                )}
            </div>
          </motion.div>
        </div>


      </div>
      
      {/* Assign Assessment Modal */}
      <AssignAssessmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        examineeId={examineeId}
        examineeName={examineeData?.name || 'Unknown Examinee'}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        selectedAssessmentIds={selectedAssessments}
        assessments={assessments}
        examineeData={examineeData}
      />

      {/* Edit Assessment Modal */}
      <EditAssessmentModal
        isOpen={isEditAssessmentModalOpen}
        onClose={() => setIsEditAssessmentModalOpen(false)}
        assessment={selectedAssessmentToEdit}
        examineeId={examineeId}
        examineeName={examineeData?.name || 'Unknown Examinee'}
        onSuccess={handleAssessmentUpdated}
      />
    </div>
  );
};

export default ExamineeDetail;
