const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dashboard.iplanbymsl.in/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    // Build headers - token ALWAYS added, never overridden
    const baseHeaders = {};
    if (token) baseHeaders['Authorization'] = `Bearer ${token}`;
    
    // Only set Content-Type if not FormData
    const isFormData = options.body instanceof FormData;
    if (!isFormData) baseHeaders['Content-Type'] = 'application/json';

    const config = {
      ...options,
      headers: {
        ...baseHeaders,
        ...options.headers, // extra headers (but won't override Authorization)
      },
    };

    // Re-add token in case options.headers overrode it
    if (token) config.headers['Authorization'] = `Bearer ${token}`;

    const method = config.method || 'GET';
    const timeoutMs = options.timeoutMs ?? 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.status = response.status;
        error.response = { status: response.status, data };
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        const e = new Error(`Request timed out after ${timeoutMs}ms`);
        e.type = 'timeout_error';
        throw e;
      }
      if (!error.response) {
        const e = new Error('Network request failed');
        e.type = 'network_error';
        throw e;
      }
      throw error;
    }
  }

  async login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  }
  async register(userData) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  }
  async getProfile() { return this.request('/auth/profile'); }
  async getDashboardStats(filters = {}) { return this.request(`/dashboard/stats?${new URLSearchParams(filters)}`); }
  async getDashboardData(filters = {}) { return this.request(`/dashboard/data?${new URLSearchParams(filters)}`); }
  async getUpcomingAppointments(limit = 5, filters = {}) { return this.request(`/dashboard/upcoming-sessions?${new URLSearchParams({ limit, ...filters })}`); }
  async getTopDoctors(limit = 5, filters = {}) { return this.request(`/dashboard/top-therapists?${new URLSearchParams({ limit, ...filters })}`); }
  async getBookingChart(filters = {}) { return this.request(`/dashboard/session-chart?${new URLSearchParams(filters)}`); }
  async getAppointments(filters = {}) { return this.request(`/sessions?${new URLSearchParams(filters)}`); }
  async getAppointment(id) { return this.request(`/sessions/${id}`); }
  async createAppointment(d) { return this.request('/sessions', { method: 'POST', body: JSON.stringify(d) }); }
  async updateAppointment(id, d) { return this.request(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deleteAppointment(id) { return this.request(`/sessions/${id}`, { method: 'DELETE' }); }
  async getPatients(filters = {}) { return this.request(`/students?${new URLSearchParams(filters)}`); }
  async getPatient(id) { return this.request(`/students/${id}`); }
  async createPatient(d) { return this.request('/students', { method: 'POST', body: JSON.stringify(d) }); }
  async updatePatient(id, d) { return this.request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deletePatient(id) { return this.request(`/students/${id}`, { method: 'DELETE' }); }
  async getTemplates() { return this.request('/templates'); }
  async getTemplate(id) { return this.request(`/templates/${id}`); }
  async createTemplate(d) { return this.request('/templates', { method: 'POST', body: JSON.stringify(d) }); }
  async updateTemplate(id, d) { return this.request(`/templates/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deleteTemplate(id) { return this.request(`/templates/${id}`, { method: 'DELETE' }); }
  async generateReportFromTemplate(tid, eid, customData = {}) { return this.request(`/templates/${tid}/generate-report`, { method: 'POST', body: JSON.stringify({ studentId: eid, customData }) }); }
  async getDoctors(filters = {}) { return this.request(`/therapists?${new URLSearchParams(filters)}`); }
  async getDoctor(id) { return this.request(`/therapists/${id}`); }
  async createDoctor(d) { return this.request('/therapists', { method: 'POST', body: JSON.stringify(d) }); }
  async updateDoctor(id, d) { return this.request(`/therapists/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deleteDoctor(id) { return this.request(`/therapists/${id}`, { method: 'DELETE' }); }
  async getClinics(filters = {}) { return this.request(`/centres?${new URLSearchParams(filters)}`); }
  async getClinic(id) { return this.request(`/centres/${id}`); }
  async createClinic(d) { return this.request('/centres', { method: 'POST', body: JSON.stringify(d) }); }
  async updateClinic(id, d) { return this.request(`/centres/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deleteClinic(id) { return this.request(`/centres/${id}`, { method: 'DELETE' }); }
  async getPaymentHistory() { return this.request('/payment/history'); }
  async createPaymentOrder(d) { return this.request('/payment/create-order', { method: 'POST', body: JSON.stringify(d) }); }
  async verifyPayment(d) { return this.request('/payment/verify', { method: 'POST', body: JSON.stringify(d) }); }
  async getUserSessions() { return this.request('/user/sessions'); }
  async getUserPayments() { return this.request('/user/payments'); }
  async getUserTherapist() { return this.request('/user/therapist'); }
  async getUserStats() { return this.request('/user/stats'); }
  async updateUserProfile(d) { return this.request('/user/profile', { method: 'PUT', body: JSON.stringify(d) }); }
  async getPlans() { return this.request('/plans'); }
  async createPlan(d) { return this.request('/plans', { method: 'POST', body: JSON.stringify(d) }); }
  async updatePlan(id, d) { return this.request(`/plans/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deletePlan(id) { return this.request(`/plans/${id}`, { method: 'DELETE' }); }
  async getPlansWithAvailability(filters = {}) { return this.request(`/plans/availability?${new URLSearchParams(filters)}`); }
  async getAvailableTherapists(filters = {}) { return this.request(`/booking/therapists?${new URLSearchParams(filters)}`); }
  async getTherapistAvailabilityForBooking(id, date) { return this.request(`/booking/therapists/${id}/availability/${date}`); }
  async getTherapistAvailabilitySettings(id) { return this.request(`/therapists/${id}/availability`); }
  async updateTherapistAvailabilitySettings(id, d) { return this.request(`/therapists/${id}/availability`, { method: 'PUT', body: JSON.stringify(d) }); }
  async getMyTherapistAvailabilitySettings() { return this.request('/therapists/my/availability'); }
  async updateMyTherapistAvailabilitySettings(d) { return this.request('/therapists/my/availability', { method: 'PUT', body: JSON.stringify(d) }); }
  async getAvailableTimeSlots(therapistId, date) { return this.request(`/booking/therapists/${therapistId}/slots?${new URLSearchParams({ date })}`); }
  async bookSession(d) { return this.request('/booking/session', { method: 'POST', body: JSON.stringify(d) }); }
  async getBookingCalendar(id, filters = {}) { return this.request(`/booking/therapists/${id}/calendar?${new URLSearchParams(filters)}`); }
  async getClinicRevenue(filters = {}) { return this.request(`/financial/clinic-revenue?${new URLSearchParams(filters)}`); }
  async getDoctorRevenue(filters = {}) { return this.request(`/financial/doctor-revenue?${new URLSearchParams(filters)}`); }
  async getBillingRecords(filters = {}) { return this.request(`/financial/billing-records?${new URLSearchParams(filters)}`); }
  async getTaxes(filters = {}) { return this.request(`/financial/taxes?${new URLSearchParams(filters)}`); }
  async getProgrammes(filters = {}) { return this.request(`/programmes?${new URLSearchParams(filters)}`); }
  async getProgramme(id) { return this.request(`/programmes/${id}`); }
  async createProgramme(d) { return this.request('/programmes', { method: 'POST', body: JSON.stringify(d) }); }
  async updateProgramme(id, d) { return this.request(`/programmes/${id}`, { method: 'PUT', body: JSON.stringify(d) }); }
  async deleteProgramme(id) { return this.request(`/programmes/${id}`, { method: 'DELETE' }); }
  async getTherapistsByCentre(centreId) { return this.request(`/programmes/therapists/${centreId}`); }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }
  async post(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
      headers: { ...options.headers }, // token added automatically in request()
    });
  }
  async put(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
      headers: { ...options.headers },
    });
  }
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiService();