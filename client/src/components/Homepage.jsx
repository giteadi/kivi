import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiCheck, FiArrowRight } from 'react-icons/fi';
import PaymentModal from './PaymentModal';

const Homepage = ({ onSelectPlan, onShowLogin }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const sessionPlans = [
    {
      id: 'remedial',
      title: 'Remedial Therapy',
      duration: '1 Hour',
      price: 2000,
      description: 'Comprehensive remedial therapy sessions for learning difficulties',
      features: [
        'One-on-one therapy session',
        'Customized learning approach',
        'Progress tracking',
        'Parent consultation'
      ]
    },
    {
      id: 'occupational',
      title: 'Occupational Therapy',
      duration: '1 Hour',
      price: 1500,
      description: 'Specialized occupational therapy for daily living skills',
      features: [
        'Sensory integration therapy',
        'Fine motor skill development',
        'Daily living activities',
        'Equipment recommendations'
      ]
    },
    {
      id: 'speech',
      title: 'Speech Language Therapy',
      duration: '1 Hour',
      price: 1500,
      description: 'Professional speech and language development therapy',
      features: [
        'Speech articulation training',
        'Language development',
        'Communication skills',
        'Swallowing therapy'
      ]
    },
    {
      id: 'counselling',
      title: 'Counselling',
      duration: '1 Hour',
      price: 1500,
      description: 'Professional counselling and psychological support',
      features: [
        'Individual counselling',
        'Behavioral therapy',
        'Emotional support',
        'Coping strategies'
      ]
    }
  ];

  const assessmentPlans = [
    {
      id: 'package1',
      title: 'Package I',
      subtitle: 'Comprehensive Assessment',
      price: 45500,
      description: 'Complete psycho-educational assessment with detailed report',
      features: [
        'Full cognitive assessment',
        'Academic achievement testing',
        'Behavioral evaluation',
        'Detailed written report',
        'Parent consultation',
        'School recommendations'
      ]
    },
    {
      id: 'package2',
      title: 'Package II',
      subtitle: 'Standard Assessment',
      price: 32500,
      description: 'Standard psycho-educational assessment package',
      features: [
        'Cognitive assessment',
        'Academic testing',
        'Written report',
        'Parent consultation',
        'Basic recommendations'
      ]
    },
    {
      id: 'package3',
      title: 'Package III',
      subtitle: 'Essential Assessment',
      price: 28500,
      description: 'Essential assessment for learning difficulties',
      features: [
        'Core cognitive testing',
        'Academic screening',
        'Summary report',
        'Parent meeting'
      ]
    },
    {
      id: 'package4',
      title: 'Package IV',
      subtitle: 'Basic Assessment',
      price: 15500,
      description: 'Basic screening and assessment package',
      features: [
        'Basic cognitive screening',
        'Academic review',
        'Brief report',
        'Consultation'
      ]
    }
  ];

  const handlePlanSelect = (plan, type) => {
    const planWithType = { ...plan, type };
    setSelectedPlan(planWithType);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      // Check if user is authenticated
      if (isAuthenticated && user) {
        // User is logged in, show payment modal
        setShowPaymentModal(true);
      } else {
        // User not logged in, redirect to login with selected plan
        onSelectPlan(selectedPlan);
      }
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
                <img 
                  src="https://res.cloudinary.com/bazeercloud/image/upload/v1765087953/Gemini_Generated_Image_o8ciwko8ciwko8ci-removebg-preview_l4nnui.png" 
                  alt="MindSaid Learning Logo" 
                  className="w-full h-full object-contain"
                />
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

        {/* Continue Button */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={handleContinue}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isAuthenticated ? 'Pay Now' : 'Continue with'} {selectedPlan.title}
              <FiArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        )}
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