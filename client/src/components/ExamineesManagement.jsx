import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiUser,
  FiFilter,
  FiMoreHorizontal,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiX,
  FiCheckSquare,
  FiSquare,
  FiChevronDown,
  FiArrowUp,
  FiArrowDown,
  FiUsers,
  FiFileText,
  FiSettings
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../store/slices/patientSlice';
import Sidebar from './Sidebar';

const ExamineesManagement = ({ onViewPatient, onEditPatient, onDeletePatient, onCreateNewPatient, activeItem = 'patients', setActiveItem }) => {
  const dispatch = useDispatch();
  const { patients, isLoading, error } = useSelector((state) => state.patients);

  const [activeTab, setActiveTab] = useState('examinee');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'lastName', direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    center: 'all',
    gender: 'all'
  });

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Transform patient data
  const transformedPatients = patients.map(patient => ({
    id: patient.id,
    systemId: `SYS${patient.id.toString().padStart(6, '0')}`,
    firstName: patient.first_name || '',
    lastName: patient.last_name || '',
    examineeId: patient.student_id || `STU${patient.id}`,
    birthDate: patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : '-',
    gender: patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '-',
    center: patient.centre_name || 'MindSaid Learning Centre',
    status: patient.status === 'active' ? 'Active' : 'Inactive'
  }));

  // Filter and sort
  const filteredPatients = transformedPatients.filter(patient => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.examineeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.systemId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || patient.status === filters.status;
    const matchesCenter = filters.center === 'all' || patient.center === filters.center;
    const matchesGender = filters.gender === 'all' || patient.gender === filters.gender;
    
    return matchesSearch && matchesStatus && matchesCenter && matchesGender;
  }).sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (sortConfig.direction === 'asc') {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelection = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === paginatedPatients.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedPatients.map(p => p.id));
    }
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <FiChevronDown className="w-4 h-4 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FiArrowUp className="w-4 h-4 text-blue-600" />
      : <FiArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const tabs = [
    { id: 'examinee', label: 'Examinee', icon: FiUser },
    { id: 'group', label: 'Group Administration', icon: FiUsers },
    { id: 'report', label: 'Report', icon: FiFileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        sidebarCollapsed={false}
        setSidebarCollapsed={() => {}}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  Kivi
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <span className="text-gray-600 font-medium">MindSaid Learning Centre</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  <FiSettings className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  KR
                </div>
                <span className="text-sm font-medium text-gray-700">KRITIKA JAGGI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        <AnimatePresence mode="wait">
          {activeTab === 'examinee' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Action Bar */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onCreateNewPatient && onCreateNewPatient()}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>New Examinee</span>
                    </button>
                    
                    <button
                      disabled={selectedItems.length === 0}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedItems.length > 0
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium">
                      <FiUser className="w-4 h-4" />
                      <span>Assign Assessment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all text-sm font-medium">
                      <FiUsers className="w-4 h-4" />
                      <span>Create Group</span>
                    </button>

                    <div className="relative">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all text-sm font-medium">
                        <FiMoreHorizontal className="w-4 h-4" />
                        <span>More Actions</span>
                        <FiChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        showFilters ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiFilter className="w-4 h-4" />
                      <span>Filters</span>
                    </button>
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
                      <FiDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Center</label>
                      <select
                        value={filters.center}
                        onChange={(e) => setFilters({ ...filters, center: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Centers</option>
                        <option value="MindSaid Learning Centre">MindSaid Learning Centre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                      <select
                        value={filters.gender}
                        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => setFilters({ status: 'all', center: 'all', gender: 'all' })}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Search & View Options */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">View:</span>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="appearance-none px-3 py-1.5 bg-white border rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors pr-8 cursor-pointer"
                    >
                      <option value="all">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include Sub-Accounts</span>
                  </label>
                  
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    <FiRefreshCw className="w-4 h-4" />
                    <span>Reset Sort Order</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search examinees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {filteredPatients.length} Records
                  </span>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading examinees...</p>
                  </div>
                ) : error ? (
                  <div className="p-12 text-center text-red-500">
                    <p>Error loading examinees</p>
                    <p className="text-sm">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-4 py-3 w-12">
                              <button
                                onClick={toggleAllSelection}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                {selectedItems.length === paginatedPatients.length && paginatedPatients.length > 0 ? (
                                  <FiCheckSquare className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <FiSquare className="w-5 h-5" />
                                )}
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('systemId')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>System ID</span>
                                <SortIcon columnKey="systemId" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('lastName')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Last Name</span>
                                <SortIcon columnKey="lastName" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('firstName')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>First Name</span>
                                <SortIcon columnKey="firstName" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('examineeId')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Examinee ID</span>
                                <SortIcon columnKey="examineeId" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('birthDate')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Birth Date</span>
                                <SortIcon columnKey="birthDate" />
                              </button>
                            </th>
                            <th className="px-4 py-3 text-left">
                              <button
                                onClick={() => handleSort('gender')}
                                className="flex items-center space-x-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                              >
                                <span>Gender</span>
                                <SortIcon columnKey="gender" />
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {paginatedPatients.map((patient, index) => (
                            <motion.tr
                              key={patient.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.03 }}
                              className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${
                                selectedItems.includes(patient.id) ? 'bg-blue-50/50' : ''
                              }`}
                              onClick={() => onViewPatient && onViewPatient(patient.id)}
                            >
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => toggleSelection(patient.id)}
                                  className="text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                  {selectedItems.includes(patient.id) ? (
                                    <FiCheckSquare className="w-5 h-5 text-blue-600" />
                                  ) : (
                                    <FiSquare className="w-5 h-5" />
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-blue-600">
                                {patient.systemId}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                {patient.lastName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {patient.firstName}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                {patient.examineeId}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {patient.birthDate}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  patient.gender === 'Male'
                                    ? 'bg-blue-50 text-blue-700'
                                    : patient.gender === 'Female'
                                    ? 'bg-pink-50 text-pink-700'
                                    : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {patient.gender}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredPatients.length === 0 && (
                      <div className="p-12 text-center">
                        <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No examinees found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Pagination */}
              {filteredPatients.length > 0 && (
                <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border p-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Show</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      <span className="text-sm text-gray-500">per page</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'group' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-sm border p-12 text-center"
            >
              <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Group Administration</h3>
              <p className="text-gray-500">Group management features coming soon</p>
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-sm border p-12 text-center"
            >
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-500">Reporting features coming soon</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t bg-white mt-12">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-700">Kivi</span>
              <a href="#" className="hover:text-gray-700">About</a>
              <a href="#" className="hover:text-gray-700">Contact</a>
              <a href="#" className="hover:text-gray-700">Privacy</a>
            </div>
            <div>
              Copyright © 2025 MindSaid Learning. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ExamineesManagement;
