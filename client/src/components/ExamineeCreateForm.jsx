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
  FiPhone
} from 'react-icons/fi';
import { useSelector } from 'react-redux';
import api from '../services/api';
import Sidebar from './Sidebar';

const ExamineeCreateForm = ({ onSave, onCancel, activeItem = 'patients', setActiveItem }) => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('demographics');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState({ years: 0, months: 0 });
  
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
  const [expandedDiagnoses, setExpandedDiagnoses] = useState({
    autismSpectrum: true,
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

  // State for History sub-tabs
  const [historySubTab, setHistorySubTab] = useState('referral');

  // State for History Other fields
  const [historyOtherData, setHistoryOtherData] = useState({
    birthInformationOther: false,
    birthInformationOtherText: '',
    developmentalMilestonesOther: false,
    developmentalMilestonesOtherText: ''
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
    if (!validateForm()) return;
    
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
        status: 'active'
      };

      const response = await api.request('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const result = await response.json();

      if (result.success) {
        onSave && onSave(result.data);
      } else {
        setErrors({ submit: result.message || 'Failed to create examinee' });
      }
    } catch (error) {
      console.error('Error creating examinee:', error);
      setErrors({ submit: 'An error occurred while creating the examinee' });
    } finally {
      setIsSaving(false);
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
                <h1 className="text-xl font-semibold text-gray-900">New Examinee</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
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
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Maths
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Writing
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.academicConcerns.other}
                          onChange={(e) => handleOtherChange('academicConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.academicConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.academicConcerns.otherText}
                          onChange={(e) => handleOtherTextChange('academicConcerns', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Reading
                      </label>
                    </div>

                    {/* Cognitive Evaluation */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Cognitive Evaluation:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Intellectual Disability
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Gifted and Talented
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.cognitiveEvaluation.other}
                          onChange={(e) => handleOtherChange('cognitiveEvaluation', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.cognitiveEvaluation.other && (
                        <input
                          type="text"
                          value={evaluationData.cognitiveEvaluation.otherText}
                          onChange={(e) => handleOtherTextChange('cognitiveEvaluation', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Traumatic Brain Injury
                      </label>
                    </div>

                    {/* Behaviour Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Behaviour Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Aggression
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Attention/Hyperactivity
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.behaviourConcerns.other}
                          onChange={(e) => handleOtherChange('behaviourConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.behaviourConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.behaviourConcerns.otherText}
                          onChange={(e) => handleOtherTextChange('behaviourConcerns', e.target.value)}
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
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Anxiety
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Depression
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.mentalHealth.other}
                          onChange={(e) => handleOtherChange('mentalHealth', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.mentalHealth.other && (
                        <input
                          type="text"
                          value={evaluationData.mentalHealth.otherText}
                          onChange={(e) => handleOtherTextChange('mentalHealth', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Developmental Delay */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Developmental Delay:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Motor
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Physical/Growth
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.developmentalDelay.other}
                          onChange={(e) => handleOtherChange('developmentalDelay', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.developmentalDelay.other && (
                        <input
                          type="text"
                          value={evaluationData.developmentalDelay.otherText}
                          onChange={(e) => handleOtherTextChange('developmentalDelay', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
                    </div>

                    {/* Language Concerns */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-500 uppercase">Language Concerns:</h4>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Receptive
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Expressive
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.languageConcerns.other}
                          onChange={(e) => handleOtherChange('languageConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.languageConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.languageConcerns.otherText}
                          onChange={(e) => handleOtherTextChange('languageConcerns', e.target.value)}
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
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Articulation
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Fluency
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.speechConcerns.other}
                          onChange={(e) => handleOtherChange('speechConcerns', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.speechConcerns.other && (
                        <input
                          type="text"
                          value={evaluationData.speechConcerns.otherText}
                          onChange={(e) => handleOtherTextChange('speechConcerns', e.target.value)}
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
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Motor Functioning
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
                        General or Not Specific
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Illegal Drugs
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
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" className="rounded border-gray-300" />
                        Prescription Drugs
                      </label>
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
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={evaluationData.employment.other}
                          onChange={(e) => handleOtherChange('employment', e.target.checked)}
                        />
                        Other
                      </label>
                      {evaluationData.employment.other && (
                        <input
                          type="text"
                          value={evaluationData.employment.otherText}
                          onChange={(e) => handleOtherTextChange('employment', e.target.value)}
                          placeholder="Please specify..."
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ml-6"
                        />
                      )}
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Asperger's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Autistic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Childhood Disintegrative Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Pervasive Developmental Delay/Disability
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Rett's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Attention Deficit/Hyperactivity Disorder (any type)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Conduct Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Disruptive Behavior Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Emotional Disturbance
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Intermittent Explosive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Kleptomania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Oppositional Defiant Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Pathological Gambling
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Pyromania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Trichotillomania
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Borderline Intellectual Functioning
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Cognitive Developmental Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Intellectual Disability Mild (formerly called Mild Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Intellectual Disability Moderate (formerly called Moderate Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Intellectual Disability Profound (formerly called Profound Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Intellectual Disability Severe (formerly called Severe Mental Retardation)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Gifted and Talented
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Expressive Language Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Language Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Mixed Receptive/Expressive Language Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Phonological Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Learning Disability in Reading/Reading Disorder/Dyslexia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Learning Disability in Mathematics/Mathematics Disorder/Dyscalculia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Learning Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Learning Disability in Writing/Disorder of Written Expression/Orthographic Impairment
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Nonverbal Learning Disability
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Acute Stress Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Agoraphobia without a History of Panic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Anorexia Nervosa
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Bipolar Disorder (I, II, & NOS)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Bulimia Nervosa
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Conversion Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Cyclothymic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Depressive/Mood Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dysthymic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Generalized Anxiety Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Major Depressive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Obsessive Compulsive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Pain Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Panic Disorder Without Agoraphobia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Posttraumatic Stress Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Separation Anxiety Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Social Phobia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Somatization Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Specific Phobia (Animals, Objects, Etc.)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Developmental Coordination Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dyspraxia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Motor Delay
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Paraplegia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Quadriplegia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Stereotypic Movement Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Antisocial Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Avoidant Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Borderline Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dependent Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Histrionic Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Narcissistic Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Obsessive Compulsive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Obsessive Compulsive Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Paranoid Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizoid Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizotypal Personality Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Brief Psychotic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Delusional Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizoaffective Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophrenia - Catatonic Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophrenia - Disorganized Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophrenia - Paranoid Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophrenia - Residual Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophrenia - Undifferentiated Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Schizophreniform Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Apraxia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Articulation Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Broca's Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Central Auditory Processing Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dysarthria
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Fluency Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Receptive Aphasia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Voice Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Substance Abuse */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('substanceAbuseDiag')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.substanceAbuseDiag ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Substance Abuse</span>
                    </button>
                    {expandedDiagnoses.substanceAbuseDiag && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Alcohol Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Alcohol Dependence Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Polysubstance Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Polysubstance Dependence Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Substance Abuse Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Substance Dependence Disorder (Alcohol, drugs, or inhalants)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                          <input type="checkbox" className="rounded border-gray-300" />
                          Traumatic Brain Injury
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Traumatic Brain Injury - Mild Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Traumatic Brain Injury - Moderate Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Traumatic Brain Injury - Severe Severity
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Other */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleDiagnosisCategory('otherDiag')}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                      <span className="text-sm font-medium">{expandedDiagnoses.otherDiag ? '⊟' : '⊞'}</span>
                      <span className="font-medium text-sm">Other</span>
                    </button>
                    {expandedDiagnoses.otherDiag && (
                      <div className="px-4 py-2 pl-10 space-y-1">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Adjustment Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Cognitive Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Creutzfeldt-Jakob Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dementia of the Alzheimer's Type
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Depersonalization Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Dissociative Identity Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Epilepsy, Not Specified
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Factitious Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Gender Identity Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Huntington's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Left Cerebral Vascular Accident (Stroke)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Left Temporal Lobe Epilepsy
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Mild Cognitive Impairment
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Parkinson's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Pick's Disease
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Primary Insomnia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Right Cerebral Vascular Accident (Stroke)
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Right Temporal Lobe Epilepsy
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Seizure Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Stroke, Not Specified
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Tic Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Tourette's Disorder
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Vascular Dementia
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                          <input type="checkbox" className="rounded border-gray-300" />
                          Other
                        </label>
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
                  <div className="border rounded-lg overflow-hidden">
                    <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                      <span className="text-xs font-medium">⊞</span>
                      <span className="font-medium text-xs">Sample Report Sentence</span>
                    </button>
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
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Role of the Referral Source:</label>
                            <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                              <option value="">Please Select...</option>
                              <option value="teacher">Teacher</option>
                              <option value="parent">Parent</option>
                              <option value="physician">Physician</option>
                              <option value="psychologist">Psychologist</option>
                              <option value="therapist">Therapist</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Referral Reason(s) */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-blue-800">Referral Reason(s)</h3>
                          
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              School Related Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Speech Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Language Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Social/Emotional Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Cognitive Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Physical Concerns
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-700">
                              <input type="checkbox" className="rounded border-gray-300" />
                              Vocational/Rehabilitation/Legal Issues
                            </label>
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
                            <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
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
                            <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                              <option value="">Please Select...</option>
                              <option value="parent">Parent</option>
                              <option value="guardian">Guardian</option>
                              <option value="self">Self</option>
                              <option value="records">Medical records</option>
                              <option value="other">Other</option>
                            </select>
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
                      {/* Education Content */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Educational History According to:</label>
                          <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option value="">Please Select...</option>
                            <option value="parent">Parent</option>
                            <option value="guardian">Guardian</option>
                            <option value="self">Self</option>
                            <option value="school">School Records</option>
                            <option value="other">Other</option>
                          </select>
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
                              <label className="block text-xs text-gray-600">Father:</label>
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
                              <select className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white">
                                <option value="">Please Select...</option>
                                <option value="regular">Regular</option>
                                <option value="gifted">Gifted/Talented</option>
                                <option value="special">Special Education</option>
                                <option value="remedial">Remedial</option>
                                <option value="other">Other</option>
                              </select>
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
                          
                          {/* Sample Report Sentence */}
                          <div className="border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                              <span className="text-xs font-medium">⊞</span>
                              <span className="font-medium text-xs">Sample Report Sentence</span>
                            </button>
                          </div>

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
                          
                          {/* Sample Report Sentence */}
                          <div className="border rounded-lg overflow-hidden">
                            <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                              <span className="text-xs font-medium">⊞</span>
                              <span className="font-medium text-xs">Sample Report Sentence</span>
                            </button>
                          </div>

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
                      {/* Health Content */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Health History According to:</label>
                          <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option value="">Please Select...</option>
                            <option value="parent">Parent</option>
                            <option value="guardian">Guardian</option>
                            <option value="self">Self</option>
                            <option value="records">Medical Records</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* Vision and Hearing Conditions */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-blue-800">Vision and Hearing Conditions</h3>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Vision */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <label className="block text-xs text-gray-600">Date of Vision Screening:</label>
                                <input type="text" className="w-24 px-2 py-1 text-xs border border-gray-300 rounded" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Results of Vision Screening:</label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  normal visual acuity
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  normal visual acuity with the aid of corrective lenses
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  a need for follow-up vision screening
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  a need for a complete vision examination
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  other
                                </label>
                              </div>
                            </div>

                            {/* Hearing */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <label className="block text-xs text-gray-600">Date of Hearing Screening:</label>
                                <input type="text" className="w-24 px-2 py-1 text-xs border border-gray-300 rounded" />
                              </div>
                              <div className="space-y-1">
                                <label className="block text-xs text-gray-600">Results of Hearing Screening:</label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  within normal limits
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  within normal limits when aided
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  needs a referral to assess the functioning of the inner ear
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  a need for a follow-up hearing screening
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  further assessment needed; refer to audiologist
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-700">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  other
                                </label>
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
                      {/* Employment Content */}
                      <div className="space-y-6">
                        {/* Sample Report Sentence */}
                        <div className="border rounded-lg overflow-hidden">
                          <button className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left">
                            <span className="text-xs font-medium">⊞</span>
                            <span className="font-medium text-xs">Sample Report Sentence</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Current Employment */}
                          <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-blue-800">Current Employment</h3>
                            
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