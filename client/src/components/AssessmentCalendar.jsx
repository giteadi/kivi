import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiPlus, 
  FiX, 
  FiClock, 
  FiUser, 
  FiFileText,
  FiCalendar,
  FiMoreVertical,
  FiTrash2,
  FiEdit2,
  FiLoader,
  FiEye,
  FiSearch,
  FiArrowLeft
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssessmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState('month');
  const [showUserList, setShowUserList] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [viewingAssessment, setViewingAssessment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [therapistScheduleLoading, setTherapistScheduleLoading] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState('');
  const [workingHoursForm, setWorkingHoursForm] = useState({
    login_time: '',
    logout_time: '',
    is_available: true,
  });
  const [workingHoursSaving, setWorkingHoursSaving] = useState(false);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    clientName: '',
    time: '',
    duration: 60,
    type: 'ot_si',
    notes: ''
  });
  const [showCenterDropdown, setShowCenterDropdown] = useState(false);
  
  // User assessment tracking
  const [userStats, setUserStats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);
  const [showUserCards, setShowUserCards] = useState(false);

  // User and center info
  const [user, setUser] = useState(null);
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Get user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // For non-admin users, set their assigned center
        if (parsedUser.role !== 'admin' && parsedUser.center_id) {
          setSelectedCenter(parsedUser.center_id);
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  // Fetch centers for admin users
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCenters();
    }
  }, [user]);

  const fetchCenters = async () => {
    try {
      const response = await api.getClinics();
      if (response.success) {
        setCenters(response.data || []);
        // Auto-select first center if none selected
        if (!selectedCenter && response.data?.length > 0) {
          setSelectedCenter(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  // Fetch assessments from API
  useEffect(() => {
    fetchAssessments();
  }, [currentDate, selectedCenter]);

  // Fetch examinee data on mount
  useEffect(() => {
    fetchExamineeData();
  }, []);

  const toISODate = (date) => date.toLocaleDateString('en-CA');

  const fetchTherapistSchedule = async () => {
    try {
      setTherapistScheduleLoading(true);
      const date = toISODate(currentDate);
      const res = await api.getAvailableTherapists({ date });
      if (res?.success) {
        setTherapists(res.data || []);
      } else {
        setTherapists([]);
      }
    } catch (error) {
      console.error('Error fetching therapist schedule:', error);
      setTherapists([]);
    } finally {
      setTherapistScheduleLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'therapist' || viewMode === 'workinghours') {
      fetchTherapistSchedule();
    }
  }, [viewMode, currentDate]);

  useEffect(() => {
    if (!selectedTherapistId) return;
    const t = therapists.find(x => String(x.id) === String(selectedTherapistId));
    if (!t) return;
    setWorkingHoursForm({
      login_time: t.login_time || '',
      logout_time: t.logout_time || '',
      is_available: t.is_available === undefined ? true : Boolean(t.is_available),
    });
  }, [selectedTherapistId, therapists]);

  const saveWorkingHours = async () => {
    if (!selectedTherapistId) return;
    try {
      setWorkingHoursSaving(true);
      const payload = {
        login_time: workingHoursForm.login_time,
        logout_time: workingHoursForm.logout_time,
        is_available: workingHoursForm.is_available,
      };
      const res = await api.updateTherapistAvailabilitySettings(selectedTherapistId, payload);
      if (res?.success) {
        toast.success('Working hours updated');
        await fetchTherapistSchedule();
      } else {
        toast.error(res?.message || 'Failed to update working hours');
      }
    } catch (error) {
      console.error('Error saving working hours:', error);
      toast.error('Failed to update working hours');
    } finally {
      setWorkingHoursSaving(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      
      // Build query params with center filter
      const params = new URLSearchParams({
        startDate,
        endDate
      });
      if (selectedCenter) {
        params.append('centerId', selectedCenter);
      }
      
      const response = await api.request(`/calendar?${params.toString()}`);
      if (response.success) {
        // Transform backend data to frontend format
        const transformedData = response.data.map(event => ({
          id: event.id,
          title: event.title,
          clientName: event.client_name,
          date: event.event_date,
          time: event.event_time?.substring(0, 5) || '',
          duration: event.duration_minutes,
          type: event.event_type,
          notes: event.notes,
          status: event.status
        }));
        setAssessments(transformedData);
        
        // Calculate user statistics
        calculateUserStats(transformedData);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  // Fetch actual examinee data from students API
  const fetchExamineeData = async () => {
    try {
      console.log('Fetching examinee data from /students API...');
      const response = await api.request('/students');
      console.log('Students API Response:', response);
      
      if (response.success && response.data) {
        const students = response.data;
        console.log('Number of students:', students.length);
        console.log('First student sample:', students[0]);
        
        // Transform student data to userStats format
        const statsArray = students.map(student => ({
          id: student.id,
          name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown',
          assessmentCount: student.requires_assessment ? 1 : 0,
          therapyCount: student.requires_therapy ? 1 : 0,
          totalCount: (student.requires_assessment ? 1 : 0) + (student.requires_therapy ? 1 : 0),
          emailCount: student.email_count || 0,
          lastEmailSent: student.last_email_sent_date,
          emailHistory: student.email_history || [],
          lastVisit: student.last_session_date || student.updated_at,
          assessments: [], // Will be populated from calendar
          studentData: student // Keep full student data
        }));
        
        // Sort by email count (most active first) then by name
        statsArray.sort((a, b) => {
          if (b.emailCount !== a.emailCount) return b.emailCount - a.emailCount;
          return a.name.localeCompare(b.name);
        });
        
        setUserStats(statsArray);
      } else {
        console.error('API response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching examinee data:', error);
      console.error('Error details:', error.message, error.stack);
    }
  };

  // Calculate assessment/therapy counts from calendar events
  const calculateUserStats = (data) => {
    // First fetch actual examinee data
    fetchExamineeData();
    
    // Then merge with calendar data
    const userMap = new Map();
    
    data.forEach(assessment => {
      if (!assessment.clientName) return;
      
      const key = assessment.clientName.toLowerCase().trim();
      if (!userMap.has(key)) {
        userMap.set(key, {
          assessments: [],
          lastVisit: null
        });
      }
      
      const userData = userMap.get(key);
      userData.assessments.push(assessment);
      
      // Track last visit date
      const assessmentDate = new Date(assessment.date);
      if (!userData.lastVisit || assessmentDate > new Date(userData.lastVisit)) {
        userData.lastVisit = assessment.date;
      }
    });
    
    // Merge calendar data with existing userStats
    setUserStats(prevStats => {
      return prevStats.map(user => {
        const key = user.name.toLowerCase().trim();
        const calendarData = userMap.get(key);
        if (calendarData) {
          return {
            ...user,
            assessments: calendarData.assessments,
            lastVisit: calendarData.lastVisit || user.lastVisit,
            totalCount: calendarData.assessments.length,
            assessmentCount: calendarData.assessments.filter(a => 
              a.type === 'ot_si' || a.type === 'assessment'
            ).length,
            therapyCount: calendarData.assessments.filter(a => 
              a.type !== 'ot_si' && a.type !== 'assessment'
            ).length
          };
        }
        return user;
      });
    });
  };

  // Handle viewing user details - now shows cards view instead of modal
  const handleViewUserDetail = (userData) => {
    setSelectedUser(userData);
    setShowUserCards(true);
    setShowUserList(false); // Hide user list when showing cards
  };

  // Back to user list/calendar view
  const handleBackToView = () => {
    setShowUserCards(false);
    setSelectedUser(null);
    setShowUserList(true);
  };

  const handleAddAssessment = async (e) => {
    e.preventDefault();
    if (!selectedDate || !newAssessment.title) return;

    try {
      const eventData = {
        title: newAssessment.title,
        clientName: newAssessment.clientName,
        eventDate: selectedDate.toLocaleDateString('en-CA'), // Use local date format (YYYY-MM-DD)
        eventTime: newAssessment.time || null,
        duration: newAssessment.duration,
        eventType: newAssessment.type,
        notes: newAssessment.notes,
        centerId: selectedCenter || user?.center_id || null
      };

      const response = await api.request('/calendar', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });

      if (response.success) {
        toast.success('Assessment scheduled successfully');
        await fetchAssessments();
        setShowAddModal(false);
        setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'assessment', notes: '' });
      }
    } catch (error) {
      console.error('Error adding assessment:', error);
      toast.error('Failed to schedule assessment');
    }
  };

  const handleEditAssessment = async (e) => {
    e.preventDefault();
    if (!editingAssessment) return;

    try {
      const eventData = {
        title: newAssessment.title,
        clientName: newAssessment.clientName,
        eventDate: selectedDate?.toLocaleDateString('en-CA'), // Use local date format
        eventTime: newAssessment.time || null,
        duration: newAssessment.duration,
        eventType: newAssessment.type,
        notes: newAssessment.notes,
        centerId: selectedCenter || user?.center_id || null
      };

      const response = await api.request(`/calendar/${editingAssessment.id}`, {
        method: 'PUT',
        body: JSON.stringify(eventData)
      });

      if (response.success) {
        toast.success('Assessment updated successfully');
        await fetchAssessments();
        setShowEditModal(false);
        setEditingAssessment(null);
        setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'assessment', notes: '' });
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
        await fetchAssessments();
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    }
  };

  const handleViewAssessment = (assessment) => {
    setViewingAssessment(assessment);
    setShowViewModal(true);
  };

  const openEditModal = (assessment) => {
    setEditingAssessment(assessment);
    setNewAssessment({
      title: assessment.title,
      clientName: assessment.clientName || '',
      time: assessment.time || '',
      duration: assessment.duration || 60,
      type: assessment.type || 'assessment',
      notes: assessment.notes || ''
    });
    setShowEditModal(true);
  };

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewMode === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else if (viewMode === 'day') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const getPeriodLabel = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getFullYear()}`;
    } else if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getAssessmentsForDate = (date) => {
    return assessments.filter(assessment => {
      const assessmentDate = new Date(assessment.date);
      return assessmentDate.getDate() === date && 
             assessmentDate.getMonth() === currentDate.getMonth() && 
             assessmentDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const getAssessmentColor = (type) => {
    const colors = {
      ot_si: '#3D3D3D',
      speech: '#6B6B6B',
      behaviour: '#D4D4D4',
      counselling: '#B5CC8E',
      holiday: '#C4A882',
      halfday: '#7C5C4A'
    };
    return colors[type] || '#3D3D3D';
  };

  const renderCalendarGrid = () => {
    const days = [];
    const totalSlots = 42; // 6 rows × 7 columns
    const today = new Date();

    // Previous month days
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      days.push(
        <div key={`prev-${i}`} className="h-20 p-2 border border-gray-200 border-gray-200 bg-gray-50 bg-gray-100">
          <span className="text-sm font-semibold text-gray-500 text-gray-500">{dayNum}</span>
        </div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAssessments = getAssessmentsForDate(day);
      const isToday = today.getDate() === day &&
                      today.getMonth() === currentDate.getMonth() &&
                      today.getFullYear() === currentDate.getFullYear();
      const isSelected = selectedDate?.getDate() === day &&
                         selectedDate?.getMonth() === currentDate.getMonth();
      const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
      const isSunday = dayOfWeek === 0;

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleDateClick(day)}
          className={`h-20 p-2 border border-gray-200 border-gray-200 cursor-pointer transition-all ${
            isToday
              ? 'ring-2 ring-blue-500 bg-gray-100 bg-gray-50'
              : 'bg-white bg-white hover:bg-gray-100 hover:bg-gray-50'
          } ${isSelected ? 'bg-gray-200 bg-gray-100' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 text-blue-500' : isSunday ? 'text-red-500 text-red-500' : 'text-gray-700 text-gray-600'}`}>
              {day}
            </span>
            {dayAssessments.length > 0 && (
              <span className="text-xs bg-blue-500 text-gray-900 px-1.5 py-0.5 rounded-full">
                {dayAssessments.length}
              </span>
            )}
          </div>
          {isSunday && dayAssessments.length === 0 && (
            <div className="text-xs text-gray-500 text-gray-500 mt-4 text-center">Center closed</div>
          )}
          <div className="space-y-1 overflow-hidden">
            {dayAssessments.slice(0, 3).map((assessment, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAssessment(assessment);
                }}
                className="text-gray-900 text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 flex items-center space-x-1"
                style={{ backgroundColor: getAssessmentColor(assessment.type) }}
              >
                <FiEye className="w-3 h-3" />
                <span>{assessment.time} {assessment.title}</span>
              </div>
            ))}
            {dayAssessments.length > 3 && (
              <div className="text-xs text-gray-500 text-gray-500 text-center">+{dayAssessments.length - 3} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    // Next month days to fill remaining slots
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(
        <div key={`next-${i}`} className="h-20 p-2 border border-gray-200 border-gray-200 bg-gray-50 bg-gray-100">
          <span className="text-sm font-semibold text-gray-500 text-gray-500">{i}</span>
        </div>
      );
    }

    return days;
  };

  // Render Week View
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      const dayAssessments = assessments.filter(a => {
        const aDate = new Date(a.date);
        return aDate.getDate() === dayDate.getDate() &&
               aDate.getMonth() === dayDate.getMonth() &&
               aDate.getFullYear() === dayDate.getFullYear();
      });

      weekDays.push(
        <div key={i} className="min-h-[200px] border-r border-gray-200 last:border-r-0 p-2 bg-white">
          <div className="text-center mb-2">
            <div className={`text-xs ${i === 0 ? 'text-red-600' : 'text-gray-500'}`}>{dayNames[i]}</div>
            <div className={`text-lg font-semibold ${
              dayDate.getDate() === new Date().getDate() &&
              dayDate.getMonth() === new Date().getMonth() ? 'text-blue-600' : i === 0 ? 'text-red-600' : 'text-gray-600'
            }`}>{dayDate.getDate()}</div>
          </div>
          <div className="space-y-1">
            {dayAssessments.map((assessment, idx) => (
              <div
                key={idx}
                onClick={() => handleViewAssessment(assessment)}
                className="text-gray-900 text-xs px-2 py-1 rounded cursor-pointer hover:opacity-90"
                style={{ backgroundColor: getAssessmentColor(assessment.type) }}
              >
                <div className="font-medium">{assessment.time}</div>
                <div className="truncate">{assessment.title}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return <div className="grid grid-cols-7">{weekDays}</div>;
  };

  // Render Day View
  const renderDayView = () => {
    const dayAssessments = assessments.filter(a => {
      const aDate = new Date(a.date);
      return aDate.getDate() === currentDate.getDate() &&
             aDate.getMonth() === currentDate.getMonth() &&
             aDate.getFullYear() === currentDate.getFullYear();
    }).sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    return (
      <div className="p-4 bg-white bg-white">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 text-gray-900">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <p className="text-gray-500 text-gray-500">{dayAssessments.length} event(s) scheduled</p>
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          {dayAssessments.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleViewAssessment(assessment)}
              className="bg-gray-50 bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200 border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAssessmentColor(assessment.type) }}></div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-gray-700">{assessment.title}</h4>
                    <p className="text-sm text-gray-600 text-gray-500">{assessment.time} ({assessment.duration} min)</p>
                  </div>
                </div>
                <span className="text-gray-900 text-xs px-2 py-1 rounded capitalize" style={{ backgroundColor: getAssessmentColor(assessment.type) }}>
                  {assessment.type}
                </span>
              </div>
              {assessment.clientName && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 text-gray-500">
                  <FiUser className="w-4 h-4" />
                  <span>{assessment.clientName}</span>
                </div>
              )}
            </motion.div>
          ))}
          {dayAssessments.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-gray-500">
              <FiCalendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No events scheduled for this date</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Event
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Get center name for display
  const getCenterName = () => {
    if (user?.role === 'admin' && selectedCenter) {
      const center = centers.find(c => c.id === selectedCenter);
      return center?.name || 'All Centers';
    }
    if (user?.center_id) {
      const center = centers.find(c => c.id === user.center_id);
      return center?.name || 'My Center';
    }
    return 'All Centers';
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 bg-gray-50 transition-colors duration-300">
      <div className="bg-white bg-white rounded-2xl shadow-sm border border-gray-200 border-gray-200 overflow-hidden text-gray-900 text-gray-900 m-4 lg:m-6">
        {/* Header */}
      <div className="p-4 border-b border-gray-200 border-gray-200 flex items-center justify-between bg-white bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900 text-gray-900 flex items-center space-x-2">
            <span>Center calendar — {getCenterName()}</span>
          </h2>

          {/* Custom Center Selector Dropdown */}
          {user?.role === 'admin' && centers.length > 0 && (
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 bg-gray-50 text-gray-900 text-gray-900 text-sm rounded-lg hover:bg-gray-200 hover:bg-gray-100 transition-colors border border-gray-200 border-gray-300">
                <span>{getCenterName()}</span>
                <span className="text-gray-500 text-gray-500">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white bg-gray-50 border border-gray-200 border-gray-300 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 text-gray-900 hover:bg-gray-100 hover:bg-gray-100 rounded-t-lg"
                >
                  All Centers
                </button>
                {centers.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => setSelectedCenter(center.id)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 text-gray-900 hover:bg-gray-100 hover:bg-gray-100 last:rounded-b-lg"
                  >
                    {center.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show center name for non-admin users */}
          {user?.role !== 'admin' && user?.center_id && (
            <span className="px-3 py-1.5 bg-gray-100 bg-gray-50 text-gray-900 text-gray-900 text-sm rounded-lg border border-gray-200 border-gray-300">
              {getCenterName()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 text-gray-500">
              <FiLoader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 bg-gray-50 text-gray-900 text-gray-900 rounded-lg hover:bg-gray-200 hover:bg-gray-100 transition-colors font-medium border border-gray-200 border-gray-300"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add event</span>
          </button>
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setNewAssessment({ ...newAssessment, type: 'holiday' });
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 bg-gray-50 text-gray-900 text-gray-900 rounded-lg hover:bg-gray-200 hover:bg-gray-100 transition-colors font-medium border border-gray-200 border-gray-300"
          >
            <FiPlus className="w-4 h-4" />
            <span>Mark holiday</span>
          </button>
          <button
            onClick={() => {
              setShowUserList(!showUserList);
              setShowUserCards(false); // Close user cards when toggling list
              setSelectedUser(null);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors font-medium border ${showUserList ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 bg-gray-50 text-gray-900 text-gray-900 border-gray-200 border-gray-300'}`}
          >
            <FiUser className="w-4 h-4" />
            <span>User List ({userStats.length})</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs - Underline Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 border-gray-200">
        <div className="flex items-center space-x-6">
          {['month', 'week', 'therapist', 'holidays', 'workinghours'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-sm pb-2 border-b-2 transition-colors ${
                viewMode === mode
                  ? 'text-gray-900 text-gray-900 border-gray-900 border-gray-900'
                  : 'text-gray-500 text-gray-500 border-transparent hover:text-gray-700 hover:text-gray-600'
              }`}
            >
              {mode === 'month' && 'Month view'}
              {mode === 'week' && 'Week view'}
              {mode === 'therapist' && 'Therapist schedule'}
              {mode === 'holidays' && 'Holidays & closures'}
              {mode === 'workinghours' && 'Working hours'}
            </button>
          ))}
        </div>

        {/* Calendar Navigation - Today between arrows */}
        <div className="flex items-center space-x-2">
          <button onClick={prevPeriod} className="p-1.5 hover:bg-gray-100 hover:bg-gray-100 rounded text-gray-500 text-gray-500 hover:text-gray-900 hover:text-gray-700 transition-colors">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-gray-600 text-gray-600 hover:text-gray-900 hover:text-gray-700 transition-colors"
          >
            Today
          </button>
          <button onClick={nextPeriod} className="p-1.5 hover:bg-gray-100 hover:bg-gray-100 rounded text-gray-500 text-gray-500 hover:text-gray-900 hover:text-gray-700 transition-colors">
            <FiChevronRight className="w-5 h-5" />
          </button>
          <span className="text-gray-900 text-gray-900 font-medium px-3 min-w-[140px] text-center">
            {getPeriodLabel()}
          </span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center space-x-6 px-4 py-3 border-b border-gray-200 border-gray-200 bg-white bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3D3D3D' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">OT/SI</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6B6B6B' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">Speech</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D4D4D4' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">Behaviour/Remedial</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B5CC8E' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">Counselling</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C4A882' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">Holiday/closed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7C5C4A' }}></div>
          <span className="text-sm text-gray-700 text-gray-600">Half day</span>
        </div>
      </div>

      {/* View Mode Content - Hidden when showing user cards */}
      {!showUserCards && !showUserList && viewMode === 'month' && (
        <>
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200 border-gray-200 bg-gray-50 bg-gray-50">
            {dayNames.map((day, index) => (
              <div key={day} className={`py-3 text-center text-sm font-semibold ${index === 0 ? 'text-red-500 text-red-500' : 'text-gray-600 text-gray-500'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {renderCalendarGrid()}
          </div>
        </>
      )}

      {!showUserCards && !showUserList && viewMode === 'week' && renderWeekView()}
      {!showUserCards && !showUserList && viewMode === 'day' && renderDayView()}
      
      {/* User List View */}
      {showUserList && (
        <div className="p-6 bg-white bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 text-gray-900">User Assessment History</h3>
              <p className="text-sm text-gray-600 text-gray-500">Click on a user to view their complete assessment details</p>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search examinee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all w-[200px]"
                />
              </div>
              
              {/* Display Limit Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={displayLimit}
                  onChange={(e) => setDisplayLimit(Number(e.target.value))}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>All</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600 text-gray-500">
                <span className="font-medium">Total: {userStats.length}</span>
              </div>
            </div>
          </div>

          {(() => {
            // Filter users based on search query
            const filteredUsers = userStats.filter(userData => 
              userData.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            // Get limited users (most recent first - already sorted)
            const displayUsers = filteredUsers.slice(0, displayLimit === 100 ? undefined : displayLimit);
            
            if (filteredUsers.length === 0) {
              return (
                <div className="py-10 text-center text-gray-600 text-gray-500">
                  <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{searchQuery ? `No users found matching "${searchQuery}"` : 'No users found with assessments'}</p>
                </div>
              );
            }
            
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayUsers.map((userData, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleViewUserDetail(userData)}
                  className="p-4 rounded-xl border border-gray-200 border-gray-200 bg-white bg-gray-50 cursor-pointer hover:shadow-md transition-all hover:border-blue-300 hover:border-blue-400"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 bg-blue-50 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-blue-600 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-gray-900">{userData.name}</h4>
                        <p className="text-xs text-gray-500 text-gray-500">
                          ID: {userData.id}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600 text-blue-500">{userData.emailCount || 0}</span>
                      <p className="text-xs text-gray-500 text-gray-500">Emails</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 border-gray-300">
                    {(() => {
                      // Show single indicator based on what user has
                      if (userData.assessmentCount > 0 && userData.therapyCount === 0) {
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FiFileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-gray-900">{userData.assessmentCount}</p>
                                <p className="text-xs text-gray-500">Assessment{userData.assessmentCount > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">Assessment Only</span>
                          </div>
                        );
                      } else if (userData.therapyCount > 0 && userData.assessmentCount === 0) {
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <FiUser className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-gray-900">{userData.therapyCount}</p>
                                <p className="text-xs text-gray-500">Therap{userData.therapyCount > 1 ? 'ies' : 'y'}</p>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-lg font-medium">Therapy Only</span>
                          </div>
                        );
                      } else if (userData.assessmentCount > 0 && userData.therapyCount > 0) {
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <FiFileText className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-base font-bold text-gray-900">{userData.assessmentCount}</p>
                                  <p className="text-xs text-gray-500">Assessment</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                  <FiUser className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-base font-bold text-gray-900">{userData.therapyCount}</p>
                                  <p className="text-xs text-gray-500">Therapy</p>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-lg font-medium">Both</span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center justify-center py-2">
                            <p className="text-sm text-gray-400">No assessments or therapies</p>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {userData.lastEmailSent && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Last email: {new Date(userData.lastEmailSent).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 text-gray-500">
                    <span>Click to view details</span>
                    <FiEye className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* User Detail Cards View - Apple Style */}
      {showUserCards && selectedUser && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="p-6 bg-gray-50 min-h-screen"
        >
          {/* Back Button & Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={handleBackToView}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 group"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium text-gray-700">Back to Users</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FiUser className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">Assessment History</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Apple Style with staggered animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{selectedUser.totalCount}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Total Visits</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{selectedUser.assessmentCount}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Assessments</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-3xl font-bold text-gray-900">{selectedUser.therapyCount}</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Therapies</p>
            </motion.div>
          </div>

          {/* Last Visit Info */}
          {selectedUser.lastVisit && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-6"
            >
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Last Visit:</span>{' '}
                {new Date(selectedUser.lastVisit).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </motion.div>
          )}

          {/* Assessment Timeline Cards */}
          <motion.h4 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-semibold text-gray-900 mb-4"
          >
            All Appointments
          </motion.h4>
          
          <div className="space-y-4">
            {selectedUser.assessments
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((assessment, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.5 + (idx * 0.1),
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  whileHover={{ scale: 1.01, x: 8 }}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Date Badge */}
                      <div className="flex flex-col items-center bg-gray-50 rounded-xl p-3 min-w-[60px]">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {new Date(assessment.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                          {new Date(assessment.date).getDate()}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(assessment.date).getFullYear()}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: getAssessmentColor(assessment.type) }}
                          />
                          <h5 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {assessment.title}
                          </h5>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <FiClock className="w-4 h-4" />
                            <span>{assessment.time || 'No time'}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>{assessment.duration} min</span>
                          </span>
                        </div>
                        
                        {assessment.type && (
                          <span
                            className="inline-block mt-2 text-xs px-2.5 py-1 rounded-lg font-medium"
                            style={{ 
                              backgroundColor: `${getAssessmentColor(assessment.type)}20`,
                              color: getAssessmentColor(assessment.type)
                            }}
                          >
                            {assessment.type}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {assessment.notes && (
                      <div className="max-w-[200px]">
                        <p className="text-xs text-gray-400 line-clamp-2">{assessment.notes}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {!showUserCards && !showUserList && viewMode === 'therapist' && (
        <div className="p-6 bg-white bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 text-gray-900">Therapist schedule</h3>
              <p className="text-sm text-gray-600 text-gray-500">Date: {toISODate(currentDate)}</p>
            </div>
            <button
              onClick={fetchTherapistSchedule}
              className="px-3 py-2 text-sm rounded-lg bg-gray-100 bg-gray-50 border border-gray-200 border-gray-300 text-gray-900 text-gray-900 hover:bg-gray-200 hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>

          {therapistScheduleLoading ? (
            <div className="py-10 text-center text-gray-600 text-gray-500">Loading...</div>
          ) : therapists.length === 0 ? (
            <div className="py-10 text-center text-gray-600 text-gray-500">No therapists found for this date.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {therapists.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-gray-200 border-gray-200 bg-white bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 text-gray-900">
                        {t.first_name} {t.last_name}
                      </div>
                      <div className="text-sm text-gray-600 text-gray-500">{t.specialty || 'Therapist'}</div>
                      <div className="text-sm text-gray-600 text-gray-500">{t.centre_name || ''}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${t.is_available ? 'bg-green-100 text-green-700 bg-green-50 text-green-600' : 'bg-red-100 text-red-700 bg-red-50 text-red-600'}`}>
                      {t.is_available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700 text-gray-600">
                    <div>
                      <span className="font-medium">Hours:</span>{' '}
                      {t.login_time && t.logout_time ? `${t.login_time} - ${t.logout_time}` : 'Not set'}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Booked slots:</span>{' '}
                      <span className="text-gray-600 text-gray-500">{t.booked_slots || 'None'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {!showUserCards && !showUserList && viewMode === 'holidays' && (
        <div className="p-6 bg-white bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 text-gray-900">Holidays & closures</h3>
              <p className="text-sm text-gray-600 text-gray-500">This month</p>
            </div>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setNewAssessment({ ...newAssessment, type: 'holiday' });
                setShowAddModal(true);
              }}
              className="px-3 py-2 text-sm rounded-lg bg-gray-100 bg-gray-50 border border-gray-200 border-gray-300 text-gray-900 text-gray-900 hover:bg-gray-200 hover:bg-gray-100"
            >
              Mark holiday
            </button>
          </div>

          {(() => {
            const holidayEvents = (assessments || []).filter(a => a.type === 'holiday' || a.type === 'halfday');
            if (holidayEvents.length === 0) {
              return (
                <div className="py-10 text-center text-gray-600 text-gray-500">No holidays/closures in this range.</div>
              );
            }
            return (
              <div className="space-y-3">
                {holidayEvents
                  .slice()
                  .sort((a, b) => String(a.date).localeCompare(String(b.date)))
                  .map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 border-gray-200 bg-white bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAssessmentColor(e.type) }} />
                        <div>
                          <div className="font-medium text-gray-900 text-gray-900">{e.title}</div>
                          <div className="text-sm text-gray-600 text-gray-500">{e.date}{e.time ? ` • ${e.time}` : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewAssessment(e)}
                          className="p-2 rounded-lg text-gray-600 text-gray-600 hover:bg-gray-100 hover:bg-gray-100"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(e.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:bg-red-50"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            );
          })()}
        </div>
      )}
      {!showUserCards && !showUserList && viewMode === 'workinghours' && (
        <div className="p-6 bg-white bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 text-gray-900">Working hours</h3>
            <p className="text-sm text-gray-600 text-gray-500">Select therapist to view/update hours.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 border-gray-200 bg-white bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 text-gray-600 mb-2">Therapist</label>
              <select
                value={selectedTherapistId}
                onChange={(e) => setSelectedTherapistId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 border-gray-300 bg-white bg-white text-gray-900 text-gray-900"
              >
                <option value="">Select therapist</option>
                {therapists.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name}
                  </option>
                ))}
              </select>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-600 mb-2">Login time</label>
                  <input
                    type="time"
                    value={workingHoursForm.login_time}
                    onChange={(e) => setWorkingHoursForm(prev => ({ ...prev, login_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 border-gray-300 bg-white bg-white text-gray-900 text-gray-900"
                    disabled={!selectedTherapistId}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-600 mb-2">Logout time</label>
                  <input
                    type="time"
                    value={workingHoursForm.logout_time}
                    onChange={(e) => setWorkingHoursForm(prev => ({ ...prev, logout_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 border-gray-300 bg-white bg-white text-gray-900 text-gray-900"
                    disabled={!selectedTherapistId}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-center space-x-2 text-sm text-gray-700 text-gray-600">
                    <input
                      type="checkbox"
                      checked={workingHoursForm.is_available}
                      onChange={(e) => setWorkingHoursForm(prev => ({ ...prev, is_available: e.target.checked }))}
                      disabled={!selectedTherapistId}
                    />
                    <span>Available for booking</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={saveWorkingHours}
                  disabled={!selectedTherapistId || workingHoursSaving}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-gray-900 hover:bg-blue-700 disabled:opacity-60"
                >
                  {workingHoursSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={fetchTherapistSchedule}
                  className="px-4 py-2 rounded-lg bg-gray-100 bg-gray-100 text-gray-900 text-gray-900 border border-gray-200 border-gray-300 hover:bg-gray-200 hover:bg-gray-200"
                >
                  Refresh list
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-gray-500">
                Note: Therapist self-update route is not available; use admin to update working hours.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 border-gray-200 bg-white bg-gray-50">
              <div className="text-sm font-medium text-gray-900 text-gray-900 mb-2">Today snapshot</div>
              <div className="text-sm text-gray-600 text-gray-500 mb-4">{toISODate(currentDate)}</div>
              {therapistScheduleLoading ? (
                <div className="py-8 text-center text-gray-600 text-gray-500">Loading...</div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-auto">
                  {therapists.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 border-gray-200">
                      <div>
                        <div className="text-sm font-medium text-gray-900 text-gray-900">{t.first_name} {t.last_name}</div>
                        <div className="text-xs text-gray-600 text-gray-500">{t.login_time && t.logout_time ? `${t.login_time} - ${t.logout_time}` : 'Hours not set'}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${t.is_available ? 'bg-green-100 text-green-700 bg-green-50 text-green-600' : 'bg-red-100 text-red-700 bg-red-50 text-red-600'}`}>
                        {t.is_available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Selected Date Sidebar */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-gray-900 text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAssessmentsForDate(selectedDate.getDate()).map((assessment) => (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleViewAssessment(assessment)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAssessmentColor(assessment.type) }}></div>
                      <span className="text-sm font-medium text-gray-700">{assessment.title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(assessment)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiClock className="w-4 h-4" />
                      <span>{assessment.time} ({assessment.duration} min)</span>
                    </div>
                    {assessment.clientName && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FiUser className="w-4 h-4" />
                        <span>{assessment.clientName}</span>
                      </div>
                    )}
                    {assessment.notes && (
                      <div className="flex items-start space-x-2 text-sm text-gray-500">
                        <FiFileText className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{assessment.notes}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {getAssessmentsForDate(selectedDate.getDate()).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-blue-600 hover:text-blue-300 font-medium"
                  >
                    Schedule one now
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Assessment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <FiPlus className="w-5 h-5" />
                  <span>{newAssessment.type === 'holiday' || newAssessment.type === 'halfday' ? 'Mark Holiday' : 'Add Event'}</span>
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'ot_si', notes: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddAssessment} className="p-6 space-y-4 bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-600 border border-gray-200">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., Initial Assessment, Progress Review"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>

                {newAssessment.type !== 'holiday' && newAssessment.type !== 'halfday' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={newAssessment.clientName}
                        onChange={(e) => setNewAssessment({...newAssessment, clientName: e.target.value})}
                        placeholder="Client name"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Time *</label>
                      <input
                        type="time"
                        required
                        value={newAssessment.time}
                        onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {newAssessment.type !== 'holiday' && newAssessment.type !== 'halfday' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Duration (min)</label>
                      <select
                        value={newAssessment.duration}
                        onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                      >
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  )}
                  <div className={newAssessment.type === 'holiday' || newAssessment.type === 'halfday' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900"
                    >
                      <option value="ot_si">OT / SI</option>
                      <option value="speech">Speech</option>
                      <option value="behaviour">Behaviour / Remedial</option>
                      <option value="counselling">Counselling</option>
                      <option value="holiday">Holiday / closed</option>
                      <option value="halfday">Half day</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'ot_si', notes: '' });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-all font-medium"
                  >
                    Schedule Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Assessment Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <FiEdit2 className="w-5 h-5" />
                  <span>Edit Event</span>
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-900 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditAssessment} className="p-6 space-y-4 bg-white">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., Initial Assessment, Progress Review"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newAssessment.clientName}
                      onChange={(e) => setNewAssessment({...newAssessment, clientName: e.target.value})}
                      placeholder="Client name"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAssessment.time}
                      onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Duration (min)</label>
                    <select
                      value={newAssessment.duration}
                      onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    >
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900"
                    >
                      <option value="ot_si">OT / SI</option>
                      <option value="speech">Speech</option>
                      <option value="behaviour">Behaviour / Remedial</option>
                      <option value="counselling">Counselling</option>
                      <option value="holiday">Holiday / closed</option>
                      <option value="halfday">Half day</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                  <textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-gray-900 rounded-lg hover:bg-emerald-700 transition-all font-medium"
                  >
                    Update Event
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

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
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
              >
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                    <FiEye className="w-5 h-5" />
                    <span>Event Details</span>
                  </h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
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
                      <p className="text-gray-600 font-medium">{viewingAssessment.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                      <p className="text-gray-600 font-medium">{viewingAssessment.time || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Client Name</label>
                      <p className="text-gray-600">{viewingAssessment.clientName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                      <p className="text-gray-600">{viewingAssessment.duration} min</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <span className="text-gray-900 text-xs px-2 py-1 rounded" style={{ backgroundColor: getAssessmentColor(viewingAssessment.type) }}>
                      {viewingAssessment.type}
                    </span>
                  </div>

                  {viewingAssessment.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                      <p className="text-gray-600">{viewingAssessment.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        openEditModal(viewingAssessment);
                      }}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-gray-900 rounded-lg hover:bg-emerald-700 transition-all font-medium flex items-center justify-center space-x-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleDeleteAssessment(viewingAssessment.id);
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-gray-900 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center space-x-2"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showUserDetailModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUserDetailModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 bg-blue-50 flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-blue-600 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500">Assessment History</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserDetailModal(false)}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* User Stats Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedUser.totalCount}</p>
                    <p className="text-xs text-gray-500">Total Visits</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedUser.assessmentCount}</p>
                    <p className="text-xs text-gray-500">Assessments</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedUser.therapyCount}</p>
                    <p className="text-xs text-gray-500">Therapies</p>
                  </div>
                </div>

                {/* Assessment List */}
                <h4 className="text-sm font-semibold text-gray-600 mb-3">All Appointments</h4>
                <div className="space-y-2">
                  {selectedUser.assessments
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((assessment, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 p-3 rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getAssessmentColor(assessment.type) }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{assessment.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(assessment.date).toLocaleDateString()} • {assessment.time || 'No time'}
                          </p>
                          {assessment.type && (
                            <span
                              className="text-xs px-2 py-0.5 rounded mt-1 inline-block"
                              style={{ backgroundColor: getAssessmentColor(assessment.type), color: '#fff' }}
                            >
                              {assessment.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{assessment.duration} min</p>
                        {assessment.notes && (
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{assessment.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedUser.lastVisit && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Last Visit:</span> {new Date(selectedUser.lastVisit).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default AssessmentCalendar;
