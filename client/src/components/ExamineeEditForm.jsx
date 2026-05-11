import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiUpload, FiTrash2, FiFile, FiImage } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const StudentEditForm = ({ studentId, onSave, onCancel }) => {
  const toast = useToast();
  const hasFetched = useRef(false);
  const hasSaved = useRef(false);
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    languageOfTesting: '',
    schoolName: '',
    grade: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    centreId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    learningNeeds: '',
    supportRequirements: '',
    status: 'Active',
    comment: '',
    requiresAssessment: false,
    requiresTherapy: false,
    documents: [] // Array to store uploaded documents
  });

  // ✅ ADD MISSING STATES - Same as ExamineeDetail
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

  const [historyData, setHistoryData] = useState({
    referralSourceName: '',
    referralSourceRole: '',
    referralSourceRoleOther: '',
    schoolRelatedConcerns: false,
    speechConcerns: false,
    languageConcerns: false,
    socialEmotionalConcerns: false,
    cognitiveConcerns: false,
    physicalConcerns: false,
    vocationalRehabilitationLegal: false,
    otherReason: false,
    otherReasonText: '',
    birthInformationOther: false,
    birthInformationOtherText: '',
    developmentalMilestonesOther: false,
    developmentalMilestonesOtherText: ''
  });

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

  const [employmentSampleReportData, setEmploymentSampleReportData] = useState({
    employmentStatus: '',
    currentJob: '',
    jobDuration: '',
    previousJobs: '',
    employmentHistorySource: '',
    additionalInfo: ''
  });

  // Diagnosis helper functions
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
      [category]: {
        ...prev[category],
        otherText: text
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

  const formatDynamicOptionLabel = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Education helper functions
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

  const addEducationCustomItem = (field, customField, text) => {
    if (text && text.trim()) {
      const key = text.trim().toLowerCase().replace(/\s+/g, '_');
      setEducationSampleReportData(prev => {
        const currentArray = prev[field] || [];
        if (!currentArray.includes(key)) {
          return { ...prev, [field]: [...currentArray, key], [customField]: '' };
        }
        return { ...prev, [customField]: '' };
      });
    }
  };

  const removeEducationCustomItem = (field, item) => {
    setEducationSampleReportData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter(i => i !== item)
    }));
  };

  const [educationCustomText, setEducationCustomText] = useState({
    personalStrengths: '',
    personalWeaknesses: '',
    peerStrengths: '',
    peerWeaknesses: '',
    learningDisabilities: ''
  });

  const handleEducationCustomTextChange = (field, text) => {
    setEducationCustomText(prev => ({ ...prev, [field]: text }));
  };

  // Health helper functions
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

  const addHealthCustomItem = (field, text) => {
    if (text && text.trim()) {
      const key = text.trim().toLowerCase().replace(/\s+/g, '_');
      setHealthSampleReportData(prev => {
        const currentArray = prev[field] || [];
        if (!currentArray.includes(key)) {
          return { ...prev, [field]: [...currentArray, key] };
        }
        return prev;
      });
    }
  };

  const removeHealthCustomItem = (field, item) => {
    setHealthSampleReportData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter(i => i !== item)
    }));
  };

  const [healthCustomText, setHealthCustomText] = useState({
    sensoryHistory: '',
    fineMotorHistory: '',
    grossMotorHistory: ''
  });

  const handleHealthCustomTextChange = (field, text) => {
    setHealthCustomText(prev => ({ ...prev, [field]: text }));
  };

  const [personalSampleReportData, setPersonalSampleReportData] = useState({
    livingArrangement: '',
    livesWithDetails: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for Identity Proof documents
  const [identityProofs, setIdentityProofs] = useState([]);
  
  // State for image preview modal
  const [previewImage, setPreviewImage] = useState(null);
  
  // ✅ ADD TAB STATES - Same as ExamineeDetail
  const [activeTab, setActiveTab] = useState('demographics');
  const [evaluationSubTab, setEvaluationSubTab] = useState('reasonsForTesting');
  const [historySubTab, setHistorySubTab] = useState('referral');

  const centres = [
    { id: 1, name: 'Centrix Centre' },
    { id: 5, name: 'Test' }
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      try {
        // Remove # prefix from studentId if present
        const cleanStudentId = studentId.toString().replace('#', '');
        console.log('Fetching student with ID:', cleanStudentId);
        const result = await api.getPatient(cleanStudentId);
        console.log('API Response:', result);
        
        if (result.success) {
          const student = result.data;
          console.log('🔄 EXAMINEE EDIT - Loading Student Data');
          console.log('📦 Raw student:', student);
          
          // ✅ Parse JSON fields - Same as ExamineeDetail
          let evalData = student.evaluation_data;
          let diagData = student.diagnosis_data;
          let histData = student.history_data;
          
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
          
          // Set basic form data
          setFormData({
            id: student.id,
            firstName: student.first_name || '',
            middleName: student.middle_name || '',
            lastName: student.last_name || '',
            email: student.email || '',
            phone: student.phone || '',
            dateOfBirth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
            gender: student.gender || '',
            languageOfTesting: student.language_of_testing || '',
            schoolName: student.school_name || '',
            grade: student.grade || '',
            address: student.address || '',
            city: student.city || '',
            state: student.state || '',
            zipCode: student.zip_code || '',
            centreId: student.centre_id || '',
            emergencyContactName: student.emergency_contact_name || '',
            emergencyContactPhone: student.emergency_contact_phone || '',
            emergencyContactRelation: student.emergency_contact_relation || '',
            learningNeeds: student.learning_needs || '',
            supportRequirements: student.support_requirements || '',
            status: student.status || 'Active',
            comment: student.comment || '',
            requiresAssessment: student.requires_assessment || false,
            requiresTherapy: student.requires_therapy || false,
            documents: student.documents ? (Array.isArray(student.documents) ? student.documents : []) : []
          });
          
          // ✅ Set evaluation data with defaults and merge saved data
          console.log('📋 Setting Evaluation Data');
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
          
          // ✅ Set diagnosis data
          console.log('🏥 Setting Diagnosis Data');
          const safeDiagData = diagData || {};
          setDiagnosisData(prev => ({
            autismSpectrum: { ...prev.autismSpectrum, ...(safeDiagData.autismSpectrum || {}) },
            behaviourEmotional: { ...prev.behaviourEmotional, ...(safeDiagData.behaviourEmotional || {}) },
            giftedTalented: { ...prev.giftedTalented, ...(safeDiagData.giftedTalented || {}) },
            intellectualDisability: { ...prev.intellectualDisability, ...(safeDiagData.intellectualDisability || {}) },
            languageDelay: { ...prev.languageDelay, ...(safeDiagData.languageDelay || {}) },
            learningDisability: { ...prev.learningDisability, ...(safeDiagData.learningDisability || {}) },
            moodRelated: { ...prev.moodRelated, ...(safeDiagData.moodRelated || {}) },
            motorDelay: { ...prev.motorDelay, ...(safeDiagData.motorDelay || {}) },
            personalityDisorders: { ...prev.personalityDisorders, ...(safeDiagData.personalityDisorders || {}) },
            schizophrenia: { ...prev.schizophrenia, ...(safeDiagData.schizophrenia || {}) },
            speech: { ...prev.speech, ...(safeDiagData.speech || {}) },
            substanceAbuse: { ...prev.substanceAbuse, ...(safeDiagData.substanceAbuse || {}) },
            traumaticBrainInjury: { ...prev.traumaticBrainInjury, ...(safeDiagData.traumaticBrainInjury || {}) },
            other: { ...prev.other, ...(safeDiagData.other || {}) }
          }));
          
          // ✅ Set history data - Merge with defaults to ensure all fields exist
          console.log('📋 Setting History Data (MERGING WITH DEFAULTS)');
          const safeHistData = histData || {};
          setHistoryData(prev => ({
            ...prev,
            ...safeHistData
          }));
          if (safeHistData && Object.keys(safeHistData).length > 0) {
            console.log('  History data keys:', Object.keys(safeHistData));
          }
          
          // ✅ Restore nested sample report data
          if (histData?.personalSampleReportData) {
            console.log('  ✅ Restoring personalSampleReportData');
            setPersonalSampleReportData(histData.personalSampleReportData);
          }
          
          if (histData?.languageSampleReportData) {
            console.log('  ✅ Restoring languageSampleReportData');
            setLanguageSampleReportData(histData.languageSampleReportData);
          }
          
          if (histData?.educationSampleReportData) {
            console.log('  ✅ Restoring educationSampleReportData');
            setEducationSampleReportData(histData.educationSampleReportData);
          }
          
          if (histData?.healthSampleReportData) {
            console.log('  ✅ Restoring healthSampleReportData');
            setHealthSampleReportData(histData.healthSampleReportData);
          }
          
          if (histData?.employmentSampleReportData) {
            console.log('  ✅ Restoring employmentSampleReportData');
            setEmploymentSampleReportData(histData.employmentSampleReportData);
          }
          
          console.log('✅ All data loaded successfully in Edit Form');
        } else {
          toast.error('Failed to fetch student data');
        }
      } catch (error) {
        console.error('Error fetching student:', error);
        toast.error('Error loading student data');
      } finally {
        setLoading(false);
      }
    };

    if (studentId && !hasFetched.current) {
      fetchStudent();
    }
    
    // Reset fetch flag when studentId changes
    return () => {
      hasFetched.current = false;
    };
  }, [studentId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.centreId) {
      newErrors.centreId = 'Center is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
    });

    const filePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: e.target.result, // Base64 string
            uploadDate: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then(newDocuments => {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    });
  };

  // Remove uploaded document
  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-4 h-4" />;
    return <FiFile className="w-4 h-4" />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasSaved.current) return;
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    hasSaved.current = true;
    
    try {
      // Remove # prefix from studentId if present
      const cleanStudentId = studentId.toString().replace('#', '');
      
      // Debug logging - what data are we sending?
      console.log('🚀 UPDATING STUDENT - Client Side Debug:');
      console.log('📤 Student ID:', cleanStudentId);
      console.log('📤 Form Data:', JSON.stringify(formData, null, 2));
      
      // ✅ Prepare API data with ALL nested fields - Same as ExamineeDetail
      const apiData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        languageOfTesting: formData.languageOfTesting,
        schoolName: formData.schoolName,
        grade: formData.grade,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        centreId: formData.centreId,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactRelation: formData.emergencyContactRelation,
        learningNeeds: formData.learningNeeds,
        supportRequirements: formData.supportRequirements,
        status: formData.status,
        comment: formData.comment,
        requiresAssessment: formData.requiresAssessment,
        requiresTherapy: formData.requiresTherapy,
        documents: formData.documents,
        identityProof: identityProofs, // Add identity proof documents
        // ✅ Include ALL nested data
        evaluationData: evaluationData,
        diagnosisData: diagnosisData,
        historyData: {
          ...historyData,
          personalSampleReportData: personalSampleReportData,
          languageSampleReportData: languageSampleReportData,
          educationSampleReportData: educationSampleReportData,
          healthSampleReportData: healthSampleReportData,
          employmentSampleReportData: employmentSampleReportData
        }
      };
      
      console.log('📦 Complete API Data:', JSON.stringify(apiData, null, 2));
      
      const result = await api.updatePatient(cleanStudentId, apiData);
      
      if (result.success) {
        toast.success('Student updated successfully');
        onSave(result.data);
      } else {
        toast.error(result.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Error updating student');
    } finally {
      setIsSubmitting(false);
      hasSaved.current = false;
    }
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading student data...</div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Examinees</span>
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Update Examinee'}</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Examinees</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Edit Examinee</span>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Edit Student</h2>
                <p className="text-gray-600">Update student information</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ✅ ADD TABS - Same as ExamineeDetail */}
            <div className="border-b bg-gray-50/50 -mx-6 -mt-6 mb-6">
              <div className="flex px-6">
                {[
                  { id: 'demographics', label: 'Demographics' },
                  { id: 'evaluation', label: 'Evaluation' },
                  { id: 'history', label: 'History' },
                  { id: 'documents', label: 'Documents' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
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

            {/* Demographics Tab */}
            {activeTab === 'demographics' && (
              <div className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language of Testing
                  </label>
                  <select
                    value={formData.languageOfTesting}
                    onChange={(e) => handleInputChange('languageOfTesting', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.languageOfTesting ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Demographics">Demographics</option>
                    <option value="Bilingual">Bilingual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter grade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter middle name"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={formData.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter any additional comments..."
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requiresAssessment}
                      onChange={(e) => handleInputChange('requiresAssessment', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Requires Assessment</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.requiresTherapy}
                      onChange={(e) => handleInputChange('requiresTherapy', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Requires Therapy</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter state"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter zip code"
                  />
                </div>
              </div>
            </div>

            {/* Centre & Emergency Contact */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Center & Emergency Contact</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Center *
                  </label>
                  <select
                    value={formData.centreId}
                    onChange={(e) => handleInputChange('centreId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.centreId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select center</option>
                    {centres.map((centre) => (
                      <option key={centre.id} value={centre.id}>
                        {centre.name}
                      </option>
                    ))}
                  </select>
                  {errors.centreId && (
                    <p className="mt-1 text-sm text-red-600">{errors.centreId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                    <option value="graduated">Graduated</option>
                    <option value="transferred">Transferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Relation
                  </label>
                  <select
                    value={formData.emergencyContactRelation}
                    onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select relation</option>
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Learning Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Learning Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Needs
                  </label>
                  <textarea
                    value={formData.learningNeeds}
                    onChange={(e) => handleInputChange('learningNeeds', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe specific learning needs..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Requirements
                  </label>
                  <textarea
                    value={formData.supportRequirements}
                    onChange={(e) => handleInputChange('supportRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe support requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Documents</h3>
              <div className="space-y-4">
                {/* Upload Button */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Documents (DOCX, Excel, Images, PDF, etc.)
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                      <FiUpload className="w-4 h-4" />
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        accept=".docx,.xlsx,.xls,.doc,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      Maximum file size: 10MB per file
                    </span>
                  </div>
                </div>

                {/* Existing Documents */}
                {formData.documents && formData.documents.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Documents ({formData.documents.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-blue-600">
                              {getFileIcon(doc.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.size)} • {doc.type || 'Unknown type'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(index)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove document"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
              </div>
            )}

            {/* ✅ Evaluation Tab */}
            {activeTab === 'evaluation' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Select all evaluation concerns that apply to this examinee. These will be used for assessment planning and reporting.
                  </p>
                </div>

                {/* Evaluation Categories */}
                {Object.entries({
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
                }).map(([key, label]) => (
                  <div key={key} className="bg-white border rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">{label}</h4>
                    <div className="space-y-2">
                      {Object.entries(evaluationData[key] || {}).map(([field, value]) => {
                        if (field === 'otherText') return null;
                        return (
                          <label key={field} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={value === true}
                              onChange={(e) => {
                                setEvaluationData(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], [field]: e.target.checked }
                                }));
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {field.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        );
                      })}
                      {evaluationData[key]?.other && (
                        <input
                          type="text"
                          value={evaluationData[key]?.otherText || ''}
                          onChange={(e) => {
                            setEvaluationData(prev => ({
                              ...prev,
                              [key]: { ...prev[key], otherText: e.target.value }
                            }));
                          }}
                          placeholder="Please specify..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* Diagnosis Section */}
                <div className="bg-white border rounded-lg p-4 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Diagnosis</h4>
                  
                  {/* Autism Spectrum */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50">
                      <span className="font-medium text-sm">Autism Spectrum Disorder</span>
                    </div>
                    <div className="px-4 py-2 pl-10 space-y-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.aspergers} onChange={() => toggleDiagnosis('autismSpectrum', 'aspergers')} />
                        Asperger's Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.autistic} onChange={() => toggleDiagnosis('autismSpectrum', 'autistic')} />
                        Autistic Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.childhoodDisintegrative} onChange={() => toggleDiagnosis('autismSpectrum', 'childhoodDisintegrative')} />
                        Childhood Disintegrative Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.pervasiveDevelopmental} onChange={() => toggleDiagnosis('autismSpectrum', 'pervasiveDevelopmental')} />
                        Pervasive Developmental Delay/Disability
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.retts} onChange={() => toggleDiagnosis('autismSpectrum', 'retts')} />
                        Rett's Disorder
                      </label>
                      {Object.keys(diagnosisData.autismSpectrum).filter(key => !['aspergers', 'autistic', 'childhoodDisintegrative', 'pervasiveDevelopmental', 'retts', 'other', 'otherText'].includes(key)).map(key => (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum[key]} onChange={() => toggleDiagnosis('autismSpectrum', key)} />
                            {formatDynamicOptionLabel(key)}
                          </label>
                          <button type="button" onClick={() => removeDiagnosisOption('autismSpectrum', key)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                        </div>
                      ))}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.autismSpectrum.other} onChange={() => toggleDiagnosis('autismSpectrum', 'other')} />
                        Other
                        <button type="button" onClick={() => removeDiagnosisOption('autismSpectrum', 'other')} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                      </label>
                      {diagnosisData.autismSpectrum.other && (
                        <div className="ml-6 w-full space-y-2">
                          <input type="text" value={diagnosisData.autismSpectrum.otherText} onChange={(e) => handleDiagnosisTextChange('autismSpectrum', e.target.value)} placeholder="Please specify..." className="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
                          <button type="button" onClick={() => addDiagnosisOption('autismSpectrum')} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add as new checkbox option</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Behaviour/Emotional */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-gray-50">
                      <span className="font-medium text-sm">Behaviour/Emotional Disorder</span>
                    </div>
                    <div className="px-4 py-2 pl-10 space-y-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.adhd} onChange={() => toggleDiagnosis('behaviourEmotional', 'adhd')} />
                        Attention Deficit/Hyperactivity Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.conduct} onChange={() => toggleDiagnosis('behaviourEmotional', 'conduct')} />
                        Conduct Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.disruptive} onChange={() => toggleDiagnosis('behaviourEmotional', 'disruptive')} />
                        Disruptive Behavior Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.emotional} onChange={() => toggleDiagnosis('behaviourEmotional', 'emotional')} />
                        Emotional Disturbance
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.intermittentExplosive} onChange={() => toggleDiagnosis('behaviourEmotional', 'intermittentExplosive')} />
                        Intermittent Explosive Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.kleptomania} onChange={() => toggleDiagnosis('behaviourEmotional', 'kleptomania')} />
                        Kleptomania
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.oppositionalDefiant} onChange={() => toggleDiagnosis('behaviourEmotional', 'oppositionalDefiant')} />
                        Oppositional Defiant Disorder
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.pathologicalGambling} onChange={() => toggleDiagnosis('behaviourEmotional', 'pathologicalGambling')} />
                        Pathological Gambling
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.pyromania} onChange={() => toggleDiagnosis('behaviourEmotional', 'pyromania')} />
                        Pyromania
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.trichotillomania} onChange={() => toggleDiagnosis('behaviourEmotional', 'trichotillomania')} />
                        Trichotillomania
                      </label>
                      {Object.keys(diagnosisData.behaviourEmotional).filter(key => !['adhd', 'conduct', 'disruptive', 'emotional', 'intermittentExplosive', 'kleptomania', 'oppositionalDefiant', 'pathologicalGambling', 'pyromania', 'trichotillomania', 'other', 'otherText'].includes(key)).map(key => (
                        <div key={key} className="flex items-center gap-2 text-sm text-gray-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional[key]} onChange={() => toggleDiagnosis('behaviourEmotional', key)} />
                            {formatDynamicOptionLabel(key)}
                          </label>
                          <button type="button" onClick={() => removeDiagnosisOption('behaviourEmotional', key)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                        </div>
                      ))}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" checked={diagnosisData.behaviourEmotional.other} onChange={() => toggleDiagnosis('behaviourEmotional', 'other')} />
                        Other
                        <button type="button" onClick={() => removeDiagnosisOption('behaviourEmotional', 'other')} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                      </label>
                      {diagnosisData.behaviourEmotional.other && (
                        <div className="ml-6 w-full space-y-2">
                          <input type="text" value={diagnosisData.behaviourEmotional.otherText} onChange={(e) => handleDiagnosisTextChange('behaviourEmotional', e.target.value)} placeholder="Please specify..." className="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
                          <button type="button" onClick={() => addDiagnosisOption('behaviourEmotional')} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add as new checkbox option</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add similar sections for other categories - keeping it compact for now */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries({
                      giftedTalented: 'Gifted and Talented',
                      intellectualDisability: 'Intellectual Disability',
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
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={Object.values(diagnosisData[key]).some(v => v === true)}
                          onChange={(e) => {
                            const anyChecked = Object.values(diagnosisData[key]).some(v => v === true);
                            setDiagnosisData(prev => ({
                              ...prev,
                              [key]: { ...prev[key], [Object.keys(prev[key])[0]]: !anyChecked }
                            }));
                          }}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ✅ History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Complete the history information to provide context for assessments and reports.
                  </p>
                </div>

                {/* Referral Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Referral Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Source Name
                      </label>
                      <input
                        type="text"
                        value={historyData.referralSourceName || ''}
                        onChange={(e) => setHistoryData(prev => ({ ...prev, referralSourceName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter referral source name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referral Source Role
                      </label>
                      <select
                        value={historyData.referralSourceRole || ''}
                        onChange={(e) => setHistoryData(prev => ({ ...prev, referralSourceRole: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="">Please Select...</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="physician">Physician</option>
                        <option value="psychologist">Psychologist</option>
                        <option value="therapist">Therapist</option>
                        <option value="other">Other</option>
                      </select>
                      {/* Show input field when "Other" is selected */}
                      {historyData.referralSourceRole === 'other' && (
                        <input
                          type="text"
                          value={historyData.referralSourceRoleOther || ''}
                          onChange={(e) => setHistoryData(prev => ({ ...prev, referralSourceRoleOther: e.target.value }))}
                          placeholder="Please specify role..."
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Referral Concerns */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Referral Concerns</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries({
                      schoolRelatedConcerns: 'School-related concerns',
                      speechConcerns: 'Speech concerns',
                      languageConcerns: 'Language concerns',
                      socialEmotionalConcerns: 'Social/emotional concerns',
                      cognitiveConcerns: 'Cognitive concerns',
                      physicalConcerns: 'Physical concerns',
                      vocationalRehabilitationLegal: 'Vocational/rehabilitation/legal issues'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={historyData[key] === true}
                          onChange={(e) => {
                            setHistoryData(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }));
                          }}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                    {/* Other checkbox */}
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={historyData.otherReason === true}
                        onChange={(e) => {
                          setHistoryData(prev => ({
                            ...prev,
                            otherReason: e.target.checked
                          }));
                        }}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Other</span>
                    </label>
                  </div>
                  {/* Show input field when "Other" is checked */}
                  {historyData.otherReason && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={historyData.otherReasonText || ''}
                        onChange={(e) => setHistoryData(prev => ({ ...prev, otherReasonText: e.target.value }))}
                        placeholder="Please specify other reason..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Language/Development Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Language & Development</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Language
                      </label>
                      <input
                        type="text"
                        value={languageSampleReportData.primaryLanguage || ''}
                        onChange={(e) => setLanguageSampleReportData(prev => ({ ...prev, primaryLanguage: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter primary language"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birth Complications
                      </label>
                      <input
                        type="text"
                        value={languageSampleReportData.birthComplications || ''}
                        onChange={(e) => setLanguageSampleReportData(prev => ({ ...prev, birthComplications: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter birth complications"
                      />
                    </div>
                  </div>
                </div>

                {/* Education Information */}
                <div className="bg-white border rounded-lg p-4 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Education</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Year/Grade</label>
                      <input type="text" value={educationSampleReportData.currentYear || ''} onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, currentYear: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter current year/grade" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                      <input type="text" value={educationSampleReportData.schoolName || ''} onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, schoolName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter school name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Education</label>
                      <input type="text" value={educationSampleReportData.motherEducation || ''} onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, motherEducation: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter mother's education" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Father's Education</label>
                      <input type="text" value={educationSampleReportData.fatherEducation || ''} onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, fatherEducation: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter father's education" />
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-semibold text-blue-800">Academic Performance - Strengths and Weaknesses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Personal Strengths:</h4>
                        {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music'].map((item) => (
                          <label key={`strength-${item}`} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={(educationSampleReportData.personalStrengths || []).includes(item)} onChange={() => handleEducationArrayChange('personalStrengths', item)} />
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </label>
                        ))}
                        {(educationSampleReportData.personalStrengths || []).filter(item => !['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music'].includes(item)).map((item) => (
                          <div key={`strength-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input type="checkbox" className="rounded border-gray-300" checked={true} onChange={() => handleEducationArrayChange('personalStrengths', item)} />
                              {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <button type="button" onClick={() => removeEducationCustomItem('personalStrengths', item)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                          </div>
                        ))}
                        <div className="mt-2 space-y-2">
                          <input type="text" value={educationCustomText.personalStrengths} onChange={(e) => handleEducationCustomTextChange('personalStrengths', e.target.value)} placeholder="Add custom strength..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                          <button type="button" onClick={() => addEducationCustomItem('personalStrengths', 'personalStrengths', educationCustomText.personalStrengths)} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add Strength</button>
                        </div>
                      </div>

                      {/* Personal Weaknesses */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Personal Weaknesses:</h4>
                        {['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music'].map((item) => (
                          <label key={`weakness-${item}`} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={(educationSampleReportData.personalWeaknesses || []).includes(item)} onChange={() => handleEducationArrayChange('personalWeaknesses', item)} />
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </label>
                        ))}
                        {(educationSampleReportData.personalWeaknesses || []).filter(item => !['reading', 'writing', 'mathematics', 'language', 'science', 'art', 'athletics', 'music'].includes(item)).map((item) => (
                          <div key={`weakness-${item}`} className="flex items-center gap-2 text-xs text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input type="checkbox" className="rounded border-gray-300" checked={true} onChange={() => handleEducationArrayChange('personalWeaknesses', item)} />
                              {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <button type="button" onClick={() => removeEducationCustomItem('personalWeaknesses', item)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                          </div>
                        ))}
                        <div className="mt-2 space-y-2">
                          <input type="text" value={educationCustomText.personalWeaknesses} onChange={(e) => handleEducationCustomTextChange('personalWeaknesses', e.target.value)} placeholder="Add custom weakness..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                          <button type="button" onClick={() => addEducationCustomItem('personalWeaknesses', 'personalWeaknesses', educationCustomText.personalWeaknesses)} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add Weakness</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="bg-white border rounded-lg p-4 space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Health</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vision Result</label>
                      <input type="text" value={healthSampleReportData.visionResult || ''} onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, visionResult: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter vision screening result" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hearing Result</label>
                      <input type="text" value={healthSampleReportData.hearingResult || ''} onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, hearingResult: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Enter hearing screening result" />
                    </div>
                  </div>

                  {/* Sensory and Motor Conditions */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-semibold text-blue-800">Sensory and Motor Conditions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Sensory History */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Sensory History:</h4>
                        {['sensory_modulation_dysfunction', 'sensory_integration_dysfunction', 'visual_perceptual_dysfunction', 'visual_processing', 'auditory_processing'].map((item) => (
                          <label key={item} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={(healthSampleReportData.sensoryHistory || []).includes(item)} onChange={() => handleHealthArrayChange('sensoryHistory', item)} />
                            {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                        ))}
                        {(healthSampleReportData.sensoryHistory || []).filter(item => !['sensory_modulation_dysfunction', 'sensory_integration_dysfunction', 'visual_perceptual_dysfunction', 'visual_processing', 'auditory_processing'].includes(item)).map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input type="checkbox" className="rounded border-gray-300" checked={true} onChange={() => handleHealthArrayChange('sensoryHistory', item)} />
                              {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <button type="button" onClick={() => removeHealthCustomItem('sensoryHistory', item)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                          </div>
                        ))}
                        <div className="mt-2 space-y-2">
                          <input type="text" value={healthCustomText.sensoryHistory} onChange={(e) => handleHealthCustomTextChange('sensoryHistory', e.target.value)} placeholder="Add custom condition..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                          <button type="button" onClick={() => { addHealthCustomItem('sensoryHistory', healthCustomText.sensoryHistory); handleHealthCustomTextChange('sensoryHistory', ''); }} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add Condition</button>
                        </div>
                      </div>

                      {/* Fine-Motor History */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Fine-Motor History:</h4>
                        {['poor_hand_strength', 'poor_manipulation_of_objects', 'poor_handwriting'].map((item) => (
                          <label key={item} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={(healthSampleReportData.fineMotorHistory || []).includes(item)} onChange={() => handleHealthArrayChange('fineMotorHistory', item)} />
                            {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                        ))}
                        {(healthSampleReportData.fineMotorHistory || []).filter(item => !['poor_hand_strength', 'poor_manipulation_of_objects', 'poor_handwriting'].includes(item)).map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input type="checkbox" className="rounded border-gray-300" checked={true} onChange={() => handleHealthArrayChange('fineMotorHistory', item)} />
                              {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <button type="button" onClick={() => removeHealthCustomItem('fineMotorHistory', item)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                          </div>
                        ))}
                        <div className="mt-2 space-y-2">
                          <input type="text" value={healthCustomText.fineMotorHistory} onChange={(e) => handleHealthCustomTextChange('fineMotorHistory', e.target.value)} placeholder="Add custom condition..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                          <button type="button" onClick={() => { addHealthCustomItem('fineMotorHistory', healthCustomText.fineMotorHistory); handleHealthCustomTextChange('fineMotorHistory', ''); }} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add Condition</button>
                        </div>
                      </div>

                      {/* Gross-Motor History */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-gray-700">Gross-Motor History:</h4>
                        {['poor_coordination', 'poor_endurance', 'poor_strength', 'poor_motor_planning', 'poor_balance', 'poor_postural_control', 'difficulty_learning_to_ride_a_bicycle'].map((item) => (
                          <label key={item} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300" checked={(healthSampleReportData.grossMotorHistory || []).includes(item)} onChange={() => handleHealthArrayChange('grossMotorHistory', item)} />
                            {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                        ))}
                        {(healthSampleReportData.grossMotorHistory || []).filter(item => !['poor_coordination', 'poor_endurance', 'poor_strength', 'poor_motor_planning', 'poor_balance', 'poor_postural_control', 'difficulty_learning_to_ride_a_bicycle'].includes(item)).map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input type="checkbox" className="rounded border-gray-300" checked={true} onChange={() => handleHealthArrayChange('grossMotorHistory', item)} />
                              {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            <button type="button" onClick={() => removeHealthCustomItem('grossMotorHistory', item)} className="text-red-500 hover:text-red-700 text-xs">✕</button>
                          </div>
                        ))}
                        <div className="mt-2 space-y-2">
                          <input type="text" value={healthCustomText.grossMotorHistory || ''} onChange={(e) => handleHealthCustomTextChange('grossMotorHistory', e.target.value)} placeholder="Add custom condition..." className="w-full px-2 py-1 text-xs border border-gray-300 rounded" />
                          <button type="button" onClick={() => { addHealthCustomItem('grossMotorHistory', healthCustomText.grossMotorHistory); handleHealthCustomTextChange('grossMotorHistory', ''); }} className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">+ Add Condition</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                    <textarea
                      value={healthSampleReportData.currentMedications || ''}
                      onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, currentMedications: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Enter current medications"
                    />
                  </div>
                </div>

                {/* Employment Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Employment (if applicable)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Status
                      </label>
                      <input
                        type="text"
                        value={employmentSampleReportData.employmentStatus || ''}
                        onChange={(e) => setEmploymentSampleReportData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter employment status"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Job
                      </label>
                      <input
                        type="text"
                        value={employmentSampleReportData.currentJob || ''}
                        onChange={(e) => setEmploymentSampleReportData(prev => ({ ...prev, currentJob: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter current job"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Identity Proof for Age of Examinee</h3>
                  <p className="text-xs text-blue-600">Upload identity documents (Aadhar Card, Birth Certificate, or Passport)</p>
                </div>

                {/* Aadhar Card */}
                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Card
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const newProof = {
                            type: 'aadhar_card',
                            image: event.target.result,
                            uploadDate: new Date().toISOString(),
                            fileName: file.name,
                            fileSize: file.size
                          };
                          const filtered = identityProofs.filter(p => p.type !== 'aadhar_card');
                          setIdentityProofs([...filtered, newProof]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {identityProofs.find(p => p.type === 'aadhar_card') && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(identityProofs.find(p => p.type === 'aadhar_card').image)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        ✓ {identityProofs.find(p => p.type === 'aadhar_card').fileName} (Click to view)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdentityProofs(identityProofs.filter(p => p.type !== 'aadhar_card'))}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Birth Certificate */}
                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birth Certificate
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const newProof = {
                            type: 'birth_certificate',
                            image: event.target.result,
                            uploadDate: new Date().toISOString(),
                            fileName: file.name,
                            fileSize: file.size
                          };
                          const filtered = identityProofs.filter(p => p.type !== 'birth_certificate');
                          setIdentityProofs([...filtered, newProof]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {identityProofs.find(p => p.type === 'birth_certificate') && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(identityProofs.find(p => p.type === 'birth_certificate').image)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        ✓ {identityProofs.find(p => p.type === 'birth_certificate').fileName} (Click to view)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdentityProofs(identityProofs.filter(p => p.type !== 'birth_certificate'))}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Passport */}
                <div className="bg-white border rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const newProof = {
                            type: 'passport',
                            image: event.target.result,
                            uploadDate: new Date().toISOString(),
                            fileName: file.name,
                            fileSize: file.size
                          };
                          const filtered = identityProofs.filter(p => p.type !== 'passport');
                          setIdentityProofs([...filtered, newProof]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {identityProofs.find(p => p.type === 'passport') && (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded p-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(identityProofs.find(p => p.type === 'passport').image)}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        ✓ {identityProofs.find(p => p.type === 'passport').fileName} (Click to view)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIdentityProofs(identityProofs.filter(p => p.type !== 'passport'))}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Document Preview</h3>
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-4 flex justify-center">
                    <img src={previewImage} alt="Document Preview" className="max-w-full max-h-[70vh] object-contain" />
                  </div>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentEditForm;
