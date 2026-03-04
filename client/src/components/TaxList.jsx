import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiPercent, FiDollarSign, FiFilter } from 'react-icons/fi';
import { useState } from 'react';

const TaxList = ({ onViewTax, onEditTax, onDeleteTax, onCreateNewTax }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const taxData = [
    {
      id: 5,
      taxName: 'Equipment Handling Tax',
      taxRate: '$15',
      center: {
        name: 'All Centers',
        badge: '',
        badgeColor: 'bg-gray-100 text-gray-800'
      },
      therapist: 'All Therapists'
    },
    {
      id: 4,
      taxName: 'Specialist Fee Tax',
      taxRate: '3%',
      center: {
        name: 'All Centers',
        badge: '',
        badgeColor: 'bg-gray-100 text-gray-800'
      },
      therapist: 'All Therapists'
    },
    {
      id: 3,
      taxName: 'Center Maintenance Tax',
      taxRate: '2%',
      center: {
        name: 'MindSaid Learning Center',
        initials: 'ML',
        email: 'center_kjaggi@mindsaidlearning.com',
        badge: 'ML',
        badgeColor: 'bg-blue-100 text-blue-800'
      },
      therapist: 'All Therapists'
    },
    {
      id: 2,
      taxName: 'Service Tax',
      taxRate: '$10',
      center: {
        name: 'All Centers',
        badge: '',
        badgeColor: 'bg-gray-100 text-gray-800'
      },
      therapist: 'All Therapists'
    },
    {
      id: 1,
      taxName: 'VAT',
      taxRate: '5%',
      center: {
        name: 'All Centers',
        badge: '',
        badgeColor: 'bg-gray-100 text-gray-800'
      },
      therapist: 'All Therapists'
    }
  ];

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
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Tax List</h1>
            <p className="text-gray-600">Manage and configure tax settings</p>
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
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Taxes</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">All Taxes</span>
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
                placeholder="Search taxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Tax Table */}
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
                    Center
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Therapist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTaxes.map((tax, index) => {
                  const TaxIcon = getTaxIcon(tax.taxRate);
                  return (
                    <motion.tr
                      key={tax.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {tax.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <TaxIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{tax.taxName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tax.taxRate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {tax.center.badge ? (
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-2 ${tax.center.badgeColor}`}>
                              <span className="text-xs font-semibold">{tax.center.badge}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{tax.center.name}</div>
                              <div className="text-xs text-gray-500">{tax.center.email}</div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-900">{tax.center.name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tax.therapist}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onViewTax && onViewTax(tax.id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View"
                          >
                            <FiEye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onEditTax && onEditTax(tax.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDeleteTax && onDeleteTax(tax.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
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
              <div className="text-gray-500">
                <FiPercent className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No taxes found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredTaxes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredTaxes.length)} of {filteredTaxes.length} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}

        {/* Tax Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPercent className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{taxData.length}</div>
                <div className="text-sm text-gray-600">Total Taxes</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiPercent className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {taxData.filter(tax => tax.taxRate.includes('%')).length}
                </div>
                <div className="text-sm text-gray-600">Percentage Taxes</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {taxData.filter(tax => tax.taxRate.includes('$')).length}
                </div>
                <div className="text-sm text-gray-600">Fixed Amount Taxes</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiPercent className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {taxData.filter(tax => tax.center.name === 'All Centers').length}
                </div>
                <div className="text-sm text-gray-600">Global Taxes</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TaxList;