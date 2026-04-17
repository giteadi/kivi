import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiDownload, FiCalendar, FiUser, FiDollarSign, FiFilter, FiRefreshCw, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './Toast';

const BillingRecords = ({ onViewBilling, onEditBilling, onDeleteBilling, onCreateNewBilling }) => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ status: 'Pending', amount: 0 });
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  
  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchBillingRecords();
  }, []);

  const fetchBillingRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.getBillingRecords();

      if (result.success) {
        // Transform the data for the component
        const transformedData = result.data.map((record, index) => ({
          id: `#INV-${String(record.id).padStart(3, '0')}`,
          patient: {
            name: record.student_first_name + ' ' + record.student_last_name,
            initials: (record.student_first_name?.[0] || '') + (record.student_last_name?.[0] || ''),
            email: 'Not provided' // API doesn't return email
          },
          doctor: {
            name: `Dr. ${record.therapist_first_name} ${record.therapist_last_name}`,
            initials: (record.therapist_first_name?.[0] || '') + (record.therapist_last_name?.[0] || '')
          },
          clinic: 'Centrix Centre', // Default clinic name
          service: 'Session', // Default service name
          amount: parseFloat(record.amount) || 0,
          tax: 0, // Calculate tax if needed
          total: parseFloat(record.amount) || 0,
          date: record.created_at ? new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 'Not available',
          status: record.status || 'Pending',
          paymentMethod: 'Not specified',
          rawId: record.id // Keep original ID for API calls
        }));

        setBillingData(transformedData);
      } else {
        setError(result.message || 'Failed to fetch billing records');
        toast.error(result.message || 'Failed to fetch billing records');
      }
    } catch (error) {
      console.error('Error fetching billing records:', error);
      setError('Error loading billing records');
      toast.error('Error loading billing records');
    } finally {
      setLoading(false);
    }
  };

  const filteredBilling = billingData.filter(bill => {
    const matchesSearch = bill.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBilling.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBilling = filteredBilling.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    const statusStr = String(status || '').toLowerCase();
    switch (statusStr) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle edit click
  const handleEditClick = (bill) => {
    setSelectedBill(bill);
    setEditForm({
      status: bill.status,
      amount: bill.amount
    });
    setShowEditModal(true);
  };

  // Handle update billing
  const handleUpdateBilling = async () => {
    if (!selectedBill) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/invoices/${selectedBill.rawId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: editForm.status,
          amount: editForm.amount
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Invoice updated successfully');
        setShowEditModal(false);
        fetchBillingRecords(); // Refresh data
      } else {
        toast.error(result.message || 'Failed to update invoice');
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setShowDeleteConfirm(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3005/api'}/invoices/${billToDelete.rawId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Invoice deleted successfully');
        setShowDeleteConfirm(false);
        fetchBillingRecords(); // Refresh data
      } else {
        toast.error(result.message || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    } finally {
      setIsDeleting(false);
      setBillToDelete(null);
    }
  };

  // Handle download PDF
  const handleDownloadPDF = (bill) => {
    // Create a simple PDF-like text file for now
    const invoiceContent = `
INVOICE
=======

Invoice ID: ${bill.id}
Date: ${bill.date}
Status: ${bill.status}

PATIENT INFORMATION
-------------------
Name: ${bill.patient.name}
Email: ${bill.patient.email}

DOCTOR/THERAPIST
----------------
Name: ${bill.doctor.name}

SERVICE DETAILS
---------------
Service: ${bill.service}
Clinic: ${bill.clinic}

PAYMENT DETAILS
---------------
Amount: ₹${bill.amount?.toLocaleString()}
Tax: ₹${bill.tax?.toLocaleString()}
Total: ₹${bill.total?.toLocaleString()}
Payment Method: ${bill.paymentMethod}

Thank you for choosing MindSaid Learning!
    `;
    
    // Create and download file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${bill.patient.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Invoice downloaded successfully');
  };

  // Handle export all records
  const handleExport = () => {
    const csvContent = [
      ['Invoice ID', 'Patient', 'Doctor', 'Service', 'Amount', 'Status', 'Date'],
      ...filteredBilling.map(bill => [
        bill.id,
        bill.patient.name,
        bill.doctor.name,
        bill.service,
        bill.amount,
        bill.status,
        bill.date
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billing-Records-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Records exported successfully');
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Billing Records</h1>
            <p className="text-gray-600">Manage patient billing and invoices</p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCreateNewBilling && onCreateNewBilling()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Invoice</span>
            </motion.button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span>Financial</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Billing Records</span>
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
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search invoices, patients, or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FiRefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading billing records...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-red-800">{error}</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchBillingRecords}
                className="flex items-center space-x-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* Billing Table */}
        {!loading && !error && (
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
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentBilling.map((bill, index) => (
                  <motion.tr
                    key={bill.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {bill.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-semibold text-blue-600">{bill.patient.initials}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{bill.patient.name}</div>
                          <div className="text-sm text-gray-500">{bill.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                          <span className="text-xs font-semibold text-green-600">{bill.doctor.initials}</span>
                        </div>
                        <span className="text-sm text-gray-900">{bill.doctor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bill.service}</div>
                        <div className="text-sm text-gray-500">{bill.clinic}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">₹{(bill.total / 100000).toFixed(1)}L</div>
                        <div className="text-xs text-gray-500">Amount: ₹{(bill.amount / 100000).toFixed(1)}L</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bill.status)}`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                        {bill.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Invoice"
                        >
                          <FiEye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(bill)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Edit"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDownloadPDF(bill)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          title="Download PDF"
                        >
                          <FiDownload className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(bill)}
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

          {filteredBilling.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiDollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No billing records found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && filteredBilling.length > 0 && (
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
              Showing {startIndex + 1} to {Math.min(endIndex, filteredBilling.length)} of {filteredBilling.length} entries
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

        {/* View Invoice Modal */}
        {showViewModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Invoice Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Invoice ID & Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Invoice ID</p>
                    <p className="text-lg font-bold text-blue-600">{selectedBill.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBill.status)}`}>
                    {selectedBill.status}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-blue-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{selectedBill.patient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedBill.patient.email}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-green-600" />
                    Doctor/Therapist
                  </h3>
                  <p className="font-medium">{selectedBill.doctor.name}</p>
                </div>

                {/* Service Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{selectedBill.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clinic:</span>
                      <span className="font-medium">{selectedBill.clinic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedBill.date}</span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5" />
                    Payment Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₹{selectedBill.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">₹{selectedBill.tax?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-blue-800 border-t border-blue-200 pt-2">
                      <span>Total:</span>
                      <span>₹{selectedBill.total?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('PDF download functionality coming soon!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FiDownload className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedBill && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Edit Invoice</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
                  <p className="text-gray-900 font-medium">{selectedBill.id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBilling}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && billToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full"
            >
              {/* Modal Header */}
              <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Confirm Delete</h2>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-white hover:text-gray-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete invoice <strong>{billToDelete.id}</strong>?
                </p>
                <p className="text-sm text-gray-500">
                  Patient: {billToDelete.patient.name}<br/>
                  Amount: ₹{billToDelete.amount?.toLocaleString()}
                </p>
                <p className="text-red-600 text-sm mt-4">This action cannot be undone.</p>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Invoice'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BillingRecords;