import { motion } from 'framer-motion';
import { FiCalendar, FiUsers, FiMapPin, FiUserCheck, FiFilter } from 'react-icons/fi';
import StatsCard from './StatsCard';
import EmailAlert from './EmailAlert';

const Dashboard = () => {
  const stats = [
    {
      icon: FiCalendar,
      title: 'Total Appointments',
      value: '10',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Total Patients',
      value: '11',
      color: 'blue'
    },
    {
      icon: FiMapPin,
      title: 'Total Clinics',
      value: '4',
      color: 'blue'
    },
    {
      icon: FiUserCheck,
      title: 'Total Doctors',
      value: '11',
      color: 'blue'
    }
  ];

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
            <div className="flex items-center space-x-2 px-4 py-2 border rounded-lg bg-white">
              <span className="text-sm text-gray-600">Select Date Range</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm">Apply Filter</span>
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {stats.map((stat, index) => (
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

        {/* Additional Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-xl p-4 lg:p-6 shadow-sm border"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity to display</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;