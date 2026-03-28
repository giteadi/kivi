const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dashboard.iplanbymsl.in/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const method = config.method || 'GET';
    const timeoutMs = options.timeoutMs ?? 15000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    config.signal = controller.signal;

    console.log('🌐 API Request:', {
      method,
      url,
      timeoutMs,
      hasAuth: !!token
    });

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      console.log('🌐 API Response (raw):', {
        method,
        url,
        status: response.status,
        ok: response.ok
      });
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      // Handle HTTP errors
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.statusText = response.statusText;
        error.response = { status: response.status, statusText: response.statusText, data };
        error.url = url;
        error.method = config.method || 'GET';
        
        // Handle specific status codes
        if (response.status === 401) {
          // Unauthorized - clear auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only reload if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.reload();
          }
        }
        
        console.error('API Error:', {
          url,
          method: config.method || 'GET',
          status: response.status,
          statusText: response.statusText,
          message: data.message,
          data
        });
        
        throw error;
      }
      
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      // Network or other errors
      if (!error.response) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
          timeoutError.type = 'timeout_error';
          timeoutError.url = url;
          timeoutError.method = method;

          console.error('Timeout Error:', {
            url,
            method,
            timeoutMs
          });

          throw timeoutError;
        }

        const networkError = new Error('Network request failed - please check your connection');
        networkError.type = 'network_error';
        networkError.originalError = error;
        networkError.url = url;
        networkError.method = method;
        
        console.error('Network Error:', {
          url,
          method,
          error: error.message,
          type: 'network_error'
        });
        
        throw networkError;
      }
      
      // Re-throw API errors
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    console.log('🌐 API Service: Starting login request to:', `${this.baseURL}/auth/login`);
    console.log('🌐 API Service: Login payload:', { email: credentials.email, password: '***' });
    
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('🌐 API Service: Login response received:', response);
      return response;
    } catch (error) {
      console.error('🌐 API Service: Login request failed:', error);
      throw error;
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Dashboard endpoints
  async getDashboardStats(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/dashboard/stats?${queryParams}`);
  }

  async getDashboardData(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/dashboard/data?${queryParams}`);
  }

  async getUpcomingAppointments(limit = 5, filters = {}) {
    const queryParams = new URLSearchParams({ limit, ...filters });
    return this.request(`/dashboard/upcoming-sessions?${queryParams}`);
  }

  async getTopDoctors(limit = 5, filters = {}) {
    const queryParams = new URLSearchParams({ limit, ...filters });
    return this.request(`/dashboard/top-therapists?${queryParams}`);
  }

  async getBookingChart(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/dashboard/session-chart?${queryParams}`);
  }

  // Sessions endpoints (mapped from appointments for frontend compatibility)
  async getAppointments(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/sessions?${queryParams}`);
  }

  async getAppointment(id) {
    return this.request(`/sessions/${id}`);
  }

  async createAppointment(appointmentData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, appointmentData) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Students endpoints (mapped from patients for frontend compatibility)
  async getPatients(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/students?${queryParams}`);
  }

  async getPatient(id) {
    return this.request(`/students/${id}`);
  }

  async createPatient(patientData) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Templates API methods
  async getTemplates() {
    return this.request('/templates');
  }

  async getTemplate(id) {
    return this.request(`/templates/${id}`);
  }

  async createTemplate(templateData) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateTemplate(id, templateData) {
    return this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteTemplate(id) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }

  async generateReportFromTemplate(templateId, examineeId, customData = {}) {
    return this.request(`/templates/${templateId}/generate-report`, {
      method: 'POST',
      body: JSON.stringify({
        studentId: examineeId,
        customData
      }),
    });
  }

  // Therapists endpoints (mapped from doctors for frontend compatibility)
  async getDoctors(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/therapists?${queryParams}`);
  }

  async getDoctor(id) {
    return this.request(`/therapists/${id}`);
  }

  async createDoctor(doctorData) {
    return this.request('/therapists', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(id, doctorData) {
    return this.request(`/therapists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id) {
    return this.request(`/therapists/${id}`, {
      method: 'DELETE',
    });
  }

  // Centres endpoints (mapped from clinics for frontend compatibility)
  async getClinics(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/centres?${queryParams}`);
  }

  async getClinic(id) {
    return this.request(`/centres/${id}`);
  }

  async createClinic(clinicData) {
    return this.request('/centres', {
      method: 'POST',
      body: JSON.stringify(clinicData),
    });
  }

  async updateClinic(id, clinicData) {
    return this.request(`/centres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clinicData),
    });
  }

  async deleteClinic(id) {
    return this.request(`/centres/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async getPaymentHistory() {
    return this.request('/payment/history');
  }

  async createPaymentOrder(orderData) {
    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(verificationData) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
    });
  }

  // User dashboard endpoints
  async getUserSessions() {
    return this.request('/user/sessions');
  }

async getUserPayments() {
  return this.request('/user/payments');
}

async getUserTherapist() {
  return this.request('/user/therapist');
}

async getUserStats() {
  return this.request('/user/stats');
}

async updateUserProfile(profileData) {
  return this.request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

async getPlans() {
  return this.request('/plans');
}

async createPlan(planData) {
  return this.request('/plans', {
    method: 'POST',
    body: JSON.stringify(planData),
  });
}

async updatePlan(id, planData) {
  return this.request(`/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(planData),
  });
}

async deletePlan(id) {
  return this.request(`/plans/${id}`, {
    method: 'DELETE',
  });
}

  async getPlansWithAvailability(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/plans/availability?${queryParams}`);
  }

  // Booking endpoints
  async getAvailableTherapists(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/booking/therapists?${queryParams}`);
  }

  async getTherapistAvailabilityForBooking(therapistId, date) {
    return this.request(`/booking/therapists/${therapistId}/availability/${date}`);
  }

  async getTherapistAvailabilitySettings(therapistId) {
    return this.request(`/therapists/${therapistId}/availability`);
  }

  async updateTherapistAvailabilitySettings(therapistId, availabilityData) {
    return this.request(`/therapists/${therapistId}/availability`, {
      method: 'PUT',
      body: JSON.stringify(availabilityData),
    });
  }

  async getMyTherapistAvailabilitySettings() {
    return this.request('/therapists/my/availability');
  }

  async updateMyTherapistAvailabilitySettings(availabilityData) {
    return this.request('/therapists/my/availability', {
      method: 'PUT',
      body: JSON.stringify(availabilityData),
    });
  }

  async getAvailableTimeSlots(therapistId, date) {
    console.log('🚀 API: Fetching time slots:', { therapistId, date });
    const queryParams = new URLSearchParams({ date });
    const url = `/booking/therapists/${therapistId}/slots?${queryParams}`;
    console.log('🚀 API: Full URL:', url);
    const response = await this.request(url);
    console.log('✅ API: Full response object:', response);
    console.log('✅ API: Response.data:', response.data);
    console.log('✅ API: Response.data type:', typeof response.data);
    console.log('✅ API: Response.data length:', response.data?.length);
    return response; // Return full response object
  }

  async bookSession(bookingData) {
    return this.request('/booking/session', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookingCalendar(therapistId, filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/booking/therapists/${therapistId}/calendar?${queryParams}`);
  }

  // Financial endpoints
  async getClinicRevenue(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/financial/clinic-revenue?${queryParams}`);
  }

  async getDoctorRevenue(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/financial/doctor-revenue?${queryParams}`);
  }

  async getBillingRecords(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/financial/billing-records?${queryParams}`);
  }

  async getTaxes(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/financial/taxes?${queryParams}`);
  }

  // Programmes endpoints (with filters)
  async getProgrammes(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/programmes?${queryParams}`);
  }

  async getProgramme(id) {
    return this.request(`/programmes/${id}`);
  }

  async createProgramme(programmeData) {
    return this.request('/programmes', {
      method: 'POST',
      body: JSON.stringify(programmeData),
    });
  }

  async updateProgramme(id, programmeData) {
    return this.request(`/programmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(programmeData),
    });
  }

  async deleteProgramme(id) {
    return this.request(`/programmes/${id}`, {
      method: 'DELETE',
    });
  }

  // Get therapists by centre
  async getTherapistsByCentre(centreId) {
    return this.request(`/programmes/therapists/${centreId}`);
  }

  // Templates API methods
  async getTemplates() {
    return this.request('/templates');
  }

  async getTemplate(id) {
    return this.request(`/templates/${id}`);
  }

  async createTemplate(templateData) {
    return this.request('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateTemplate(id, templateData) {
    return this.request(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteTemplate(id) {
    return this.request(`/templates/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();