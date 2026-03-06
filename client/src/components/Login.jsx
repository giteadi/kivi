import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { loginUser, clearError } from '../store/slices/authSlice';
import LogoImage from './LogoImage';

const Login = ({ onLoginSuccess, onShowRegister, selectedPlan }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: 'admin@mindsaidlearning.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('📝 Form field changed:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      console.log('🧹 Clearing error state');
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login attempt with:', { email: formData.email, password: '***' });
    
    try {
      console.log('📤 Dispatching login request...');
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log('✅ Login successful:', result);
      if (result) {
        // Check if there's a selected plan to trigger payment
        if (selectedPlan) {
          console.log('💳 User has selected plan, triggering payment flow');
          // User logged in with selected plan, trigger payment flow
          onLoginSuccess();
        } else {
          console.log('🏠 Normal login without selected plan');
          // Normal login without selected plan
          onLoginSuccess();
        }
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error details:', { message: error.message, stack: error.stack });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <LogoImage />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to MindSaid Learning</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
          {selectedPlan && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Selected Plan:</p>
              <p className="font-semibold text-blue-900">{selectedPlan.title}</p>
              <p className="text-sm text-blue-700">₹{selectedPlan.price?.toLocaleString()}/-</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Admin Credentials:</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-700">Email: admin@mindsaidlearning.com | Password: admin123</p>
            <p className="text-sm text-blue-700">Email: admin2@mindsaidlearning.com | Password: admin123</p>
            <p className="text-sm text-blue-700">Email: superadmin@mindsaidlearning.com | Password: super123</p>
          </div>
          <p className="text-sm text-blue-800 font-medium mt-4 mb-2">Demo Parent/User Credentials:</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-700">Email: parent.john.smith@gmail.com | Password: parent123</p>
            <p className="text-sm text-blue-700">Email: parent.mary.jones@gmail.com | Password: parent123</p>
            <p className="text-sm text-blue-700">Email: parent.william.davis@gmail.com | Password: parent123</p>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onShowRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;