import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiXCircle, FiAlertTriangle, FiMail } from 'react-icons/fi';

const TermsOfService = () => {
  const sections = [
    {
      icon: FiFileText,
      title: 'Acceptance of Terms',
      content: `By accessing or using Centrix ("the Service"), you agree to be bound by these Terms of Service. 
      If you disagree with any part of the terms, you may not access the Service.
      
      These terms apply to all users, including therapists, administrators, and other healthcare professionals 
      who use our educational therapy management platform.`
    },
    {
      icon: FiCheckCircle,
      title: 'User Accounts and Responsibilities',
      content: `When you create an account with us, you must provide accurate, complete, and current information. 
      You are responsible for:
      
      • Maintaining the confidentiality of your account credentials
      • Restricting access to your account and device
      • Accepting responsibility for all activities that occur under your account
      • Notifying us immediately of any unauthorized access or security breach
      • Ensuring all patient/examinee data entered is accurate and lawfully obtained`
    },
    {
      icon: FiAlertTriangle,
      title: 'Data Privacy and HIPAA Compliance',
      content: `As a healthcare-related service, we take data privacy seriously:
      
      • All users must comply with HIPAA and applicable healthcare privacy laws
      • You may only use the Service for legitimate educational therapy purposes
      • Patient data must be handled according to your center's privacy policies
      • You are responsible for obtaining proper consent for data collection
      • We provide the tools, but you are responsible for compliant use`
    },
    {
      icon: FiXCircle,
      title: 'Prohibited Uses',
      content: `You agree not to use the Service:
      
      • For any unlawful purpose or to solicit others to perform unlawful acts
      • To violate any international, federal, or state regulations
      • To infringe upon our intellectual property rights or others'
      • To harass, abuse, insult, harm, or discriminate against others
      • To submit false or misleading information
      • To upload or transmit viruses or malicious code
      • To collect personal information of other users without consent`
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our educational therapy management platform.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: April 11, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {section.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Additional Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription and Payments</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance 
              on a recurring and periodic basis (monthly or annually, depending on your plan).
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your subscription will automatically renew at the end of each period unless you cancel it. 
              You can cancel your subscription at any time through your account settings or by contacting us.
            </p>
            <p className="text-gray-600 leading-relaxed">
              All fees are exclusive of applicable taxes. You are responsible for paying all taxes associated 
              with your subscription.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are and will remain the 
              exclusive property of Centrix and its licensors. The Service is protected by copyright, 
              trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our trademarks and trade dress may not be used in connection with any product or service 
              without the prior written consent of Centrix.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, 
              for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Upon termination, your right to use the Service will immediately cease. If you wish to 
              terminate your account, you may simply discontinue using the Service or contact us to 
              request account deletion.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In no event shall Centrix, nor its directors, employees, partners, agents, suppliers, or 
              affiliates, be liable for any indirect, incidental, special, consequential or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We do not warrant that the Service will be uninterrupted, timely, secure, or error-free. 
              You use the Service at your own risk.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions. Our failure to enforce any right 
              or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days' notice prior to any 
              new terms taking effect. What constitutes a material change will be determined at our 
              sole discretion. By continuing to access or use our Service after those revisions become 
              effective, you agree to be bound by the revised terms.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-sm p-8 text-white"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold">Contact Us</h2>
            </div>
            <p className="text-blue-100 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us:
            </p>
            <p className="text-white font-medium">Email: iplanbymsl@gmail.com</p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; 2026 Centrix. All rights reserved. | 
            <a href="/" className="text-blue-400 hover:text-blue-300 ml-1">Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
