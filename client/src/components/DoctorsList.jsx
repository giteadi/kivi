import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiUsers, FiFilter, FiUpload } from 'react-icons/fi';
import { useState } from 'react';
import FiltersPanel from './FiltersPanel';
import ImportModal from './ImportModal';

const DoctorsList = ({ onViewDoctor, onEditDoctor, onDeleteDoctor, onCreateNewDoctor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClinic, setFilterClinic] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const doctors = [
    {
      id: '#9424',
      name: 'Dr. Kjaggi',
      initials: 'DK',
      email: 'dr.kjaggi@clinic.com',
      phone: '+1 6530 66',
      clinic: 'Clinic Kjaggi',
      clinicColor: 'bg-blue-100 text-blue-800',
      specialty: 'General Medicine',
      specialtyColor: 'bg-green-100 text-green-800',
      experience: '15 years',
      qualification: 'MBBS, MD',
      status: 'Active',
      joinDate: 'January 15, 2020',
      totalPatients: 245,
      todayAppointments: 8,
      rating: 4.8,
      availability: 'Available'
    },
    {
      id: '#9425',
      name: 'Dr. Johnson',
      initials: 'DJ',
      email: 'dr.johnson@clinic.com',
      phone: '+1 5551234567',
      clinic: 'Clinic Kjaggi',
      clinicColor: 'bg-blue-100 text-blue-800',
      specialty: 'Cardiology',
      specialtyColor: 'bg-red-100 text-red-800',
      experience: '12 years',
      qualification: 'MBBS, DM Cardiology',
      status: 'Active',
      joinDate: 'March 10, 2021',
      totalPatients: 189,
      todayAppointments: 5,
      rating: 4.6,
      availability: 'Busy'
    },
    {
      id: '#9426',
      name: 'Dr. Wilson',
      initials: 'DW',
      email: 'dr.wilson@clinic.com',
      phone: '+1 5559876543',
      clinic: 'Green Valley Clinic',
      clinicColor: 'bg-green-100 text-green-800',
      specialty: 'Pediatrics',
      specialtyColor: 'bg-yellow-100 text-yellow-800',
      experience: '10 years',
      qualification: 'MBBS, MD Pediatrics',
      status: 'Active',
      joinDate: 'June 5, 2022',
      totalPatients: 156,
      todayAppointments: 6,
      rating: 4.9,
      availability: 'Available'
    },
    {
      id: '#9427',
      name: 'Dr. Anderson',
      initials: 'DA',
      email: 'dr.anderson@clinic.com',
      phone: '+1 5554567890',
      clinic: 'Sunrise Health Center',
      clinicColor: 'bg-yellow-100 text-yellow-800',
      specialty: 'Orthopedics',
      specialtyColor: 'bg-purple-100 text-purple-800',
      experience: '18 years',
      qualification: 'MBBS, MS Orthopedics',
      status: 'On Leave',
      joinDate: 'September 12, 2019',
      totalPatients: 298,
      todayAppointments: 0,
      rating: 4.7,
      availability: 'Unavailable'
    },
    {
      id: '#9428',
      name: 'Dr. Sarah Miller',
      initials: 'SM',
      email: 'dr.sarah@clinic.com',
      phone: '+1 5556789012',
      clinic: 'Downtown Family Clinic',
      clinicColor: 'bg-purple-100 text-purple-800',
      specialty: 'Dermatology',
      specialtyColor: 'bg-pink-100 text-pink-800',
      experience: '8 years',
      qualification: 'MBBS, MD Dermatology',
      status: 'Active',
      joinDate: 'February 20, 2023',
      totalPatients: 134,
      todayAppointments: 4,
      rating: 4.5,
      availability: 'Available'
    }
  ];

  const clinics = ['all', 'Clinic Kjaggi', 'Green Valley Clinic', 'Sunrise Health Center', 'Downtown Family Clinic'];
  const specialties = ['all', 'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClinic = filterClinic === 'all' || doctor.clinic === filterClinic;
    const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesClinic && matchesSpecialty;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
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
            <h1 className="text-2xl font-semibold text-gray-800">All Doctors</h1>
            <p className="text-gray-600">Manage and view all doctor profiles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiUpload className="w-4 h-4" />
              <span>Import Data</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewDoctor && onCreateNewDoctor()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Doctor</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Doctors</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">All Doctors</span>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Clinic Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Clinic:</label>
              <select
                value={filterClinic}
                onChange={(e) => setFilterClinic(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {clinics.map(clinic => (
                  <option key={clinic} value={clinic}>
                    {clinic === 'all' ? 'All Clinics' : clinic}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Specialty:</label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search:</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters Button */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">&nbsp;</label>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFiltersOpen(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Doctors Table */}
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
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Clinic
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Patients
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
                {filteredDoctors.map((doctor, index) => (
                  <motion.tr
                    key={doctor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewDoctor(doctor.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-sm font-semibold text-blue-600">{doctor.initials}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                          <div className="text-sm text-gray-500">{doctor.qualification}</div>
                          <div className="text-sm text-gray-500">{doctor.experience} experience</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${doctor.specialtyColor}`}>
                        {doctor.specialty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${doctor.clinicColor}`}>
                        {doctor.clinic}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center">
                          <FiPhone className="w-3 h-3 mr-1 text-gray-400" />
                          {doctor.phone}
                        </div>
                        <div className="flex items-center">
                          <FiMail className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-32">{doctor.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{doctor.totalPatients} Total</div>
                        <div className="text-gray-500">{doctor.todayAppointments} Today</div>
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{doctor.rating}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                          {doctor.status}
                        </span>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAvailabilityColor(doctor.availability)}`}>
                            {doctor.availability}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDoctor(doctor.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Profile"
                        >
                          <FiEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDoctor && onEditDoctor(doctor.id);
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
                            onDeleteDoctor && onDeleteDoctor(doctor.id);
                          }}
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

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No doctors found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
            <div className="text-sm text-gray-600">Total Doctors</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {doctors.filter(d => d.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {doctors.filter(d => d.availability === 'Available').length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(doctors.map(d => d.specialty)).size}
            </div>
            <div className="text-sm text-gray-600">Specialties</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {doctors.reduce((sum, d) => sum + d.todayAppointments, 0)}
            </div>
            <div className="text-sm text-gray-600">Today's Appointments</div>
          </div>
        </motion.div>
      </div>

      {/* Filters Panel */}
      <FiltersPanel
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onApplyFilters={(filters) => setAppliedFilters(filters)}
        filterType="doctors"
      />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importType="doctors"
      />
    </div>
  );
};

export default DoctorsList;