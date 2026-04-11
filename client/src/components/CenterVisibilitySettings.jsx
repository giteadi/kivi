import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEye, 
  FiEyeOff, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar, 
  FiFileText,
  FiShield,
  FiSave,
  FiRefreshCw,
  FiCheckCircle,
  FiMapPin,
  FiInfo
} from 'react-icons/fi';
import api from '../services/api';
import Sidebar from './Sidebar';

const CenterVisibilitySettings = () => {
  const [activeItem, setActiveItem] = useState('center-visibility');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Visibility categories with their fields
  const visibilityCategories = [
    {
      title: 'Financial Data',
      icon: FiDollarSign,
      color: 'green',
      fields: [
        { key: 'show_revenue', label: 'Show Revenue' },
        { key: 'show_billing_records', label: 'Show Billing Records' },
        { key: 'show_payment_details', label: 'Show Payment Details' },
        { key: 'show_tax_info', label: 'Show Tax Information' },
      ]
    },
    {
      title: 'Patient Data',
      icon: FiUsers,
      color: 'blue',
      fields: [
        { key: 'show_patient_contact_info', label: 'Show Contact Information' },
        { key: 'show_patient_medical_history', label: 'Show Medical History' },
        { key: 'show_patient_assessments', label: 'Show Assessments' },
        { key: 'show_patient_personal_info', label: 'Show Personal Information' },
      ]
    },
    {
      title: 'Session Data',
      icon: FiCalendar,
      color: 'purple',
      fields: [
        { key: 'show_session_details', label: 'Show Session Details' },
        { key: 'show_session_notes', label: 'Show Session Notes' },
        { key: 'show_therapy_plans', label: 'Show Therapy Plans' },
      ]
    },
    {
      title: 'Center Data',
      icon: FiMapPin,
      color: 'orange',
      fields: [
        { key: 'show_center_financials', label: 'Show Center Financials' },
        { key: 'show_center_staff_list', label: 'Show Staff List' },
        { key: 'show_center_analytics', label: 'Show Analytics' },
      ]
    },
    {
      title: 'Examinee Data',
      icon: FiFileText,
      color: 'pink',
      fields: [
        { key: 'show_examinee_contact_info', label: 'Show Contact Info' },
        { key: 'show_examinee_assessment_results', label: 'Show Assessment Results' },
        { key: 'show_examinee_reports', label: 'Show Reports' },
      ]
    }
  ];

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const response = await api.request('/center-visibility');
      if (response.success) {
        setCenters(response.data || []);
        if (response.data && response.data.length > 0 && !selectedCenter) {
          setSelectedCenter(response.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
      setError('Failed to load centers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (fieldKey) => {
    if (!selectedCenter) return;
    
    setSelectedCenter({
      ...selectedCenter,
      [fieldKey]: !selectedCenter[fieldKey]
    });
  };

  const handleSave = async () => {
    if (!selectedCenter) return;
    
    setSaving(true);
    try {
      const settings = {};
      visibilityCategories.forEach(cat => {
        cat.fields.forEach(field => {
          settings[field.key] = selectedCenter[field.key];
        });
      });

      const response = await api.request(`/center-visibility/${selectedCenter.id}`, {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      
      if (response.success) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(null), 3000);
        
        // Update the centers list
        setCenters(centers.map(c => 
          c.id === selectedCenter.id ? selectedCenter : c
        ));
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getEnabledCount = (center) => {
    let count = 0;
    let total = 0;
    visibilityCategories.forEach(cat => {
      cat.fields.forEach(field => {
        total++;
        if (center[field.key]) count++;
      });
    });
    return { count, total };
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
        <div className="flex-1 lg:ml-64 min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading centers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar 
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 min-h-screen bg-slate-50 lg:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Center Visibility Settings</h1>
            <p className="text-gray-600">
              Control what data is visible to center handlers. Select a center to configure its visibility settings.
            </p>
          </div>

          {/* Messages */}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <FiCheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800">{message}</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
            >
              <FiInfo className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Centers List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Centers</h2>
                  <button 
                    onClick={fetchCenters}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh"
                  >
                    <FiRefreshCw className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {centers.map((center) => {
                    const { count, total } = getEnabledCount(center);
                    const isSelected = selectedCenter?.id === center.id;
                    
                    return (
                      <button
                        key={center.id}
                        onClick={() => setSelectedCenter(center)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          isSelected 
                            ? 'bg-blue-50 border-2 border-blue-500' 
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {center.name}
                            </h3>
                            <p className="text-sm text-gray-500">{center.city}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              center.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {center.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {count}/{total} visible
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="lg:col-span-2">
              {selectedCenter ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedCenter.name} Settings
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Configure what data center handlers can see
                      </p>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {visibilityCategories.map((category) => {
                      const Icon = category.icon;
                      const colorClasses = {
                        green: 'bg-green-50 text-green-600 border-green-200',
                        blue: 'bg-blue-50 text-blue-600 border-blue-200',
                        purple: 'bg-purple-50 text-purple-600 border-purple-200',
                        orange: 'bg-orange-50 text-orange-600 border-orange-200',
                        pink: 'bg-pink-50 text-pink-600 border-pink-200',
                      };

                      return (
                        <div key={category.title} className="border border-gray-200 rounded-xl p-4">
                          <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${colorClasses[category.color]}`}>
                            <Icon className="w-5 h-5" />
                            <h3 className="font-semibold">{category.title}</h3>
                          </div>
                          
                          <div className="space-y-3">
                            {category.fields.map((field) => (
                              <label 
                                key={field.key}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                              >
                                <span className="text-sm text-gray-700">{field.label}</span>
                                <button
                                  onClick={() => handleToggle(field.key)}
                                  className={`relative w-12 h-6 rounded-full transition-colors ${
                                    selectedCenter[field.key] ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    selectedCenter[field.key] ? 'translate-x-6' : 'translate-x-0'
                                  }`} />
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShield className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Center</h3>
                  <p className="text-gray-500">
                    Choose a center from the list to configure its visibility settings
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CenterVisibilitySettings;
