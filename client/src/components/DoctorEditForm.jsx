import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiAward, FiDollarSign, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

// Utility function to format date for HTML input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const DoctorEditForm = ({ doctorId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    centre: '',
    centreId: '',
    specialty: '',
    qualification: '',
    experience: '',
    status: 'Active',
    joiningDate: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    loginTime: '09:00',
    logoutTime: '18:00',
    isAvailable: true,
    emergencyContactName: '',
    emergencyContactPhone: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);

  const specialties = [
    'Learning Therapy',
    'Behavioral Therapy',
    'Speech Therapy',
    'Occupational Therapy',
    'Educational Psychology',
    'Special Needs Support',
    'Child Development',
    'Family Counseling'
  ];
  const statuses = ['Active', 'On Leave', 'Inactive'];
  const genders = ['Male', 'Female', 'Other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Fetch centres from database
  useEffect(() => {
    const fetchCentres = async () => {
      setLoadingCentres(true);
      try {
        const response = await api.request('/centres', {
          method: 'GET'
        });
        if (response.success && response.data) {
          setCentres(response.data);
        }
      } catch (error) {
        console.error('Error fetching centres:', error);
      } finally {
        setLoadingCentres(false);
      }
    };
    fetchCentres();
  }, []);

  // Fetch therapist data when component mounts
  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        const numericId = typeof doctorId === 'string' ? doctorId.replace('#', '') : doctorId;
        const result = await api.getDoctor(numericId);

        if (result.success) {
          const therapist = result.data;
          setFormData({
            id: therapist.id,
            firstName: therapist.first_name || '',
            lastName: therapist.last_name || '',
            email: therapist.email,
            phone: therapist.phone,
            password: '',
            centre: therapist.centre_name || '',
            centreId: therapist.centre_id || '',
            specialty: therapist.specialty,
            qualification: therapist.qualification,
            experience: therapist.experience_years || '',
            status: therapist.status === 'active' ? 'Active' : 'Inactive',
            joiningDate: formatDateForInput(therapist.joining_date),
            dateOfBirth: formatDateForInput(therapist.date_of_birth),
            gender: therapist.gender,
            address: therapist.address,
            city: therapist.city || '',
            state: therapist.state || '',
            zipCode: therapist.zip_code || '',
            licenseNumber: therapist.license_number,
            loginTime: therapist.login_time ? therapist.login_time.substring(0, 5) : '09:00',
            logoutTime: therapist.logout_time ? therapist.logout_time.substring(0, 5) : '18:00',
            isAvailable: therapist.is_available !== false,
            emergencyContactName: therapist.emergency_contact_name,
            emergencyContactPhone: therapist.emergency_contact_phone,
            bio: therapist.bio || ''
          });
        } else {
          toast.error('Failed to load therapist data');
        }
      } catch (error) {
        console.error('Error fetching therapist data:', error);
        toast.error('Error loading therapist data');
      } finally {
        setIsLoading(false);
      }
    };

    if (doctorId) {
      fetchTherapistData();
    }
  }, [doctorId]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.centre.trim()) newErrors.centre = 'Center is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Fee validation
    if (formData.consultationFee && isNaN(formData.consultationFee)) {
      newErrors.consultationFee = 'Consultation fee must be a number';
    }
    
    // Password validation (only if provided)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setUpdateSuccess(false);
    setPasswordUpdated(false);
    
    try {
      // Prepare therapist data for API
      const therapistData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        qualification: formData.qualification,
        license_number: formData.licenseNumber,
        experience_years: parseInt(formData.experience) || 0,
        bio: formData.bio,
        date_of_birth: formatDateForInput(formData.dateOfBirth),
        gender: formData.gender,
        address: formData.address,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        joining_date: formatDateForInput(formData.joiningDate),
        status: formData.status.toLowerCase()
      };

      // Track if password is being updated
      const isPasswordUpdate = formData.password.trim().length > 0;
      
      // Only include password if it was provided (for admin to update)
      if (isPasswordUpdate) {
        therapistData.password = formData.password;
      }

      // Add availability data
      therapistData.login_time = formData.loginTime + ':00';
      therapistData.logout_time = formData.logoutTime + ':00';
      therapistData.is_available = formData.isAvailable;
      therapistData.city = formData.city;
      therapistData.state = formData.state;
      therapistData.zip_code = formData.zipCode;

      const result = await api.updateDoctor(formData.id, therapistData);

      if (result.success) {
        setUpdateSuccess(true);
        if (isPasswordUpdate) {
          setPasswordUpdated(true);
        }
        
        // Keep password field for admin visibility (don't clear it)
        // setFormData(prev => ({ ...prev, password: '' }));
        
        // Show success toast
        toast.success(`Therapist updated successfully!${isPasswordUpdate ? ' Password has been changed.' : ''}`);
        
        onSave({ ...formData, id: doctorId });
      } else {
        toast.error(`Failed to update therapist: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating therapist:', error);
      toast.error('Failed to update therapist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading therapist data...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">Edit Therapist</h1>
                  <p className="text-gray-600">Update therapist information and professional details</p>
                </div>
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Home</span>
              <span className="mx-2">›</span>
              <span>Therapists</span>
              <span className="mx-2">›</span>
              <span className="text-gray-800">Edit Therapist</span>
            </div>

          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiUser className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full address"
                />
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
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiPhone className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                  {passwordUpdated && (
                    <span className="ml-2 text-xs text-green-600 font-medium">
                      ✓ Updated
                    </span>
                  )}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500 bg-red-50' : 
                      passwordUpdated ? 'border-green-500 bg-green-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password (leave empty to keep current)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leave empty to keep current password
                  {passwordUpdated && (
                    <span className="ml-1 text-green-600">• Password successfully updated</span>
                  )}
                </p>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>
          </motion.div>
          {/* Professional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiAward className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Professional Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.specialty ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                {errors.specialty && <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.qualification ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="e.g., MBBS, MD"
                />
                {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Years of experience"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter license number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Center <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.centre}
                  onChange={(e) => handleInputChange('centre', e.target.value)}
                  disabled={loadingCentres}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.centre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loadingCentres ? 'bg-gray-100' : ''}`}
                >
                  <option value="">{loadingCentres ? 'Loading centers...' : 'Select center'}</option>
                  {centres.map((centre) => (
                    <option key={centre.id} value={centre.name || centre.centre_name}>
                      {centre.name || centre.centre_name}
                    </option>
                  ))}
                </select>
                {errors.centre && <p className="mt-1 text-sm text-red-600">{errors.centre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Joining Date
                </label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Availability Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiAward className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Availability Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login Time
                </label>
                <input
                  type="time"
                  value={formData.loginTime}
                  onChange={(e) => handleInputChange('loginTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logout Time
                </label>
                <input
                  type="time"
                  value={formData.logoutTime}
                  onChange={(e) => handleInputChange('logoutTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability Status
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={formData.isAvailable}
                      onChange={() => handleInputChange('isAvailable', true)}
                      className="mr-2"
                    />
                    <span className="text-sm">Available</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="availability"
                      checked={!formData.isAvailable}
                      onChange={() => handleInputChange('isAvailable', false)}
                      className="mr-2"
                    />
                    <span className="text-sm">Unavailable</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>


          {/* Emergency Contact & Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiMapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Emergency Contact & Bio</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter therapist bio and background..."
                />
              </div>
            </div>
          </motion.div>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorEditForm;