import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiEye, FiEdit3, FiTrash2, FiCalendar, FiUser, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices } from '../store/slices/serviceSlice';
import api from '../services/api';

const EncountersList = ({ onEditProgramme, onDeleteProgramme, onCreateNewProgramme }) => {
  const dispatch = useDispatch();
  const { services: programmes, isLoading, error } = useSelector((state) => state.services);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState(null);
  const [newSessionData, setNewSessionData] = useState({
    title: '',
    description: '',
    duration: 30,
    max_participants: 1,
    session_type: 'individual',
    therapist_id: '',
    centre_id: '',
    session_date: new Date().toISOString().split('T')[0], // Current date
    price: '',
    notes: ''
  });
  const [therapists, setTherapists] = useState([]);

  // Load services and therapists on component mount
  useEffect(() => {
    dispatch(fetchServices());
    fetchTherapists();
  }, [dispatch]);

  // Update form when edit mode changes
  useEffect(() => {
    if (isEditMode && editingProgramme) {
      console.log('🔄 useEffect triggered - Edit mode with programme:', editingProgramme);
      console.log('🔄 Programme fields available:', Object.keys(editingProgramme));
      
      const prefilledData = {
        title: editingProgramme.name || editingProgramme.programme_name || '',
        description: editingProgramme.description || editingProgramme.notes || '',
        duration: editingProgramme.duration || 30,
        max_participants: 1,
        session_type: editingProgramme.session_type || 'individual',
        therapist_id: editingProgramme.therapist_id ? editingProgramme.therapist_id.toString() : '',
        centre_id: editingProgramme.centre_id ? editingProgramme.centre_id.toString() : '',
        session_date: editingProgramme.session_date || new Date().toISOString().split('T')[0],
        price: editingProgramme.fee ? editingProgramme.fee.toString() : '',
        notes: editingProgramme.notes || editingProgramme.description || ''
      };
      
      console.log('🔄 Setting form data:', prefilledData);
      setNewSessionData(prefilledData);
      
      // Force modal open after state update
      setTimeout(() => {
        console.log('🔄 Opening modal after state update');
        setShowNewSessionModal(true);
      }, 100);
    }
  }, [isEditMode, editingProgramme]);

  // Fetch therapists from API
  const fetchTherapists = async () => {
    try {
      const response = await api.request('/therapists');
      if (response.success && response.data) {
        setTherapists(response.data);
      }
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  // Handle editing a programme
  const handleEditProgramme = (transformedProgramme) => {
    console.log('✏️ Edit button clicked for transformed programme:', transformedProgramme);
    console.log('✏️ Available fields:', Object.keys(transformedProgramme));
    
    // Find the original programme data from programmes state
    const originalProgramme = programmes.find(p => p.id === transformedProgramme.id);
    console.log('🔍 Found original programme:', originalProgramme);
    
    if (!originalProgramme) {
      console.error('❌ Could not find original programme data for id:', transformedProgramme.id);
      alert('Error: Could not load programme data for editing');
      return;
    }
    
    // Set edit mode and programme data
    setIsEditMode(true);
    setEditingProgramme(originalProgramme);
    
    // useEffect will handle the rest
  };

  // Handle creating new session or updating existing
  const handleCreateSession = async () => {
    try {
      // Validate required fields
      if (!newSessionData.title || !newSessionData.therapist_id) {
        alert('Please fill in all required fields (Title and Therapist)');
        return;
      }

      // Get centre_id from selected therapist
      const selectedTherapist = therapists.find(t => t.id === parseInt(newSessionData.therapist_id));
      
      if (!selectedTherapist) {
        alert('Selected therapist not found. Please try again.');
        return;
      }
      
      // Map frontend fields to database fields for programmes
      const programmeData = {
        programme_id: isEditMode ? editingProgramme.programme_id : `P${Date.now().toString().slice(-5)}`,
        name: newSessionData.title, // title -> name
        category: 'Session Plan', // Default category for session plans
        description: newSessionData.description || '', // description -> description
        duration: parseInt(newSessionData.duration) || 30,
        therapist_id: parseInt(newSessionData.therapist_id),
        centre_id: selectedTherapist.centre_id ? parseInt(selectedTherapist.centre_id) : null,
        fee: newSessionData.price ? parseFloat(newSessionData.price) : 0.00, // price -> fee
        // session_date not needed for programmes
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} programme data:`, programmeData);
      console.log('Selected therapist:', selectedTherapist);

      const response = await api.request(`/programmes${isEditMode ? `/${editingProgramme.id}` : ''}`, {
        method: isEditMode ? 'PUT' : 'POST',
        body: JSON.stringify(programmeData)
      });
      
      console.log('API Response:', response);
      
      if (response.success) {
        console.log(`Success! ${isEditMode ? 'Updated' : 'Created'} programme and closing modal...`);
        alert(`Programme ${isEditMode ? 'updated' : 'created'} successfully!`);
        
        // Close modal and reset state
        setShowNewSessionModal(false);
        
        // Reset form after modal closes
        setTimeout(() => {
          setNewSessionData({
            title: '',
            description: '',
            duration: 30,
            max_participants: 1,
            session_type: 'individual',
            therapist_id: '',
            centre_id: '',
            session_date: new Date().toISOString().split('T')[0], // Current date
            price: '',
            notes: ''
          });
          setIsEditMode(false);
          setEditingProgramme(null);
        }, 100);
        
        // Refresh programmes list (only for creation, not updates)
        if (!isEditMode && onCreateNewProgramme) {
          console.log('Calling onCreateNewProgramme callback for creation...');
          setTimeout(() => {
            onCreateNewProgramme();
          }, 200);
        } else if (isEditMode) {
          console.log('Skipping callback for edit mode - no navigation needed');
        }
      } else {
        alert(`Failed to ${isEditMode ? 'update' : 'create'} programme: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} session:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} session: ${error.message}`);
    }
  };

  // Transform API data to match frontend format
  const transformedProgrammes = programmes.map(programme => ({
    id: programme.id,
    patient: `Student ${programme.id}`,
    doctor: programme.therapist_first_name ? 
      `${programme.therapist_first_name} ${programme.therapist_last_name}` : 
      'Not Assigned',
    clinic: `Centre ${programme.centre_id}`,
    date: new Date(programme.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    time: '10:00 AM', // Default time since not in API
    type: programme.name || 'General Programme',
    status: programme.status === 'active' ? 'Active' : 
            programme.status === 'inactive' ? 'Inactive' : 'Archived',
    duration: `${programme.duration} min`,
    problems: programme.description ? 1 : 0,
    observations: programme.objectives ? 1 : 0,
    notes: programme.target_age_group ? 1 : 0
  }));

  const filteredProgrammes = transformedProgrammes.filter(programme => {
    const matchesSearch = programme.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.clinic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || programme.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
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
            <h1 className="text-2xl font-semibold text-gray-800">Sessions List</h1>
            <p className="text-gray-600">Create and manage session plans for students</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewSessionModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create New Session</span>
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>Home</span>
          <span className="mx-2">›</span>
          <span className="text-gray-800">Sessions List</span>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

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
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Encounters Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium">Loading programmes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500">
                <p className="text-lg font-medium">Error loading programmes</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Programme Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProgrammes.map((programme) => (
                    <motion.tr
                      key={programme.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <FiUser className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{programme.patient}</div>
                            <div className="text-sm text-gray-500">{programme.clinic}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{programme.doctor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
                          <div>
                            <div>{programme.date}</div>
                            <div className="text-gray-500">{programme.time}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{programme.type}</div>
                        <div className="text-sm text-gray-500">{programme.duration}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(programme.status)}`}>
                          {programme.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>Desc: {programme.problems}</div>
                          <div>Obj: {programme.observations}</div>
                          <div>Age: {programme.notes}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProgramme(programme);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Edit Programme"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProgramme && onDeleteProgramme(programme.id);
                            }}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Programme"
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
          )}

          {!isLoading && !error && filteredProgrammes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No programmes found</p>
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
          className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{transformedProgrammes.length}</div>
            <div className="text-sm text-gray-600">Total Programmes</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {transformedProgrammes.filter(p => p.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {transformedProgrammes.filter(p => p.status === 'Inactive').length}
            </div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="text-2xl font-bold text-gray-600">
              {transformedProgrammes.filter(p => p.status === 'Archived').length}
            </div>
            <div className="text-sm text-gray-600">Archived</div>
          </div>
        </motion.div>

        {/* New Session Modal */}
        {showNewSessionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditMode ? 'Edit Session' : 'Create New Session'}
                </h2>
                <button
                  onClick={() => {
                    setShowNewSessionModal(false);
                    setIsEditMode(false);
                    setEditingProgramme(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
                  <input
                    type="text"
                    value={newSessionData.title}
                    onChange={(e) => setNewSessionData({...newSessionData, title: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter session title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Therapist</label>
                  <select
                    value={newSessionData.therapist_id}
                    onChange={(e) => setNewSessionData({...newSessionData, therapist_id: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Therapist</option>
                    {therapists.map(therapist => (
                      <option key={therapist.id} value={therapist.id}>
                        {therapist.first_name && therapist.last_name 
                          ? `${therapist.first_name} ${therapist.last_name} (${therapist.specialty})` 
                          : therapist.employee_id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newSessionData.description}
                    onChange={(e) => setNewSessionData({...newSessionData, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter session description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={newSessionData.price}
                    onChange={(e) => setNewSessionData({...newSessionData, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter session price"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newSessionData.duration}
                    onChange={(e) => setNewSessionData({...newSessionData, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="15"
                    max="180"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={newSessionData.session_type}
                    onChange={(e) => setNewSessionData({...newSessionData, session_type: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="individual">Individual</option>
                    <option value="group">Group</option>
                    <option value="online">Online</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewSessionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSession}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditMode ? 'Update Session' : 'Create Session'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncountersList;