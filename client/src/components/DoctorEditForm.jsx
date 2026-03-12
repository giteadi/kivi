import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiAward, FiDollarSign, FiEye, FiEyeOff } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Utility function to format date for HTML input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const DoctorEditForm = ({ doctorId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    clinic: '',
    specialty: '',
    qualification: '',
    experience: '',
    status: 'Active',
    availability: 'Available',
    joinDate: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    licenseNumber: '',
    consultationFee: '',
    workingHours: '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    specializations: '',
    certifications: '',
    languages: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);

  const clinics = ['Clinic Kjaggi', 'Green Valley Clinic', 'Sunrise Health Center', 'Downtown Family Clinic'];
  const specialties = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Neurology', 'Psychiatry'];
  const statuses = ['Active', 'On Leave', 'Inactive'];
  const availabilities = ['Available', 'Busy', 'Unavailable'];
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

  // Fetch therapist data when component mounts
  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        // Extract numeric ID from doctorId (remove # prefix)
        const numericId = doctorId?.replace('#', '');
        
        const response = await fetch(`/api/therapists/${numericId}`);
        const result = await response.json();

        if (result.success) {
          const therapist = result.data;
          setFormData({
            id: therapist.id,
            name: `${therapist.first_name} ${therapist.last_name}`,
            email: therapist.email,
            phone: therapist.phone,
            password: therapist.password || '', // Show current password from database
            clinic: therapist.centre_name || '',
            specialty: therapist.specialty,
            qualification: therapist.qualification,
            experience: therapist.experience_years || '',
            status: therapist.status === 'active' ? 'Active' : 'Inactive',
            availability: 'Available',
            joinDate: formatDateForInput(therapist.joining_date),
            dateOfBirth: formatDateForInput(therapist.date_of_birth),
            gender: therapist.gender,
            address: therapist.address,
            licenseNumber: therapist.license_number,
            consultationFee: therapist.session_fee || '',
            workingHours: '9:00 AM - 6:00 PM', // Default, could be enhanced
            emergencyContactName: therapist.emergency_contact_name,
            emergencyContactRelation: '',
            emergencyContactPhone: therapist.emergency_contact_phone,
            specializations: therapist.bio || '',
            certifications: '',
            languages: ''
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
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.consultationFee.trim()) newErrors.consultationFee = 'Consultation fee is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
    
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
        first_name: formData.name.split(' ')[0] || '',
        last_name: formData.name.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        qualification: formData.qualification,
        license_number: formData.licenseNumber,
        experience_years: parseInt(formData.experience) || 0,
        session_fee: parseFloat(formData.consultationFee) || 0,
        bio: formData.specializations,
        date_of_birth: formatDateForInput(formData.dateOfBirth),
        gender: formData.gender,
        address: formData.address,
        emergency_contact_name: formData.emergencyContactName,
        emergency_contact_phone: formData.emergencyContactPhone,
        status: formData.status.toLowerCase()
      };

      // Track if password is being updated
      const isPasswordUpdate = formData.password.trim().length > 0;
      
      // Only include password if it was provided (for admin to update)
      if (isPasswordUpdate) {
        therapistData.password = formData.password;
      }

      const response = await fetch(`/api/therapists/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapistData),
      });

      const result = await response.json();

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
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
                  Specialty
                </label>
                <select
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
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
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.licenseNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Medical license number"
                />
                {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.consultationFee ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Consultation fee"
                />
                {errors.consultationFee && <p className="mt-1 text-sm text-red-600">{errors.consultationFee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Languages spoken (comma separated)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                <textarea
                  value={formData.specializations}
                  onChange={(e) => handleInputChange('specializations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Areas of specialization (comma separated)"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </label>
                <textarea
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="Professional certifications (comma separated)"
                />
              </div>
            </div>
          </motion.div>

          {/* Employment Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiDollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Employment Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Clinic
                </label>
                <select
                  value={formData.clinic}
                  onChange={(e) => handleInputChange('clinic', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {clinics.map(clinic => (
                    <option key={clinic} value={clinic}>{clinic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange('joinDate', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {availabilities.map(availability => (
                    <option key={availability} value={availability}>{availability}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center space-x-2 mb-6">
              <FiMapPin className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.emergencyContactName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Emergency contact name"
                />
                {errors.emergencyContactName && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relation
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Relation to doctor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.emergencyContactPhone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Emergency contact phone"
                />
                {errors.emergencyContactPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone}</p>}
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