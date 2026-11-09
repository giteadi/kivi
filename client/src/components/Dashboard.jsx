import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiEye,
  FiCalendar, 
  FiUsers, 
  FiMapPin, 
  FiFileText, 
  FiPlus, 
  FiClipboard,
  FiTrendingUp,
  FiActivity,
  FiBook,
  FiSearch,
  FiArrowUpRight,
  FiClock,
  FiChevronDown,
  FiCheckSquare,
  FiHeart,
  FiUser,
  FiUpload,
  FiCreditCard,
  FiMessageSquare,
  FiX
} from 'react-icons/fi';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSidebar } from '../App';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// Route mapping
const routeMapping = {
  'assessment-list': '/encounters/assessments',
  'therapy-list': '/encounters/therapies',
  'examinees': '/examinees',
  'centers': '/centres',
  'templates': '/templates',
};

const Dashboard = ({ onAppointmentClick, onCreateNewEncounter, onViewAllAppointments, onViewAllTherapists, setActiveItem }) => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.dashboard);
  const { sidebarCollapsed } = useSidebar();

  const [upcomingAssessments, setUpcomingAssessments] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [todaysSessions, setTodaysSessions] = useState(0);
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSessionsDropdown, setShowSessionsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search items
  const searchableItems = [
    { label: 'Dashboard', route: '/dashboard', activeItem: 'dashboard', icon: FiActivity },
    { label: 'Examinees Management', route: '/examinees', activeItem: 'patients', icon: FiUser },
    { label: 'Therapist Directory', route: '/therapists', activeItem: 'doctors', icon: FiUsers },
    { label: 'Assessment Templates', route: '/templates', activeItem: 'template-manager', icon: FiBook },
    { label: 'Clinical Forms', route: '/forms', activeItem: 'forms', icon: FiUpload },
    { label: 'Center Locations', route: '/centres', activeItem: 'clinics', icon: FiMapPin },
    { label: 'Billing Records', route: '/billing', activeItem: 'billing-records', icon: FiCreditCard },
    { label: 'Assessment Calendar', route: '/assessment-calendar', activeItem: 'assessment-calendar', icon: FiCalendar },
    { label: 'Conners Rating Scale', route: '/conners', activeItem: 'conners', icon: FiActivity },
    { label: 'Invoices & Statements', route: '/invoices', activeItem: 'invoices', icon: FiFileText },
  ];

  const filteredSuggestions = searchQuery.trim() 
    ? searchableItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const fetchUpcomingAssessments = async () => {
    try {
      setCalendarLoading(true);
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const startDate = today.toISOString().split('T')[0];
      const endDate = nextWeek.toISOString().split('T')[0];
      
      const response = await api.request(`/calendar?startDate=${startDate}&endDate=${endDate}`);
      if (response.success) {
        const transformedData = (response.data || [])
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

  // Weekly chart data
  const weeklyChartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { assessment: Array(7).fill(0), therapy: Array(7).fill(0) };
    upcomingAssessments.forEach(ev => {
      const d = new Date(ev.date);
      const dow = d.getDay();
      if (ev.type === 'therapy') counts.therapy[dow]++;
      else counts.assessment[dow]++;
    });
    return days.map((day, i) => ({
      day,
      Assessments: counts.assessment[i],
      Therapy: counts.therapy[i],
    }));
  }, [upcomingAssessments]);

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

  // Quick Action Buttons (Compact Apple Toolbar)
  const quickActions = [
    {
      title: 'New Examinee',
      icon: FiPlus,
      primary: true,
      onClick: () => setActiveItem?.('patient-create')
    },
    {
      title: 'Report Template',
      icon: FiFileText,
      onClick: () => setActiveItem?.('template-manager')
    },
    {
      title: 'Forms',
      icon: FiClipboard,
      route: '/forms',
      activeItem: 'forms'
    },
    {
      title: 'Invoices',
      icon: FiCreditCard,
      onClick: () => setActiveItem?.('billing-records')
    },
    {
      title: 'Conners',
      icon: FiActivity,
      route: '/conners',
      activeItem: 'conners'
    },
    {
      title: 'Centers',
      icon: FiMapPin,
      route: '/centres',
      activeItem: 'clinics'
    }
  ];

  return (
    <div className={`min-h-[calc(100vh-3.5rem)] bg-[#fbfbfd] transition-all duration-200 select-none ${
      sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[248px]'
    }`}>
      <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-3.5 sm:space-y-5">
        
        {/* Apple-style Top Bar: Clean Title & Spotlight Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900">
                Clinical Overview
              </h1>
              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Live
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Therapy and assessment operations summary
            </p>
          </div>

          {/* Spotlight Search Bar */}
          <div className="relative w-full sm:w-72" ref={searchRef}>
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchSuggestions(true);
              }}
              onFocus={() => setShowSearchSuggestions(true)}
              placeholder="Search sections... (⌘K)"
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3]/20 focus:border-[#0071e3] shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchSuggestions(false); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Spotlight Dropdown */}
            <AnimatePresence>
              {showSearchSuggestions && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 right-0 mt-1.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12)] border border-slate-200/80 z-40 overflow-hidden max-h-72 overflow-y-auto"
                >
                  {filteredSuggestions.length > 0 ? (
                    <div className="p-1 space-y-0.5">
                      <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Quick Results
                      </div>
                      {filteredSuggestions.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.route}
                          onClick={() => handleSearchClick(item)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
                        >
                          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                            <item.icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching records found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Compact Quick Actions Toolbar (Apple Segmented Style) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            if (action.route) {
              return (
                <Link
                  key={i}
                  to={action.route}
                  onClick={() => setActiveItem?.(action.activeItem)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-medium text-slate-700 shadow-sm hover:border-slate-300 active:scale-98 transition-all flex-shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{action.title}</span>
                </Link>
              );
            }
            return (
              <button
                key={i}
                onClick={action.onClick}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium shadow-sm active:scale-98 transition-all flex-shrink-0 ${
                  action.primary
                    ? 'bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-[0_1px_2px_rgba(0,113,227,0.25)]'
                    : 'border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${action.primary ? 'text-white' : 'text-slate-500'}`} />
                <span>{action.title}</span>
              </button>
            );
          })}
        </div>

        {/* Apple 4-Tile Metric Cards (Compact & Mobile-Optimized 2x2 Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* Card 1: Today's Sessions */}
          <div className="relative group apple-card p-3 sm:p-4 hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Today's Sessions
              </span>
              <button 
                onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                title="View categories"
              >
                <FiCalendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
            
            <div className="mt-1.5 sm:mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {todaysSessions}
              </span>
              <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                Active
              </span>
            </div>

            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
              <span>Workflow</span>
              <button
                onClick={() => setShowSessionsDropdown(!showSessionsDropdown)}
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
              >
                <span>Filter</span>
                <FiChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${showSessionsDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Sessions Dropdown */}
            <AnimatePresence>
              {showSessionsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-slate-200 z-30 overflow-hidden p-1 space-y-0.5"
                >
                  <Link
                    to={routeMapping['assessment-list']}
                    onClick={() => { setActiveItem?.('assessment-list'); setShowSessionsDropdown(false); }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FiCheckSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Assessment List</span>
                  </Link>
                  <Link
                    to={routeMapping['therapy-list']}
                    onClick={() => { setActiveItem?.('therapy-list'); setShowSessionsDropdown(false); }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FiHeart className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Therapy List</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card 2: Examinees */}
          <Link
            to={routeMapping['examinees']}
            onClick={() => setActiveItem?.('patients')}
            className="group apple-card p-3 sm:p-4 hover:border-emerald-200 transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Examinees
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiUsers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {stats.totalPatients || '24'}
              </span>
              <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                +5%
              </span>
            </div>

            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
              <span>Clients</span>
              <FiArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </Link>

          {/* Card 3: Centers */}
          <Link
            to={routeMapping['centers']}
            onClick={() => setActiveItem?.('clinics')}
            className="group apple-card p-3 sm:p-4 hover:border-indigo-200 transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Centers Network
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiMapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {stats.totalClinics || '3'}
              </span>
              <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-slate-100 text-slate-600">
                Sites
              </span>
            </div>

            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
              <span>Locations</span>
              <FiArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </Link>

          {/* Card 4: Templates */}
          <Link
            to={routeMapping['templates']}
            onClick={() => setActiveItem?.('template-manager')}
            className="group apple-card p-3 sm:p-4 hover:border-amber-200 transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Report Batteries
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FiBook className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            
            <div className="mt-1.5 sm:mt-2.5 flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {templatesCount}
              </span>
              <span className="inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-amber-50 text-amber-700">
                Active
              </span>
            </div>

            <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-[11px] text-slate-400 flex items-center justify-between">
              <span>Standardized</span>
              <FiArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
          </Link>
        </div>

        {/* 2-Column Split: Activity Chart & Upcoming Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5">
          
          {/* Left: Weekly Activity Bar Chart (7 Cols) */}
          <div className="lg:col-span-7 apple-card p-3.5 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 sm:mb-4">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-900">
                  Weekly Session Load
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Scheduled assessment and therapy distribution
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium self-end sm:self-auto">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                  <span className="text-slate-600 text-[10px] sm:text-[11px]">Assessments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                  <span className="text-slate-600 text-[10px] sm:text-[11px]">Therapy</span>
                </div>
              </div>
            </div>

            <div className="w-full h-44 sm:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} barSize={11} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    allowDecimals={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    axisLine={false} 
                    tickLine={false} 
                    width={18} 
                  />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: 12, 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
                      fontSize: 11,
                      padding: '6px 10px'
                    }}
                    cursor={{ fill: 'rgba(0,113,227,0.04)' }}
                  />
                  <Bar dataKey="Assessments" fill="#0071e3" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Therapy" fill="#34c759" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Upcoming Sessions & Schedule (5 Cols) */}
          <div className="lg:col-span-5 apple-card p-3.5 sm:p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-slate-900">
                  Upcoming Timeline
                </h3>
                {calendarLoading && (
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <Link
                to={routeMapping['assessment-list']}
                onClick={() => setActiveItem?.('assessment-list')}
                className="text-[11px] sm:text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>View All</span>
                <FiArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-1.5 sm:space-y-2 flex-1 overflow-y-auto max-h-48 sm:max-h-56 pr-0.5 scrollbar-thin">
              {upcomingAssessments.length > 0 ? (
                upcomingAssessments.slice(0, 5).map((assessment) => (
                  <div
                    key={assessment.id}
                    onClick={() => {
                      setViewingAssessment(assessment);
                      setShowViewModal(true);
                    }}
                    className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {assessment.title}
                        </span>
                        <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                          assessment.type === 'therapy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/50'
                        }`}>
                          {assessment.type || 'Session'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                        <span className="truncate">{assessment.clientName || 'Client'}</span>
                        {assessment.time && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 font-mono text-[9px] sm:text-[10px]">
                              <FiClock className="w-2.5 h-2.5" />
                              {assessment.time}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-slate-200/70 text-slate-600 shadow-sm">
                        {formatDate(assessment.date)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center p-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-medium text-slate-500">No scheduled sessions</p>
                  <button
                    onClick={() => setActiveItem?.('assessment-list')}
                    className="mt-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Schedule from Calendar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Apple-grade Session Details Modal */}
      <AnimatePresence>
        {showViewModal && viewingAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 w-full max-w-sm overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
                    <FiEye className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Session Record
                  </h3>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Title</span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{viewingAssessment.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Date</span>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {viewingAssessment.date ? new Date(viewingAssessment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Time</span>
                    <p className="font-medium text-slate-800 mt-0.5 font-mono">{viewingAssessment.time || 'Not set'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Client</span>
                    <p className="font-medium text-slate-800 mt-0.5">{viewingAssessment.clientName || 'Unassigned'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Duration</span>
                    <p className="font-medium text-slate-800 mt-0.5">{viewingAssessment.duration || 45} mins</p>
                  </div>
                </div>

                {viewingAssessment.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Clinical Notes</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded-lg text-[11px]">{viewingAssessment.notes}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setActiveItem?.('assessment-list');
                    }}
                    className="flex-1 py-2 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span>Open in Calendar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
