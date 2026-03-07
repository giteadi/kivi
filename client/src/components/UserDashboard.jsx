import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../store/slices/authSlice';
import { fetchPlans } from '../store/slices/plansSlice';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiMenu,
  FiFileText
} from 'react-icons/fi';
import api from '../services/api';
import PaymentModal from './PaymentModal';
import UserSidebar from './UserSidebar';
import BookingModal from './BookingModal';

const UserDashboard = ({ selectedPlan, onSelectNewPlan }) => {
  const { user } = useSelector((state) => state.auth);
  const { plans, loading: plansLoading } = useSelector((state) => state.plans);
  const dispatch = useDispatch();
  const [userSessions, setUserSessions] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [assignedTherapist, setAssignedTherapist] = useState(null);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    progress: 0
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [planToPayFor, setPlanToPayFor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlanForBooking, setSelectedPlanForBooking] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Fetch user dashboard data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Show payment modal if selectedPlan is available (user selected plan before login)
        if (selectedPlan) {
          setPlanToPayFor(selectedPlan);
          setShowPaymentModal(true);
        }

        // Fetch all user data in parallel
        const [sessionsRes, paymentsRes, therapistRes, statsRes] = await Promise.all([
          api.getUserSessions(),
          api.getUserPayments(),
          api.getUserTherapist(),
          api.getUserStats()
        ]);

        // Fetch plans
        dispatch(fetchPlans());

        if (sessionsRes.success) {
          setUserSessions(sessionsRes.data);
        }

        if (paymentsRes.success) {
          setPaymentHistory(paymentsRes.data);
        }

        if (therapistRes.success && therapistRes.data) {
          setAssignedTherapist(therapistRes.data);
        }

        if (statsRes.success) {
          setUserStats(statsRes.data);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        // Don't show fallback data - let components handle empty states
        setUserSessions([]);
        setPaymentHistory([]);
        setAssignedTherapist(null);
        setUserStats({
          totalSessions: 0,
          completedSessions: 0,
          upcomingSessions: 0,
          progress: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [selectedPlan]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'Scheduled': return 'text-blue-600 bg-blue-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handlePayForPlan = (plan) => {
    setPlanToPayFor(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (plan, paymentResponse) => {
    console.log('Payment successful:', paymentResponse);
    alert(`Payment successful for ${plan.title}!`);
    setShowPaymentModal(false);
    setPlanToPayFor(null);
    
    // Add to payment history
    const newPayment = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: plan.price,
      type: plan.title,
      status: 'Paid',
      method: 'Razorpay'
    };
    setPaymentHistory(prev => [newPayment, ...prev]);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setPlanToPayFor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlanForBooking(plan);
    setShowBookingModal(true);
    setActiveItem('booking');
  };

  const handleBookSession = () => {
    setShowBookingModal(true);
    setActiveItem('booking');
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedPlanForBooking(null);
    // Refresh user data
    fetchUserData();
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked, user:', user);
    setEditFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    console.log('Setting edit form data:', {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditingProfile(true);
    console.log('isEditingProfile set to true');
  };

  const handleSaveProfile = async () => {
    try {
      const response = await api.updateUserProfile(editFormData);
      if (response.success) {
        // Update user in Redux store
        dispatch(updateUser(response.data));
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: ''
    });
  };

  const handleInputChange = (e) => {
    console.log('Input changed:', e.target.name, e.target.value);
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const renderDashboardContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Welcome, {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">Your therapy journey dashboard</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg lg:text-xl font-semibold text-blue-600">
                {selectedPlan?.title || 'No Plan Selected'}
              </p>
              <button
                onClick={handleLogout}
                className="mt-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{loading ? '...' : userStats.totalSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{loading ? '...' : userStats.completedSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{loading ? '...' : userStats.upcomingSessions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiTrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
              <div className="ml-3 lg:ml-4">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900">{loading ? '...' : `${userStats.progress}%`}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Sessions */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Recent Sessions</h2>
              </div>
              <div className="p-4 lg:p-6">
                {loading ? (
                  <div className="space-y-3 lg:space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userSessions.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {userSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FiActivity className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">{session.programme_name || 'Therapy Session'}</h3>
                            <p className="text-xs lg:text-sm text-gray-600">with {session.therapist_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(session.session_date).toLocaleDateString()} at {session.session_time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                          {session.notes && (
                            <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">{session.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <FiCalendar className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Sessions Yet</h3>
                    <p className="text-sm text-gray-500">Your therapy sessions will appear here once scheduled.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Assigned Therapist */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm mb-4 lg:mb-6"
            >
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Your Therapist</h2>
              </div>
              <div className="p-4 lg:p-6">
                {loading ? (
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : assignedTherapist ? (
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden bg-gray-200">
                      <FiUser className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm lg:text-base">{assignedTherapist.name}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 mb-2">{assignedTherapist.specialty}</p>
                    <p className="text-xs text-gray-500 mb-4">{assignedTherapist.qualification}</p>
                    <div className="space-y-2 text-xs lg:text-sm">
                      <p className="text-gray-600">Experience: {assignedTherapist.experience}</p>
                      <p className="text-gray-600">Phone: {assignedTherapist.phone}</p>
                      <p className="text-gray-600">Email: {assignedTherapist.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <FiUser className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Therapist Assigned</h3>
                    <p className="text-sm text-gray-500">A therapist will be assigned to you once your therapy plan is activated.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="p-4 lg:p-6 border-b">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Payment History</h2>
              </div>
              <div className="p-4 lg:p-6">
                {loading ? (
                  <div className="space-y-3 lg:space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded-lg"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paymentHistory.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-green-600 font-bold text-sm">₹</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">₹{payment.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">{payment.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 lg:py-8">
                    <span className="text-gray-400 font-bold text-2xl lg:text-3xl">₹</span>
                    <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
                    <p className="text-sm text-gray-500">Your payment history will appear here once you make payments.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlansContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Plans & Packages</h1>
                <p className="text-gray-600 text-sm lg:text-base">Choose the perfect plan for your therapy journey</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 border hover:border-blue-300 cursor-pointer"
                onClick={() => handlePlanSelect(plan)}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-blue-600 mb-4">
                    ₹{parseFloat(plan.price).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Duration: {plan.duration}
                  </div>
                </div>
                <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Select Plan
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentsContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600 text-sm lg:text-base">View your payment history and manage transactions</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-4 lg:p-6 border-b">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Payment History</h2>
          </div>
          <div className="p-4 lg:p-6">
            {loading ? (
              <div className="space-y-3 lg:space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg gap-3">
                      <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paymentHistory.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-shadow gap-3">
                    <div className="flex items-center space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">₹</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm lg:text-base">₹{payment.amount.toLocaleString()}</h3>
                        <p className="text-xs lg:text-sm text-gray-600">{payment.type || 'Payment'}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
                      <span className={`px-2 py-1 lg:px-3 lg:py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                      <p className="text-xs text-gray-500">{payment.method || 'Online'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 lg:py-12">
                <span className="text-gray-400 font-bold text-3xl lg:text-4xl">₹</span>
                <h3 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">No Payment History</h3>
                <p className="text-sm text-gray-500">Your payment transactions will appear here once you make payments.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderProfileContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 text-sm lg:text-base">Manage your personal information and account settings</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm"
        >
          <div className="p-4 lg:p-6 border-b">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">Profile Information</h2>
          </div>
          <div className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 lg:mb-8">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl lg:text-2xl flex-shrink-0">
                {user?.first_name?.[0] || 'U'}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base">{user?.email}</p>
                <p className="text-xs lg:text-sm text-gray-500 capitalize">{user?.role} Account</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="first_name"
                    value={editFormData.first_name}
                    onChange={handleInputChange}
                    autoFocus
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pointer-events-auto relative z-10"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm lg:text-base">
                    {user?.first_name || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    name="last_name"
                    value={editFormData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pointer-events-auto relative z-10"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm lg:text-base">
                    {user?.last_name || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pointer-events-auto relative z-10"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm lg:text-base">
                    {user?.email || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditingProfile ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-sm lg:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pointer-events-auto relative z-10"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm lg:text-base">
                    {user?.phone || 'Not provided'}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900 text-sm lg:text-base capitalize">
                  {user?.role || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <div className="p-3 bg-green-50 rounded-lg text-green-700 font-medium text-sm lg:text-base">
                  Active
                </div>
              </div>
            </div>

            <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t">
              {isEditingProfile ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 lg:px-6 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm lg:text-base"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 lg:px-6 lg:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="px-4 py-2 lg:px-6 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <FiMenu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 text-sm lg:text-base">View your therapy progress and session reports</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Progress Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-4 lg:p-6 border-b">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Progress Report</h2>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Total Sessions</span>
                  <span className="font-semibold text-sm lg:text-base">{loading ? '...' : userStats.totalSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Completed Sessions</span>
                  <span className="font-semibold text-sm lg:text-base">{loading ? '...' : userStats.completedSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Upcoming Sessions</span>
                  <span className="font-semibold text-sm lg:text-base">{loading ? '...' : userStats.upcomingSessions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm lg:text-base">Progress</span>
                  <span className="font-semibold text-sm lg:text-base">{loading ? '...' : `${userStats.progress}%`}</span>
                </div>
              </div>

              <div className="mt-4 lg:mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                  <div
                    className="bg-blue-600 h-2 lg:h-3 rounded-full transition-all duration-500"
                    style={{ width: `${loading ? 0 : userStats.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Session Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm"
          >
            <div className="p-4 lg:p-6 border-b">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">Session Reports</h2>
            </div>
            <div className="p-4 lg:p-6">
              {loading ? (
                <div className="space-y-3 lg:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userSessions.length > 0 ? (
                <div className="space-y-3 lg:space-y-4">
                  {userSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="p-3 lg:p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                        <h4 className="font-semibold text-gray-900 text-sm lg:text-base flex-1">
                          {session.programme_name || 'Therapy Session'}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)} self-start sm:self-auto`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 mb-1">
                        with {session.therapist_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.session_date).toLocaleDateString()}
                      </p>
                      {session.notes && (
                        <p className="text-xs lg:text-sm text-gray-700 mt-2 p-2 bg-white rounded border-l-2 border-blue-200">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 lg:py-8">
                  <FiFileText className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No Session Reports</h3>
                  <p className="text-sm text-gray-500">Your session reports will appear here after completing sessions.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeItem) {
      case 'plans':
        return renderPlansContent();
      case 'payments':
        return renderPaymentsContent();
      case 'profile':
        return renderProfileContent();
      case 'reports':
        return renderReportsContent();
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar */}
      <UserSidebar 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onLogout={handleLogout}
        onPlanSelect={handlePlanSelect}
        onBookSession={handleBookSession}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Main Content */}
      {renderMainContent()}
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        selectedPlan={planToPayFor || selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedPlan={selectedPlanForBooking}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default UserDashboard;