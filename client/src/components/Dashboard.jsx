import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
  FiArrowUpRight,
  FiClock,
  FiChevronDown,
  FiCheckSquare,
  FiHeart,
  FiHome,
  FiUser,
  FiUserCheck,
  FiUpload,
  FiCreditCard,
  FiMessageSquare,
  FiX
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setFilters, clearFilters } from '../store/slices/dashboardSlice';
import AssessmentCalendar from './AssessmentCalendar';
import StatsCard from './StatsCard';
import RevenueCard from './RevenueCard';

// Route mapping - same as Sidebar
const routeMapping = {
  'assessment-list': '/encounters/assessments',
  'therapy-list': '/encounters/therapies',
  'examinees': '/examinees',
  'centers': '/centres',
  'templates': '/templates',
};

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
  const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Searchable navigation items
  const searchableItems = [
    { label: 'Dashboard', route: '/dashboard', activeItem: 'dashboard', icon: FiHome },
    { label: 'Sessions', route: '/encounters', activeItem: 'encounters', icon: FiUsers },
    { label: 'Assessment List', route: '/encounters/assessments', activeItem: 'assessment-list', icon: FiFileText },
    { label: 'Therapy List', route: '/encounters/therapies', activeItem: 'therapy-list', icon: FiActivity },
    { label: 'Examinees', route: '/examinees', activeItem: 'patients', icon: FiUser },
    { label: 'Therapists', route: '/therapists', activeItem: 'doctors', icon: FiUserCheck },
    { label: 'Templates', route: '/templates', activeItem: 'template-manager', icon: FiBook },
    { label: 'Forms', route: '/forms', activeItem: 'forms', icon: FiUpload },
    { label: 'Centres', route: '/centres', activeItem: 'clinics', icon: FiMapPin },
    { label: 'Centre Revenue', route: '/centres/revenue', activeItem: 'clinic-revenue', icon: FiTrendingUp },
    { label: 'Billing Records', route: '/billing', activeItem: 'billing-records', icon: FiCreditCard },
    { label: 'Queries', route: '/admin/queries', activeItem: 'queries', icon: FiMessageSquare },
    { label: 'Reports', route: '/reports', activeItem: 'report', icon: FiFileText },
    { label: 'Conners', route: '/coners', activeItem: 'coners', icon: FiLayers },
  ];

  // Filter suggestions based on search query
  const filteredSuggestions = searchQuery.trim() 
    ? searchableItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchClick = (item) => {
    setSearchQuery('');
    setShowSearchSuggestions(false);
    setActiveItem?.(item.activeItem);
  };

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
      title: 'Examinees',
      value: stats.totalPatients?.toString() || '24',
      trend: '+5%',
      color: 'emerald',
      route: 'examinees'
    },
    {
      icon: FiMapPin,
      title: 'Centers',
      value: stats.totalClinics?.toString() || '3',
      trend: '0%',
      color: 'violet',
      route: 'centers'
    },
    {
      icon: FiBook,
      title: 'Templates',
      value: '12',
      trend: '-8%',
      color: 'amber',
      route: 'templates'
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
            <p className="text-gray-500 mt-1">Here is what is happening in your therapy center today</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative" ref={searchRef}>
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder="Search anything..."
                className="pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
              
              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSearchSuggestions && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-30 overflow-hidden max-h-80 overflow-y-auto"
                  >
                    {filteredSuggestions.length > 0 ? (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Results ({filteredSuggestions.length})
                        </div>
                        {filteredSuggestions.map((item, index) => (
                          <Link
                            key={index}
                            to={item.route}
                            onClick={() => handleSearchClick(item)}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors text-left border-t border-gray-50"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <item.icon className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-800">{item.label}</span>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-4 text-center text-gray-500">
                        <FiSearch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No results found</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative ${stat.title === "Today's Sessions" || stat.route ? 'cursor-pointer' : ''}`}
              onClick={stat.title === "Today's Sessions" ? () => setShowSessionsDropdown(!showSessionsDropdown) : undefined}
            >
              {stat.route && (
                <Link
                  to={routeMapping[stat.route]}
                  onClick={() => setActiveItem?.(stat.route)}
                  className="absolute inset-0 z-10"
                />
              )}
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`text-sm font-medium ${stat.trend.startsWith('+') ? 'text-emerald-600' : stat.trend.startsWith('-') ? 'text-red-600' : 'text-gray-500'}`}>
                    {stat.trend}
                  </span>
                  {stat.title === "Today's Sessions" && (
                    <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSessionsDropdown ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.title}</p>
              </div>
              
              {/* Dropdown for Today's Sessions */}
              <AnimatePresence>
                {stat.title === "Today's Sessions" && showSessionsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden"
                  >
                    <Link
                      to={routeMapping['assessment-list']}
                      onClick={() => { setActiveItem?.('assessment-list'); setShowSessionsDropdown(false); }}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiCheckSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Assessment List</p>
                        <p className="text-xs text-gray-500">View all assessments</p>
                      </div>
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <Link
                      to={routeMapping['therapy-list']}
                      onClick={() => { setActiveItem?.('therapy-list'); setShowSessionsDropdown(false); }}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FiHeart className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Therapy List</p>
                        <p className="text-xs text-gray-500">View all therapy sessions</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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