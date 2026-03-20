import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiMapPin, 
  FiEdit2, 
  FiTrash2, 
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiBell
} from 'react-icons/fi';
import { fetchSessions, deleteSession } from '../store/slices/sessionSlice';
import SessionCreateForm from './SessionCreateForm';
import SessionEditForm from './SessionEditForm';
import api from '../services/api';
import { useSidebar } from '../App';

const SessionList = ({ onViewEncounter }) => {
  console.log('🔍 SessionList: Component initialized');

  const dispatch = useDispatch();
  const { sessions, loading, error } = useSelector((state) => state.sessions);
  const sidebarContext = useSidebar() || {};
  const { sidebarCollapsed = false } = sidebarContext;

  console.log('🔍 SessionList: Redux state - sessions:', sessions?.length || 0, 'loading:', loading, 'error:', error);
  
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // card or table
  const [currentPage, setCurrentPage] = useState(1);
  const [sessionsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    centre_id: '',
    therapist_id: '',
    date_from: '',
    date_to: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [newSessions, setNewSessions] = useState(new Set());
  const [showNotification, setShowNotification] = useState(false);
  const previousSessionsCount = useRef(0);
  const pollingInterval = useRef(null);

  useEffect(() => {
    console.log('🔍 SessionList: useEffect triggered - fetching sessions');
    dispatch(fetchSessions());
    
    // Set up polling for real-time updates
    pollingInterval.current = setInterval(() => {
      console.log('🔍 SessionList: Polling - fetching updated sessions');
      dispatch(fetchSessions());
    }, 10000); // Poll every 10 seconds
    
    return () => {
      if (pollingInterval.current) {
        console.log('🔍 SessionList: Cleaning up polling interval');
        clearInterval(pollingInterval.current);
      }
    };
  }, [dispatch]);

  // Detect new sessions
  useEffect(() => {
    console.log('🔍 SessionList: Sessions updated, checking for new sessions. Previous count:', previousSessionsCount.current, 'Current count:', sessions.length);

    if (sessions.length > previousSessionsCount.current && previousSessionsCount.current > 0) {
      const latestSession = sessions[0]; // Assuming newest session is first
      console.log('🔍 SessionList: New session detected:', latestSession);
      setNewSessions(prev => new Set(prev).add(latestSession.id));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
    previousSessionsCount.current = sessions.length;
  }, [sessions]);

  // Helper function to get client name
  const getClientName = (session) => {
    // Priority 1: If user who booked is different from student, show booking user
    if (session.user_first_name && session.user_email && 
        session.user_email !== session.student_email) {
      return `${session.user_first_name} ${session.user_last_name}`;
    }
    // Priority 2: Student data
    if (session.student_first_name && session.student_last_name) {
      return `${session.student_first_name} ${session.student_last_name}`;
    }
    // Priority 3: Client fields (fallback)
    if (session.client_first_name && session.client_last_name) {
      return `${session.client_first_name} ${session.client_last_name}`;
    }
    return 'Unknown Client';
  };

  // Helper function to get client email
  const getClientEmail = (session) => {
    // Priority 1: Booking user email if different
    if (session.user_email && session.user_email !== session.student_email) {
      return session.user_email;
    }
    // Priority 2: Student email
    if (session.student_email) {
      return session.student_email;
    }
    // Priority 3: Client email (fallback)
    return session.client_email || 'No email';
  };

  // Helper function to get client type
  const getClientType = (session) => {
    // If booking user is different from student, it's likely a parent
    if (session.user_first_name && session.user_email && 
        session.user_email !== session.student_email) {
      return session.user_role || 'parent';
    }
    return session.client_type || 'student';
  };

  // Filter and search sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.client_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.client_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.student_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.student_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.therapist_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.therapist_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.centre_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.programme_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === '' || session.status === filters.status;
    const matchesCentre = filters.centre_id === '' || session.centre_id == filters.centre_id;
    const matchesTherapist = filters.therapist_id === '' || session.therapist_id == filters.therapist_id;
    const matchesDateFrom = filters.date_from === '' || new Date(session.session_date) >= new Date(filters.date_from);
    const matchesDateTo = filters.date_to === '' || new Date(session.session_date) <= new Date(filters.date_to);

    const matches = matchesSearch && matchesStatus && matchesCentre && matchesTherapist && matchesDateFrom && matchesDateTo;

    if (!matches) {
      console.log('🔍 SessionList: Session filtered out:', session.id, {
        matchesSearch,
        matchesStatus,
        matchesCentre,
        matchesTherapist,
        matchesDateFrom,
        matchesDateTo
      });
    }

    return matches;
  });

  console.log('🔍 SessionList: Filtered sessions count:', filteredSessions.length, 'out of', sessions.length);

  // Pagination
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  console.log('🔍 SessionList: Pagination - currentPage:', currentPage, 'totalPages:', totalPages, 'currentSessions:', currentSessions.length);

  const handleCreateSession = async (sessionData) => {
    console.log('🔍 SessionList: handleCreateSession called with data:', sessionData);

    try {
      await api.request('/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      console.log('🔍 SessionList: Session created successfully, fetching updated sessions');
      dispatch(fetchSessions());
      setIsCreateFormOpen(false);
      
      // Show notification for new session
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('🔍 SessionList: Error creating session:', error);
    }
  };

  const handleRefreshSessions = () => {
    console.log('🔍 SessionList: handleRefreshSessions called - manually refreshing sessions');
    dispatch(fetchSessions());
  };

  const clearNewSessionStatus = (sessionId) => {
    console.log('🔍 SessionList: clearNewSessionStatus called for session:', sessionId);
    setNewSessions(prev => {
      const newSet = new Set(prev);
      newSet.delete(sessionId);
      return newSet;
    });
  };

  const handleEditSession = async (sessionData) => {
    console.log('🔍 SessionList: handleEditSession called with data:', sessionData);

    try {
      await api.request(`/sessions/${selectedSession.id}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData)
      });
      console.log('🔍 SessionList: Session updated successfully, fetching updated sessions');
      dispatch(fetchSessions());
      setIsEditFormOpen(false);
      setSelectedSession(null);
    } catch (error) {
      console.error('🔍 SessionList: Error updating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    console.log('🔍 SessionList: handleDeleteSession called for session:', sessionId);

    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await dispatch(deleteSession(sessionId));
        console.log('🔍 SessionList: Session deleted successfully, fetching updated sessions');
        dispatch(fetchSessions());
      } catch (error) {
        console.error('🔍 SessionList: Error deleting session:', error);
      }
    } else {
      console.log('🔍 SessionList: Session deletion cancelled by user');
    }
  };

  const openEditForm = (session) => {
    console.log('🔍 SessionList: openEditForm called for session:', session.id);
    setSelectedSession(session);
    setIsEditFormOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'awaiting_confirmation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <FiCalendar className="w-4 h-4" />;
      case 'confirmed': return <FiCheckCircle className="w-4 h-4" />;
      case 'completed': return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled': return <FiXCircle className="w-4 h-4" />;
      case 'awaiting_confirmation': return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiCalendar className="w-4 h-4" />;
    }
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      centre_id: '',
      therapist_id: '',
      date_from: '',
      date_to: ''
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className={`p-4 lg:p-6 ${sidebarCollapsed ? '' : 'lg:ml-64 xl:ml-64'}`}>
      {/* Header */}
      <div className="mb-8">
        {/* Notification */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center"
            >
              <FiBell className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-green-800">New session booked successfully!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Sessions</h1>
            <p className="text-gray-600">Manage therapy sessions and appointments</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefreshSessions}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Refresh sessions"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Session</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
                    <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center ${
                  viewMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiEye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FiFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 p-4 rounded-lg mb-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="awaiting_confirmation">Awaiting Confirmation</option>
                </select>
                
                <input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="From Date"
                />
                
                <input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="To Date"
                />
                
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Showing {currentSessions.length} of {filteredSessions.length} sessions
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Sessions Display */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.values(filters).some(v => v) 
              ? 'Try adjusting your search or filters' 
              : 'Get started by scheduling your first session'
            }
          </p>
          {!searchTerm && !Object.values(filters).some(v => v) && (
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Schedule Session
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {currentSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={() => clearNewSessionStatus(session.id)}
                  className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                    newSessions.has(session.id) ? 'border-green-400 bg-green-50' : 'border-gray-200'
                  }`}
                >
                        <div className="p-4">
                          {/* New Session Badge */}
                          {newSessions.has(session.id) && (
                            <div className="mb-2">
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                <FiBell className="w-3 h-3 mr-1" />
                                New Booking
                              </span>
                            </div>
                          )}
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-2">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                  {getStatusIcon(session.status)}
                                  <span className="ml-1 capitalize">{session.status.replace('_', ' ')}</span>
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                {getClientName(session)}
                              </h3>
                              <p className="text-xs text-gray-600">{session.programme_name}</p>
                              {getClientType(session) && (
                                <p className="text-xs text-gray-500 capitalize">
                                  {getClientType(session)}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col space-y-1">
                              <button
                                onClick={() => onViewEncounter && onViewEncounter(session.id)}
                                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="View"
                              >
                                <FiEye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditForm(session)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSession(session.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Session Details */}
                          <div className="space-y-2">
                            <div className="flex items-center text-xs text-gray-600">
                              <FiCalendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                              <span>{new Date(session.session_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FiClock className="w-3.5 h-3.5 mr-2 text-gray-400" />
                              <span>{session.session_time} ({session.duration} min)</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FiUser className="w-3.5 h-3.5 mr-2 text-gray-400" />
                              <span>{session.therapist_first_name} {session.therapist_last_name}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-600">
                              <FiMapPin className="w-3.5 h-3.5 mr-2 text-gray-400" />
                              <span>{session.centre_name}</span>
                            </div>
                          </div>

                          {/* Session Type */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              {session.session_type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Therapist</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentSessions.map((session) => (
                      <tr 
                        key={session.id} 
                        onClick={() => clearNewSessionStatus(session.id)}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          newSessions.has(session.id) ? 'bg-green-50 border-l-4 border-l-green-400' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getClientName(session)}
                            </div>
                            <div className="text-sm text-gray-500">{session.programme_name}</div>
                            {getClientType(session) && (
                              <div className="text-xs text-gray-400 capitalize">
                                {getClientType(session)}
                              </div>
                            )}
                            {newSessions.has(session.id) && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium mt-1">
                                <FiBell className="w-3 h-3 mr-1" />
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(session.session_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.session_time} ({session.duration} min)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.therapist_first_name} {session.therapist_last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.programme_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {session.centre_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1 capitalize">{session.status.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => onViewEncounter && onViewEncounter(session.id)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditForm(session)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSession(session.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Session Modal */}
      <SessionCreateForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onSave={handleCreateSession}
      />

      {/* Edit Session Modal */}
      <SessionEditForm
        isOpen={isEditFormOpen}
        onClose={() => {
          setIsEditFormOpen(false);
          setSelectedSession(null);
        }}
        onSave={handleEditSession}
        sessionId={selectedSession?.id}
      />
      </div>
    </div>
  );
};

export default SessionList;
