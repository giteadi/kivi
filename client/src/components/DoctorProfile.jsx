import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiFileText, FiActivity, FiClock, FiStar, FiUsers } from 'react-icons/fi';
import { useState } from 'react';

const DoctorProfile = ({ doctorId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock doctor data - in real app this would come from API based on doctorId
  const doctorData = {
    id: '#9424',
    name: 'Dr. Kjaggi',
    initials: 'DK',
    email: 'dr.kjaggi@clinic.com',
    phone: '+1 6530 66',
    clinic: 'Clinic Kjaggi',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD',
    experience: '15 years',
    status: 'Active',
    availability: 'Available',
    joinDate: 'January 15, 2020',
    dateOfBirth: 'March 10, 1975',
    age: '49 years',
    gender: 'Male',
    address: '456 Medical Plaza, New York, NY 10002',
    licenseNumber: 'MD123456789',
    rating: 4.8,
    totalPatients: 245,
    todayAppointments: 8,
    workingHours: '9:00 AM - 6:00 PM',
    consultationFee: '₹500',
    emergencyContact: {
      name: 'Dr. Sarah Kjaggi',
      relation: 'Spouse',
      phone: '+1 6530 67'
    },
    appointments: [
      {
        id: 1,
        date: 'March 3, 2026',
        time: '9:00 AM',
        patient: 'Thomas Thompson',
        type: 'Follow Up Visit',
        status: 'Scheduled',
        duration: '30 min'
      },
      {
        id: 2,
        date: 'March 3, 2026',
        time: '10:00 AM',
        patient: 'Sarah Johnson',
        type: 'Initial Consultation',
        status: 'Scheduled',
        duration: '45 min'
      },
      {
        id: 3,
        date: 'March 2, 2026',
        time: '2:30 PM',
        patient: 'Mike Wilson',
        type: 'Follow Up Visit',
        status: 'Completed',
        duration: '30 min'
      }
    ],
    patients: [
      {
        id: 1,
        name: 'Thomas Thompson',
        lastVisit: 'February 20, 2026',
        condition: 'Diabetes Management',
        status: 'Active Treatment'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        lastVisit: 'February 18, 2026',
        condition: 'Hypertension',
        status: 'Regular Checkup'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        lastVisit: 'March 2, 2026',
        condition: 'General Health',
        status: 'Healthy'
      }
    ],
    schedule: [
      { day: 'Monday', time: '9:00 AM - 6:00 PM', status: 'Available' },
      { day: 'Tuesday', time: '9:00 AM - 6:00 PM', status: 'Available' },
      { day: 'Wednesday', time: '9:00 AM - 6:00 PM', status: 'Available' },
      { day: 'Thursday', time: '9:00 AM - 6:00 PM', status: 'Available' },
      { day: 'Friday', time: '9:00 AM - 6:00 PM', status: 'Available' },
      { day: 'Saturday', time: '9:00 AM - 2:00 PM', status: 'Available' },
      { day: 'Sunday', time: 'Off', status: 'Unavailable' }
    ]
  };

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
      </div>
    </div>
  );
};

export default DoctorProfile;