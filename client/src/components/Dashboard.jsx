import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
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
  FiX,
  FiLoader
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData, setFilters, clearFilters } from '../store/slices/dashboardSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
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

  const [assessments, setAssessments] = useState([]);
  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [todaysSessions, setTodaysSessions] = useState(0);
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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
    { label: 'Centers', route: '/centres', activeItem: 'clinics', icon: FiMapPin },
    { label: 'Center Revenue', route: '/centres/revenue', activeItem: 'clinic-revenue', icon: FiTrendingUp },
    { label: 'Billing Records', route: '/billing', activeItem: 'billing-records', icon: FiCreditCard },
    { label: 'Queries', route: '/admin/queries', activeItem: 'queries', icon: FiMessageSquare },
    { label: 'Reports', route: '/reports', activeItem: 'report', icon: FiFileText },
    { label: 'Conners', route: '/conners', activeItem: 'conners', icon: FiLayers },
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
    fetchUpcomingAssessments();
    fetchTemplatesCount();
    fetchTodaysSessions();
  }, [dispatch]);

  // Fetch templates count
  const fetchTemplatesCount = async () => {
    try {
      const response = await api.request('/templates');
      if (response.success) {
        setTemplatesCount(response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Fetch today's sessions
  const fetchTodaysSessions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.request(`/sessions?date=${today}`);
      if (response.success) {
        setTodaysSessions(response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching today sessions:', error);
    }
  };

  // Fetch upcoming assessments from calendar API
  const fetchUpcomingAssessments = async () => {
    try {
      setCalendarLoading(true);
      // Get today's date and 7 days ahead
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      
      const response = await api.request(`/calendar?startDate=${startDate}&endDate=${endDate}`);
      if (response.success) {
        // Transform backend data to frontend format and sort by date/time
        const transformedData = response.data
          .filter(event => event.status !== 'cancelled')
          .map(event => ({
            id: event.id,
            title: event.title,
            clientName: event.client_name,
            date: event.event_date,
            time: event.event_time?.substring(0, 5) || '',
            duration: event.duration_minutes,
            type: event.event_type,
            notes: event.notes,
            status: event.status
          }))
          .sort((a, b) => {
            // Sort by date first, then by time
            const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
            const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
            return dateA - dateB;
          });
        setUpcomingAssessments(transformedData);
      }
    } catch (error) {
      console.error('Error fetching upcoming assessments:', error);
    } finally {
      setCalendarLoading(false);
    }
  };

  const getAssessmentColor = (type) => {
    const colors = {
      assessment: 'bg-blue-500',
      therapy: 'bg-emerald-500',
      evaluation: 'bg-violet-500',
      followup: 'bg-amber-500',
      meeting: 'bg-pink-500'
    };
    return colors[type] || 'bg-blue-500';
  };

  // Quick Action Cards Data
  const quickActions = [
    {
      icon: FiPlus,
      title: 'New Examinee',
      description: 'Register new client',
      color: 'from-blue-500 to-blue-600',
      onClick: () => setActiveItem?.('patient-create')
    },
    {
      icon: FiFileText,
      title: 'Create Report',
      description: 'Generate assessment report',
      color: 'from-emerald-500 to-emerald-600',
      onClick: () => setActiveItem?.('template-manager')
    },
    {
      icon: FiClipboard,
      title: 'Forms',
      description: 'Custom assessment forms',
      color: 'from-cyan-500 to-cyan-600',
      route: '/forms',
      activeItem: 'forms'
    },
    {
      icon: FiCreditCard,
      title: 'Invoice',
      description: 'View billing records',
      color: 'from-purple-500 to-purple-600',
      onClick: () => setActiveItem?.('billing-records')
    },
    {
      icon: FiMapPin,
      title: 'Network',
      description: 'Manage centres',
      color: 'from-orange-500 to-orange-600',
      route: '/centres',
      activeItem: 'clinics'
    },
    {
      icon: FiActivity,
      title: 'Conners',
      description: 'ADHD Assessment',
      color: 'from-red-500 to-red-600',
      route: '/conners',
      activeItem: 'conners'
    }
  ];

  // Stats Data
  const statsData = [
    {
      icon: FiCalendar,
      title: 'Today\'s Sessions',
      value: todaysSessions.toString(),
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
      value: templatesCount.toString(),
      trend: '-8%',
      color: 'amber',
      route: 'templates'
    }
  ];

  // Handle Assessment Actions
  const handleAddAssessment = async (newAssessment) => {
    try {
      const response = await api.request('/calendar', {
        method: 'POST',
        body: JSON.stringify({
          title: newAssessment.title,
          clientName: newAssessment.clientName,
          eventDate: newAssessment.date,
          eventTime: newAssessment.time || null,
          duration: newAssessment.duration,
          eventType: newAssessment.type,
          notes: newAssessment.notes
        })
      });
      if (response.success) {
        toast.success('Assessment scheduled successfully');
        fetchUpcomingAssessments();
      }
    } catch (error) {
      console.error('Error adding assessment:', error);
      toast.error('Failed to schedule assessment');
    }
  };

  const handleEditAssessment = async (updatedAssessment) => {
    try {
      const response = await api.request(`/calendar/${updatedAssessment.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: updatedAssessment.title,
          clientName: updatedAssessment.clientName,
          eventDate: updatedAssessment.date,
          eventTime: updatedAssessment.time || null,
          duration: updatedAssessment.duration,
          eventType: updatedAssessment.type,
          notes: updatedAssessment.notes
        })
      });
      if (response.success) {
        toast.success('Assessment updated successfully');
        fetchUpcomingAssessments();
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast.error('Failed to update assessment');
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!confirm('Are you sure you want to delete this assessment?')) return;
    try {
      const response = await api.request(`/calendar/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        toast.success('Assessment deleted successfully');
        fetchUpcomingAssessments();
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0f0f10] dark:to-[#1c1c1e] transition-colors duration-300">
      <div className="p-4 lg:p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-gray-800 dark:text-white"
            >
              Welcome Back, Admin
            </motion.h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what is happening in your therapy center today</p>
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
                className="pl-10 pr-10 py-2 bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchSuggestions(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2c2c2e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-30 overflow-hidden max-h-80 overflow-y-auto"
                  >
                    {filteredSuggestions.length > 0 ? (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                          Results ({filteredSuggestions.length})
                        </div>
                        {filteredSuggestions.map((item, index) => (
                          <Link
                            key={index}
                            to={item.route}
                            onClick={() => handleSearchClick(item)}
                            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left border-t border-gray-50 dark:border-gray-700"
                          >
                            <div className="p-2 bg-gray-100 dark:bg-[#3a3a3c] rounded-lg">
                              <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
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
              className={`bg-white dark:bg-[#1c1c1e] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all relative ${stat.title === "Today's Sessions" || stat.route ? 'cursor-pointer' : ''}`}
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
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
              </div>
              
              {/* Dropdown for Today's Sessions */}
              <AnimatePresence>
                {stat.title === "Today's Sessions" && showSessionsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#2c2c2e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20 overflow-hidden"
                  >
                    <Link
                      to={routeMapping['assessment-list']}
                      onClick={() => { setActiveItem?.('assessment-list'); setShowSessionsDropdown(false); }}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-[#3a3a3c] transition-colors text-left"
                    >
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <FiCheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Assessment List</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View all assessments</p>
                      </div>
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700"></div>
                    <Link
                      to={routeMapping['therapy-list']}
                      onClick={() => { setActiveItem?.('therapy-list'); setShowSessionsDropdown(false); }}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-[#3a3a3c] transition-colors text-left"
                    >
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <FiHeart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Therapy List</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View all therapy sessions</p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* View Assessment Modal */}
      <AnimatePresence>
        {showViewModal && viewingAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <FiEye className="w-5 h-5" />
                  <span>Assessment Details</span>
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                  <p className="text-lg font-semibold text-gray-900">{viewingAssessment.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                    <p className="text-gray-900 font-medium">
                      {viewingAssessment.date ? new Date(viewingAssessment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                    <p className="text-gray-900 font-medium">{viewingAssessment.time || 'Not set'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Client Name</label>
                    <p className="text-gray-900">{viewingAssessment.clientName || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                    <p className="text-gray-900">{viewingAssessment.duration} min</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                  <span className={`${getAssessmentColor(viewingAssessment.type)} text-white text-xs px-2 py-1 rounded capitalize`}>
                    {viewingAssessment.type}
                  </span>
                </div>

                {viewingAssessment.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                    <p className="text-gray-900">{viewingAssessment.notes}</p>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setActiveItem?.('assessment-list');
                    }}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2"
                  >
                    <FiCalendar className="w-4 h-4" />
                    <span>View in Calendar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              action.route ? (
                <Link key={index} to={action.route} onClick={() => setActiveItem?.(action.activeItem || action.route.replace('/', ''))}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative overflow-hidden bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer`}
                  >
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                    <div className="relative">
                      <action.icon className="w-8 h-8 mb-3" />
                      <h3 className="font-semibold text-sm">{action.title}</h3>
                      <p className="text-xs text-white/80 mt-1">{action.description}</p>
                    </div>
                  </motion.div>
                </Link>
              ) : (
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
              )
            ))}
          </div>
        </motion.div>

        {/* Upcoming Assessments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Upcoming Assessments</h3>
              {calendarLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </div>
            <button 
              onClick={() => setActiveItem?.('assessment-list')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <FiArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAssessments.length > 0 ? (
              upcomingAssessments.slice(0, 6).map((assessment) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setViewingAssessment(assessment);
                    setShowViewModal(true);
                  }}
                >
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group-hover:bg-blue-50/50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getAssessmentColor(assessment.type)}`}></div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{assessment.type}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        formatDate(assessment.date) === 'Today' 
                          ? 'bg-red-100 text-red-600' 
                          : formatDate(assessment.date) === 'Tomorrow'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {formatDate(assessment.date)}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{assessment.title}</h4>
                    
                    {assessment.clientName && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <FiUser className="w-4 h-4" />
                        <span>{assessment.clientName}</span>
                      </div>
                    )}
                    
                    {assessment.time && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>{assessment.time} ({assessment.duration} min)</span>
                      </div>
                    )}
                    
                    {assessment.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 line-clamp-2">{assessment.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400">
                <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No upcoming assessments scheduled</p>
                <button
                  onClick={() => setActiveItem?.('assessment-list')}
                  className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Schedule an assessment
                </button>
              </div>
            )}
          </div>
          
          {upcomingAssessments.length > 6 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveItem?.('assessment-list')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All {upcomingAssessments.length} Assessments
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;