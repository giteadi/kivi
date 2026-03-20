import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiFileText, FiActivity, FiClock, FiStar, FiUsers } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const DoctorProfile = ({ doctorId, onBack, onEditProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract numeric ID from doctorId (remove # prefix)
  const numericId = doctorId?.replace('#', '');

  // Fetch doctor data from API
  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!numericId) {
        setError('No doctor ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const result = await api.getDoctor(numericId);

        if (result.success) {
          const therapist = result.data;
          
          // Transform API data to match component format
          const transformedData = {
            id: `#${therapist.id}`,
            name: `${therapist.first_name || ''} ${therapist.last_name || ''}`.trim() || 'Unknown Name',
            initials: `${therapist.first_name?.[0] || ''}${therapist.last_name?.[0] || ''}` || 'N/A',
            email: therapist.email || 'Not specified',
            phone: therapist.phone || 'Not specified',
            clinic: therapist.centre_name || 'Unknown Clinic',
            specialty: therapist.specialty || 'Not specified',
            qualification: therapist.qualification || 'Not specified',
            experience: therapist.experience_years ? `${therapist.experience_years} years` : 'Not specified',
            status: therapist.status === 'active' ? 'Active' : 'Inactive',
            availability: therapist.is_available ? 'Available' : 'Unavailable',
            joinDate: therapist.joining_date ? new Date(therapist.joining_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Not specified',
            dateOfBirth: therapist.date_of_birth ? new Date(therapist.date_of_birth).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Not specified',
            age: therapist.date_of_birth ? 
              `${Math.floor((new Date() - new Date(therapist.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))} years` : 
              'Not specified',
            gender: therapist.gender || 'Not specified',
            address: therapist.address || 'Not specified',
            licenseNumber: therapist.license_number || 'Not specified',
            rating: therapist.rating || 4.5,
            totalPatients: therapist.total_sessions || 0,
            todayAppointments: therapist.today_appointments || 0,
            workingHours: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`,
            consultationFee: therapist.session_fee ? `₹${therapist.session_fee}` : 'Not specified',
            emergencyContact: {
              name: therapist.emergency_contact_name || 'Not specified',
              relation: 'Not specified',
              phone: therapist.emergency_contact_phone || 'Not specified'
            },
            // Mock data for appointments, patients, and schedule (can be enhanced later)
            appointments: [],
            patients: [],
            schedule: [
              { day: 'Monday', time: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`, status: therapist.is_available ? 'Available' : 'Unavailable' },
              { day: 'Tuesday', time: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`, status: therapist.is_available ? 'Available' : 'Unavailable' },
              { day: 'Wednesday', time: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`, status: therapist.is_available ? 'Available' : 'Unavailable' },
              { day: 'Thursday', time: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`, status: therapist.is_available ? 'Available' : 'Unavailable' },
              { day: 'Friday', time: `${therapist.login_time || '09:00'} - ${therapist.logout_time || '18:00'}`, status: therapist.is_available ? 'Available' : 'Unavailable' },
              { day: 'Saturday', time: 'Off', status: 'Unavailable' },
              { day: 'Sunday', time: 'Off', status: 'Unavailable' }
            ]
          };

          setDoctorData(transformedData);
        } else {
          setError(result.message || 'Failed to load doctor data');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError('Error loading doctor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [numericId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'patients', label: 'Patients', icon: FiUsers },
    { id: 'schedule', label: 'Schedule', icon: FiClock }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'available':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Professional Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Specialty</label>
                  <p className="text-sm text-gray-800">{doctorData.specialty}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Qualification</label>
                  <p className="text-sm text-gray-800">{doctorData.qualification}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-sm text-gray-800">{doctorData.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">License Number</label>
                  <p className="text-sm text-gray-800">{doctorData.licenseNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-sm text-gray-800">{doctorData.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Consultation Fee</label>
                  <p className="text-sm text-gray-800">{doctorData.consultationFee}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-sm text-gray-800">{doctorData.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-sm text-gray-800">{doctorData.age}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-sm text-gray-800">{doctorData.gender}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{doctorData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{doctorData.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-sm text-gray-800">{doctorData.address}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm text-gray-800">{doctorData.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Relation</label>
                  <p className="text-sm text-gray-800">{doctorData.emergencyContact.relation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-800">{doctorData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctorData.appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.patient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.duration}
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
        );

      case 'patients':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctorData.patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.condition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctorData.schedule.map((schedule, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {schedule.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {schedule.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
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
              <p className="text-gray-600">Loading doctor profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <FiUser className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-lg font-medium text-gray-800 mb-2">Error Loading Profile</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!isLoading && !error && doctorData && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5 text-blue-600" />
                </motion.button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">Doctor Profile</h1>
                  <p className="text-gray-600">Complete doctor information and schedule</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEditProfile && onEditProfile(doctorId)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiEdit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Home</span>
              <span className="mx-2">›</span>
              <span>Doctors</span>
              <span className="mx-2">›</span>
              <span className="text-gray-800">Doctor Profile</span>
            </div>

            {/* Doctor Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border mb-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">{doctorData.initials}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{doctorData.name}</h2>
                      <p className="text-gray-600">Doctor ID: {doctorData.id}</p>
                      <p className="text-gray-600">{doctorData.specialty} • {doctorData.clinic}</p>
                    </div>
                    
                    <div className="flex flex-col lg:items-end space-y-2 mt-4 lg:mt-0">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(doctorData.status)}`}>
                          {doctorData.status}
                        </span>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(doctorData.availability)}`}>
                          {doctorData.availability}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiUsers className="w-4 h-4" />
                          <span>{doctorData.totalPatients} Patients</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          <span>{doctorData.rating} Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
              {renderTabContent()}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;