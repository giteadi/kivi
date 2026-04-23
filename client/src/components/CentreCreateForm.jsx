import { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import api from '../services/api';
import { useToast } from './Toast';
import LocationSelector from './LocationSelector';

const CentreCreateForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    operating_hours: '',
    specialties: '',
    services: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('[CentreCreateForm] handleChange:', { name, value });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[CentreCreateForm] handleSubmit called');
    console.log('[CentreCreateForm] formData before submit:', formData);
    setLoading(true);
    setError('');

    try {
      // Convert specialties string to JSON array
      const specialtiesArray = formData.specialties.split(',').map(s => s.trim()).filter(s => s);
      const servicesArray = formData.services ? formData.services.split(',').map(s => s.trim()).filter(s => s) : [];
      
      console.log('[CentreCreateForm] servicesArray:', servicesArray);
      
      const centreData = {
        ...formData,
        specialties: JSON.stringify(specialtiesArray),
        services: JSON.stringify(servicesArray)
      };

      // Format established_date to YYYY-MM-DD for MySQL
      if (centreData.established_date) {
        centreData.established_date = centreData.established_date.split('T')[0];
      }

      console.log('[CentreCreateForm] sending to API:', centreData);
      const data = await api.createClinic(centreData);
      console.log('[CentreCreateForm] API response:', data);

      if (data.success) {
        toast.success('Center created successfully!', { duration: 3000 });
        onSuccess && onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to create center');
        toast.error(data.message || 'Failed to create center', { duration: 4000 });
      }
    } catch (err) {
      console.error('[CentreCreateForm] error:', err);
      setError('Error creating center');
      toast.error('Error creating center', { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add New Center</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Center Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter center name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="center@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full address"
              />
            </div>

            <div className="md:col-span-2">
              <LocationSelector
                value={{
                  country: formData.country,
                  state: formData.state,
                  city: formData.city,
                  zip_code: formData.zip_code,
                }}
                onChange={(loc) => setFormData(prev => ({ ...prev, ...loc }))}
                errors={error ? {} : {}}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Hours
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Opening Time</label>
                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime || ''}
                    onChange={(e) => {
                      handleChange(e);
                      const closing = formData.closingTime || '20:00';
                      const opening = e.target.value || '09:00';
                      const formatTime = (t) => {
                        const [h, m] = t.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        return `${hour12}:${m} ${ampm}`;
                      };
                      setFormData(prev => ({ ...prev, operating_hours: `${formatTime(opening)} - ${formatTime(closing)}` }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Closing Time</label>
                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime || ''}
                    onChange={(e) => {
                      handleChange(e);
                      const opening = formData.openingTime || '09:00';
                      const closing = e.target.value || '20:00';
                      const formatTime = (t) => {
                        const [h, m] = t.split(':');
                        const hour = parseInt(h);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const hour12 = hour % 12 || 12;
                        return `${hour12}:${m} ${ampm}`;
                      };
                      setFormData(prev => ({ ...prev, operating_hours: `${formatTime(opening)} - ${formatTime(closing)}` }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Example: 9:00 AM to 8:00 PM</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialties (comma-separated)
              </label>
              <input
                type="text"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Learning Therapy, Behavioral Therapy, Speech Therapy"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Services (comma-separated)
              </label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={(e) => {
                  console.log('[CentreCreateForm] services input:', e.target.value);
                  handleChange(e);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Speech Therapy, Occupational Therapy, Physical Therapy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FiSave className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Center'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CentreCreateForm;
