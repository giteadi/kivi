import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowRight, FiUsers, FiActivity, FiShield, FiBarChart2, FiFileText, FiCalendar } from 'react-icons/fi';
import LogoImage from './LogoImage';

const Homepage = ({ onShowLogin }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: FiUsers,
      title: 'Examinee Management',
      description: 'Comprehensive profiles with demographics, history, and assessment tracking'
    },
    {
      icon: FiFileText,
      title: 'Assessment Templates',
      description: 'Standardized tools including WISC, WJ-IV, ADHD scales, and more'
    },
    {
      icon: FiActivity,
      title: 'Progress Monitoring',
      description: 'Track development milestones and intervention effectiveness over time'
    },
    {
      icon: FiCalendar,
      title: 'Session Scheduling',
      description: 'Efficient booking system with therapist availability and reminders'
    },
    {
      icon: FiBarChart2,
      title: 'Analytics & Reports',
      description: 'Generate detailed reports with visual insights and recommendations'
    },
    {
      icon: FiShield,
      title: 'Secure & Compliant',
      description: 'HIPAA-compliant data protection with role-based access control'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Assessments Completed' },
    { value: '500+', label: 'Professional Therapists' },
    { value: '50+', label: 'Assessment Tools' },
    { value: '99.9%', label: 'Uptime Guaranteed' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
                <LogoImage />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Centrix
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <span className="text-sm text-gray-600">Welcome, {user?.first_name}</span>
              ) : (
                <button
                  onClick={onShowLogin}
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Professional Assessment Platform
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Educational Therapy{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Streamline your educational therapy practice with comprehensive assessment tools, 
                examinee management, and progress tracking. Designed for professionals by professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onShowLogin}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  Get Started
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </button>
                <a
                  href="#features"
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-all duration-300 font-semibold text-center"
                >
                  Learn More
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                  alt="Professional therapist working with student"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 hidden lg:block"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">2,500+</p>
                    <p className="text-sm text-gray-500">Assessments this month</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools designed to help educational therapists 
              deliver exceptional care and track progress effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About/Image Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80"
                  alt="Educational assessment"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80"
                  alt="Therapy session"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Trusted by Educational Therapists Worldwide
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Centrix is built on years of experience in educational therapy and assessment. 
                Our platform combines evidence-based assessment tools with modern technology 
                to help you deliver the best possible outcomes for your examinees.
              </p>
              <ul className="space-y-4">
                {[
                  'Standardized assessment tools (WISC, WJ-IV, ADHD scales)',
                  'Comprehensive reporting with visual analytics',
                  'Secure cloud-based data management',
                  'Multi-center support with role-based access'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educational therapists who trust Centrix for their assessment and management needs.
            </p>
            <button
              onClick={onShowLogin}
              className="px-10 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold text-lg"
            >
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  <LogoImage />
                </div>
                <span className="text-2xl font-bold text-white">Centrix</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm">
                Professional educational therapy management and assessment platform. 
                Empowering therapists to deliver exceptional care.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <span className="sr-only">Email</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400">
                <li>support@centrix.io</li>
                <li>+91 98765 43210</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 text-sm">
              &copy; 2026 Centrix. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;