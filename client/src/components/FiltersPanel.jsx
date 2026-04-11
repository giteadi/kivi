import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUser, FiMapPin, FiFilter } from 'react-icons/fi';
import { useState } from 'react';

const FiltersPanel = ({ isOpen, onClose, onApplyFilters, filterType = 'patients' }) => {
  const [filters, setFilters] = useState({
    studentId: '',
    studentName: '',
    centre: '',
    registeredOn: '',
    status: '',
    dateRange: {
      from: '',
      to: ''
    },
    specialty: '',
    department: '',
    shift: '',
    performance: '',
    centreName: '',
    city: '',
    state: '',
    emergencyServices: ''
  });

  const centres = [
    'All Centres',
    'Centrix Centre',
    'Green Valley Learning Centre', 
    'Sunrise Learning Centre',
    'Downtown Learning Centre'
  ];

  const statuses = [
    'All Status',
    'Active',
    'Inactive',
    'On Leave',
    'Suspended'
  ];

  const specialties = [
    'All Specialties',
    'Learning Therapy',
    'Behavioral Therapy',
    'Speech Therapy',
    'Occupational Therapy',
    'Educational Psychology',
    'Special Needs Support'
  ];

  const departments = [
    'All Departments',
    'Front Desk',
    'Student Registration',
    'Emergency Desk',
    'Billing',
    'Session Scheduling'
  ];

  const shifts = [
    'All Shifts',
    'Morning',
    'Evening',
    'Night'
  ];

  const performances = [
    'All Performance',
    'Excellent',
    'Good',
    'Average',
    'Poor'
  ];

  const handleFilterChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFilters(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleReset = () => {
    setFilters({
      studentId: '',
      studentName: '',
      centre: '',
      registeredOn: '',
      status: '',
      dateRange: {
        from: '',
        to: ''
      },
      specialty: '',
      department: '',
      shift: '',
      performance: '',
      centreName: '',
      city: '',
      state: '',
      emergencyServices: ''
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const renderPatientFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student ID
          </label>
          <input
            type="text"
            value={filters.studentId}
            onChange={(e) => handleFilterChange('studentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="eg 123"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            value={filters.studentName}
            onChange={(e) => handleFilterChange('studentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="eg Sophia Anderson"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre
          </label>
          <select
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {centres.map(centre => (
              <option key={centre} value={centre === 'All Centres' ? '' : centre}>
                {centre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registered ON
          </label>
          <input
            type="date"
            value={filters.registeredOn}
            onChange={(e) => handleFilterChange('registeredOn', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'All Status' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );

  const renderDoctorFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Therapist Name
          </label>
          <input
            type="text"
            value={filters.studentName}
            onChange={(e) => handleFilterChange('studentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter therapist name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialty
          </label>
          <select
            value={filters.specialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty === 'All Specialties' ? '' : specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre
          </label>
          <select
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {centres.map(centre => (
              <option key={centre} value={centre === 'All Centres' ? '' : centre}>
                {centre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'All Status' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Join Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => handleFilterChange('dateRange.from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => handleFilterChange('dateRange.to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="To"
            />
          </div>
        </div>
      </div>
    </>
  );
  // Temporarily disabled for future use
  const renderReceptionistFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Receptionist Name
          </label>
          <input
            type="text"
            value={filters.patientName}
            onChange={(e) => handleFilterChange('patientName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter receptionist name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {departments.map(dept => (
              <option key={dept} value={dept === 'All Departments' ? '' : dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shift
          </label>
          <select
            value={filters.shift}
            onChange={(e) => handleFilterChange('shift', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {shifts.map(shift => (
              <option key={shift} value={shift === 'All Shifts' ? '' : shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre
          </label>
          <select
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {centres.map(centre => (
              <option key={centre} value={centre === 'All Centres' ? '' : centre}>
                {centre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance
          </label>
          <select
            value={filters.performance}
            onChange={(e) => handleFilterChange('performance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {performances.map(perf => (
              <option key={perf} value={perf === 'All Performance' ? '' : perf}>
                {perf}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'All Status' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );

  const renderAppointmentFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>
          <input
            type="text"
            value={filters.studentName}
            onChange={(e) => handleFilterChange('studentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter student name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Therapist Name
          </label>
          <input
            type="text"
            value={filters.studentId}
            onChange={(e) => handleFilterChange('studentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter therapist name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre
          </label>
          <select
            value={filters.centre}
            onChange={(e) => handleFilterChange('centre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {centres.map(centre => (
              <option key={centre} value={centre === 'All Centres' ? '' : centre}>
                {centre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => handleFilterChange('dateRange.from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => handleFilterChange('dateRange.to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="To"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Awaiting Confirmation">Awaiting Confirmation</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderClinicFilters = () => (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centre Name
          </label>
          <input
            type="text"
            value={filters.centreName || ''}
            onChange={(e) => handleFilterChange('centreName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter centre name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={filters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            value={filters.state || ''}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All States</option>
            <option value="NY">New York</option>
            <option value="CA">California</option>
            <option value="FL">Florida</option>
            <option value="IL">Illinois</option>
            <option value="TX">Texas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialty
          </label>
          <select
            value={filters.specialty}
            onChange={(e) => handleFilterChange('specialty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {specialties.map(specialty => (
              <option key={specialty} value={specialty === 'All Specialties' ? '' : specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status === 'All Status' ? '' : status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Services
          </label>
          <select
            value={filters.emergencyServices || ''}
            onChange={(e) => handleFilterChange('emergencyServices', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Centres</option>
            <option value="true">With Emergency Services</option>
            <option value="false">Without Emergency Services</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Established Date Range
          </label>
          <div className="space-y-2">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => handleFilterChange('dateRange.from', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="From"
            />
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => handleFilterChange('dateRange.to', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="To"
            />
          </div>
        </div>
      </div>
    </>
  );

  const getFilterContent = () => {
    switch (filterType) {
      case 'patients':
        return renderPatientFilters();
      case 'doctors':
        return renderDoctorFilters();
      // case 'receptionists':
      //   return renderReceptionistFilters(); // Temporarily disabled for future use
      case 'appointments':
        return renderAppointmentFilters();
      case 'clinics':
        return renderClinicFilters();
      default:
        return renderPatientFilters();
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Filters Panel */}
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-80 h-full bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6">
              {getFilterContent()}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t p-6">
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FiltersPanel;