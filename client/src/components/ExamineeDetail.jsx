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
    email: '',
    comment: '',
    account: 'MINDSAID LEARNING CENTRE',
    center1: '',
    center2: '',
    center3: '',
    center4: ''
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
  
  const [age, setAge] = useState({ years: 0, months: 0 });
  const [errors, setErrors] = useState({});
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDocumentManageOpen, setIsDocumentManageOpen] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingDocument, setViewingDocument] = useState(null);
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
      // Parse JSON fields
      let evalData = currentPatient.evaluation_data;
      let diagData = currentPatient.diagnosis_data;
      let histData = currentPatient.history_data;
      
      if (typeof evalData === 'string') {
        try { evalData = JSON.parse(evalData); } catch (e) { evalData = {}; }
      }
      if (typeof diagData === 'string') {
        try { diagData = JSON.parse(diagData); } catch (e) { diagData = {}; }
      }
      if (typeof histData === 'string') {
        try { histData = JSON.parse(histData); } catch (e) { histData = {}; }
      }
      
      // Set form data
      setFormData({
        firstName: currentPatient.first_name || '',
        middleName: currentPatient.middle_name || '',
        lastName: currentPatient.last_name || '',
        examineeId: currentPatient.student_id || '',
        gender: currentPatient.gender ? currentPatient.gender.charAt(0).toUpperCase() + currentPatient.gender.slice(1) : '',
        birthDate: currentPatient.date_of_birth ? new Date(currentPatient.date_of_birth).toISOString().split('T')[0] : '',
        email: currentPatient.email || '',
        comment: currentPatient.comment || '',
        account: currentPatient.centre_name || 'MINDSAID LEARNING CENTRE',
        center1: currentPatient.custom_field_1 || '',
        center2: currentPatient.custom_field_2 || '',
        center3: currentPatient.custom_field_3 || '',
        center4: currentPatient.custom_field_4 || ''
      });
      
      // Set evaluation data with defaults and merge saved data
      setEvaluationData(prev => ({
        academicConcerns: { ...prev.academicConcerns, ...evalData?.academicConcerns },
        cognitiveEvaluation: { ...prev.cognitiveEvaluation, ...evalData?.cognitiveEvaluation },
        behaviourConcerns: { ...prev.behaviourConcerns, ...evalData?.behaviourConcerns },
        mentalHealth: { ...prev.mentalHealth, ...evalData?.mentalHealth },
        developmentalDelay: { ...prev.developmentalDelay, ...evalData?.developmentalDelay },
        languageConcerns: { ...prev.languageConcerns, ...evalData?.languageConcerns },
        speechConcerns: { ...prev.speechConcerns, ...evalData?.speechConcerns },
        physicalConcerns: { ...prev.physicalConcerns, ...evalData?.physicalConcerns },
        substanceAbuse: { ...prev.substanceAbuse, ...evalData?.substanceAbuse },
        employment: { ...prev.employment, ...evalData?.employment }
      }));
      
      // Set diagnosis data
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
        ...diagData
      });
      
      // Set history data with defaults and merge saved data
      setHistoryData(prev => ({
        ...prev,
        ...histData
      }));
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

  const toggleDiagnosis = (category) => {
    setDiagnosisData(prev => ({
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

  // Save handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const apiData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        studentId: formData.examineeId,
        gender: formData.gender.toLowerCase(),
        dateOfBirth: formData.birthDate,
        email: formData.email,
        comment: formData.comment,
        centreName: formData.account,
        customField1: formData.center1,
        customField2: formData.center2,
        customField3: formData.center3,
        customField4: formData.center4,
        evaluationData: evaluationData,
        diagnosisData: diagnosisData,
        historyData: historyData
      };

      const response = await api.request(`/students/${examineeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      if (response.success) {
        toast.success('Examinee updated successfully!');
        dispatch(fetchPatient(examineeId));
      } else {
        toast.error(response.message || 'Failed to update examinee');
      }
    } catch (error) {
      console.error('Error updating examinee:', error);
      toast.error('An error occurred while updating the examinee');
    } finally {
      setIsSaving(false);
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
      customField1: patient.custom_field_1 || patient.customField1 || '',
      customField2: patient.custom_field_2 || patient.customField2 || '',
      customField3: patient.custom_field_3 || patient.customField3 || '',
      customField4: patient.custom_field_4 || patient.customField4 || '',
      groups: patient.groups || '',
      legacyId: patient.legacy_id || '',
      email: patient.email || 'Not provided',
      phone: patient.phone || 'Not provided',
      centre: patient.centre_name || 'MindSaid Learning Centre',
      address: patient.address || 'Not provided',
      city: patient.city || '',
      state: patient.state || '',
      zipCode: patient.zip_code || '',
      emergencyContactName: patient.emergency_contact_name || '',
      emergencyContactPhone: patient.emergency_contact_phone || '',
      emergencyContactRelation: patient.emergency_contact_relation || '',
      learningNeeds: patient.learning_needs || '',
      supportRequirements: patient.support_requirements || '',
      documents: patient.documents ? (Array.isArray(patient.documents) ? patient.documents : []) : [],
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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-4 h-4 text-green-600" />;
    return <FiFile className="w-4 h-4 text-blue-600" />;
  };

  // Download document
  const downloadDocument = (doc) => {
    try {
      // Create a link element and trigger download
      const link = window.document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      toast.success(`Downloading ${doc.name}`);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  // View document
  const viewDocument = (doc) => {
    setViewingDocument(doc);
  };

  // Delete document
  const handleDeleteDocument = (index) => {
    if (!window.confirm(`Delete "${examineeData.documents[index].name}"?`)) {
      return;
    }

    setIsSaving(true);
    const updatedDocuments = examineeData.documents.filter((_, i) => i !== index);
    
    // Call API directly to save
    api.updatePatient(currentPatient.id, {
      ...currentPatient,
      documents: updatedDocuments
    }).then((response) => {
      toast.success('Document deleted successfully');
      // Refresh the patient data
      dispatch(fetchPatient(examineeId));
      setIsSaving(false);
    }).catch((error) => {
      toast.error('Failed to delete document: ' + error.message);
      setIsSaving(false);
    });
  };

  // Replace document
  const handleReplaceDocument = (index) => {
    // Open file picker
    const fileInput = window.document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif';
    
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setIsSaving(true);
      try {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const updatedDocuments = [...examineeData.documents];
        updatedDocuments[index] = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadDate: new Date().toISOString()
        };

        // Call API directly to save
        await api.updatePatient(currentPatient.id, {
          ...currentPatient,
          documents: updatedDocuments
        });

        toast.success('Document replaced successfully');
        // Refresh the patient data
        dispatch(fetchPatient(examineeId));
        setIsSaving(false);
      } catch (error) {
        toast.error('Failed to replace document: ' + error.message);
        setIsSaving(false);
      }
    };

    fileInput.click();
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
                        Center Assignments
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <label className={labelClass}>Center 1</label>
                          <input
                            type="text"
                            value={formData.center1}
                            onChange={(e) => handleChange('center1', e.target.value)}
                            className={inputClass('center1')}
                            placeholder="Enter center name"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Center 2</label>
                          <input
                            type="text"
                            value={formData.center2}
                            onChange={(e) => handleChange('center2', e.target.value)}
                            className={inputClass('center2')}
                            placeholder="Enter center name"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Center 3</label>
                          <input
                            type="text"
                            value={formData.center3}
                            onChange={(e) => handleChange('center3', e.target.value)}
                            className={inputClass('center3')}
                            placeholder="Enter center name"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Center 4</label>
                          <input
                            type="text"
                            value={formData.center4}
                            onChange={(e) => handleChange('center4', e.target.value)}
                            className={inputClass('center4')}
                            placeholder="Enter center name"
                          />
                        </div>
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
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300"
                                checked={evaluationData.academicConcerns.reading}
                                onChange={(e) => handleEvaluationFieldChange('academicConcerns', 'reading', e.target.checked)}
                              />
                              Reading
                            </label>
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
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300"
                                checked={evaluationData.cognitiveEvaluation.traumaticBrainInjury}
                                onChange={(e) => handleEvaluationFieldChange('cognitiveEvaluation', 'traumaticBrainInjury', e.target.checked)}
                              />
                              Traumatic Brain Injury
                            </label>
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
                              Physical/Growth
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
                      </>
                    )}

                    {evaluationSubTab === 'diagnoses' && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Please select a diagnosis for this examinee. You may select more than one diagnosis.
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Click the [+] to expand and [-] to collapse a category.
                        </p>

                        {/* Diagnosis Categories */}
                        {Object.entries({
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
                        }).map(([key, label]) => (
                          <div key={key} className="border rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleDiagnosis(key)}
                              className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                            >
                              <span className="text-sm font-medium">{diagnosisData[key] ? '⊟' : '⊞'}</span>
                              <span className="font-medium text-sm">{label}</span>
                            </button>
                            {diagnosisData[key] && (
                              <div className="px-4 py-2 pl-10 space-y-1">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300"
                                    checked={diagnosisData[key]}
                                    onChange={() => toggleDiagnosis(key)}
                                  />
                                  {label} Selected
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
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
                    </div>

                    {historySubTab === 'referral' && (
                      <div className="space-y-6">
                        <div className="border rounded-lg overflow-hidden">
                          <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                            <span className="text-sm font-medium">⊞</span>
                            <span className="font-medium text-sm">Sample Report Sentence</span>
                          </button>
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
                        <h4 className="text-sm font-semibold text-blue-700">Personal Information</h4>
                        <p className="text-sm text-gray-500">Personal history details can be added here.</p>
                      </div>
                    )}

                    {historySubTab === 'languageDevelopment' && (
                      <div className="space-y-6">
                        <h4 className="text-sm font-semibold text-blue-700">Language and Development</h4>
                        <p className="text-sm text-gray-500">Language and developmental history can be added here.</p>
                      </div>
                    )}
                  </motion.div>
                )}
            </div>
          </motion.div>
        </div>

        {/* Documents Section */}
        {(examineeData.documents && examineeData.documents.length > 0 || true) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-sm border mb-6"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Documents</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {examineeData.documents?.length || 0} file(s)
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Open file picker to add new document
                      const fileInput = window.document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = '.pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif';
                      
                      fileInput.onchange = async (event) => {
                        const file = event.target.files[0];
                        if (!file) return;

                        if (file.size > 10 * 1024 * 1024) {
                          toast.error('File size must be less than 10MB');
                          return;
                        }

                        setIsSaving(true);
                        try {
                          const base64 = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          });

                          const newDoc = {
                            name: file.name,
                            type: file.type,
                            size: file.size,
                            data: base64,
                            uploadDate: new Date().toISOString()
                          };

                          const updatedDocuments = [...(examineeData.documents || []), newDoc];

                          // Call API directly to save
                          await api.updatePatient(currentPatient.id, {
                            ...currentPatient,
                            documents: updatedDocuments
                          });

                          toast.success('Document added successfully');
                          // Refresh the patient data
                          dispatch(fetchPatient(examineeId));
                          setIsSaving(false);
                        } catch (error) {
                          toast.error('Failed to add document: ' + (error.message || error));
                          setIsSaving(false);
                        }
                      };

                      fileInput.click();
                    }}
                    disabled={isSaving}
                    className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                    title="Add new document"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Add</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            {examineeData.documents && examineeData.documents.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {examineeData.documents.map((doc, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div 
                        className="flex items-start space-x-3 cursor-pointer mb-3"
                        onClick={() => downloadDocument(doc)}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatFileSize(doc.size)}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.type || 'Unknown type'}
                          </p>
                          {doc.uploadDate && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(doc.uploadDate).toLocaleDateString('en-GB')}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <FiDownload className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            viewDocument(doc);
                          }}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                          title="View document"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplaceDocument(index);
                          }}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition-colors disabled:opacity-50"
                          title="Replace document"
                        >
                          <FiEdit3 className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(index);
                          }}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center space-x-1 px-2 py-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded transition-colors disabled:opacity-50"
                          title="Delete document"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FiFile className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No documents uploaded yet</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Evaluation Section */}
        {(examineeData?.evaluationData || examineeData?.diagnosisData || examineeData?.historyData) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl shadow-sm border mb-6"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Evaluation & Clinical Information</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Reasons for Testing */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">Reasons for Testing</h3>
                {renderEvaluationData()}
              </div>

              {/* Diagnoses */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Diagnoses</h3>
                {renderDiagnosisData()}
              </div>

              {/* History */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-3">History Information</h3>
                {renderHistoryData()}
              </div>

              {/* Comment */}
              {examineeData?.comment && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Additional Comments</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{examineeData.comment}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

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

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">{viewingDocument.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(viewingDocument.size)} • {viewingDocument.type || 'Unknown type'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewingDocument(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Content - Based on File Type */}
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center">
              {/* Images */}
              {viewingDocument.type.startsWith('image/') ? (
                <img
                  src={viewingDocument.data}
                  alt={viewingDocument.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : /* PDFs */ viewingDocument.type === 'application/pdf' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFileText className="w-16 h-16 text-red-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">PDF Preview</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    PDF preview is not available. Click the download button to view the file in your PDF reader.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download PDF</span>
                  </motion.button>
                </div>
              ) : /* Excel/Word */ viewingDocument.type.includes('spreadsheet') ||
                viewingDocument.type.includes('document') ||
                viewingDocument.type.includes('word') ||
                viewingDocument.type.includes('excel') ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFile className="w-16 h-16 text-blue-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Document Preview</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    {viewingDocument.type.includes('spreadsheet')
                      ? 'Excel files cannot be previewed here.'
                      : 'Office documents cannot be previewed here.'}
                    <br />
                    Download the file to view in the appropriate application.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              ) : (
                /* Unknown file type */
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiFile className="w-16 h-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Cannot Preview File</p>
                  <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
                    This file type is not supported for preview. Download the file to open it with your system's default application.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      downloadDocument(viewingDocument);
                      setViewingDocument(null);
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span>Download</span>
                  </motion.button>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  downloadDocument(viewingDocument);
                  setViewingDocument(null);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewingDocument(null)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

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
