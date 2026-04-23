import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiMapPin, FiPhone, FiMail, FiUsers, FiCalendar, FiFilter, FiUpload } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import ImportModal from './ImportModal';
import FiltersPanel from './FiltersPanel';
import CentreCreateForm from './CentreCreateForm';
import { useToast } from './Toast';

const ClinicsList = ({ onViewClinic, onEditClinic, onDeleteClinic, onCreateNewClinic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const toast = useToast();

  // Fetch centres from API
  useEffect(() => {
    fetchCentres();
  }, []);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      const data = await api.getClinics();
      
      if (data.success) {
        setCentres(data.data);
      } else {
        setError('Failed to fetch centres');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Delete centre
  const handleDeleteCentre = async (id) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      try {
        const result = await api.deleteClinic(id);
        
        if (result.success) {
          // Refresh the centres list
          fetchCentres();
          toast.success('Center deleted successfully!', { duration: 3000 });
          // Call the prop handler if it exists (for backward compatibility)
          if (onDeleteClinic) {
            onDeleteClinic(id);
          }
        } else {
          toast.error('Failed to delete center: ' + result.message, { duration: 4000 });
        }
      } catch (err) {
        toast.error('Error deleting center', { duration: 4000 });
      }
    }
  };

  // Transform API data to match component structure
  const transformCentreData = (centre) => {
    return {
      id: centre.id.toString(),
      name: centre.name || 'Unknown Center',
      initials: centre.name ? centre.name.substring(0, 2).toUpperCase() : 'UC',
      address: centre.address || 'Address not available',
      city: centre.city || 'Unknown City',
      state: centre.state || 'Unknown State',
      zipCode: centre.zip_code || 'N/A',
      phone: centre.phone || 'N/A',
      email: centre.email || 'N/A',
      website: centre.website || '',
      status: centre.status || 'inactive',
      established: centre.created_at ? new Date(centre.created_at).toISOString().split('T')[0] : 'Unknown',
      totalDoctors: centre.total_therapists || 0,
      totalPatients: centre.total_examinees || 0,
      totalAppointments: centre.total_sessions || 0,
      specialties: centre.specialties ? (Array.isArray(centre.specialties) ? centre.specialties : JSON.parse(centre.specialties || '[]')) : [],
      operatingHours: centre.operating_hours || 'Not specified',
      emergencyServices: centre.emergency_services || false,
      rating: centre.rating || 0,
      // Add all other fields from API to avoid data loss
      ...centre
    };
  };

  const clinics = centres.map(transformCentreData);

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinic.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = filterStatus === 'all' || clinic.status.toLowerCase() === filterStatus.toLowerCase();
    
    // Apply advanced filters
    let matchesAdvancedFilters = true;
    if (appliedFilters.clinicName && !clinic.name.toLowerCase().includes(appliedFilters.clinicName.toLowerCase())) {
      matchesAdvancedFilters = false;
    }
    if (appliedFilters.city && !clinic.city.toLowerCase().includes(appliedFilters.city.toLowerCase())) {
      matchesAdvancedFilters = false;
    }
    if (appliedFilters.state && appliedFilters.state !== 'All States' && clinic.state !== appliedFilters.state) {
      matchesAdvancedFilters = false;
    }
    if (appliedFilters.status && appliedFilters.status !== 'All Status' && clinic.status !== appliedFilters.status) {
      matchesAdvancedFilters = false;
    }
    if (appliedFilters.specialty && appliedFilters.specialty !== 'All Specialties' && 
        !clinic.specialties.includes(appliedFilters.specialty)) {
      matchesAdvancedFilters = false;
    }
    
    return matchesSearch && matchesStatus && matchesAdvancedFilters;
  });

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
      case 'maintenance':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">All Centers</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage and view all learning center locations</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span>Import Center Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Center</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Centers</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800 dark:text-gray-300">All Centers</span>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search centres, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFiltersOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading centres...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400">
              <FiMapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{error}</p>
              <button 
                onClick={fetchCentres}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Clinics Grid */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredClinics.map((clinic, index) => {
            const badgeColor = clinic.status === 'active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
            return (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#1c1c1e] rounded-xl p-6 shadow-sm dark:shadow-black/20 border dark:border-gray-800 hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-pointer"
              onClick={() => onViewClinic(clinic.id)}
            >
              {/* Clinic Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${badgeColor}`}>
                    <span className="text-lg font-bold">{clinic.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{clinic.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{clinic.id}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeColor}`}>
                  {clinic.status}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-2 mb-3">
                <FiMapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{clinic.address}</p>
                  <p>{clinic.city}, {clinic.state} {clinic.zipCode}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <FiPhone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{clinic.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{clinic.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{clinic.totalDoctors}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Therapists</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{clinic.totalPatients}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Examinees</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{clinic.totalAppointments}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {clinic.specialties.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {specialty}
                    </span>
                  ))}
                  {clinic.specialties.length > 2 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      +{clinic.specialties.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{clinic.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewClinic(clinic.id);
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 rounded"
                    title="View Details"
                  >
                    <FiEye className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditClinic && onEditClinic(clinic.id);
                    }}
                    className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 rounded"
                    title="Edit"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCentre(clinic.id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            );
          })}
        </motion.div>
        )}

        {filteredClinics.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <FiMapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No centres found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <FiMapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{clinics.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Centres</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {clinics.reduce((sum, clinic) => sum + clinic.totalDoctors, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Therapists</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {clinics.reduce((sum, clinic) => sum + clinic.totalPatients, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Examinees</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#1c1c1e] rounded-lg p-4 shadow-sm dark:shadow-black/20 border dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiCalendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {clinics.filter(clinic => clinic.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Centres</div>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importType="clinics"
      />

      {/* Filters Panel */}
      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={handleApplyFilters}
        filterType="clinics"
      />

      {/* Center Create Form */}
      {isCreateModalOpen && (
        <CentreCreateForm
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={fetchCentres}
        />
      )}
    </div>
  );
};

export default ClinicsList;