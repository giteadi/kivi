const API_BASE_URL = 'http://localhost:3005/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
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
    return this.request(`/dashboard/upcoming-appointments?${queryParams}`);
  }

  async getTopDoctors(limit = 5, filters = {}) {
    const queryParams = new URLSearchParams({ limit, ...filters });
    return this.request(`/dashboard/top-doctors?${queryParams}`);
  }

  async getBookingChart(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/dashboard/booking-chart?${queryParams}`);
  }

  // Appointments endpoints
  async getAppointments(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/appointments?${queryParams}`);
  }

  async getAppointment(id) {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async updateAppointment(id, appointmentData) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });
  }

  async deleteAppointment(id) {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // Patients endpoints
  async getPatients(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/patients?${queryParams}`);
  }

  async getPatient(id) {
    return this.request(`/patients/${id}`);
  }

  async createPatient(patientData) {
    return this.request('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    return this.request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatient(id) {
    return this.request(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Doctors endpoints
  async getDoctors(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/doctors?${queryParams}`);
  }

  async getDoctor(id) {
    return this.request(`/doctors/${id}`);
  }

  async createDoctor(doctorData) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(id, doctorData) {
    return this.request(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id) {
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  // Clinics endpoints
  async getClinics(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/clinics?${queryParams}`);
  }

  async getClinic(id) {
    return this.request(`/clinics/${id}`);
  }

  async createClinic(clinicData) {
    return this.request('/clinics', {
      method: 'POST',
      body: JSON.stringify(clinicData),
    });
  }

  async updateClinic(id, clinicData) {
    return this.request(`/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clinicData),
    });
  }

  async deleteClinic(id) {
    return this.request(`/clinics/${id}`, {
      method: 'DELETE',
    });
  }

  // Services endpoints
  async getServices(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/services?${queryParams}`);
  }

  async getService(id) {
    return this.request(`/services/${id}`);
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(id, serviceData) {
    return this.request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(id) {
    return this.request(`/services/${id}`, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();