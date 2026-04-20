import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiActivity,
  FiUser,
  FiMapPin
} from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const TherapyList = () => {
  const [therapies, setTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    centre_id: '',
    therapist_id: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [centres, setCentres] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee: '',
    duration: '',
    status: 'active',
    centre_id: '',
    therapist_id: '',
    category: 'Therapy Session'
  });

  useEffect(() => {
    fetchTherapies();
    fetchTherapists();
    fetchCentres();
  }, []);

  const fetchTherapies = async () => {
    try {
      setLoading(true);
      const response = await api.request('/plans?type=session');
      if (response.success) {
        // Filter therapy sessions
        const therapyData = response.data?.filter(p => 
          p.category?.toLowerCase().includes('therapy') ||
          p.type === 'session'
        ) || [];
        setTherapies(therapyData);
      }
    } catch (error) {
      console.error('Error fetching therapies:', error);
      toast.error('Failed to load therapies');
    } finally {
      setLoading(false);
    }
  };

  const fetchTherapists = async () => {
    try {
      const response = await api.request('/therapists');
      if (response.success) {
        setTherapists(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const fetchCentres = async () => {
    try {
      const response = await api.request('/centres');
      if (response.success) {
        setCentres(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching centres:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        type: 'session',
        price: parseFloat(formData.fee),
        duration: parseFloat(formData.duration)
      };
      
      const response = await api.request('/plans', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (response.success) {
        toast.success('Therapy created successfully');
        setIsCreateModalOpen(false);
        resetForm();
        fetchTherapies();
      } else {
        toast.error(response.message || 'Failed to create therapy');
      }
    } catch (error) {
      console.error('Error creating therapy:', error);
      toast.error('Failed to create therapy');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.fee),
        duration: parseFloat(formData.duration)
      };
      
      const response = await api.request(`/plans/${editingTherapy.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      if (response.success) {
        toast.success('Therapy updated successfully');
        setEditingTherapy(null);
        resetForm();
        fetchTherapies();
      } else {
        toast.error(response.message || 'Failed to update therapy');
      }
    } catch (error) {
      console.error('Error updating therapy:', error);
      toast.error('Failed to update therapy');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this therapy?')) return;
    
    try {
      const response = await api.request(`/plans/${id}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        toast.success('Therapy deleted successfully');
        fetchTherapies();
      } else {
        toast.error(response.message || 'Failed to delete therapy');
      }
    } catch (error) {
      console.error('Error deleting therapy:', error);
      toast.error('Failed to delete therapy');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      fee: '',
      duration: '',
      status: 'active',
      centre_id: '',
      therapist_id: '',
      category: 'Therapy Session'
    });
  };

  const openEditModal = (therapy) => {
    setEditingTherapy(therapy);
    setFormData({
      name: therapy.name || '',
      description: therapy.description || '',
      fee: therapy.fee || '',
      duration: therapy.duration || '',
      status: therapy.status || 'active',
      centre_id: therapy.centre_id || '',
      therapist_id: therapy.therapist_id || '',
      category: therapy.category || 'Therapy Session'
    });
  };

  // Filter therapies
  const filteredTherapies = therapies.filter(therapy => {
    const matchesSearch = !searchTerm || 
      therapy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.therapist_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapy.therapist_last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || therapy.status === filters.status;
    const matchesCentre = !filters.centre_id || therapy.centre_id == filters.centre_id;
    const matchesTherapist = !filters.therapist_id || therapy.therapist_id == filters.therapist_id;
    
    return matchesSearch && matchesStatus && matchesCentre && matchesTherapist;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'complete': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      case 'inactive': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="lg:ml-64 p-4 lg:p-6 min-h-screen bg-gray-50 dark:bg-[#0f0f10] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Therapy List</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage therapy sessions and treatments</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Therapy
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow-sm dark:shadow-black/20 border dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search therapies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-300"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2c2c2e]'
            }`}
          >
            <FiFilter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="progress">In Progress</option>
                  <option value="complete">Complete</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select
                  value={filters.centre_id}
                  onChange={(e) => setFilters({ ...filters, centre_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Centres</option>
                  {centres.map(centre => (
                    <option key={centre.id} value={centre.id}>{centre.name}</option>
                  ))}
                </select>

                <select
                  value={filters.therapist_id}
                  onChange={(e) => setFilters({ ...filters, therapist_id: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  <option value="">All Therapists</option>
                  {therapists.map(therapist => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.first_name} {therapist.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Therapy List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1c1c1e] rounded-lg shadow-sm dark:shadow-black/20 border dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#2c2c2e] border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Therapy Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Therapist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Centre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTherapies.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <FiActivity className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="dark:text-gray-400">No therapies found</p>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create your first therapy
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredTherapies.map((therapy) => (
                    <tr key={therapy.id} className="hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{therapy.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{therapy.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiClock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                          {therapy.duration} hours
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="text-gray-400 dark:text-gray-500 mr-1">₹</span>
                          {therapy.fee}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiUser className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                          {therapy.therapist_first_name} {therapy.therapist_last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <FiMapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                          {therapy.centre_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(therapy.status)}`}>
                          {therapy.status === 'active' && <FiCheckCircle className="w-3 h-3 mr-1" />}
                          {therapy.status?.charAt(0).toUpperCase() + therapy.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(therapy)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(therapy.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingTherapy) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1c1c1e] rounded-xl shadow-xl dark:shadow-black/40 border dark:border-gray-800 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingTherapy ? 'Edit Therapy' : 'Create New Therapy'}
              </h2>
              
              <form onSubmit={editingTherapy ? handleUpdate : handleCreate}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      rows="2"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours) *</label>
                      <input
                        type="number"
                        required
                        min="0.5"
                        step="0.5"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee (₹) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.fee}
                        onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Centre</label>
                      <select
                        value={formData.centre_id}
                        onChange={(e) => setFormData({ ...formData, centre_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        <option value="">Select Centre</option>
                        {centres.map(centre => (
                          <option key={centre.id} value={centre.id}>{centre.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Therapist</label>
                      <select
                        value={formData.therapist_id}
                        onChange={(e) => setFormData({ ...formData, therapist_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                      >
                        <option value="">Select Therapist</option>
                        {therapists.map(therapist => (
                          <option key={therapist.id} value={therapist.id}>
                            {therapist.first_name} {therapist.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2c2c2e] rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-colors duration-300"
                    >
                      <option value="active">Active</option>
                      <option value="progress">In Progress</option>
                      <option value="complete">Complete</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setEditingTherapy(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2c2c2e] rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingTherapy ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TherapyList;
