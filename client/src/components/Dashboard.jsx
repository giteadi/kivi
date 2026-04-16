import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiUsers, 
  FiMapPin, 
  FiFileText, 
  FiPlus, 
  FiClipboard,
  FiTrendingUp,
  FiActivity,
  FiBook,
  FiLayers,
  FiSettings,
  FiBell,
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
  FiArrowUpRight,
  FiClock
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setFilters, clearFilters } from '../store/slices/dashboardSlice';
import AssessmentCalendar from './AssessmentCalendar';
import StatsCard from './StatsCard';
import RevenueCard from './RevenueCard';

const Dashboard = ({ onAppointmentClick, onCreateNewEncounter, onViewAllAppointments, onViewAllTherapists, setActiveItem }) => {
  const dispatch = useDispatch();
  const { 
    stats, 
    isLoading 
  } = useSelector((state) => state.dashboard);

  const [assessments, setAssessments] = useState([
    { id: 1, title: 'Initial Assessment', clientName: 'Rahul Sharma', date: '2026-04-18', time: '10:00', duration: 60, type: 'assessment', notes: 'First session assessment' },
    { id: 2, title: 'Progress Review', clientName: 'Priya Patel', date: '2026-04-20', time: '14:30', duration: 45, type: 'therapy', notes: 'Monthly progress check' },
    { id: 3, title: 'Cognitive Evaluation', clientName: 'Amit Kumar', date: '2026-04-22', time: '11:00', duration: 90, type: 'evaluation', notes: 'Detailed cognitive testing' },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localFilters, setLocalFilters] = useState({ startDate: '', endDate: '', clinicId: '', doctorId: '' });

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Quick Action Cards Data
  const quickActions = [
    {
      icon: FiPlus,
      title: 'New Session',
      description: 'Schedule therapy session',
      color: 'from-blue-500 to-blue-600',
      onClick: () => onCreateNewEncounter?.()
    },
    {
      icon: FiFileText,
      title: 'Create Report',
      description: 'Generate assessment report',
      color: 'from-emerald-500 to-emerald-600',
      onClick: () => setActiveItem?.('reports')
    },
    {
      icon: FiUsers,
      title: 'Add Client',
      description: 'Register new examinee',
      color: 'from-violet-500 to-violet-600',
      onClick: () => setActiveItem?.('students')
    },
    {
      icon: FiBook,
      title: 'Templates',
      description: 'Manage assessment forms',
      color: 'from-amber-500 to-amber-600',
      onClick: () => setActiveItem?.('templates')
    },
    {
      icon: FiLayers,
      title: 'Conners',
      description: 'Access assessment tools',
      color: 'from-rose-500 to-rose-600',
      onClick: () => setActiveItem?.('coners')
    },
    {
      icon: FiClipboard,
      title: 'Forms',
      description: 'Custom assessment forms',
      color: 'from-cyan-500 to-cyan-600',
      onClick: () => setActiveItem?.('forms')
    }
  ];

  // Stats Data
  const statsData = [
    {
      icon: FiCalendar,
      title: 'Today\'s Sessions',
      value: stats.totalAppointments?.toString() || '8',
      trend: '+12%',
      color: 'blue'
    },
    {
      icon: FiUsers,
      title: 'Active Clients',
      value: stats.totalPatients?.toString() || '24',
      trend: '+5%',
      color: 'emerald'
    },
    {
      icon: FiMapPin,
      title: 'Centers',
      value: stats.totalClinics?.toString() || '3',
      trend: '0%',
      color: 'violet'
    },
    {
      icon: FiActivity,
      title: 'Pending Reports',
      value: '12',
      trend: '-8%',
      color: 'amber'
    }
  ];

  // Handle Assessment Actions
  const handleAddAssessment = (newAssessment) => {
    setAssessments([...assessments, { ...newAssessment, id: Date.now() }]);
  };

  const handleEditAssessment = (updatedAssessment) => {
    setAssessments(assessments.map(a => a.id === updatedAssessment.id ? updatedAssessment : a));
  };

  const handleDeleteAssessment = (id) => {
    setAssessments(assessments.filter(a => a.id !== id));
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 lg:p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-800"
            >
              Welcome Back, Admin
            </motion.h1>
            <p className="text-gray-500 mt-1">Here\'s what\'s happening in your therapy center today</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors relative">
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={() => setActiveItem?.('settings')}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <FiSettings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
              <span>View All</span>
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
                className={`group relative overflow-hidden bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                <div className="relative">
                  <action.icon className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-white/80 mt-1">{action.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Assessment Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <AssessmentCalendar 
            assessments={assessments}
            onAddAssessment={handleAddAssessment}
            onEditAssessment={handleEditAssessment}
            onDeleteAssessment={handleDeleteAssessment}
          />
        </motion.div>

        {/* Bottom Section - Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                <FiClock className="w-4 h-4" />
                <span>Last 24 hours</span>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { icon: FiFileText, color: 'bg-blue-100 text-blue-600', title: 'Assessment report generated', desc: 'Rahul Sharma - Initial Assessment', time: '2 hours ago' },
                { icon: FiUsers, color: 'bg-emerald-100 text-emerald-600', title: 'New client registered', desc: 'Priya Patel joined the center', time: '4 hours ago' },
                { icon: FiCalendar, color: 'bg-violet-100 text-violet-600', title: 'Session completed', desc: 'Amit Kumar - Therapy Session #5', time: '5 hours ago' },
                { icon: FiBook, color: 'bg-amber-100 text-amber-600', title: 'Template updated', desc: 'WRAT-5 Hindi template modified', time: '8 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`p-2.5 rounded-xl ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{activity.title}</h4>
                    <p className="text-sm text-gray-500">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">Upcoming Today</h3>
              <button 
                onClick={() => onViewAllAppointments?.()}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {[
                { time: '10:00 AM', title: 'Initial Assessment', client: 'Rahul Sharma', type: 'assessment', color: 'bg-blue-500' },
                { time: '11:30 AM', title: 'Progress Review', client: 'Priya Patel', type: 'therapy', color: 'bg-emerald-500' },
                { time: '02:00 PM', title: 'Cognitive Testing', client: 'Amit Kumar', type: 'evaluation', color: 'bg-violet-500' },
                { time: '03:30 PM', title: 'Follow-up Session', client: 'Neha Gupta', type: 'followup', color: 'bg-amber-500' },
              ].map((session, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onClick={() => onAppointmentClick?.(session)}>
                  <div className={`w-1 h-12 rounded-full ${session.color}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">{session.time}</span>
                      <span className="text-xs text-gray-400 capitalize">{session.type}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">{session.title}</h4>
                    <p className="text-xs text-gray-500">{session.client}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onCreateNewEncounter?.()}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
            >
              + Schedule New Session
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;