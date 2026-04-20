import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiMail, 
  FiUser, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiTrash2,
  FiRefreshCw,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import api from '../services/api';
import Sidebar from './Sidebar';

const Queries = () => {
  const [activeItem, setActiveItem] = useState('queries');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact-queries');
      if (response.data && response.data.success) {
        setQueries(response.data.data || []);
      } else {
        // Fallback: try to get from localStorage if API fails
        const localQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
        setQueries(localQueries.reverse());
      }
    } catch (err) {
      console.error('Error fetching queries:', err);
      // Fallback to localStorage
      const localQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
      setQueries(localQueries.reverse());
      setError('Using local data. Some queries may not be synced.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/contact-queries/${id}`, { status: newStatus });
      
      // Update local state
      setQueries(queries.map(q => 
        q.id === id ? { ...q, status: newStatus } : q
      ));
      
      // Update localStorage fallback
      const localQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
      const updatedLocal = localQueries.map(q => 
        q.id === id ? { ...q, status: newStatus } : q
      );
      localStorage.setItem('contactQueries', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error('Error updating query status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this query?')) return;
    
    try {
      await api.delete(`/contact-queries/${id}`);
      setQueries(queries.filter(q => q.id !== id));
      
      // Update localStorage
      const localQueries = JSON.parse(localStorage.getItem('contactQueries') || '[]');
      const updatedLocal = localQueries.filter(q => q.id !== id);
      localStorage.setItem('contactQueries', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error('Error deleting query:', err);
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesFilter = filter === 'all' || query.status === filter;
    const matchesSearch = 
      query.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="w-4 h-4 mr-1" />
            Resolved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <FiXCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex">
      <Sidebar 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 min-h-screen bg-slate-50 dark:bg-[#0f0f10] p-6 lg:ml-64 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Contact Queries</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and respond to contact form submissions</p>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Queries</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{queries.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {queries.filter(q => q.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {queries.filter(q => q.status === 'resolved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {queries.filter(q => {
                    const date = new Date(q.created_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FiMail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm dark:shadow-black/20 border dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <div className="flex gap-2">
                {['all', 'pending', 'resolved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-[#2c2c2e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#3a3a3c]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
                />
              </div>
              <button
                onClick={fetchQueries}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-yellow-800 dark:text-yellow-200">
            {error}
          </div>
        )}

        {/* Queries Table */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm dark:shadow-black/20 border dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading queries...</p>
            </div>
          ) : filteredQueries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#2c2c2e] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No queries found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Contact queries will appear here when users submit the contact form'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredQueries.map((query) => (
                    <tr key={query.id} className="hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {query.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{query.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{query.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 dark:text-white max-w-xs truncate">{query.subject}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{query.message}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900 dark:text-white">{formatDate(query.created_at)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(query.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedQuery(query)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {query.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(query.id, 'resolved')}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                title="Mark as Resolved"
                              >
                                <FiCheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(query.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <FiXCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(query.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
        </motion.div>
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border dark:border-gray-800 shadow-2xl dark:shadow-black/40"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Query Details</h2>
                <button
                  onClick={() => setSelectedQuery(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#2c2c2e] rounded-lg transition-colors"
                >
                  <FiXCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-medium text-blue-600 dark:text-blue-400">
                    {selectedQuery.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedQuery.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedQuery.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatDate(selectedQuery.created_at)}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedQuery.status)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Subject</h4>
                <p className="text-lg text-gray-900 dark:text-white">{selectedQuery.subject}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Message</h4>
                <div className="bg-gray-50 dark:bg-[#2c2c2e] rounded-xl p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedQuery.email}?subject=Re: ${selectedQuery.subject}`}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Reply via Email
                </a>
                {selectedQuery.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedQuery.id, 'resolved');
                        setSelectedQuery(null);
                      }}
                      className="py-3 px-6 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedQuery.id, 'rejected');
                        setSelectedQuery(null);
                      }}
                      className="py-3 px-6 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Queries;
