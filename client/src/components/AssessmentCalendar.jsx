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
  FiEdit2
} from 'react-icons/fi';

const AssessmentCalendar = ({ assessments = [], onAddAssessment, onEditAssessment, onDeleteAssessment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    clientName: '',
    time: '',
    duration: 60,
    type: 'assessment',
    notes: ''
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  const handleAddAssessment = (e) => {
    e.preventDefault();
    if (selectedDate && newAssessment.title) {
      onAddAssessment({
        ...newAssessment,
        date: selectedDate.toISOString().split('T')[0],
        id: Date.now()
      });
      setShowAddModal(false);
      setNewAssessment({ title: '', clientName: '', time: '', duration: 60, type: 'assessment', notes: '' });
    }
  };

  const getAssessmentColor = (type) => {
    const colors = {
      assessment: 'bg-blue-500',
      therapy: 'bg-green-500',
      evaluation: 'bg-purple-500',
      followup: 'bg-orange-500',
      meeting: 'bg-pink-500'
    };
    return colors[type] || 'bg-blue-500';
  };

  const renderCalendarGrid = () => {
    const days = [];
    const totalSlots = 42; // 6 rows × 7 columns

    // Empty slots for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-28 bg-gray-50/50"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAssessments = getAssessmentsForDate(day);
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === currentDate.getMonth() &&
                      new Date().getFullYear() === currentDate.getFullYear();
      const isSelected = selectedDate?.getDate() === day;

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleDateClick(day)}
          className={`h-28 p-2 border border-gray-100 cursor-pointer transition-all ${
            isToday ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-gray-50'
          } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {dayAssessments.length > 0 && (
              <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                {dayAssessments.length}
              </span>
            )}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayAssessments.slice(0, 3).map((assessment, idx) => (
              <div
                key={idx}
                className={`${getAssessmentColor(assessment.type)} text-white text-xs px-1.5 py-0.5 rounded truncate`}
              >
                {assessment.time} {assessment.title}
              </div>
            ))}
            {dayAssessments.length > 3 && (
              <div className="text-xs text-gray-500 text-center">+{dayAssessments.length - 3} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    // Fill remaining slots
    const remainingSlots = totalSlots - days.length;
    for (let i = 0; i < remainingSlots; i++) {
      days.push(<div key={`fill-${i}`} className="h-28 bg-gray-50/50"></div>);
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <FiCalendar className="w-5 h-5" />
            <span>Assessment Calendar</span>
          </h2>
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg p-1">
            <button onClick={prevMonth} className="p-1.5 hover:bg-white/20 rounded text-white transition-colors">
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white font-medium px-3 min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-white/20 rounded text-white transition-colors">
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 bg-white/20 text-white text-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-white/20 rounded-lg p-1">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm rounded-md capitalize transition-colors ${
                  viewMode === mode ? 'bg-white text-blue-600' : 'text-white hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Assessment</span>
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
        {dayNames.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {renderCalendarGrid()}
      </div>

      {/* Selected Date Sidebar */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-gray-50 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
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
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getAssessmentColor(assessment.type)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{assessment.title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => onEditAssessment(assessment)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDeleteAssessment(assessment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
                <div className="col-span-full text-center py-8 text-gray-400">
                  <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No assessments scheduled for this date</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600">
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <FiPlus className="w-5 h-5" />
                  <span>Add Assessment</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddAssessment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assessment Title *</label>
                  <input
                    type="text"
                    required
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})}
                    placeholder="e.g., Initial Assessment, Progress Review"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newAssessment.clientName}
                      onChange={(e) => setNewAssessment({...newAssessment, clientName: e.target.value})}
                      placeholder="Client name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      value={newAssessment.time}
                      onChange={(e) => setNewAssessment({...newAssessment, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <select
                      value={newAssessment.duration}
                      onChange={(e) => setNewAssessment({...newAssessment, duration: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newAssessment.type}
                      onChange={(e) => setNewAssessment({...newAssessment, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="assessment">Assessment</option>
                      <option value="therapy">Therapy Session</option>
                      <option value="evaluation">Evaluation</option>
                      <option value="followup">Follow-up</option>
                      <option value="meeting">Meeting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newAssessment.notes}
                    onChange={(e) => setNewAssessment({...newAssessment, notes: e.target.value})}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-500/30"
                  >
                    Schedule Assessment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentCalendar;
