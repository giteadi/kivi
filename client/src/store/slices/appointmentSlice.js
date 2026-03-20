import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await api.getAppointments(filters);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch appointments'
      );
    }
  }
);

export const fetchAppointment = createAsyncThunk(
  'appointments/fetchAppointment',
  async (id, { rejectWithValue }) => {
    try {
      return await api.getAppointment(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch appointment'
      );
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      return await api.createAppointment(appointmentData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create appointment'
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, appointmentData }, { rejectWithValue }) => {
    try {
      return await api.updateAppointment(id, appointmentData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update appointment'
      );
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteAppointment(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete appointment'
      );
    }
  }
);

// Initial state
const initialState = {
  appointments: [],
  currentAppointment: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: {
    status: '',
    doctorId: '',
    clinicId: '',
    date: '',
    search: ''
  }
};

// Appointment slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: '',
        doctorId: '',
        clinicId: '',
        date: '',
        search: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAppointment: (state, action) => {
      state.currentAppointment = action.payload;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        const appointmentsData = action.payload?.data || action.payload || [];
        state.appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
        state.totalCount = state.appointments.length;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Appointment
      .addCase(fetchAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Appointment
      .addCase(updateAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?.id === action.payload.id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = state.appointments.filter(apt => apt.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentAppointment?.id === action.payload) {
          state.currentAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  clearError, 
  setCurrentAppointment, 
  clearCurrentAppointment 
} = appointmentSlice.actions;

export default appointmentSlice.reducer;