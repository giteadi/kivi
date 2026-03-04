import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.clinicId) queryParams.append('clinicId', filters.clinicId);
      if (filters.doctorId) queryParams.append('doctorId', filters.doctorId);

      const response = await axios.get(`${API_BASE_URL}/dashboard/data?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard data'
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/dashboard/stats?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchUpcomingAppointments = createAsyncThunk(
  'dashboard/fetchUpcomingAppointments',
  async ({ limit = 5, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({ limit, ...filters });
      const response = await axios.get(`${API_BASE_URL}/dashboard/upcoming-appointments?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch upcoming appointments'
      );
    }
  }
);

export const fetchTopDoctors = createAsyncThunk(
  'dashboard/fetchTopDoctors',
  async ({ limit = 5, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({ limit, ...filters });
      const response = await axios.get(`${API_BASE_URL}/dashboard/top-doctors?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch top doctors'
      );
    }
  }
);

export const fetchBookingChart = createAsyncThunk(
  'dashboard/fetchBookingChart',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/dashboard/booking-chart?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking chart data'
      );
    }
  }
);

// Initial state
const initialState = {
  stats: {
    totalAppointments: 0,
    totalPatients: 0,
    totalClinics: 0,
    totalDoctors: 0,
    activeServices: 0,
    totalRevenue: 0
  },
  upcomingAppointments: [],
  topDoctors: [],
  bookingChart: [],
  isLoading: false,
  error: null,
  filters: {
    startDate: '',
    endDate: '',
    clinicId: '',
    doctorId: ''
  }
};

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: '',
        endDate: '',
        clinicId: '',
        doctorId: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats || state.stats;
        state.upcomingAppointments = action.payload.upcomingAppointments || [];
        state.topDoctors = action.payload.topDoctors || [];
        state.bookingChart = action.payload.bookingChart || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Upcoming Appointments
      .addCase(fetchUpcomingAppointments.fulfilled, (state, action) => {
        state.upcomingAppointments = action.payload;
      })
      // Fetch Top Doctors
      .addCase(fetchTopDoctors.fulfilled, (state, action) => {
        state.topDoctors = action.payload;
      })
      // Fetch Booking Chart
      .addCase(fetchBookingChart.fulfilled, (state, action) => {
        state.bookingChart = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;