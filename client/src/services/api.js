const API_BASE_URL = 'http://localhost:3005/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🌐 API Service: Making request to:', url);
    console.log('🌐 API Service: Request options:', { ...options, body: options.body ? '***' : undefined });
    
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem('token');
    console.log('🌐 API Service: Token available:', !!token);
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🌐 API Service: Sending fetch request...');
      const response = await fetch(url, config);
      console.log('🌐 API Service: Response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('🌐 API Service: Response data:', data);
      
      // Handle unauthorized responses
      if (response.status === 401) {
        console.log('🌐 API Service: Unauthorized response, clearing localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        return;
      }
      
      if (!response.ok) {
        console.error('🌐 API Service: Response not OK:', response.status, data);
        throw new Error(data.message || 'API request failed');
      }
      
      console.log('🌐 API Service: Request successful, returning data');
      return data;
    } catch (error) {
      console.error('🌐 API Service: Request error:', error);
      console.error('🌐 API Service: Error details:', { message: error.message, stack: error.stack });
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

  async getPlans() {
    return this.request('/plans');
  }

  async getPlan(id) {
    return this.request(`/plans/${id}`);
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
    const queryParams = new URLSearchParams({ date });
    return this.request(`/booking/therapists/${therapistId}/slots?${queryParams}`);
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
}

export default new ApiService();