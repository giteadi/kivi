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
    autismSpectrum: false,
    behaviourEmotional: false,
    giftedTalented: false,
    intellectualDisability: false,
    languageDelay: false,
    learningDisability: false,
    moodRelated: false,
    motorDelay: false,
    personalityDisorders: false,
    schizophrenia: false,
    speech: false,
    substanceAbuse: false,
    traumaticBrainInjury: false,
    other: false
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

  const [personalSampleReportData, setPersonalSampleReportData] = useState({
    livingArrangement: '',
    livesWithDetails: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
          setDiagnosisData({
            autismSpectrum: false,
            behaviourEmotional: false,
            giftedTalented: false,
            intellectualDisability: false,
            languageDelay: false,
            learningDisability: false,
            moodRelated: false,
            motorDelay: false,
            personalityDisorders: false,
            schizophrenia: false,
            speech: false,
            substanceAbuse: false,
            traumaticBrainInjury: false,
            other: false,
            ...safeDiagData
          });
          
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
                  { id: 'history', label: 'History' }
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
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Diagnosis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries({
                      autismSpectrum: 'Autism Spectrum Disorder',
                      behaviourEmotional: 'Behaviour/Emotional Disorder',
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
                          checked={diagnosisData[key] === true}
                          onChange={(e) => {
                            setDiagnosisData(prev => ({
                              ...prev,
                              [key]: e.target.checked
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
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Education</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Year/Grade
                      </label>
                      <input
                        type="text"
                        value={educationSampleReportData.currentYear || ''}
                        onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, currentYear: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter current year/grade"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mother's Education
                      </label>
                      <input
                        type="text"
                        value={educationSampleReportData.motherEducation || ''}
                        onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, motherEducation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter mother's education"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father's Education
                      </label>
                      <input
                        type="text"
                        value={educationSampleReportData.fatherEducation || ''}
                        onChange={(e) => setEducationSampleReportData(prev => ({ ...prev, fatherEducation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter father's education"
                      />
                    </div>
                  </div>
                </div>

                {/* Health Information */}
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Health</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vision Result
                      </label>
                      <input
                        type="text"
                        value={healthSampleReportData.visionResult || ''}
                        onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, visionResult: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter vision screening result"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hearing Result
                      </label>
                      <input
                        type="text"
                        value={healthSampleReportData.hearingResult || ''}
                        onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, hearingResult: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter hearing screening result"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Medications
                      </label>
                      <textarea
                        value={healthSampleReportData.currentMedications || ''}
                        onChange={(e) => setHealthSampleReportData(prev => ({ ...prev, currentMedications: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter current medications"
                      />
                    </div>
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
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentEditForm;
