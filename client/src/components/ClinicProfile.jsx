import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiPhone, FiMail, FiGlobe, FiClock, FiUsers, FiCalendar, FiEdit3, FiStar, FiActivity, FiTrendingUp, FiLoader } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';

const ClinicProfile = ({ clinicId, onBack, onEditClinic }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parseJsonField = (field) => {
    console.log('[ClinicProfile] parseJsonField input:', field, 'type:', typeof field);
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      const parsed = JSON.parse(field);
      console.log('[ClinicProfile] parseJsonField parsed:', parsed);
      return parsed;
    } catch (e) {
      console.log('[ClinicProfile] parseJsonField parse error:', e.message);
      return [];
    }
  };

  // Debug clinic data changes
  useEffect(() => {
    console.log('[ClinicProfile] Clinic data changed:', clinic);
    if (clinic) {
      console.log('[ClinicProfile] Services in clinic object:', clinic.services);
    }
  }, [clinic]);

  // Fetch clinic data based on clinicId
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        setLoading(true);
        const response = await api.getClinic(clinicId);
        if (response.success) {
          const data = response.data;
          console.log('[ClinicProfile] Raw API data:', data);
          console.log('[ClinicProfile] Raw services from API:', data.services);
          // Transform API data to match component structure
          setClinic({
            id: data.id,
            name: data.name || 'Unknown Center',
            initials: data.name ? data.name.substring(0, 2).toUpperCase() : 'UC',
            address: data.address || 'Address not available',
            city: data.city || 'Unknown City',
            state: data.state || 'Unknown State',
            country: data.country || 'India',
            zipCode: data.zip_code || 'N/A',
            phone: data.phone || 'N/A',
            email: data.email || 'N/A',
            website: data.website || '',
            status: data.status || 'inactive',
            established: data.established_date || (data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : 'Unknown'),
            totalDoctors: data.total_therapists || 0,
            totalPatients: data.total_examinees || 0,
            totalAppointments: data.total_sessions || 0,
            specialties: parseJsonField(data.specialties),
            operatingHours: data.operating_hours || 'Not specified',
            emergencyServices: data.emergency_services || false,
            rating: data.rating || 0,
            badgeColor: 'bg-blue-100 text-blue-800',
            description: data.description || 'No description available.',
            facilities: parseJsonField(data.facilities),
            services: parseJsonField(data.services),
            insurance: parseJsonField(data.insurance_accepted),
            languages: parseJsonField(data.languages_supported),
            parkingAvailable: data.parking_available || false,
            wheelchairAccessible: data.wheelchair_accessible || false
          });
        } else {
          setError('Failed to fetch clinic details');
        }
      } catch (err) {
        setError('Error loading clinic data');
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchClinic();
    }
  }, [clinicId]);

  const doctors = [
    {
      id: 'D001',
      name: 'Dr. Matthew Jackson',
      specialty: 'Cardiology',
      experience: '15 years',
      rating: 4.9,
      patients: 45,
      appointments: 120
    },
    {
      id: 'D002',
      name: 'Dr. Sarah Wilson',
      specialty: 'Pediatrics',
      experience: '12 years',
      rating: 4.8,
      patients: 38,
      appointments: 95
    },
    {
      id: 'D003',
      name: 'Dr. Michael Brown',
      specialty: 'General Medicine',
      experience: '20 years',
      rating: 4.7,
      patients: 52,
      appointments: 140
    },
    {
      id: 'D004',
      name: 'Dr. Emily Davis',
      specialty: 'Orthopedics',
      experience: '10 years',
      rating: 4.6,
      patients: 35,
      appointments: 85
    }
  ];

  const recentAppointments = [
    {
      id: 'A001',
      patient: 'John Smith',
      doctor: 'Dr. Matthew Jackson',
      date: '2026-03-03',
      time: '10:00 AM',
      type: 'Consultation',
      status: 'Completed'
    },
    {
      id: 'A002',
      patient: 'Mary Johnson',
      doctor: 'Dr. Sarah Wilson',
      date: '2026-03-03',
      time: '11:30 AM',
      type: 'Check-up',
      status: 'In Progress'
    },
    {
      id: 'A003',
      patient: 'Robert Davis',
      doctor: 'Dr. Michael Brown',
      date: '2026-03-03',
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'Scheduled'
    }
  ];

  const monthlyStats = [
    { month: 'Jan', appointments: 180, revenue: 45000 },
    { month: 'Feb', appointments: 195, revenue: 48750 },
    { month: 'Mar', appointments: 210, revenue: 52500 },
    { month: 'Apr', appointments: 185, revenue: 46250 },
    { month: 'May', appointments: 220, revenue: 55000 },
    { month: 'Jun', appointments: 205, revenue: 51250 }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity }
    // { id: 'doctors', label: 'Doctors', icon: FiUsers },
    // { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    // { id: 'analytics', label: 'Analytics', icon: FiTrendingUp }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading clinic details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !clinic) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Clinic not found'}</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-3 rounded-xl bg-white shadow-lg border hover:bg-gray-50 transition-all"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Center Profile</h1>
              <p className="text-gray-500">View and manage center information</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEditClinic && onEditClinic(clinicId)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg transition-all"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Edit Center</span>
          </motion.button>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">{clinic.initials}</span>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-800">{clinic.name}</h2>
                  <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    clinic.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {clinic.status}
                  </span>
                </div>
                <div className="flex items-center space-x-6 text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{clinic.city}, {clinic.state}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiCalendar className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">Est. {new Date(clinic.established).getFullYear()}</span>
                  </div>
                </div>
                <p className="text-gray-600 max-w-xl leading-relaxed">{clinic.description}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FiPhone className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl">
                <FiMapPin className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-gray-600">{clinic.address}</p>
                  <p className="text-gray-600">{clinic.city}, {clinic.state}, {clinic.country} {clinic.zipCode}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <FiPhone className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Phone</p>
                  <p className="text-gray-600">{clinic.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <FiMail className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Email</p>
                  <p className="text-gray-600">{clinic.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <FiClock className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Operating Hours</p>
                  <p className="text-gray-600">{clinic.operatingHours}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom Services */}
          {clinic.services && clinic.services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FiStar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Custom Services</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {clinic.services.map((service, index) => (
                  <span key={index} className="px-4 py-2 text-sm bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicProfile;