import { motion } from 'framer-motion';
import { FiShield, FiLock, FiEye, FiTrash2, FiMail } from 'react-icons/fi';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: FiShield,
      title: 'Information We Collect',
      content: `We collect information that you provide directly to us, including:
      
      • Personal identification information (name, email address, phone number)
      • Professional information (qualifications, specialties, center affiliation)
      • Patient/examinee data that you input into the system
      • Usage data and analytics to improve our services
      • Payment information for subscription services`
    },
    {
      icon: FiLock,
      title: 'How We Protect Your Data',
      content: `We implement appropriate technical and organizational security measures to protect your personal information:
      
      • Encryption of data in transit and at rest using industry-standard protocols
      • Role-based access control to limit data access to authorized personnel
      • Regular security audits and vulnerability assessments
      • Secure data centers with 99.9% uptime guarantee
      • Compliance with HIPAA and other relevant healthcare data protection regulations`
    },
    {
      icon: FiEye,
      title: 'How We Use Your Information',
      content: `We use the collected information for the following purposes:
      
      • Providing and maintaining our educational therapy management services
      • Processing and storing assessment data and reports
      • Communicating with you about your account and our services
      • Analyzing usage patterns to improve user experience
      • Complying with legal obligations and regulatory requirements`
    },
    {
      icon: FiTrash2,
      title: 'Data Retention and Deletion',
      content: `We retain your information for as long as your account is active or as needed to provide you services:
      
      • Account data is retained until you request deletion
      • Assessment data is retained according to your center's data retention policy
      • Backup data is retained for 30 days after deletion
      • You can request complete data deletion by contacting us
      • Some data may be retained for legal compliance purposes`
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
              <FiShield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
              Cookies are files with a small amount of data which may include an anonymous unique identifier.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
              However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may employ third-party companies and individuals to facilitate our service, provide the service on our behalf, 
              perform service-related services, or assist us in analyzing how our service is used.
            </p>
            <p className="text-gray-600 leading-relaxed">
              These third parties have access to your personal information only to perform these tasks on our behalf and are 
              obligated not to disclose or use it for any other purpose.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>The right to access the personal information we hold about you</li>
              <li>The right to request correction of inaccurate information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
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
              If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;
