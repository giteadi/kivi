import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiSave,
  FiEdit2,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiMapPin,
  FiAward,
  FiFileText
} from 'react-icons/fi';
import api from '../services/api';

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [availability, setAvailability] = useState({
    login_time: '09:00',
    logout_time: '18:00',
    is_available: true,
  });
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    specialty: '',
    qualification: '',
    experience_years: '',
    session_fee: '',
    bio: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Fetch therapist data on component mount
  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        // Fetch availability
        const availabilityResponse = await api.getMyTherapistAvailabilitySettings();
        if (availabilityResponse.success) {
          const data = availabilityResponse.data;
          setAvailability({
            login_time: data.login_time ? data.login_time.substring(0, 5) : '09:00',
            logout_time: data.logout_time ? data.logout_time.substring(0, 5) : '18:00',
            is_available: data.is_available !== undefined ? data.is_available : true
          });
        }

        // Fetch profile data
        const profileResponse = await api.getProfile();
        if (profileResponse.success) {
          const data = profileResponse.data;
          setProfileData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            specialty: data.specialty || '',
            qualification: data.qualification || '',
            experience_years: data.experience_years || '',
            session_fee: data.session_fee || '',
            bio: data.bio || '',
            address: data.address || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching therapist data:', error);
        setMessage({ type: 'error', text: 'Failed to load therapist data' });
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistData();
  }, []);

  // Fetch sessions when sessions view is selected
  useEffect(() => {
    if (activeView === 'sessions') {
      fetchSessions();
    }
  }, [activeView]);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  const closeSessionDetails = () => {
    setShowSessionDetails(false);
    setSelectedSession(null);
  };

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await api.request('/therapists/my/sessions');
      console.log('🔍 Therapist sessions response:', response);
      if (response.success) {
        setSessions(response.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to load sessions' });
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setMessage({ type: 'error', text: 'Failed to load sessions' });
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleAvailabilityChange = (field, value) => {
    setAvailability(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await api.updateMyTherapistAvailabilitySettings({
        login_time: availability.login_time + ':00',
        logout_time: availability.logout_time + ':00',
        is_available: availability.is_available
      });

      if (response.success) {
        setMessage({ type: 'success', text: 'Availability updated successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update availability' });
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setMessage({ type: 'error', text: 'Failed to update availability' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Call therapist profile update endpoint instead of user profile
      const response = await api.request('/therapists/my/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      if (response.success) {
        // Update Redux store with new user data (only basic fields)
        const userUpdateData = {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone
        };
        dispatch(updateUser(userUpdateData));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditingProfile(false);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Profile Section */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0] || 'T'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-gray-500">Therapist</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'dashboard' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiCalendar className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('sessions')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'sessions' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiClock className="w-5 h-5" />
                <span>My Assessments</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'profile' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Therapist Dashboard
                </h1>
                <p className="text-gray-600">Manage your availability and sessions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard View */}
          {activeView === 'dashboard' && (
            <>
              {/* Availability Management */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Availability Settings</h2>
                  <div className="flex items-center space-x-2">
                    {availability.is_available ? (
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <FiXCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${availability.is_available ? 'text-green-600' : 'text-red-600'}`}>
                      {availability.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Login Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Login Time
                    </label>
                    <input
                      type="time"
                      value={availability.login_time}
                      onChange={(e) => handleAvailabilityChange('login_time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Logout Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logout Time
                    </label>
                    <input
                      type="time"
                      value={availability.logout_time}
                      onChange={(e) => handleAvailabilityChange('logout_time', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Availability Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={availability.is_available}
                          onChange={() => handleAvailabilityChange('is_available', true)}
                          className="mr-2"
                        />
                        <span className="text-sm">Available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          checked={!availability.is_available}
                          onChange={() => handleAvailabilityChange('is_available', false)}
                          className="mr-2"
                        />
                        <span className="text-sm">Unavailable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveAvailability}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiCalendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Today's Sessions</p>
                      <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FiClock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FiUser className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Active Examinees</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Profile View */}
          {activeView === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => handleProfileChange('first_name', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => handleProfileChange('last_name', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <input
                        type="text"
                        value={profileData.specialty}
                        onChange={(e) => handleProfileChange('specialty', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                      <input
                        type="text"
                        value={profileData.qualification}
                        onChange={(e) => handleProfileChange('qualification', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                      <input
                        type="number"
                        value={profileData.experience_years}
                        onChange={(e) => handleProfileChange('experience_years', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Fee (₹)</label>
                      <input
                        type="number"
                        value={profileData.session_fee}
                        onChange={(e) => handleProfileChange('session_fee', e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  disabled={!isEditingProfile}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  disabled={!isEditingProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              {/* Emergency Contact */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={profileData.emergency_contact_name}
                      onChange={(e) => handleProfileChange('emergency_contact_name', e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={profileData.emergency_contact_phone}
                      onChange={(e) => handleProfileChange('emergency_contact_phone', e.target.value)}
                      disabled={!isEditingProfile}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditingProfile && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Sessions View */}
          {activeView === 'sessions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Assessments</h2>
                <div className="text-sm text-gray-500">
                  {sessions.length} assessment{sessions.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              {loadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12">
                  <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sessions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleSessionClick(session)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Session Header */}
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <FiCalendar className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-gray-900">
                                {new Date(session.session_date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FiClock className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-700">{session.session_time}</span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {session.status}
                            </div>
                          </div>

                          {/* Student Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Student Details</h4>
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center space-x-2">
                                  <FiUser className="w-4 h-4" />
                                  <span className="font-medium">{session.student_first_name} {session.student_last_name}</span>
                                </div>
                                {session.student_email && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <FiMail className="w-4 h-4 text-blue-500" />
                                    <button 
                                      onClick={() => window.open(`mailto:${session.student_email}`)}
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {session.student_email}
                                    </button>
                                  </div>
                                )}
                                {session.student_phone && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <FiPhone className="w-4 h-4 text-green-500" />
                                    <button 
                                      onClick={() => window.open(`tel:${session.student_phone}`)}
                                      className="text-green-600 hover:text-green-800 underline"
                                    >
                                      {session.student_phone}
                                    </button>
                                  </div>
                                )}
                                {session.age && (
                                  <div className="text-gray-600 mt-2">
                                    <span className="font-medium">Age:</span> {session.age} • 
                                    <span className="font-medium">Gender:</span> {session.gender}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Session Details</h4>
                              <div className="text-sm text-gray-700">
                                <div className="flex items-center space-x-2">
                                  <FiFileText className="w-4 h-4" />
                                  <span>{session.programme_name || 'General Session'}</span>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <FiMapPin className="w-4 h-4" />
                                  <span>{session.centre_name || 'Centre'}</span>
                                </div>
                                <div className="text-gray-600 mt-1">
                                  Duration: {session.duration || 60} minutes
                                </div>
                                {session.programme_fee && (
                                  <div className="text-gray-600">
                                    <span className="font-medium">Fee:</span> ₹{session.programme_fee}
                                  </div>
                                )}
                                {/* Payment Status */}
                                <div className="mt-2 p-2 bg-gray-50 rounded">
                                  <span className="font-medium text-gray-700">Payment Status: </span>
                                  <span className={`font-bold ${
                                    session.payment_status === 'paid' ? 'text-green-600' : 
                                    session.payment_status === 'pending' ? 'text-yellow-600' : 
                                    'text-red-600'
                                  }`}>
                                    {session.payment_status || 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {session.notes && (
                            <div className="mt-3">
                              <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {session.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Settings View */}
          {activeView === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>
              <div className="text-center py-12">
                <FiSettings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Settings panel coming soon...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Session Details Modal */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
                <button
                  onClick={closeSessionDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Student Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
                  
                  {selectedSession.student_first_name || selectedSession.student_last_name ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FiUser className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {selectedSession.student_first_name} {selectedSession.student_last_name}
                        </span>
                      </div>
                      
                      {selectedSession.student_email && (
                        <div className="flex items-center space-x-2">
                          <FiMail className="w-4 h-4 text-blue-500" />
                          <button 
                            onClick={() => window.open(`mailto:${selectedSession.student_email}`)}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {selectedSession.student_email}
                          </button>
                        </div>
                      )}
                      
                      {selectedSession.student_phone && (
                        <div className="flex items-center space-x-2">
                          <FiPhone className="w-4 h-4 text-green-500" />
                          <button 
                            onClick={() => window.open(`tel:${selectedSession.student_phone}`)}
                            className="text-green-600 hover:text-green-800 underline"
                          >
                            {selectedSession.student_phone}
                          </button>
                        </div>
                      )}
                      
                      {(selectedSession.age || selectedSession.gender) && (
                        <div className="text-gray-600">
                          {selectedSession.age && <span>Age: {selectedSession.age}</span>}
                          {selectedSession.age && selectedSession.gender && <span> • </span>}
                          {selectedSession.gender && <span>Gender: {selectedSession.gender}</span>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <FiUser className="w-8 h-8 mb-2" />
                      <p>Student information not available</p>
                    </div>
                  )}
                </div>

                {/* Parent/Guardian Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Parent/Guardian Information</h3>
                  
                  {selectedSession.user_first_name || selectedSession.user_last_name ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FiUser className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">
                          {selectedSession.user_first_name} {selectedSession.user_last_name}
                        </span>
                        {selectedSession.user_role && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            {selectedSession.user_role}
                          </span>
                        )}
                      </div>
                      
                      {selectedSession.user_email && (
                        <div className="flex items-center space-x-2">
                          <FiMail className="w-4 h-4 text-blue-500" />
                          <button 
                            onClick={() => window.open(`mailto:${selectedSession.user_email}`)}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {selectedSession.user_email}
                          </button>
                        </div>
                      )}
                      
                      {selectedSession.user_phone && (
                        <div className="flex items-center space-x-2">
                          <FiPhone className="w-4 h-4 text-green-500" />
                          <button 
                            onClick={() => window.open(`tel:${selectedSession.user_phone}`)}
                            className="text-green-600 hover:text-green-800 underline"
                          >
                            {selectedSession.user_phone}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <FiUser className="w-8 h-8 mb-2" />
                      <p>Parent/Guardian information not available</p>
                    </div>
                  )}
                </div>

                {/* Session Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(selectedSession.session_date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-4 h-4 text-blue-500" />
                      <span>{selectedSession.session_time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiFileText className="w-4 h-4 text-blue-500" />
                      <span>{selectedSession.programme_name || 'General Session'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="w-4 h-4 text-blue-500" />
                      <span>{selectedSession.centre_name || 'Centre'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Duration:</span>
                      <span>{selectedSession.duration || 60} minutes</span>
                    </div>
                    
                    {selectedSession.programme_fee && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Fee:</span>
                        <span className="text-lg font-bold text-green-600">₹{selectedSession.programme_fee}</span>
                      </div>
                    )}
                    
                    {/* Payment Status */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">Payment Status: </span>
                      <span className={`font-bold text-lg ${
                        selectedSession.payment_status === 'paid' ? 'text-green-600' : 
                        selectedSession.payment_status === 'pending' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {selectedSession.payment_status || 'Pending'}
                      </span>
                    </div>
                    
                    {selectedSession.total_amount && parseFloat(selectedSession.total_amount) > 0 && (
                      <div className="text-sm text-gray-600">
                        Amount Paid: ₹{selectedSession.total_amount}
                        {selectedSession.payment_date && (
                          <span> on {new Date(selectedSession.payment_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {selectedSession.notes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedSession.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistDashboard;
