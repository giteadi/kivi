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
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  // Fetch clinic data based on clinicId
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        setLoading(true);
        const response = await api.getClinic(clinicId);
        if (response.success) {
          const data = response.data;
          // Transform API data to match component structure
          setClinic({
            id: data.id,
            name: data.name || 'Unknown Center',
            initials: data.name ? data.name.substring(0, 2).toUpperCase() : 'UC',
            address: data.address || 'Address not available',
            city: data.city || 'Unknown City',
            state: data.state || 'Unknown State',
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
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 rounded-lg bg-white shadow-sm border hover:bg-gray-50"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Center Profile</h1>
              <p className="text-gray-600">Detailed center information and management</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEditClinic && onEditClinic(clinicId)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Edit Center</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Centers</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">{clinic.name}</span>
        </div>

        {/* Clinic Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${clinic.badgeColor}`}>
                <span className="text-2xl font-bold">{clinic.initials}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{clinic.name}</h2>
                  <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                    {clinic.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>{clinic.city}, {clinic.state}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    <span>{clinic.rating} Rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>Est. {new Date(clinic.established).getFullYear()}</span>
                  </div>
                </div>
                <p className="text-gray-600 max-w-2xl">{clinic.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{clinic.totalDoctors}</div>
                <div className="text-sm text-gray-500">Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{clinic.totalPatients}</div>
                <div className="text-sm text-gray-500">Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{clinic.totalAppointments}</div>
                <div className="text-sm text-gray-500">Appointments</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Address</p>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                      <p className="text-sm text-gray-600">{clinic.city}, {clinic.state} {clinic.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiPhone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-sm text-gray-600">{clinic.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-600">{clinic.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiGlobe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Website</p>
                      <p className="text-sm text-blue-600">{clinic.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Operating Hours</p>
                      <p className="text-sm text-gray-600">{clinic.operatingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Specialties & Services */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Specialties & Services</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Medical Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.facilities.map((facility, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Insurance Accepted</p>
                    <div className="flex flex-wrap gap-2">
                      {clinic.insurance.slice(0, 3).map((ins, index) => (
                        <span key={index} className="inline-flex px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-full">
                          {ins}
                        </span>
                      ))}
                      {clinic.insurance.length > 3 && (
                        <span className="inline-flex px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                          +{clinic.insurance.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* {activeTab === 'doctors' && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Medical Staff</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patients
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appointments
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-blue-600">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.specialty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{doctor.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.patients}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.appointments}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Recent Appointments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {appointment.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )} */}

          {/* {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
                <div className="space-y-4">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{stat.month}</p>
                        <p className="text-xs text-gray-500">{stat.appointments} appointments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">₹{stat.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Average Rating</p>
                      <p className="text-2xl font-bold text-blue-600">{clinic.rating}</p>
                    </div>
                    <FiStar className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-900">Patient Satisfaction</p>
                      <p className="text-2xl font-bold text-green-600">94%</p>
                    </div>
                    <FiUsers className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-purple-900">Appointment Rate</p>
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                    </div>
                    <FiCalendar className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </motion.div>
      </div>
    </div>
  );
};

export default ClinicProfile;