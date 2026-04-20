import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiRefreshCw
} from 'react-icons/fi';
import { fetchPlans } from '../store/slices/plansSlice';
import toast from 'react-hot-toast';
import api from '../services/api';

const PlansList = () => {
  const dispatch = useDispatch();
  const { plans = [], loading = false, error = null } = useSelector((state) => state.plans || {});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [plansPerPage] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    price: '',
    duration: '',
    status: 'active'
  });

  // Filter plans - declare BEFORE useEffect
  const plansArray = Array.isArray(plans) ? plans : [];
  const filteredPlans = plansArray.filter(plan => {
    if (!plan) return false;
    const matchesSearch = (plan.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = filteredPlans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(filteredPlans.length / plansPerPage);

  // Fetch plans on mount
  useEffect(() => {
    console.log('🔍 PlansList: Mounting - fetching plans');
    dispatch(fetchPlans());
  }, [dispatch]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔍 PlansList: State updated', {
      plansCount: plansArray.length,
      loading,
      error,
      plansData: plansArray
    });
  }, [plans, loading, error]);

  // Handle create/edit plan
  const handleSavePlan = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Plan name is required');
      return;
    }

    try {
      if (isEditing) {
        // Update plan
        await api.request(`/plans/${selectedPlan.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        toast.success('Plan updated successfully!');
      } else {
        // Create plan
        await api.request('/plans', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success('Plan created successfully!');
      }
      
      setShowModal(false);
      setFormData({
        name: '',
        description: '',
        type: '',
        price: '',
        duration: '',
        status: 'active'
      });
      setIsEditing(false);
      setSelectedPlan(null);
      
      // Refresh plans
      dispatch(fetchPlans());
    } catch (error) {
      toast.error(error.message || 'Failed to save plan');
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name || '',
      description: plan.description || '',
      type: plan.type || '',
      price: plan.price || '',
      duration: plan.duration || '',
      status: plan.status || 'active'
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await api.request(`/plans/${id}`, {
        method: 'DELETE'
      });
      toast.success('Plan deleted successfully!');
      dispatch(fetchPlans());
    } catch (error) {
      toast.error(error.message || 'Failed to delete plan');
    }
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedPlan(null);
    setFormData({
      name: '',
      description: '',
      type: '',
      price: '',
      duration: '',
      status: 'active'
    });
    setShowModal(true);
  };

  return (
    <div className="lg:ml-64 p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plans Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Create and manage therapy plans</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={20} />
            New Plan
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow-sm dark:shadow-black/20 border dark:border-gray-800 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter size={20} className="text-gray-400 dark:text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Plans Table */}
        <div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow-sm dark:shadow-black/20 border dark:border-gray-800 overflow-hidden">
          {loading && (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading plans...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">Error: {error?.message || error || 'Failed to load plans'}</p>
              <button
                onClick={() => dispatch(fetchPlans())}
                className="mt-4 flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-700"
              >
                <FiRefreshCw size={18} />
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredPlans.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No plans found matching your filters' 
                  : 'No plans available yet'}
              </p>
              <button
                onClick={handleOpenCreateModal}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first plan
              </button>
            </div>
          )}

          {currentPlans.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {currentPlans.map((plan) => (
                      <motion.tr
                        key={plan.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{plan.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{plan.type || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">₹{plan.price || '0'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{plan.duration || '-'} min</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            plan.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                          }`}>
                            {plan.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditPlan(plan)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-lg max-w-md w-full p-6 border dark:border-gray-800 shadow-2xl dark:shadow-black/40"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {isEditing ? 'Edit Plan' : 'Create New Plan'}
            </h2>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="e.g., Basic Therapy Plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="Describe the plan..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                  placeholder="e.g., Therapy, Learning"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {isEditing ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-[#2c2c2e] text-gray-900 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-[#3a3a3c] transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PlansList;
