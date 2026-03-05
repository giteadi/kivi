import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCreditCard, FiShield, FiCheck } from 'react-icons/fi';

const PaymentModal = ({ isOpen, onClose, selectedPlan, onPaymentSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;

    setIsProcessing(true);

    try {
      // Create order on backend (you'll need to implement this API)
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: selectedPlan.price * 100, // Razorpay expects amount in paise
          currency: 'INR'
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: 'rzp_test_RSRL6CiapHiTg7', // Using the key from .env
        amount: selectedPlan.price * 100,
        currency: 'INR',
        name: 'MindSaid Learning',
        description: `Payment for ${selectedPlan.title}`,
        order_id: orderData.data.orderId,
        handler: function (response) {
          // Payment successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Verify payment on backend
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          planId: selectedPlan.id
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        onPaymentSuccess(selectedPlan, paymentResponse);
        onClose();
      } else {
        throw new Error('Payment verification failed');
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Plan Details */}
            <div className="p-6 border-b bg-gray-50">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedPlan.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{selectedPlan.description}</p>
                <div className="text-3xl font-bold text-blue-600">
                  ₹{selectedPlan.price?.toLocaleString()}/-
                </div>
                {selectedPlan.duration && (
                  <p className="text-sm text-gray-500 mt-1">{selectedPlan.duration}</p>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="p-6 border-b">
              <h4 className="font-semibold text-gray-900 mb-3">Billing Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Name:</span> {user?.first_name} {user?.last_name}</p>
                <p><span className="text-gray-600">Email:</span> {user?.email}</p>
                {user?.phone && (
                  <p><span className="text-gray-600">Phone:</span> {user?.phone}</p>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 border-b">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Method</h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <FiCreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">Razorpay</p>
                    <p className="text-xs text-gray-500">Credit/Debit Card, UPI, Net Banking</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Security Info */}
            <div className="p-6 border-b">
              <div className="flex items-center text-sm text-gray-600">
                <FiShield className="w-4 h-4 mr-2 text-green-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>

            {/* Payment Button */}
            <div className="p-6">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FiCreditCard className="w-5 h-5" />
                    <span>Pay ₹{selectedPlan.price?.toLocaleString()}</span>
                  </div>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By proceeding, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;