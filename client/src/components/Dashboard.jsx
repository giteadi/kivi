import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiMapPin, FiUserCheck, FiFilter, FiSettings, FiLock } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setFilters, clearFilters } from '../store/slices/dashboardSlice';
import StatsCard from './StatsCard';
import EmailAlert from './EmailAlert';
import RevenueCard from './RevenueCard';
import AppointmentCard from './AppointmentCard';
import DoctorCard from './DoctorCard';
import BookingChart from './BookingChart';

const Dashboard = ({ onAppointmentClick, onCreateNewEncounter, onViewAllAppointments }) => {
  const dispatch = useDispatch();
  const { 
    stats, 
    upcomingAppointments, 
    topDoctors, 
    bookingChart, 
    isLoading, 
    error, 
    filters 
  } = useSelector((state) => state.dashboard);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Load dashboard data on component mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Handle date range selection
  const handleDateRangeChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters
  const handleApplyFilter = () => {
    dispatch(setFilters(localFilters));
    dispatch(fetchDashboardData(localFilters));
    setShowDatePicker(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      clinicId: '',
      doctorId: ''
    };
    setLocalFilters(clearedFilters);
    dispatch(clearFilters());
    dispatch(fetchDashboardData());
    setShowDatePicker(false);
  };

  const statsData = [
    {
      icon: FiCalendar,
      title: 'Total Appointments',
      value: stats.totalAppointments?.toString() || '0',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Total Patients',
      value: stats.totalPatients?.toString() || '0',
      color: 'blue'
    },
    {
      icon: FiMapPin,
      title: 'Total Clinics',
      value: stats.totalClinics?.toString() || '0',
      color: 'blue'
    },
    {
      icon: FiUserCheck,
      title: 'Total Doctors',
      value: stats.totalDoctors?.toString() || '0',
      color: 'blue'
    }
  ];

  const revenueStats = [
    {
      icon: FiSettings,
      title: 'Active Services',
      value: stats.activeServices?.toString() || '0'
    },
    {
      icon: FiLock,
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue || 0}/-`
    }
  ];

  const formatAppointmentData = (appointments) => {
    return appointments.map(apt => ({
      id: apt.id,
      patient: apt.patient_name,
      date: new Date(apt.appointment_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: new Date(`2000-01-01T${apt.appointment_time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      clinic: apt.clinic_name,
      doctor: apt.doctor_name,
      initials: apt.patient_name ? apt.patient_name.split(' ').map(n => n[0]).join('') : 'PK',
      bgColor: 'bg-purple-100'
    }));
  };

  const formatDoctorData = (doctors) => {
    return doctors.map(doc => ({
      name: doc.doctor_name,
      clinic: doc.clinic_name,
      appointments: doc.appointment_count?.toString() || '0',
      initials: doc.doctor_name ? doc.doctor_name.split(' ').map(n => n[0]).join('') : 'DK',
      bgColor: 'bg-blue-100'
    }));
  };

  const handleAppointmentClick = (appointment) => {
    if (onAppointmentClick) {
      onAppointmentClick(appointment.id);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        <EmailAlert />
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Dashboard</span>
        </div>

        {/* Insights Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold text-gray-800"
          >
            Insights
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {localFilters.startDate && localFilters.endDate 
                    ? `${localFilters.startDate} to ${localFilters.endDate}`
                    : 'Select Date Range'
                  }
                </span>
              </button>
              
              {/* Date Range Picker */}
              {showDatePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 p-4 bg-white border rounded-lg shadow-lg z-10 min-w-[300px]"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={localFilters.startDate}
                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={localFilters.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleClearFilters}
                        className="flex-1 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleApplyFilter}
                        className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApplyFilter}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm">
                {isLoading ? 'Loading...' : 'Apply Filter'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8"
        >
          {revenueStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <RevenueCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCreateNewEncounter && onCreateNewEncounter()}
                  className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  New Encounter
                </motion.button>
                <button 
                  onClick={() => onViewAllAppointments && onViewAllAppointments()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {formatAppointmentData(upcomingAppointments || []).map((appointment, index) => (
                <AppointmentCard 
                  key={index} 
                  {...appointment} 
                  onClick={() => handleAppointmentClick(appointment)}
                />
              ))}
              {(!upcomingAppointments || upcomingAppointments.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No upcoming appointments
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Top Doctors</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {formatDoctorData(topDoctors || []).map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
              ))}
              {(!topDoctors || topDoctors.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  No doctor data available
                </div>
              )}
            </div>
          </motion.div>

          {/* Booking Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <BookingChart data={bookingChart || []} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;