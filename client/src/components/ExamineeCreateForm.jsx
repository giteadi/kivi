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
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        student_id: formData.examineeId,
        gender: formData.gender.toLowerCase(),
        date_of_birth: formData.birthDate,
        email: formData.email,
        comment: formData.comment,
        centre_name: formData.account,
        custom_field_1: formData.center1,
        custom_field_2: formData.center2,
        custom_field_3: formData.center3,
        custom_field_4: formData.center4,
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
                <span className="text-xs text-red-500">* Required</span>
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
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Evaluation</h3>
                  <p className="text-gray-500">Evaluation features coming soon</p>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUser className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">History</h3>
                  <p className="text-gray-500">History features coming soon</p>
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