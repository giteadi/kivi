import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiFilter, FiUpload, FiActivity, FiClock, FiCheck, FiMapPin, FiUser } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../store/slices/serviceSlice';
import ImportModal from './ImportModal';

const ServiceCards = ({ onViewService, onEditService, onDeleteService, onCreateNewService }) => {
  const dispatch = useDispatch();
  const { services: servicesData, isLoading, error } = useSelector((state) => state.services);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Load services on component mount
  useEffect(() => {
    console.log('=== ServiceCards: Fetching services ===');
    dispatch(fetchServices());
  }, [dispatch]);

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

  // Filter services
  const filteredServices = servicesData.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (service.centre_name && service.centre_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || (service.category && service.category === selectedCategory);
    const matchesStatus = filterStatus === 'all' || (service.status && service.status.toLowerCase() === filterStatus.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Separate services into session plans and assessment plans like homepage
  const sessionPlans = filteredServices.filter(service => 
    service.category && (
      service.category.includes('Therapy') || 
      service.category.includes('Learning') || 
      service.category.includes('Counselling') ||
      service.category.includes('Support')
    )
  );

  const assessmentPlans = filteredServices.filter(service => 
    service.category && service.category.includes('Assessment')
  );

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

  const ServiceCard = ({ service, type, index }) => {
    const features = [
      'Professional service',
      'Customized approach',
      'Progress tracking',
      'Expert consultation'
    ];

    if (service.category && service.category.includes('Assessment')) {
      features[0] = 'Comprehensive assessment';
      features[1] = 'Detailed report';
      features[3] = 'School recommendations';
    }

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 relative group"
      >
        {/* Action Buttons - Show on hover */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewService && onViewService(service.id);
            }}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="View Service"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onEditService && onEditService(service.id);
            }}
            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            title="Edit Service"
          >
            <FiEdit3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
                onDeleteService && onDeleteService(service.id);
              }
            }}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            title="Delete Service"
          >
            <FiTrash2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Service Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
            <span className="text-lg font-bold text-blue-600">{service.programme_id}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <FiClock className="w-4 h-4 mr-1" />
            <span className="text-sm">{service.duration} mins</span>
          </div>
          <div className="flex items-center justify-center mb-2">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
          </div>
          <div className="text-3xl font-bold text-blue-600">₹{service.fee}/-</div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 text-center">{service.description || 'Professional service with expert consultation'}</p>
        
        {/* Service Features */}
        <div className="space-y-2 mb-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center text-sm text-gray-600">
              <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <FiMapPin className="w-4 h-4 mr-2 text-purple-500" />
            <span>Center {service.centre_id}</span>
          </div>
          {service.therapist_first_name && (
            <div className="flex items-center text-sm text-gray-600">
              <FiUser className="w-4 h-4 mr-2 text-green-500" />
              <span>{service.therapist_first_name} {service.therapist_last_name}</span>
            </div>
          )}
          <div className="text-xs text-gray-500 text-center">
            {service.category}
          </div>
        </div>

        {/* Click to edit hint */}
        <div className="mt-4 text-center">
          <span className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Click card to edit
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Program Cards</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage programs in card view with full CRUD operations</p>
            </div>
            
            <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                <FiUpload className="w-4 h-4" />
                <span className="hidden xs:inline">Import Data</span>
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
            <span className="text-gray-800 whitespace-nowrap">Program Cards</span>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-0"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="Search programs..."
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
              <span className="hidden sm:inline">Apply Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6"
        >
          <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-1.5 lg:p-2 bg-blue-100 rounded-lg">
                <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-lg lg:text-2xl font-bold text-blue-600">{filteredServices.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">Total Programs</div>
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
                  {filteredServices.filter(s => s.status === 'active').length}
                </div>
                <div className="text-xs lg:text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-1.5 lg:p-2 bg-purple-100 rounded-lg">
                <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-lg lg:text-2xl font-bold text-purple-600">{sessionPlans.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">Session Plans</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm border">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="p-1.5 lg:p-2 bg-yellow-100 rounded-lg">
                <FiActivity className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg lg:text-2xl font-bold text-yellow-600">{assessmentPlans.length}</div>
                <div className="text-xs lg:text-sm text-gray-600">Assessments</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Session Plans */}
        {sessionPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Session Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sessionPlans.map((service, index) => (
                <div 
                  key={service.id}
                  onClick={() => onEditService && onEditService(service.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard service={service} type="session" index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Plans */}
        {assessmentPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assessmentPlans.map((service, index) => (
                <div 
                  key={service.id}
                  onClick={() => onEditService && onEditService(service.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard service={service} type="assessment" index={index} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FiActivity className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No programs found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}

        {/* Other Services (not session or assessment) */}
        {filteredServices.length > 0 && sessionPlans.length === 0 && assessmentPlans.length === 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <div 
                  key={service.id}
                  onClick={() => onEditService && onEditService(service.id)}
                  className="cursor-pointer"
                >
                  <ServiceCard service={service} type="other" index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
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

export default ServiceCards;
