import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiFilter, FiUpload, FiActivity } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../store/slices/serviceSlice';
import ImportModal from './ImportModal';

const ServicesList = ({ onViewService, onEditService, onDeleteService, onCreateNewService }) => {
  const dispatch = useDispatch();
  const { services: servicesData, isLoading, error } = useSelector((state) => state.services);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Load services on component mount
  useEffect(() => {
    console.log('=== ServicesList: Fetching services ===');
    dispatch(fetchServices());
  }, [dispatch]);

  // Debug services data
  useEffect(() => {
    console.log('=== ServicesList: Services state ===', servicesData);
    console.log('=== ServicesList: isLoading ===', isLoading);
    console.log('=== ServicesList: error ===', error);
    console.log('=== ServicesList: Component re-rendered ===');
  }, [servicesData, isLoading, error]);

  const categories = [
    'General',
    'Learning Support', 
    'Behavioral Therapy',
    'Speech Therapy',
    'Occupational Therapy',
    'Educational Assessment',
    'Special Needs Support',
    'Family Counseling',
    'Child Development',
    'Educational Psychology'
  ];

  // Remove hardcoded services array - will use Redux data instead

  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (service.centre_name && service.centre_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || (service.category && service.category === selectedCategory);
    const matchesStatus = filterStatus === 'all' || (service.status && service.status.toLowerCase() === filterStatus.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">All Programs</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage educational programs and therapy services</p>
            </div>
            
            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                <FiUpload className="w-4 h-4" />
                <span className="hidden xs:inline">Import Programme Data</span>
                <span className="xs:hidden">Import</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onCreateNewService && onCreateNewService()}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                <FiPlus className="w-4 h-4" />
                <span className="hidden xs:inline">Add Program</span>
                <span className="xs:hidden">Add</span>
              </motion.button>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 overflow-x-auto">
            <span>Home</span>
            <span className="mx-1 sm:mx-2">›</span>
            <span>Services</span>
            <span className="mx-1 sm:mx-2">›</span>
            <span className="text-gray-800 dark:text-gray-300 whitespace-nowrap">All Programs</span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
          {/* Category Sidebar - Mobile Dropdown, Desktop Sidebar */}
          <div className="xl:w-64">
            {/* Mobile Category Dropdown */}
            <div className="xl:hidden mb-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </motion.div>
            </div>

            {/* Desktop Category Sidebar */}
            <div className="hidden xl:block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800 sticky top-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Category</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      !selectedCategory 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                        selectedCategory === category 
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 font-medium' 
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1c1c1e] rounded-xl p-4 lg:p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800 mb-4 lg:mb-6"
            >
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
                {/* Status Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white min-w-0 transition-colors duration-300"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Search */}
                <div className="flex-1 relative min-w-0">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Anything"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </motion.button>
              </div>
            </motion.div>
            
            {/* Services Table - Mobile Cards, Desktop Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-sm dark:shadow-black/20 border dark:border-gray-800 overflow-hidden"
            >
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white dark:bg-blue-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Service ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Center
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Therapist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#1c1c1e] divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredServices.map((service, index) => (
                      <motion.tr
                        key={service.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer"
                        onClick={() => onEditService && onEditService(service.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{service.programme_id}</span>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{service.id}</span>
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Click to edit</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{service.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{service.centre_id}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">Centre {service.centre_id}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Center Location</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {service.therapist_first_name ? (
                              <>
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-2">
                                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                                    {service.therapist_first_name.charAt(0)}{service.therapist_last_name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {service.therapist_first_name} {service.therapist_last_name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{service.therapist_specialty}</div>
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400">Not assigned</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">₹{service.fee}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="text-gray-900 dark:text-white">{service.duration} mins</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onViewService && onViewService(service.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded"
                              title="View Service"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEditService && onEditService(service.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded"
                              title="Edit"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDeleteService && onDeleteService(service.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded"
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

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {filteredServices.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors cursor-pointer"
                        onClick={() => onEditService && onEditService(service.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{service.programme_id}</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{service.category}</p>
                              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Tap to edit</div>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Price:</span>
                            <span className="ml-1 font-medium text-green-600 dark:text-green-400">₹{service.fee}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{service.duration} mins</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">{service.centre_id}</span>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900 dark:text-white">Centre {service.centre_id}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Center Location</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onViewService && onViewService(service.id)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                              title="View Service"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEditService && onEditService(service.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-2 rounded-lg bg-green-50 dark:bg-green-900/20"
                              title="Edit"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDeleteService && onDeleteService(service.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-2 rounded-lg bg-red-50 dark:bg-red-900/20"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                      <FiActivity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No services found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Empty State */}
              {filteredServices.length === 0 && (
                <div className="hidden lg:block text-center py-12">
                  <div className="text-gray-500 dark:text-gray-400">
                    <FiActivity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No services found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 lg:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
            >
              <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-3 lg:p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-blue-600 dark:text-blue-400">{servicesData.length}</div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-3 lg:p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-green-600 dark:text-green-400">
                      {servicesData.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Active Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-3 lg:p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {categories.length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Categories</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-3 lg:p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      ₹{servicesData.length > 0 ? Math.round(servicesData.reduce((sum, service) => sum + parseFloat(service.fee || 0), 0) / servicesData.length) : 0}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Avg Price</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importType="services"
      />
    </div>
  );
};

export default ServicesList;