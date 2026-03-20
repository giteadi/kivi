import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await api.getPatients(filters);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch patients'
      );
    }
  }
);

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id, { rejectWithValue }) => {
    try {
      return await api.getPatient(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch patient'
      );
    }
  }
);

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      return await api.createPatient(patientData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create patient'
      );
    }
  }
);

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      return await api.updatePatient(id, patientData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update patient'
      );
    }
  }
);

export const deletePatient = createAsyncThunk(
  'patients/deletePatient',
  async (id, { rejectWithValue }) => {
    try {
      await api.deletePatient(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete patient'
      );
    }
  }
);

// Initial state
const initialState = {
  patients: [],
  currentPatient: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: {
    search: '',
    gender: '',
    status: '',
    ageRange: ''
  }
};

// Patient slice
const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        gender: '',
        status: '',
        ageRange: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        const patientsData = action.payload?.data || action.payload || [];
        state.patients = Array.isArray(patientsData) ? patientsData : [];
        state.totalCount = state.patients.length;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Single Patient
      .addCase(fetchPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPatient = action.payload;
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Patient
      .addCase(createPatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.patients.findIndex(patient => patient.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (state.currentPatient?.id === action.payload.id) {
          state.currentPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = state.patients.filter(patient => patient.id !== action.payload);
        state.totalCount -= 1;
        if (state.currentPatient?.id === action.payload) {
          state.currentPatient = null;
        }
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  clearError, 
  setCurrentPatient, 
  clearCurrentPatient 
} = patientSlice.actions;

export default patientSlice.reducer;