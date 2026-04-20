import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiPercent, FiDollarSign, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useToast } from './Toast';
import api from '../services/api';

const TaxList = ({ onViewTax, onEditTax, onDeleteTax, onCreateNewTax }) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [taxData, setTaxData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.getTaxes();

      if (result.success) {
        // Transform the data for the component
        const transformedData = result.data.map((tax, index) => ({
          id: tax.id,
          taxName: tax.name,
          taxRate: `${tax.rate}%`,
          taxAmount: parseFloat(tax.tax_amount) || 0,
          applicableTransactions: parseInt(tax.applicable_transactions) || 0,
          center: {
            name: 'All Centers', // API doesn't specify center, default to all
            badge: '',
            badgeColor: 'bg-gray-100 text-gray-800'
          },
          therapist: 'All Therapists',
          status: tax.status
        }));

        setTaxData(transformedData);
      } else {
        setError(result.message || 'Failed to fetch tax data');
        toast.error(result.message || 'Failed to fetch tax data');
      }
    } catch (error) {
      console.error('Error fetching taxes:', error);
      setError('Error loading tax data');
      toast.error('Error loading tax data');
    } finally {
      setLoading(false);
    }
  };

  const filteredTaxes = taxData.filter(tax =>
    tax.taxName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.therapist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredTaxes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTaxes = filteredTaxes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getTaxIcon = (taxRate) => {
    return taxRate.includes('%') ? FiPercent : FiDollarSign;
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white transition-colors duration-300">Tax List</h1>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Manage and configure tax settings</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filter</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewTax && onCreateNewTax()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Tax</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-500 mb-6 transition-colors duration-300">
          <span className="hover:text-gray-700 dark:hover:text-gray-300">Home</span>
          <span className="mx-2">›</span>
          <span className="hover:text-gray-700 dark:hover:text-gray-300">Taxes</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-gray-200">All Taxes</span>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-300"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search taxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Loading tax data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="text-red-800 dark:text-red-200 transition-colors duration-300">{error}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchTaxes}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-200 rounded text-sm transition-colors duration-300"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Tax Table */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Tax Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Tax Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Tax Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Applicable Transactions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1c1c1e] divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {currentTaxes.map((tax, index) => {
                  const TaxIcon = getTaxIcon(tax.taxRate);
                  return (
                    <motion.tr
                      key={tax.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                      className="hover:bg-gray-50 dark:hover:bg-[#252528] transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded accent-blue-600" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">
                        {tax.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3 transition-colors duration-300">
                            <TaxIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200 transition-colors duration-300">{tax.taxName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 transition-colors duration-300">
                          {tax.taxRate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">
                        ₹{(tax.taxAmount / 100000).toFixed(1)}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200 transition-colors duration-300">
                        {tax.applicableTransactions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewTax && onViewTax(tax.id)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded transition-colors duration-300"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEditTax && onEditTax(tax.id)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded transition-colors duration-300"
                            title="Edit"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDeleteTax && onDeleteTax(tax.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded transition-colors duration-300"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredTaxes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <FiPercent className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No taxes found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredTaxes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-[#2c2c2e] text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">entries</span>
            </div>

            <div className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTaxes.length)} of {filteredTaxes.length} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-[#2c2c2e] dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2c2c2e] dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-[#2c2c2e] dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Tax Stats */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-colors duration-300">
                <FiPercent className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">{taxData.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Taxes</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg transition-colors duration-300">
                <FiPercent className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                  ₹{(taxData.reduce((sum, tax) => sum + tax.taxAmount, 0) / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Tax Amount</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg transition-colors duration-300">
                <FiPercent className="w-6 h-6 text-yellow-600 dark:text-yellow-400 transition-colors duration-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 transition-colors duration-300">
                  {taxData.reduce((sum, tax) => sum + tax.applicableTransactions, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Applicable Transactions</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg transition-colors duration-300">
                <FiPercent className="w-6 h-6 text-purple-600 dark:text-purple-400 transition-colors duration-300" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">
                  {taxData.filter(tax => tax.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Taxes</div>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaxList;