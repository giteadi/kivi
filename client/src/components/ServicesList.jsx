import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiFilter, FiUpload, FiActivity } from 'react-icons/fi';
import { useState } from 'react';
import ImportModal from './ImportModal';

const ServicesList = ({ onViewService, onEditService, onDeleteService, onCreateNewService }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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

  const services = [
    {
      id: 8,
      serviceId: 'LS',
      name: 'Learning Support Session',
      category: 'General',
      center: 'Green Valley Learning Center',
      centerInitials: 'GV',
      centerEmail: 'kjaggi+center3@mindsaidlearning.com',
      price: 150,
      duration: '30 mins',
      status: 'Active',
      description: 'Individual learning support session for academic improvement'
    },
    {
      id: 7,
      serviceId: 'BA',
      name: 'Behavioral Assessment',
      category: 'Educational Assessment',
      center: 'Green Valley Learning Center',
      centerInitials: 'GV',
      centerEmail: 'kjaggi+center3@mindsaidlearning.com',
      price: 200,
      duration: '45 mins',
      status: 'Active',
      description: 'Comprehensive behavioral assessment for learning needs'
    },
    {
      id: 6,
      serviceId: 'ST',
      name: 'Speech Therapy',
      category: 'Speech Therapy',
      center: 'Green Valley Learning Center',
      centerInitials: 'GV',
      centerEmail: 'kjaggi+center3@mindsaidlearning.com',
      price: 100,
      duration: '15 mins',
      status: 'Active',
      description: 'Speech therapy session for communication development'
    },
    {
      id: 5,
      serviceId: 'LA',
      name: 'Learning Assessment',
      category: 'Educational Assessment',
      center: 'Green Valley Learning Center',
      centerInitials: 'GV',
      centerEmail: 'kjaggi+center3@mindsaidlearning.com',
      price: 80,
      duration: '10 mins',
      status: 'Active',
      description: 'Complete learning abilities assessment'
    },
    {
      id: 4,
      serviceId: 'OT',
      name: 'Occupational Therapy',
      category: 'Occupational Therapy',
      center: 'Downtown Learning Center',
      centerInitials: 'DL',
      centerEmail: 'kjaggi+center2@mindsaidlearning.com',
      price: 120,
      duration: '60 mins',
      status: 'Active',
      description: 'Occupational therapy for skill development'
    },
    {
      id: 3,
      serviceId: 'FC',
      name: 'Family Counseling',
      category: 'Family Counseling',
      center: 'Sunrise Learning Center',
      centerInitials: 'SL',
      centerEmail: 'kjaggi+center1@mindsaidlearning.com',
      price: 180,
      duration: '45 mins',
      status: 'Active',
      description: 'Family counseling and support sessions'
    },
    {
      id: 2,
      serviceId: 'EP',
      name: 'Educational Psychology',
      category: 'Educational Psychology',
      center: 'MindSaid Learning Center',
      centerInitials: 'ML',
      centerEmail: 'center_kjaggi@mindsaidlearning.com',
      price: 200,
      duration: '50 mins',
      status: 'Active',
      description: 'Educational psychology consultation and therapy sessions'
    },
    {
      id: 1,
      serviceId: 'GC',
      name: 'General Consultation',
      category: 'General',
      center: 'MindSaid Learning Center',
      centerInitials: 'ML',
      centerEmail: 'center_kjaggi@mindsaidlearning.com',
      price: 100,
      duration: '30 mins',
      status: 'Active',
      description: 'General educational consultation with experienced therapists'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.center.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    const matchesStatus = filterStatus === 'all' || service.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">All Programs</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage educational programs and therapy services</p>
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
          <div className="flex items-center text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <span>Home</span>
            <span className="mx-1 sm:mx-2">›</span>
            <span>Services</span>
            <span className="mx-1 sm:mx-2">›</span>
            <span className="text-gray-800 whitespace-nowrap">All Programs</span>
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
                className="bg-white rounded-xl p-4 shadow-sm border"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                className="bg-white rounded-xl p-4 shadow-sm border sticky top-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Category</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      !selectedCategory 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
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
                          ? 'bg-blue-100 text-blue-800 font-medium' 
                          : 'text-gray-600 hover:bg-gray-50'
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
              className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border mb-4 lg:mb-6"
            >
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
                {/* Status Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Search */}
                <div className="flex-1 relative min-w-0">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search Anything"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-blue-600 text-white">
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
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServices.map((service, index) => (
                      <motion.tr
                        key={service.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-blue-600">{service.serviceId}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{service.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.category}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                              <span className="text-xs font-semibold text-purple-600">{service.centerInitials}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{service.center}</div>
                              <div className="text-sm text-gray-500">{service.centerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-green-600">₹{service.price}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.duration}
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
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="View Service"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEditService && onEditService(service.id)}
                              className="text-green-600 hover:text-green-900 p-1 rounded"
                              title="Edit"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDeleteService && onDeleteService(service.id)}
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

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {filteredServices.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-600">{service.serviceId}</span>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                              <p className="text-xs text-gray-500">{service.category}</p>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-1 font-medium text-green-600">₹{service.price}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-1 text-gray-900">{service.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                              <span className="text-xs font-semibold text-purple-600">{service.centerInitials}</span>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-900">{service.center}</div>
                              <div className="text-xs text-gray-500 truncate max-w-32">{service.centerEmail}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onViewService && onViewService(service.id)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-lg bg-blue-50"
                              title="View Service"
                            >
                              <FiEye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEditService && onEditService(service.id)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg bg-green-50"
                              title="Edit"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onDeleteService && onDeleteService(service.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-lg bg-red-50"
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
                    <div className="text-gray-500">
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
                  <div className="text-gray-500">
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
              <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-blue-600">{services.length}</div>
                    <div className="text-xs lg:text-sm text-gray-600">Total Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-green-100 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-green-600">
                      {services.filter(s => s.status === 'Active').length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">Active Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-purple-600">
                      {categories.length}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">Categories</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="p-1.5 lg:p-2 bg-yellow-100 rounded-lg">
                    <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-lg lg:text-2xl font-bold text-yellow-600">
                      ₹{Math.round(services.reduce((sum, service) => sum + service.price, 0) / services.length)}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">Avg Price</div>
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