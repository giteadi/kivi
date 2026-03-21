import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiCheck, FiArrowRight } from 'react-icons/fi';
import { fetchServices } from '../store/slices/serviceSlice';
import PaymentModal from './PaymentModal';
import LogoImage from './LogoImage';

const Homepage = ({ onSelectPlan, onShowLogin }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { services: servicesData } = useSelector((state) => state.services);
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load services on component mount
  useEffect(() => {
    console.log('=== Homepage: Fetching services for plans ===');
    dispatch(fetchServices());
  }, [dispatch]);

  // Transform services data to plan format with fallback to static data
  const sessionPlans = servicesData.length > 0 
    ? servicesData
        .filter(service => service.type && service.type === 'session')
        .map(service => ({
          id: service.id,
          title: service.name,
          duration: service.duration || '1 Hour',
          price: parseFloat(service.price),
          description: service.description || 'Professional therapy session',
          features: service.features && Array.isArray(service.features) ? service.features : [
            'Professional therapy session',
            'Customized learning approach',
            'Progress tracking',
            'Parent consultation'
          ]
        }))
    : [
      // Fallback static data when API is empty
      {
        id: 'SP001',
        title: 'Individual Therapy Session',
        duration: '1 Hour',
        price: 50.00, // $50.00
        description: 'One-on-one therapy session with personalized approach',
        features: [
          'Professional therapy session',
          'Customized learning approach',
          'Progress tracking',
          'Parent consultation'
        ]
      },
      {
        id: 'SP002',
        title: 'Group Therapy Session',
        duration: '1.5 Hours',
        price: 30.00, // $30.00
        description: 'Small group therapy for social skill development',
        features: [
          'Group interaction activities',
          'Social skill building',
          'Peer learning',
          'Progress reports'
        ]
      },
      {
        id: 'SP003',
        title: 'Specialized Learning Session',
        duration: '1 Hour',
        price: 60.00, // $60.00
        description: 'Specialized session for specific learning needs',
        features: [
          'Specialized curriculum',
          'One-on-one attention',
          'Customized materials',
          'Expert therapist'
        ]
      }
    ];

  const assessmentPlans = servicesData.length > 0
    ? servicesData
        .filter(service => service.type && service.type === 'assessment')
        .map(service => ({
          id: service.id,
          title: service.name,
          subtitle: service.type,
          price: parseFloat(service.price),
          description: service.description || 'Comprehensive assessment service',
          features: service.features && Array.isArray(service.features) ? service.features : [
            'Comprehensive assessment',
            'Detailed report',
            'Parent consultation',
            'School recommendations'
          ]
        }))
    : [
      // Fallback static data when API is empty
      {
        id: 'AP001',
        title: 'Comprehensive Assessment',
        subtitle: 'Full Evaluation',
        price: 80.00, // $80.00
        description: 'Complete psychological and learning assessment',
        features: [
          'Comprehensive assessment',
          'Detailed report',
          'Parent consultation',
          'School recommendations'
        ]
      },
      {
        id: 'AP002',
        title: 'Learning Disability Assessment',
        subtitle: 'Specialized Evaluation',
        price: 100.00, // $100.00
        description: 'Focused assessment for learning disabilities',
        features: [
          'Specialized testing',
          'Detailed diagnosis',
          'Learning plan',
          'Expert recommendations'
        ]
      },
      {
        id: 'AP003',
        title: 'Behavioral Assessment',
        subtitle: 'Behavior Analysis',
        price: 70.00, // $70.00
        description: 'Assessment for behavioral challenges and interventions',
        features: [
          'Behavior analysis',
          'Intervention strategies',
          'Parent guidance',
          'Progress monitoring'
        ]
      }
    ];

  // Debug services data
  useEffect(() => {
    console.log('=== Homepage: Services data ===', servicesData);
    console.log('=== Homepage: Session plans ===', sessionPlans);
    console.log('=== Homepage: Assessment plans ===', assessmentPlans);
  }, [servicesData, sessionPlans, assessmentPlans]);

  const handlePlanSelect = (plan, type) => {
    const planWithType = { ...plan, type };
    setSelectedPlan(planWithType);
    
    // Check if user is authenticated
    if (isAuthenticated && user) {
      // User is logged in and is admin, redirect to admin panel for editing
      if (user.role === 'admin') {
        console.log('Admin user authenticated, redirecting to admin panel');
        // Redirect to admin programs section
        window.location.href = '/admin?section=programs';
      } else {
        // Regular user - redirect to booking flow instead of direct payment
        console.log('User authenticated, redirecting to booking flow');
        onSelectPlan(planWithType); // This should trigger the booking modal in the parent component
      }
    } else {
      // User not logged in, redirect to login with selected plan
      console.log('User not authenticated, redirecting to login');
      onSelectPlan(planWithType);
    }
  };

  const handleContinue = () => {
    console.log('Continue clicked, selectedPlan:', selectedPlan);
    console.log('isAuthenticated:', isAuthenticated, 'user:', user);
    
    if (selectedPlan) {
      // Check if user is authenticated
      if (isAuthenticated && user) {
        // User is logged in and is admin, redirect to admin panel for editing
        if (user.role === 'admin') {
          console.log('Admin user authenticated, redirecting to admin panel');
          // Redirect to admin programs section
          window.location.href = '/admin?section=programs';
        } else {
          // Regular user, show payment modal
          console.log('User authenticated, showing payment modal');
          setShowPaymentModal(true);
        }
      } else {
        // User not logged in, redirect to login with selected plan
        console.log('User not authenticated, redirecting to login');
        onSelectPlan(selectedPlan);
      }
    } else {
      console.log('No plan selected');
    }
  };

  const handlePaymentSuccess = (plan, paymentResponse) => {
    // Handle successful payment
    console.log('Payment successful:', paymentResponse);
    alert(`Payment successful for ${plan.title}! You will be redirected to your dashboard.`);
    
    // You can redirect to user dashboard or show success message
    // For now, we'll just close the modal and reset selection
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden">
                <LogoImage />
              </div>
              <span className="text-2xl font-bold text-gray-800">MindSaid Learning</span>
            </div>
            <button
              onClick={onShowLogin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {isAuthenticated && user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <p className="text-green-800 font-medium">
                🎯 Admin Access: Click on any plan to edit it in the admin panel
              </p>
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Choose Your Therapy Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Select from our comprehensive therapy sessions or assessment packages designed to support your learning journey
          </motion.p>
        </div>

        {/* Session Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Session Plans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sessionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-xl'
                }`}
                onClick={() => handlePlanSelect(plan, 'session')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <div className="flex items-center justify-center text-gray-600 mb-2">
                    <FiClock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{plan.duration}</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">₹{plan.price.toLocaleString()}/-</div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 text-center">{plan.description}</p>
                
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan?.id === plan.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-2 bg-blue-50 rounded-lg text-center"
                  >
                    <span className="text-blue-600 font-medium text-sm">Selected</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Assessment Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Assessment Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-xl'
                }`}
                onClick={() => handlePlanSelect(plan, 'assessment')}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{plan.subtitle}</p>
                  <div className="text-3xl font-bold text-purple-600">₹{plan.price.toLocaleString()}/-</div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 text-center">{plan.description}</p>
                
                <div className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <FiCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {selectedPlan?.id === plan.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-2 bg-purple-50 rounded-lg text-center"
                  >
                    <span className="text-purple-600 font-medium text-sm">Selected</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 MindSaid Learning. All rights reserved.</p>
            <p className="mt-2">Professional therapy and assessment services for learning development</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        selectedPlan={selectedPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Homepage;