import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone, FiMapPin, FiFilter, FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';

const AdminSessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAllSessions();
  }, [refreshKey]);

  const fetchAllSessions = async () => {
    setLoading(true);
    try {
      const response = await api.request('/dashboard/admin/sessions');
      console.log('🔍 Admin sessions response:', response);
      if (response.success) {
        setSessions(response.data);
      } else {
        console.error('Failed to fetch sessions:', response.message);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      (session.student_first_name && session.student_first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.student_last_name && session.student_last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.user_email && session.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.therapist_first_name && session.therapist_first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (session.centre_name && session.centre_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesDate = !dateFilter || session.session_date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'awaiting_confirmation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Sessions</h1>
            <p className="text-gray-600">View and manage all booked sessions</p>
          </div>
          <button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by student, therapist, centre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="awaiting_confirmation">Awaiting Confirmation</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Assessments ({filteredSessions.length})
            </h2>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No assessments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Center
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programme
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <FiCalendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-900">
                            {new Date(session.session_date).toLocaleDateString()}
                          </span>
                          <FiClock className="w-4 h-4 text-blue-500 ml-2" />
                          <span className="text-sm text-gray-900">{session.session_time}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {session.student_first_name} {session.student_last_name}
                          </div>
                          {session.student_email && (
                            <div className="text-gray-500 flex items-center mt-1">
                              <FiMail className="w-3 h-3 mr-1" />
                              {session.student_email}
                            </div>
                          )}
                          {session.student_phone && (
                            <div className="text-gray-500 flex items-center mt-1">
                              <FiPhone className="w-3 h-3 mr-1" />
                              {session.student_phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {session.therapist_first_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900">
                            <FiMapPin className="w-4 h-4 mr-1 text-blue-500" />
                            {session.centre_name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {session.programme_name}
                          </div>
                          {session.programme_fee && (
                            <div className="text-gray-500">
                              ₹{session.programme_fee}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(session.payment_status)}`}>
                            {session.payment_status}
                          </span>
                          {session.total_amount > 0 && (
                            <div className="text-gray-500 mt-1">
                              ₹{session.total_amount}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSessionsList;
