import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiSave
} from 'react-icons/fi';
import api from '../services/api';

const TherapistDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [availability, setAvailability] = useState({
    login_time: '09:00',
    logout_time: '18:00',
    is_available: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch therapist availability on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.getMyTherapistAvailabilitySettings();
        if (response.success) {
          const data = response.data;
          setAvailability({
            login_time: data.login_time ? data.login_time.substring(0, 5) : '09:00',
            logout_time: data.logout_time ? data.logout_time.substring(0, 5) : '18:00',
            is_available: data.is_available !== undefined ? data.is_available : true
          });
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        setMessage({ type: 'error', text: 'Failed to load availability settings' });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  const handleAvailabilityChange = (field, value) => {
    setAvailability(prev => ({
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
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg">
                <FiCalendar className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <FiClock className="w-5 h-5" />
                <span>My Sessions</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
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
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
