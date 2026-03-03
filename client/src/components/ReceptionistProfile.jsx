import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMapPin, FiCalendar, FiUser, FiClock, FiDollarSign, FiAward } from 'react-icons/fi';
import { useState } from 'react';

const ReceptionistProfile = ({ receptionistId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock receptionist data
  const receptionistData = {
    id: '#R001',
    name: 'Sarah Johnson',
    initials: 'SJ',
    email: 'sarah.johnson@clinic.com',
    phone: '+1 5551234567',
    clinic: 'Clinic Kjaggi',
    shift: 'Morning',
    shiftTime: '8:00 AM - 4:00 PM',
    status: 'Active',
    joinDate: 'January 15, 2023',
    experience: '3 years',
    department: 'Front Desk',
    salary: '₹25,000',
    performance: 'Excellent',
    dateOfBirth: 'June 15, 1995',
    age: '28 years',
    gender: 'Female',
    address: '789 Reception Street, New York, NY 10003',
    employeeId: 'EMP001',
    emergencyContact: {
      name: 'Michael Johnson',
      relation: 'Husband',
      phone: '+1 5551234568'
    },
    workHistory: [
      {
        id: 1,
        date: 'March 1, 2026',
        checkIn: '8:00 AM',
        checkOut: '4:00 PM',
        hours: '8 hours',
        status: 'Present'
      },
      {
        id: 2,
        date: 'February 28, 2026',
        checkIn: '8:00 AM',
        checkOut: '4:00 PM',
        hours: '8 hours',
        status: 'Present'
      },
      {
        id: 3,
        date: 'February 27, 2026',
        checkIn: '8:15 AM',
        checkOut: '4:00 PM',
        hours: '7.75 hours',
        status: 'Late'
      }
    ],
    tasks: [
      {
        id: 1,
        task: 'Patient Registration',
        completed: 45,
        total: 50,
        date: 'March 3, 2026'
      },
      {
        id: 2,
        task: 'Appointment Scheduling',
        completed: 32,
        total: 35,
        date: 'March 3, 2026'
      },
      {
        id: 3,
        task: 'Phone Calls',
        completed: 28,
        total: 30,
        date: 'March 3, 2026'
      }
    ],
    schedule: [
      { day: 'Monday', time: '8:00 AM - 4:00 PM', status: 'Scheduled' },
      { day: 'Tuesday', time: '8:00 AM - 4:00 PM', status: 'Scheduled' },
      { day: 'Wednesday', time: '8:00 AM - 4:00 PM', status: 'Scheduled' },
      { day: 'Thursday', time: '8:00 AM - 4:00 PM', status: 'Scheduled' },
      { day: 'Friday', time: '8:00 AM - 4:00 PM', status: 'Scheduled' },
      { day: 'Saturday', time: 'Off', status: 'Off' },
      { day: 'Sunday', time: 'Off', status: 'Off' }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUser },
    { id: 'attendance', label: 'Attendance', icon: FiClock },
    { id: 'tasks', label: 'Tasks', icon: FiAward },
    { id: 'schedule', label: 'Schedule', icon: FiCalendar }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'present':
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'off':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
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
            {/* Employment Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Employee ID</label>
                  <p className="text-sm text-gray-800">{receptionistData.employeeId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p className="text-sm text-gray-800">{receptionistData.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Experience</label>
                  <p className="text-sm text-gray-800">{receptionistData.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Join Date</label>
                  <p className="text-sm text-gray-800">{receptionistData.joinDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Salary</label>
                  <p className="text-sm text-gray-800">{receptionistData.salary}/month</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Performance</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(receptionistData.performance)}`}>
                    {receptionistData.performance}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-sm text-gray-800">{receptionistData.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Age</label>
                  <p className="text-sm text-gray-800">{receptionistData.age}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-sm text-gray-800">{receptionistData.gender}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{receptionistData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-800">{receptionistData.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-sm text-gray-800">{receptionistData.address}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-sm text-gray-800">{receptionistData.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Relation</label>
                  <p className="text-sm text-gray-800">{receptionistData.emergencyContact.relation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-sm text-gray-800">{receptionistData.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {receptionistData.workHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkIn}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.checkOut}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.hours}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-4">
            {receptionistData.tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{task.task}</h3>
                  <span className="text-sm text-gray-500">{task.date}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{task.completed}/{task.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(task.completed / task.total) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {Math.round((task.completed / task.total) * 100)}% Complete
                  </div>
                </div>
              </div>
            ))}
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
                  {receptionistData.schedule.map((schedule, index) => (
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
              <h1 className="text-2xl font-semibold text-gray-800">Receptionist Profile</h1>
              <p className="text-gray-600">Complete receptionist information and performance</p>
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
          <span>Receptionists</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Receptionist Profile</span>
        </div>

        {/* Receptionist Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{receptionistData.initials}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{receptionistData.name}</h2>
                  <p className="text-gray-600">Employee ID: {receptionistData.id}</p>
                  <p className="text-gray-600">{receptionistData.department} • {receptionistData.clinic}</p>
                </div>
                
                <div className="flex flex-col lg:items-end space-y-2 mt-4 lg:mt-0">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(receptionistData.status)}`}>
                      {receptionistData.status}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPerformanceColor(receptionistData.performance)}`}>
                      {receptionistData.performance}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{receptionistData.shiftTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiDollarSign className="w-4 h-4" />
                      <span>{receptionistData.salary}</span>
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

export default ReceptionistProfile;