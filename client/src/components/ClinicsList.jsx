import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiMapPin, FiPhone, FiMail, FiUsers, FiCalendar, FiFilter, FiUpload } from 'react-icons/fi';
import { useState } from 'react';
import ImportModal from './ImportModal';
import FiltersPanel from './FiltersPanel';

const ClinicsList = ({ onViewClinic, onEditClinic, onDeleteClinic, onCreateNewClinic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});

  const clinics = [
    {
      id: 'CL001',
      name: 'Clinic Kjaggi',
      initials: 'CK',
      address: '123 Medical Center Drive, Healthcare District',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567',
      email: 'clinic_kjaggi@kivicare.com',
      website: 'www.clinickjaggi.com',
      status: 'Active',
      established: '2020-01-15',
      totalDoctors: 8,
      totalPatients: 245,
      totalAppointments: 1250,
      specialties: ['Learning Therapy', 'Behavioral Therapy', 'Speech Therapy'],
      operatingHours: '8:00 AM - 8:00 PM',
      emergencyServices: true,
      rating: 4.8,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'CL002',
      name: 'Green Valley Clinic',
      initials: 'GV',
      address: '456 Green Valley Road, Medical Plaza',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      phone: '+1 (555) 987-6543',
      email: 'info@greenvalleyclinic.com',
      website: 'www.greenvalleyclinic.com',
      status: 'Active',
      established: '2018-06-20',
      totalDoctors: 12,
      totalPatients: 380,
      totalAppointments: 2100,
      specialties: ['Occupational Therapy', 'Educational Psychology', 'Special Needs Support'],
      operatingHours: '7:00 AM - 9:00 PM',
      emergencyServices: true,
      rating: 4.6,
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'CL003',
      name: 'Sunrise Health Center',
      initials: 'SH',
      address: '789 Sunrise Boulevard, Health Complex',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      phone: '+1 (555) 456-7890',
      email: 'contact@sunrisehealthcenter.com',
      website: 'www.sunrisehealthcenter.com',
      status: 'Active',
      established: '2019-03-10',
      totalDoctors: 15,
      totalPatients: 520,
      totalAppointments: 3200,
      specialties: ['Learning Support', 'Therapy Services', 'Assessment'],
      operatingHours: '24/7',
      emergencyServices: true,
      rating: 4.9,
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'CL004',
      name: 'Downtown Family Clinic',
      initials: 'DF',
      address: '321 Downtown Street, City Center',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      phone: '+1 (555) 321-0987',
      email: 'info@downtownfamilyclinic.com',
      website: 'www.downtownfamilyclinic.com',
      status: 'Active',
      established: '2017-11-05',
      totalDoctors: 6,
      totalPatients: 180,
      totalAppointments: 890,
      specialties: ['Family Support', 'Child Development', 'Educational Guidance'],
      operatingHours: '8:00 AM - 6:00 PM',
      emergencyServices: false,
      rating: 4.5,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'CL005',
      name: 'Metro Medical Center',
      initials: 'MM',
      address: '654 Metro Avenue, Medical District',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      phone: '+1 (555) 654-3210',
      email: 'admin@metromedicalcenter.com',
      website: 'www.metromedicalcenter.com',
      status: 'Inactive',
      established: '2021-08-12',
      totalDoctors: 4,
      totalPatients: 95,
      totalAppointments: 320,
      specialties: ['Learning Assessment', 'Behavioral Support'],
      operatingHours: '9:00 AM - 5:00 PM',
      emergencyServices: false,
      rating: 4.2,
      badgeColor: 'bg-gray-100 text-gray-800'
    }
  ];

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
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
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
            <h1 className="text-2xl font-semibold text-gray-800">All Centres</h1>
            <p className="text-gray-600">Manage and view all learning centre locations</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span>Import Centre Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewClinic && onCreateNewClinic()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Centre</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Centres</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">All Centres</span>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search centres, locations, or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        {/* Clinics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredClinics.map((clinic, index) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all cursor-pointer"
              onClick={() => onViewClinic(clinic.id)}
            >
              {/* Clinic Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${clinic.badgeColor}`}>
                    <span className="text-lg font-bold">{clinic.initials}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{clinic.name}</h3>
                    <p className="text-sm text-gray-500">{clinic.id}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(clinic.status)}`}>
                  {clinic.status}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-start space-x-2 mb-3">
                <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>{clinic.address}</p>
                  <p>{clinic.city}, {clinic.state} {clinic.zipCode}</p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{clinic.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{clinic.email}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{clinic.totalDoctors}</div>
                  <div className="text-xs text-gray-500">Therapists</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{clinic.totalPatients}</div>
                  <div className="text-xs text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">{clinic.totalAppointments}</div>
                  <div className="text-xs text-gray-500">Sessions</div>
                </div>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {clinic.specialties.slice(0, 2).map((specialty, idx) => (
                    <span key={idx} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {specialty}
                    </span>
                  ))}
                  {clinic.specialties.length > 2 && (
                    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{clinic.specialties.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium text-gray-700">{clinic.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewClinic(clinic.id);
                    }}
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
                      onEditClinic && onEditClinic(clinic.id);
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
                      onDeleteClinic && onDeleteClinic(clinic.id);
                    }}
                    className="text-red-600 hover:text-red-900 p-1 rounded"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredClinics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FiMapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No centres found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiMapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{clinics.length}</div>
                <div className="text-sm text-gray-600">Total Centres</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {clinics.reduce((sum, clinic) => sum + clinic.totalDoctors, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Therapists</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {clinics.reduce((sum, clinic) => sum + clinic.totalPatients, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiCalendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {clinics.filter(clinic => clinic.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-600">Active Centres</div>
              </div>
            </div>
          </div>
        </motion.div>
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
    </div>
  );
};

export default ClinicsList;