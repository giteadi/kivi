import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiUser, FiPhone, FiMail, FiClock, FiUpload } from 'react-icons/fi';
import { useState } from 'react';
import ImportModal from './ImportModal';

const ReceptionistsList = ({ onViewReceptionist, onEditReceptionist, onDeleteReceptionist, onCreateNewReceptionist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClinic, setFilterClinic] = useState('all');
  const [filterShift, setFilterShift] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const receptionists = [
    {
      id: '#R001',
      name: 'Sarah Johnson',
      initials: 'SJ',
      email: 'sarah.johnson@mindsaidlearning.com',
      phone: '+1 5551234567',
      center: 'MindSaid Learning Center',
      centerColor: 'bg-blue-100 text-blue-800',
      shift: 'Morning',
      shiftColor: 'bg-green-100 text-green-800',
      shiftTime: '8:00 AM - 4:00 PM',
      status: 'Active',
      joinDate: 'January 15, 2023',
      experience: '3 years',
      department: 'Front Desk',
      salary: '₹25,000',
      performance: 'Excellent'
    },
    {
      id: '#R002',
      name: 'Maria Garcia',
      initials: 'MG',
      email: 'maria.garcia@mindsaidlearning.com',
      phone: '+1 5559876543',
      center: 'Green Valley Learning Center',
      centerColor: 'bg-green-100 text-green-800',
      shift: 'Evening',
      shiftColor: 'bg-orange-100 text-orange-800',
      shiftTime: '4:00 PM - 12:00 AM',
      status: 'Active',
      joinDate: 'March 10, 2023',
      experience: '2 years',
      department: 'Student Registration',
      salary: '₹23,000',
      performance: 'Good'
    },
    {
      id: '#R003',
      name: 'Jennifer Wilson',
      initials: 'JW',
      email: 'jennifer.wilson@mindsaidlearning.com',
      phone: '+1 5554567890',
      center: 'Sunrise Learning Center',
      centerColor: 'bg-yellow-100 text-yellow-800',
      shift: 'Night',
      shiftColor: 'bg-purple-100 text-purple-800',
      shiftTime: '12:00 AM - 8:00 AM',
      status: 'On Leave',
      joinDate: 'June 5, 2022',
      experience: '4 years',
      department: 'Emergency Desk',
      salary: '₹28,000',
      performance: 'Excellent'
    },
    {
      id: '#R004',
      name: 'Lisa Anderson',
      initials: 'LA',
      email: 'lisa.anderson@mindsaidlearning.com',
      phone: '+1 5556789012',
      center: 'Downtown Learning Center',
      centerColor: 'bg-purple-100 text-purple-800',
      shift: 'Morning',
      shiftColor: 'bg-green-100 text-green-800',
      shiftTime: '8:00 AM - 4:00 PM',
      status: 'Active',
      joinDate: 'September 20, 2023',
      experience: '1 year',
      department: 'Billing',
      salary: '₹22,000',
      performance: 'Good'
    },
    {
      id: '#R005',
      name: 'Emma Thompson',
      initials: 'ET',
      email: 'emma.thompson@mindsaidlearning.com',
      phone: '+1 5553456789',
      center: 'MindSaid Learning Center',
      centerColor: 'bg-blue-100 text-blue-800',
      shift: 'Evening',
      shiftColor: 'bg-orange-100 text-orange-800',
      shiftTime: '4:00 PM - 12:00 AM',
      status: 'Active',
      joinDate: 'November 12, 2022',
      experience: '2.5 years',
      department: 'Session Scheduling',
      salary: '₹24,000',
      performance: 'Excellent'
    }
  ];

  const centers = ['all', 'MindSaid Learning Center', 'Green Valley Learning Center', 'Sunrise Learning Center', 'Downtown Learning Center'];
  const shifts = ['all', 'Morning', 'Evening', 'Night'];

  const filteredReceptionists = receptionists.filter(receptionist => {
    const matchesSearch = receptionist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receptionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receptionist.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCenter = filterClinic === 'all' || receptionist.center === filterClinic;
    const matchesShift = filterShift === 'all' || receptionist.shift === filterShift;
    return matchesSearch && matchesCenter && matchesShift;
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

  const getPerformanceColor = (performance) => {
    switch (performance?.toLowerCase()) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
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
            <h1 className="text-2xl font-semibold text-gray-800">All Staff Members</h1>
            <p className="text-gray-600">Manage and view all staff member profiles</p>
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
              onClick={() => onCreateNewReceptionist && onCreateNewReceptionist()}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Staff</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">All Staff Members</span>
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
              <label className="text-sm font-medium text-gray-700 mb-2 block">Select Center:</label>
              <select
                value={filterClinic}
                onChange={(e) => setFilterClinic(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {centers.map(center => (
                  <option key={center} value={center}>
                    {center === 'all' ? 'All Centers' : center}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Shift:</label>
              <select
                value={filterShift}
                onChange={(e) => setFilterShift(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {shifts.map(shift => (
                  <option key={shift} value={shift}>
                    {shift === 'all' ? 'All Shifts' : shift}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search:</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search staff members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
        {/* Receptionists Table */}
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
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Center
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Performance
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
                {filteredReceptionists.map((receptionist, index) => (
                  <motion.tr
                    key={receptionist.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewReceptionist(receptionist.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold text-purple-600">{receptionist.initials}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{receptionist.name}</div>
                          <div className="text-sm text-gray-500">{receptionist.experience} experience</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{receptionist.department}</div>
                      <div className="text-sm text-gray-500">{receptionist.salary}/month</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${receptionist.centerColor}`}>
                        {receptionist.center}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${receptionist.shiftColor}`}>
                          {receptionist.shift}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FiClock className="w-3 h-3 mr-1" />
                          {receptionist.shiftTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center">
                          <FiPhone className="w-3 h-3 mr-1 text-gray-400" />
                          {receptionist.phone}
                        </div>
                        <div className="flex items-center">
                          <FiMail className="w-3 h-3 mr-1 text-gray-400" />
                          <span className="truncate max-w-32">{receptionist.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(receptionist.performance)}`}>
                        {receptionist.performance}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receptionist.status)}`}>
                        {receptionist.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewReceptionist(receptionist.id);
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
                            onEditReceptionist && onEditReceptionist(receptionist.id);
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
                            onDeleteReceptionist && onDeleteReceptionist(receptionist.id);
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
          {filteredReceptionists.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiUser className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No staff members found</p>
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
            <div className="text-2xl font-bold text-blue-600">{receptionists.length}</div>
            <div className="text-sm text-gray-600">Total Staff</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {receptionists.filter(r => r.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">
              {receptionists.filter(r => r.shift === 'Morning').length}
            </div>
            <div className="text-sm text-gray-600">Morning Shift</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {receptionists.filter(r => r.shift === 'Evening').length}
            </div>
            <div className="text-sm text-gray-600">Evening Shift</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-indigo-600">
              {receptionists.filter(r => r.performance === 'Excellent').length}
            </div>
            <div className="text-sm text-gray-600">Excellent Performance</div>
          </div>
        </motion.div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        importType="receptionists"
      />
    </div>
  );
};

export default ReceptionistsList;