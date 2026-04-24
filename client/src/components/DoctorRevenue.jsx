import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiUser, FiMail, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useToast } from './Toast';

const DoctorRevenue = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [doctorRevenueData, setDoctorRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorRevenue();
  }, []);

  const fetchDoctorRevenue = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.getDoctorRevenue();

      if (result.success) {
        // Transform the data for the component
        const transformedData = result.data.map((item, index) => ({
          id: index + 1,
          rank: index + 1,
          sessions: parseInt(item.total_transactions) || 0,
          revenue: parseFloat(item.total_revenue) || 0,
          doctor: {
            name: `Dr. ${item.first_name} ${item.last_name}`,
            initials: `${(item.first_name || '')[0]}${(item.last_name || '')[0]}`.toUpperCase(),
            email: 'Not provided', // API doesn't return email
            badge: item.specialty?.substring(0, 2).toUpperCase() || 'MD',
            badgeColor: 'bg-blue-100 text-blue-800'
          },
          clinic: {
            name: 'Centrix Centre', // Default clinic name
            initials: 'ML',
            email: 'Not provided',
            badge: 'MS',
            badgeColor: 'bg-purple-100 text-purple-800'
          }
        }));

        setDoctorRevenueData(transformedData);
      } else {
        setError(result.message || 'Failed to fetch therapist revenue data');
        toast.error(result.message || 'Failed to fetch therapist revenue data');
      }
    } catch (error) {
      console.error('Error fetching therapist revenue:', error);
      setError('Error loading therapist revenue data');
      toast.error('Error loading therapist revenue data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = doctorRevenueData.filter(item =>
    item.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const statusStr = String(status || '').toLowerCase();
    switch (statusStr) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = doctorRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSessions = doctorRevenueData.reduce((sum, item) => sum + item.sessions, 0);

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Therapist Revenue</h1>
            <p className="text-gray-600">Revenue analysis by therapist performance</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Financial</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Therapist Revenue</span>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search therapists or clinics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading therapist revenue data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-red-800">{error}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchDoctorRevenue}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Therapist Revenue Table */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Therapist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Clinic
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(item.revenue / 100000).toFixed(1)}L
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${item.doctor.badgeColor}`}>
                          <span className="text-sm font-semibold">{item.doctor.badge}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.doctor.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {item.doctor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${item.clinic.badgeColor}`}>
                          <span className="text-xs font-semibold">{item.clinic.badge}</span>
                        </div>
                        <span className="text-sm text-gray-900">{item.clinic.name}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No therapist revenue data found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Revenue Stats */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{doctorRevenueData.length}</div>
                <div className="text-sm text-gray-600">Total Therapists</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">₹{(totalRevenue / 100000).toFixed(1)}L</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiUser className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {doctorRevenueData.length > 0 ? `₹${(totalRevenue / doctorRevenueData.length / 100000).toFixed(1)}L` : '₹0L'}
                </div>
                <div className="text-sm text-gray-600">Avg Revenue</div>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorRevenue;