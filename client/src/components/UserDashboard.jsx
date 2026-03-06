import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { fetchPlans } from '../store/slices/plansSlice';
import { motion } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiDollarSign, 
  FiFileText,
  FiActivity,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus
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
        // Keep mock data as fallback if API fails
        setUserSessions([
          {
            id: 1,
            session_date: '2026-03-10',
            session_time: '10:00 AM',
            programme_name: selectedPlan?.title || 'Remedial Therapy',
            therapist_name: 'Dr. Sarah Johnson',
            status: 'scheduled',
            notes: 'Initial assessment and goal setting'
          }
        ]);

        setPaymentHistory([
          {
            id: 1,
            date: '2026-03-01',
            amount: selectedPlan?.price || 2000,
            plan_name: selectedPlan?.title || 'Remedial Therapy',
            status: 'paid',
            method: 'Credit Card'
          }
        ]);

        setAssignedTherapist({
          name: 'Dr. Sarah Johnson',
          specialty: 'Learning Therapy',
          experience: '8 years',
          qualification: 'M.Ed, Ph.D in Special Education',
          phone: '+91-9876543210',
          email: 'dr.sarah.johnson@mindsaidlearning.com'
        });

        setUserStats({
          totalSessions: 12,
          completedSessions: 8,
          upcomingSessions: 4,
          progress: 85
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

  const renderDashboardContent = () => (
    <div className="flex-1">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">Your therapy journey dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Current Plan</p>
              <p className="text-lg font-semibold text-blue-600">
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
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : userStats.totalSessions}</p>
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
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : userStats.completedSessions}</p>
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
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : userStats.upcomingSessions}</p>
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
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `${userStats.progress}%`}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Recent Sessions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiActivity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{session.type}</h3>
                          <p className="text-sm text-gray-600">with {session.therapist}</p>
                          <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                        {session.notes && (
                          <p className="text-xs text-gray-500 mt-1 max-w-xs">{session.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Assigned Therapist */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm mb-6"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Your Therapist</h2>
              </div>
              <div className="p-6">
                {assignedTherapist && (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                      <img 
                        src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png" 
                        alt="Therapist Avatar" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{assignedTherapist.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{assignedTherapist.specialty}</p>
                    <p className="text-xs text-gray-500 mb-4">{assignedTherapist.qualification}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">Experience: {assignedTherapist.experience}</p>
                      <p className="text-gray-600">Phone: {assignedTherapist.phone}</p>
                      <p className="text-gray-600">Email: {assignedTherapist.email}</p>
                    </div>
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
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FiDollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{payment.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Plans & Packages</h1>
              <p className="text-gray-600">Choose the perfect plan for your therapy journey</p>
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

  const renderMainContent = () => {
    switch (activeItem) {
      case 'plans':
        return renderPlansContent();
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <UserSidebar 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        onLogout={handleLogout}
        onPlanSelect={handlePlanSelect}
        onBookSession={handleBookSession}
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