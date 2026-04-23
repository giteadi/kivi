import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave, FiX, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiUsers } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import LocationSelector from './LocationSelector';

const ClinicEditForm = ({ clinicId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    status: 'active',
    established: '',
    operatingHours: '',
    description: '',
    specialties: [],
    facilities: [],
    services: [],
    insurance: [],
    languages: []
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [servicesInput, setServicesInput] = useState('');

  // Fetch clinic data when component mounts or clinicId changes
  useEffect(() => {
    const fetchClinicData = async () => {
      if (!clinicId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.getClinic(clinicId);
        if (response.success && response.data) {
          const data = response.data;
          // Map database fields (snake_case) to form fields (camelCase)
          setFormData({
            name: data.name || '',
            country: data.country || 'India',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zip_code || '',
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            status: data.status || 'active',
            established: data.established_date
              ? new Date(data.established_date).toISOString().split('T')[0]
              : '',
            operatingHours: data.operating_hours || '',
            description: data.description || '',
            specialties: parseJsonField(data.specialties),
            facilities: parseJsonField(data.facilities),
            services: parseJsonField(data.services),
            insurance: parseJsonField(data.insurance_accepted),
            languages: parseJsonField(data.languages_supported)
          });
          setServicesInput(parseJsonField(data.services).join(', '));
        }
      } catch (error) {
        console.error('Error fetching clinic data:', error);
        alert('Failed to load clinic data');
      } finally {
        setLoading(false);
      }
    };

    fetchClinicData();
  }, [clinicId]);

  // Helper function to parse JSON fields from database
  const parseJsonField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  const handleInputChange = (field, value) => {
    console.log('[ClinicEditForm] handleInputChange:', { field, value });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    console.log('[ClinicEditForm] validateForm called with formData:', formData);
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Clinic name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    console.log('[ClinicEditForm] validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[ClinicEditForm] handleSubmit called');
    console.log('[ClinicEditForm] formData before save:', formData);
    
    // Update services from input before submit
    const servicesArray = servicesInput.split(',').map(s => s.trim()).filter(s => s);
    console.log('[ClinicEditForm] SERVICES INPUT:', servicesInput);
    console.log('[ClinicEditForm] SERVICES ARRAY:', servicesArray);
    
    if (validateForm()) {
      console.log('[ClinicEditForm] validation passed, calling onSave');
      const payload = {
        name: formData.name,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        status: formData.status,
        description: formData.description,
        operating_hours: formData.operatingHours,
        specialties: JSON.stringify(formData.specialties),
        facilities: JSON.stringify(formData.facilities),
        services: servicesArray,
        insurance_accepted: formData.insurance,
        languages_supported: formData.languages,
        established_date: formData.established
          ? formData.established.split('T')[0]
          : null
      };
      console.log('[ClinicEditForm] payload:', payload);
      onSave(payload);
    } else {
      console.log('[ClinicEditForm] validation failed');
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
      <div className="p-4 lg:p-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading clinic data...</span>
          </div>
        )}
        {!loading && (
        <>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="p-2 rounded-lg bg-white dark:bg-[#1c1c1e] shadow-sm dark:shadow-black/20 border dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Edit Center</h1>
              <p className="text-gray-600 dark:text-gray-400">Update center information and settings</p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Centres</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-gray-300">Edit Center</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Center Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e]'
                  } transition-colors duration-300`}
                  placeholder="Enter center name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="Enter center description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Services
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="Enter custom services separated by commas (e.g., Speech Therapy, Occupational Therapy)"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                    errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e]'
                  } transition-colors duration-300`}
                  placeholder="Enter full address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="md:col-span-2">
                <LocationSelector
                  value={{
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    zip_code: formData.zipCode,
                  }}
                  onChange={(loc) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      country: loc.country,
                      state: loc.state,
                      city: loc.city,
                      zipCode: loc.zip_code
                    }));
                    setErrors(prev => ({ ...prev, country: '', state: '', city: '', zipCode: '' }));
                  }}
                  errors={errors}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e]'
                  } transition-colors duration-300`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e]'
                  } transition-colors duration-300`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
          </motion.div>

          {/* Operating Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Operating Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Established Date
                </label>
                <input
                  type="date"
                  value={formData.established}
                  onChange={(e) => handleInputChange('established', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Operating Hours
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Opening Time</label>
                    <input
                      type="time"
                      value={formData.openingTime || ''}
                      onChange={(e) => {
                        handleInputChange('openingTime', e.target.value);
                        // Auto-update operatingHours format
                        const closing = formData.closingTime || '20:00';
                        const opening = e.target.value || '09:00';
                        const formatTime = (t) => {
                          const [h, m] = t.split(':');
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const hour12 = hour % 12 || 12;
                          return `${hour12}:${m} ${ampm}`;
                        };
                        handleInputChange('operatingHours', `${formatTime(opening)} - ${formatTime(closing)}`);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Closing Time</label>
                    <input
                      type="time"
                      value={formData.closingTime || ''}
                      onChange={(e) => {
                        handleInputChange('closingTime', e.target.value);
                        // Auto-update operatingHours format
                        const opening = formData.openingTime || '09:00';
                        const closing = e.target.value || '20:00';
                        const formatTime = (t) => {
                          const [h, m] = t.split(':');
                          const hour = parseInt(h);
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          const hour12 = hour % 12 || 12;
                          return `${hour12}:${m} ${ampm}`;
                        };
                        handleInputChange('operatingHours', `${formatTime(opening)} - ${formatTime(closing)}`);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Example: 9:00 AM to 8:00 PM</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-end space-x-4 pt-6"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
            >
              <FiX className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiSave className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          </motion.div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default ClinicEditForm;