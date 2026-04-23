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
  FiEye
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const AssessmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState('month');
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
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
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
        <div key={`prev-${i}`} className="h-20 p-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#252527]">
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">{dayNum}</span>
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
          className={`h-20 p-2 border border-gray-200 dark:border-gray-800 cursor-pointer transition-all ${
            isToday
              ? 'ring-2 ring-blue-500 bg-gray-100 dark:bg-[#2C2C2E]'
              : 'bg-white dark:bg-[#1C1C1E] hover:bg-gray-100 dark:hover:bg-[#2C2C2E]'
          } ${isSelected ? 'bg-gray-200 dark:bg-[#3A3A3C]' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : isSunday ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
              {day}
            </span>
            {dayAssessments.length > 0 && (
              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                {dayAssessments.length}
              </span>
            )}
          </div>
          {isSunday && dayAssessments.length === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-4 text-center">Center closed</div>
          )}
          <div className="space-y-1 overflow-hidden">
            {dayAssessments.slice(0, 3).map((assessment, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewAssessment(assessment);
                }}
                className="text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 flex items-center space-x-1"
                style={{ backgroundColor: getAssessmentColor(assessment.type) }}
              >
                <FiEye className="w-3 h-3" />
                <span>{assessment.time} {assessment.title}</span>
              </div>
            ))}
            {dayAssessments.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-500 text-center">+{dayAssessments.length - 3} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    // Next month days to fill remaining slots
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push(
        <div key={`next-${i}`} className="h-20 p-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#252527]">
          <span className="text-sm font-semibold text-gray-400 dark:text-gray-600">{i}</span>
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
        <div key={i} className="min-h-[200px] border-r border-gray-800 last:border-r-0 p-2 bg-[#1C1C1E]">
          <div className="text-center mb-2">
            <div className={`text-xs ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>{dayNames[i]}</div>
            <div className={`text-lg font-semibold ${
              dayDate.getDate() === new Date().getDate() &&
              dayDate.getMonth() === new Date().getMonth() ? 'text-blue-400' : i === 0 ? 'text-red-400' : 'text-gray-300'
            }`}>{dayDate.getDate()}</div>
          </div>
          <div className="space-y-1">
            {dayAssessments.map((assessment, idx) => (
              <div
                key={idx}
                onClick={() => handleViewAssessment(assessment)}
                className="text-white text-xs px-2 py-1 rounded cursor-pointer hover:opacity-90"
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
      <div className="p-4 bg-white dark:bg-[#1C1C1E]">
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{dayAssessments.length} event(s) scheduled</p>
        </div>
        <div className="space-y-3 max-w-2xl mx-auto">
          {dayAssessments.map((assessment) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleViewAssessment(assessment)}
              className="bg-gray-50 dark:bg-[#2C2C2E] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getAssessmentColor(assessment.type) }}></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-200">{assessment.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{assessment.time} ({assessment.duration} min)</p>
                  </div>
                </div>
                <span className="text-white text-xs px-2 py-1 rounded capitalize" style={{ backgroundColor: getAssessmentColor(assessment.type) }}>
                  {assessment.type}
                </span>
              </div>
              {assessment.clientName && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiUser className="w-4 h-4" />
                  <span>{assessment.clientName}</span>
                </div>
              )}
            </motion.div>
          ))}
          {dayAssessments.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No events scheduled for this date</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden text-gray-900 dark:text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Center calendar — {getCenterName()}</span>
          </h2>

          {/* Custom Center Selector Dropdown */}
          {user?.role === 'admin' && centers.length > 0 && (
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-[#2C2C2E] text-gray-900 dark:text-white text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-[#3A3A3C] transition-colors border border-gray-200 dark:border-gray-700">
                <span>{getCenterName()}</span>
                <span className="text-gray-500 dark:text-gray-400">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3A3A3C] rounded-t-lg"
                >
                  All Centers
                </button>
                {centers.map((center) => (
                  <button
                    key={center.id}
                    onClick={() => setSelectedCenter(center.id)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-[#3A3A3C] last:rounded-b-lg"
                  >
                    {center.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show center name for non-admin users */}
          {user?.role !== 'admin' && user?.center_id && (
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-[#2C2C2E] text-gray-900 dark:text-white text-sm rounded-lg border border-gray-200 dark:border-gray-700">
              {getCenterName()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {loading && (
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <FiLoader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-[#2C2C2E] text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#3A3A3C] transition-colors font-medium border border-gray-200 dark:border-gray-700"
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
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-[#2C2C2E] text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-[#3A3A3C] transition-colors font-medium border border-gray-200 dark:border-gray-700"
          >
            <FiPlus className="w-4 h-4" />
            <span>Mark holiday</span>
          </button>
        </div>
      </div>

      {/* View Mode Tabs - Underline Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-6">
          {['month', 'week', 'therapist', 'holidays', 'workinghours'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`text-sm pb-2 border-b-2 transition-colors ${
                viewMode === mode
                  ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
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
          <button onClick={prevPeriod} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3A3A3C] rounded text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Today
          </button>
          <button onClick={nextPeriod} className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3A3A3C] rounded text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <FiChevronRight className="w-5 h-5" />
          </button>
          <span className="text-gray-900 dark:text-white font-medium px-3 min-w-[140px] text-center">
            {getPeriodLabel()}
          </span>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center space-x-6 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3D3D3D' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">OT/SI</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#6B6B6B' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Speech</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#D4D4D4' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Behaviour/Remedial</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B5CC8E' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Counselling</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#C4A882' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Holiday/closed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#7C5C4A' }}></div>
          <span className="text-sm text-gray-700 dark:text-gray-300">Half day</span>
        </div>
      </div>

      {/* View Mode Content */}
      {viewMode === 'month' && (
        <>
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#2C2C2E]">
            {dayNames.map((day, index) => (
              <div key={day} className={`py-3 text-center text-sm font-semibold ${index === 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
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

      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'therapist' && (
        <div className="p-6 bg-white dark:bg-[#1C1C1E]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Therapist schedule</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date: {toISODate(currentDate)}</p>
            </div>
            <button
              onClick={fetchTherapistSchedule}
              className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3A3A3C]"
            >
              Refresh
            </button>
          </div>

          {therapistScheduleLoading ? (
            <div className="py-10 text-center text-gray-600 dark:text-gray-400">Loading...</div>
          ) : therapists.length === 0 ? (
            <div className="py-10 text-center text-gray-600 dark:text-gray-400">No therapists found for this date.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {therapists.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2C2C2E]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {t.first_name} {t.last_name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t.specialty || 'Therapist'}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{t.centre_name || ''}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${t.is_available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                      {t.is_available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <span className="font-medium">Hours:</span>{' '}
                      {t.login_time && t.logout_time ? `${t.login_time} - ${t.logout_time}` : 'Not set'}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Booked slots:</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{t.booked_slots || 'None'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {viewMode === 'holidays' && (
        <div className="p-6 bg-white dark:bg-[#1C1C1E]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Holidays & closures</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
            </div>
            <button
              onClick={() => {
                setSelectedDate(new Date());
                setNewAssessment({ ...newAssessment, type: 'holiday' });
                setShowAddModal(true);
              }}
              className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#3A3A3C]"
            >
              Mark holiday
            </button>
          </div>

          {(() => {
            const holidayEvents = (assessments || []).filter(a => a.type === 'holiday' || a.type === 'halfday');
            if (holidayEvents.length === 0) {
              return (
                <div className="py-10 text-center text-gray-600 dark:text-gray-400">No holidays/closures in this range.</div>
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
                      className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2C2C2E]"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAssessmentColor(e.type) }} />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{e.title}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{e.date}{e.time ? ` • ${e.time}` : ''}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewAssessment(e)}
                          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3A3C]"
                          title="View"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(e.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
      {viewMode === 'workinghours' && (
        <div className="p-6 bg-white dark:bg-[#1C1C1E]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Working hours</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Select therapist to view/update hours.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2C2C2E]">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Therapist</label>
              <select
                value={selectedTherapistId}
                onChange={(e) => setSelectedTherapistId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Login time</label>
                  <input
                    type="time"
                    value={workingHoursForm.login_time}
                    onChange={(e) => setWorkingHoursForm(prev => ({ ...prev, login_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white"
                    disabled={!selectedTherapistId}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logout time</label>
                  <input
                    type="time"
                    value={workingHoursForm.logout_time}
                    onChange={(e) => setWorkingHoursForm(prev => ({ ...prev, logout_time: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1C1E] text-gray-900 dark:text-white"
                    disabled={!selectedTherapistId}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="inline-flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
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
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {workingHoursSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={fetchTherapistSchedule}
                  className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#3A3A3C] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-[#4A4A4C]"
                >
                  Refresh list
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Note: Therapist self-update route is not available; use admin to update working hours.
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2C2C2E]">
              <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Today snapshot</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">{toISODate(currentDate)}</div>
              {therapistScheduleLoading ? (
                <div className="py-8 text-center text-gray-600 dark:text-gray-400">Loading...</div>
              ) : (
                <div className="space-y-2 max-h-[360px] overflow-auto">
                  {therapists.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{t.first_name} {t.last_name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{t.login_time && t.logout_time ? `${t.login_time} - ${t.logout_time}` : 'Hours not set'}</div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${t.is_available ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
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
            className="border-t border-gray-800 bg-[#2C2C2E] p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
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
                  className="bg-[#1C1C1E] p-4 rounded-xl shadow-sm border border-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getAssessmentColor(assessment.type) }}></div>
                      <span className="text-sm font-medium text-gray-200">{assessment.title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openEditModal(assessment)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-[#3A3A3C] rounded transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-[#3A3A3C] rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <FiClock className="w-4 h-4" />
                      <span>{assessment.time} ({assessment.duration} min)</span>
                    </div>
                    {assessment.clientName && (
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <FiUser className="w-4 h-4" />
                        <span>{assessment.clientName}</span>
                      </div>
                    )}
                    {assessment.notes && (
                      <div className="flex items-start space-x-2 text-sm text-gray-400">
                        <FiFileText className="w-4 h-4 mt-0.5" />
                        <span className="line-clamp-2">{assessment.notes}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {getAssessmentsForDate(selectedDate.getDate()).length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No events scheduled for this date</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-blue-400 hover:text-blue-300 font-medium"
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
              className="bg-[#1C1C1E] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-800"
            >
              <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#2C2C2E]">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FiPlus className="w-5 h-5" />
                  <span>{newAssessment.type === 'holiday' || newAssessment.type === 'halfday' ? 'Mark Holiday' : 'Add Event'}</span>
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'ot_si', notes: '' });
                  }}
                  className="p-2 hover:bg-[#3A3A3C] rounded-lg text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddAssessment} className="p-6 space-y-4 bg-[#1C1C1E]">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
                  <div className="px-3 py-2 bg-[#2C2C2E] rounded-lg text-gray-300 border border-gray-800">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., Initial Assessment, Progress Review"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                  />
                </div>

                {newAssessment.type !== 'holiday' && newAssessment.type !== 'halfday' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={newAssessment.clientName}
                        onChange={(e) => setNewAssessment({...newAssessment, clientName: e.target.value})}
                        placeholder="Client name"
                        className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Time *</label>
                      <input
                        type="time"
                        required
                        value={newAssessment.time}
                        onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                        className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {newAssessment.type !== 'holiday' && newAssessment.type !== 'halfday' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Duration (min)</label>
                      <select
                        value={newAssessment.duration}
                        onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
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
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-white placeholder-gray-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'ot_si', notes: '' });
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#2C2C2E] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
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
              className="bg-[#1C1C1E] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-800"
            >
              <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#2C2C2E]">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FiEdit2 className="w-5 h-5" />
                  <span>Edit Event</span>
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-[#3A3A3C] rounded-lg text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditAssessment} className="p-6 space-y-4 bg-[#1C1C1E]">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., Initial Assessment, Progress Review"
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newAssessment.clientName}
                      onChange={(e) => setNewAssessment({...newAssessment, clientName: e.target.value})}
                      placeholder="Client name"
                      className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={newAssessment.time}
                      onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Duration (min)</label>
                    <select
                      value={newAssessment.duration}
                      onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
                    >
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                      className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white"
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
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                  <textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#2C2C2E] border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-white placeholder-gray-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#2C2C2E] transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium"
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
                className="bg-[#1C1C1E] rounded-2xl shadow-2xl w-full max-w-md border border-gray-800"
              >
                <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#2C2C2E] rounded-t-2xl">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <FiEye className="w-5 h-5" />
                    <span>Event Details</span>
                  </h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                    <p className="text-lg font-semibold text-white">{viewingAssessment.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
                      <p className="text-gray-300 font-medium">{viewingAssessment.date}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Time</label>
                      <p className="text-gray-300 font-medium">{viewingAssessment.time || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Client Name</label>
                      <p className="text-gray-300">{viewingAssessment.clientName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                      <p className="text-gray-300">{viewingAssessment.duration} min</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                    <span className="text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: getAssessmentColor(viewingAssessment.type) }}>
                      {viewingAssessment.type}
                    </span>
                  </div>

                  {viewingAssessment.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                      <p className="text-gray-300">{viewingAssessment.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        openEditModal(viewingAssessment);
                      }}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium flex items-center justify-center space-x-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleDeleteAssessment(viewingAssessment.id);
                      }}
                      className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center space-x-2"
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
    </div>
  );
};

export default AssessmentCalendar;
