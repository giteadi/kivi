import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiCalendar, FiUser, FiClock, FiUpload } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointments } from '../store/slices/appointmentSlice';
import ImportModal from './ImportModal';

const AppointmentsList = ({ onViewAppointment, onEditAppointment, onDeleteAppointment, onCreateNewAppointment }) => {
  const dispatch = useDispatch();
  const { appointments, isLoading, error } = useSelector((state) => state.appointments);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Load appointments on component mount
  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Transform API data to match frontend format
  const transformedAppointments = appointments.map(appointment => ({
    id: appointment.id,
    patient: `${appointment.patient_first_name} ${appointment.patient_last_name}`,
    doctor: `${appointment.doctor_first_name} ${appointment.doctor_last_name}`,
    clinic: appointment.clinic_name || 'Unknown Clinic',
    date: new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: new Date(`1970-01-01T${appointment.appointment_time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }),
    type: appointment.notes || 'General Visit',
    status: appointment.status === 'scheduled' ? 'Booked' : 
            appointment.status === 'confirmed' ? 'Confirmed' :
            appointment.status === 'completed' ? 'Completed' :
            appointment.status === 'cancelled' ? 'Cancelled' : 'Pending',
    duration: `${appointment.duration || 30} min`,
    service: appointment.service_name || 'General Consultation',
    amount: `₹${appointment.service_price || 0}.00`
  }));

  const filteredAppointments = transformedAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Sessions</h1>
            <p className="text-gray-600">Manage and view all student sessions</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span>Import Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewAppointment && onCreateNewAppointment()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Session</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Sessions</span>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="booked">Booked</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Appointments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading appointments...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500">
                <p className="text-lg font-medium">Error loading appointments</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <motion.tr
                      key={appointment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <FiUser className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                            <div className="text-sm text-gray-500">{appointment.clinic}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.doctor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div>{appointment.date}</div>
                            <div className="text-gray-500 flex items-center">
                              <FiClock className="w-3 h-3 mr-1" />
                              {appointment.time} ({appointment.duration})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.service}</div>
                        <div className="text-sm text-gray-500">{appointment.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewAppointment(appointment.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditAppointment && onEditAppointment(appointment.id);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteAppointment && onDeleteAppointment(appointment.id);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !error && filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No sessions found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{transformedAppointments.length}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {transformedAppointments.filter(a => a.status === 'Confirmed').length}
            </div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {transformedAppointments.filter(a => a.status === 'Booked').length}
            </div>
            <div className="text-sm text-gray-600">Booked</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {transformedAppointments.filter(a => a.status === 'Pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-600">
              {transformedAppointments.filter(a => a.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </motion.div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importType="sessions"
      />
    </div>
  );
};

export default AppointmentsList;