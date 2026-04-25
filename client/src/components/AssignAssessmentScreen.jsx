import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiX,
  FiSearch,
  FiPackage,
  FiDollarSign,
  FiCheck,
  FiSave,
  FiFileText,
  FiEdit3,
  FiUser,
  FiMail,
  FiCalendar,
  FiClock
} from 'react-icons/fi';
import api from '../services/api';

const AssignAssessmentScreen = ({ examineeId: propExamineeId, examineeName: propExamineeName, examineeEmail: propExamineeEmail, onBack, onSave }) => {
  // Use localStorage fallback if props are empty (e.g., after page refresh)
  const [savedExaminee, setSavedExaminee] = useState(() => {
    const saved = localStorage.getItem('selectedExamineeForAssignment');
    return saved ? JSON.parse(saved) : null;
  });
  
  const examineeId = propExamineeId || savedExaminee?.id || savedExaminee?.examineeId;
  const examineeName = propExamineeName || savedExaminee?.name || (savedExaminee?.firstName && savedExaminee?.lastName ? `${savedExaminee.firstName} ${savedExaminee.lastName}` : '');
  const examineeEmail = propExamineeEmail || savedExaminee?.email;
  
  // Save to localStorage when props change
  useEffect(() => {
    if (propExamineeId) {
      const data = { id: propExamineeId, name: propExamineeName, email: propExamineeEmail };
      localStorage.setItem('selectedExamineeForAssignment', JSON.stringify(data));
      setSavedExaminee(data);
    }
  }, [propExamineeId, propExamineeName, propExamineeEmail]);
  
  const [packages, setPackages] = useState([]);
  const [individualAssessments, setIndividualAssessments] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Assessment Admin Screen State
  const [showAssessmentAdmin, setShowAssessmentAdmin] = useState(false);
  const [adminDate, setAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [examiner, setExaminer] = useState('JAGGI, KRUTIKA');
  const [deliveryMethod, setDeliveryMethod] = useState('manual');
  const [email, setEmail] = useState(examineeEmail || '');
  const [notes, setNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  // Update email when examineeEmail prop changes
  useEffect(() => {
    setEmail(examineeEmail || '');
  }, [examineeEmail]);

  // Email Invoice Screen State
  const [showEmailScreen, setShowEmailScreen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    fetchPackages();
    fetchIndividualAssessments();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.request('/assessment-packages');
      if (response.success && response.data) {
        const formattedPackages = response.data.map(pkg => ({
          id: pkg.id.toString(),
          dbId: pkg.id,
          name: pkg.name,
          category: pkg.category,
          price: pkg.price,
          ageRange: pkg.age_range,
          description: pkg.description,
          includes: pkg.includes || [],
          isActive: pkg.is_active,
          customPrice: pkg.price // Allow custom price override
        }));
        setPackages(formattedPackages);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualAssessments = async () => {
    try {
      const response = await api.request('/individual-assessments');
      if (response.success && response.data) {
        const formattedAssessments = response.data.map(ass => ({
          id: ass.id.toString(),
          dbId: ass.id,
          name: ass.name,
          category: ass.category,
          price: parseFloat(ass.price),
          description: ass.description,
          isActive: ass.is_active,
          customPrice: parseFloat(ass.price) // Allow custom price override
        }));
        setIndividualAssessments(formattedAssessments);
      }
    } catch (err) {
      console.error('Failed to fetch individual assessments:', err);
    }
  };

  const togglePackageSelection = (packageId) => {
    setSelectedPackages(prev =>
      prev.includes(packageId) ? prev.filter(id => id !== packageId) : [...prev, packageId]
    );
  };

  const toggleAssessmentSelection = (assessmentId) => {
    setSelectedAssessments(prev =>
      prev.includes(assessmentId) ? prev.filter(id => id !== assessmentId) : [...prev, assessmentId]
    );
  };

  const updatePackageCustomPrice = (packageId, newPrice) => {
    setPackages(prev =>
      prev.map(pkg =>
        pkg.id === packageId ? { ...pkg, customPrice: parseFloat(newPrice) || pkg.price } : pkg
      )
    );
  };

  const updateAssessmentCustomPrice = (assessmentId, newPrice) => {
    setIndividualAssessments(prev =>
      prev.map(ass =>
        ass.id === assessmentId ? { ...ass, customPrice: parseFloat(newPrice) || ass.price } : ass
      )
    );
  };

  const removePackage = (packageId) => {
    setSelectedPackages(prev => prev.filter(id => id !== packageId));
  };

  const removeAssessment = (assessmentId) => {
    setSelectedAssessments(prev => prev.filter(id => id !== assessmentId));
  };

  const calculateTotal = () => {
    let total = 0;

    // Add selected packages with their custom prices
    selectedPackages.forEach(pkgId => {
      const pkg = packages.find(p => p.id === pkgId);
      if (pkg) {
        total += pkg.customPrice || pkg.price;
      }
    });

    // Add selected individual assessments with their custom prices
    selectedAssessments.forEach(assId => {
      const ass = individualAssessments.find(a => a.id === assId);
      if (ass) {
        total += ass.customPrice || ass.price;
      }
    });

    return total;
  };

  const handleSave = () => {
    // Open assessment admin screen instead of direct save
    setShowAssessmentAdmin(true);
  };

  const handleSaveFromAdmin = async (closeAfterSave = false) => {
    setIsSaving(true);

    const packageData = {
      name: packageName || `Package for ${examineeName}`,
      selectedPackages: selectedPackages.map(id => packages.find(p => p.id === id)),
      selectedAssessments: selectedAssessments.map(id => individualAssessments.find(a => a.id === id)),
      totalPrice: calculateTotal(),
      examineeId,
      adminDate,
      examiner,
      deliveryMethod,
      email,
      notes
    };

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSave(packageData);
    setIsSaving(false);

    if (closeAfterSave) {
      setShowAssessmentAdmin(false);
    }
  };

  const handleSendInvoice = () => {
    // Pre-fill email subject and body
    const total = calculateTotal();
    const items = [...selectedPackages, ...selectedAssessments];
    const itemList = items.map(item => `- ${item.name}: ${formatPrice(item.price || 0)}`).join('\n');

    setEmailSubject(`Assessment Invoice - ${examineeName || 'Student'}`);
    setEmailBody(`Dear ${examineeName || 'Parent/Guardian'},

Please find below the assessment details and invoice:

Examinee: ${examineeName || 'N/A'}
Examinee ID: ${examineeId || 'N/A'}

Assessment Items:
${itemList}

Total Amount: ${formatPrice(total)}

Please complete the payment to proceed with the assessment.

Best regards,
Kivi Educational Therapy`);

    setShowEmailScreen(true);
  };

  const handleSendEmail = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await api.request('/invoices/send-assessment', {
        method: 'POST',
        body: JSON.stringify({
          assessmentId: `PKG-${Date.now()}`,
          studentId: examineeId,
          email: email,
          firstName: examineeName?.split(' ')[0] || '',
          lastName: examineeName?.split(' ').slice(1).join(' ') || '',
          assessmentName: packageName || 'Custom Package',
          assessmentType: 'Package',
          price: calculateTotal(),
          individualPrice: calculateTotal(),
          itemsCount: selectedPackages.length + selectedAssessments.length,
          adminDate: adminDate,
          examiner: examiner,
          subject: emailSubject,
          message: emailBody
        })
      });

      if (response.success) {
        alert('Invoice email sent successfully to ' + email);
        setShowEmailScreen(false);
      } else {
        alert('Failed to send email: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Email send error:', error);
      alert('Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.isActive && (pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pkg.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAssessments = individualAssessments.filter(ass =>
    ass.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ass.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 lg:px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Assign Assessment</h1>
              <p className="text-gray-600">{examineeName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(calculateTotal())}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={selectedPackages.length === 0 && selectedAssessments.length === 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <FiSave className="w-4 h-4" />
              Continue
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Available Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages or assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Assessment Packages */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                  Assessment Packages
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading packages...
                </div>
              ) : filteredPackages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No packages found
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-4 transition-colors ${
                        selectedPackages.includes(pkg.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="checkbox"
                              checked={selectedPackages.includes(pkg.id)}
                              onChange={() => togglePackageSelection(pkg.id)}
                              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                              pkg.category === 'Therapy' ? 'bg-emerald-100 text-emerald-700' :
                              pkg.category === 'PE Assessment' ? 'bg-purple-100 text-purple-700' :
                              pkg.category === 'Specialized' ? 'bg-orange-100 text-orange-700' :
                              pkg.category === 'Early Childhood' ? 'bg-pink-100 text-pink-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {pkg.category}
                            </span>
                          </div>
                          {pkg.ageRange && (
                            <p className="text-sm text-gray-500 mb-1">{pkg.ageRange}</p>
                          )}
                          <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.includes.map((item, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          {selectedPackages.includes(pkg.id) && (
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-gray-600">Price:</label>
                              <input
                                type="number"
                                value={pkg.customPrice}
                                onChange={(e) => updatePackageCustomPrice(pkg.id, e.target.value)}
                                className="w-24 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                min="0"
                              />
                            </div>
                          )}
                          <div className="text-lg font-bold text-green-600">
                            {formatPrice(pkg.customPrice || pkg.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Individual Assessments */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FiFileText className="w-5 h-5 text-blue-600" />
                    Individual Assessments
                  </h2>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'assessment-tools' }))}
                    className="text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg transition-all shadow-sm hover:shadow-md"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Manage Assessment Tools
                  </button>
                </div>
                <p className="text-sm text-gray-500">Click checkbox to select, edit price inline</p>
              </div>

              <div className="divide-y max-h-96 overflow-y-auto">
                {filteredAssessments.map((ass) => (
                  <div
                    key={ass.id}
                    className={`p-4 transition-colors ${
                      selectedAssessments.includes(ass.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAssessments.includes(ass.id)}
                          onChange={() => toggleAssessmentSelection(ass.id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{ass.name}</h4>
                          <p className="text-sm text-gray-500">{ass.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {selectedAssessments.includes(ass.id) && (
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-600">Price:</label>
                            <input
                              type="number"
                              value={ass.customPrice}
                              onChange={(e) => updateAssessmentCustomPrice(ass.id, e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                              min="0"
                            />
                          </div>
                        )}
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(ass.customPrice || ass.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Selected Items */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border sticky top-24">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Selected Items</h2>
              </div>

              <div className="p-4 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {/* Selected Packages */}
                {selectedPackages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Packages</h3>
                    <div className="space-y-2">
                      {selectedPackages.map(pkgId => {
                        const pkg = packages.find(p => p.id === pkgId);
                        if (!pkg) return null;
                        return (
                          <div key={pkgId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800">{pkg.name}</div>
                              <div className="text-xs text-gray-500">{pkg.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600 text-sm">
                                {formatPrice(pkg.customPrice || pkg.price)}
                              </span>
                              <button
                                onClick={() => removePackage(pkgId)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Assessments */}
                {selectedAssessments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Individual Assessments</h3>
                    <div className="space-y-2">
                      {selectedAssessments.map(assId => {
                        const ass = individualAssessments.find(a => a.id === assId);
                        if (!ass) return null;
                        return (
                          <div key={assId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-800">{ass.name}</div>
                              <div className="text-xs text-gray-500">{ass.category}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-green-600 text-sm">
                                {formatPrice(ass.customPrice || ass.price)}
                              </span>
                              <button
                                onClick={() => removeAssessment(assId)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedPackages.length === 0 && selectedAssessments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No items selected
                  </div>
                )}
              </div>

              {/* Package Name Input */}
              <div className="p-4 border-t">
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  placeholder="Enter package name..."
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Admin Screen */}
      {showAssessmentAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Assessment Administration</h2>
            </div>
            <button
              onClick={() => setShowAssessmentAdmin(false)}
              className="text-white/80 hover:text-white"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleSaveFromAdmin(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => handleSaveFromAdmin(true)}
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save and Close'}
              </button>
              <button
                onClick={handleSendInvoice}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 shadow-sm flex items-center gap-2"
              >
                <FiMail className="w-4 h-4" />
                Send Invoice
              </button>
              <button
                onClick={() => setShowAssessmentAdmin(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>

            {/* Examinee Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Examinee Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Examinee Name:</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 font-medium">
                    {examineeName && examineeName.trim() !== 'undefined undefined' ? examineeName : 'Not selected'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Examinee ID:</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                    {examineeId && examineeId !== 'undefined' ? examineeId : 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Details */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Assessment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Assessment Package:</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 font-medium">
                    {packageName || 'Custom Package'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Items Count:</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                    {selectedPackages.length + selectedAssessments.length} item(s)
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Total Price:</label>
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 font-bold">
                    {formatPrice(calculateTotal())}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Administration Date: *</label>
                  <input
                    type="date"
                    value={adminDate}
                    onChange={(e) => setAdminDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Examiner: *</label>
                  <select
                    value={examiner}
                    onChange={(e) => setExaminer(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option>JAGGI, KRUTIKA</option>
                    <option>New Examiner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status:</label>
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-700 font-medium">
                    Ready for Administration
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Delivery Options</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="manual"
                    checked={deliveryMethod === 'manual'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <div>
                    <div className="font-medium text-sm">Manual Entry</div>
                    <div className="text-xs text-gray-500">Enter responses manually for paper-based assessments</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="delivery"
                    value="onscreen"
                    checked={deliveryMethod === 'onscreen'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">On-Screen Administration</div>
                    <div className="text-xs text-gray-500 mb-2">Administer assessment digitally on this computer</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Email Invoice Screen */}
      {showEmailScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[60] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Send Invoice Email</h2>
            </div>
            <button
              onClick={() => setShowEmailScreen(false)}
              className="text-white/80 hover:text-white"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiMail className="w-4 h-4" />
                    Send Email
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEmailScreen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>

            {/* Email Form */}
            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter recipient email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter email message..."
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Invoice Preview */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Invoice Preview:</h4>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                  <div className="flex justify-between mb-2">
                    <span>Examinee:</span>
                    <span className="font-medium">{examineeName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Items:</span>
                    <span>{selectedPackages.length + selectedAssessments.length}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-blue-600">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AssignAssessmentScreen;
