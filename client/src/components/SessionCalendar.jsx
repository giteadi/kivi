import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar,
  FiClock,
  FiUser,
  FiMapPin,
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBell
} from 'react-icons/fi';

const SessionCalendar = ({ sessions, onSessionClick, onViewSession }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'awaiting_confirmation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled': return <FiCalendar className="w-3 h-3" />;
      case 'confirmed': return <FiCheckCircle className="w-3 h-3" />;
      case 'completed': return <FiCheckCircle className="w-3 h-3" />;
      case 'cancelled': return <FiXCircle className="w-3 h-3" />;
      case 'awaiting_confirmation': return <FiAlertCircle className="w-3 h-3" />;
      default: return <FiCalendar className="w-3 h-3" />;
    }
  };

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const grouped = {};
    sessions.forEach(session => {
      const date = new Date(session.session_date).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(session);
    });
    return grouped;
  }, [sessions]);

  // Get sessions for selected date
  const selectedDateSessions = selectedDate ? sessionsByDate[selectedDate] || [] : [];

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        day: prevMonthLastDay - i
      });
    }
    
    // Current month days
    const today = new Date().toISOString().split('T')[0];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(year, month, i).toISOString().split('T')[0];
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        day: i,
        dateStr,
        isToday: dateStr === today,
        hasSessions: sessionsByDate[dateStr]?.length > 0,
        sessionCount: sessionsByDate[dateStr]?.length || 0
      });
    }
    
    // Next month padding to complete 6 rows (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        day: i
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={goToPreviousMonth}
                className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
              >
                <FiChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors border-x border-gray-200"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
              >
                <FiChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Summary */}
          <div className="text-sm text-gray-600">
            {sessions.length} sessions this month
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: dayInfo.isCurrentMonth ? 1.02 : 1 }}
              onClick={() => dayInfo.isCurrentMonth && setSelectedDate(dayInfo.dateStr)}
              className={`
                relative min-h-[80px] p-1.5 rounded-lg border transition-all text-left
                ${dayInfo.isCurrentMonth 
                  ? 'bg-white hover:bg-blue-50 cursor-pointer' 
                  : 'bg-gray-50 text-gray-400 cursor-default'
                }
                ${dayInfo.isToday ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
                ${selectedDate === dayInfo.dateStr ? 'ring-2 ring-blue-600 bg-blue-50' : ''}
              `}
            >
              <span className={`
                text-sm font-medium
                ${dayInfo.isToday ? 'text-blue-600' : dayInfo.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}
              `}>
                {dayInfo.day}
              </span>
              
              {/* Session Indicators */}
              {dayInfo.hasSessions && (
                <div className="mt-1 space-y-0.5">
                  {dayInfo.sessionCount <= 3 ? (
                    // Show individual dots for 3 or fewer sessions
                    sessionsByDate[dayInfo.dateStr].slice(0, 3).map((session, idx) => (
                      <div
                        key={idx}
                        className={`
                          text-[10px] px-1 py-0.5 rounded truncate
                          ${session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            session.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                            session.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }
                        `}
                      >
                        {session.session_time?.substring(0, 5)}
                      </div>
                    ))
                  ) : (
                    // Show count for more than 3 sessions
                    <div className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                      {dayInfo.sessionCount} sessions
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Date Sessions */}
      {selectedDate && selectedDateSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-200 bg-gray-50"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Sessions on {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <span className="text-sm text-gray-600">{selectedDateSessions.length} session(s)</span>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedDateSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1 capitalize">{session.status?.replace('_', ' ')}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {session.session_time?.substring(0, 5)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {session.student_first_name} {session.student_last_name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{session.programme_name}</p>
                      
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUser className="w-3 h-3" />
                          {session.therapist_first_name} {session.therapist_last_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" />
                          {session.centre_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {session.duration} min
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1 ml-3">
                      <button
                        onClick={() => onViewSession(session)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="View Session"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSessionClick(session)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Session"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State for Selected Date */}
      {selectedDate && selectedDateSessions.length === 0 && (
        <div className="border-t border-gray-200 bg-gray-50 p-8 text-center">
          <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No sessions scheduled for this date</p>
        </div>
      )}
    </div>
  );
};

export default SessionCalendar;
