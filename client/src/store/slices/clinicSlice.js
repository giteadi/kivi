import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '@/services/api';

export const fetchClinics = createAsyncThunk(
  'clinics/fetchClinics',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await apiService.get(`/centres?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clinics');
    }
  }
);

const initialState = {
  clinics: [],
  currentClinic: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: { search: '', city: '', status: '' }
};

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', city: '', status: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.isLoading = false;
        const clinicsData = action.payload?.data || action.payload || [];
        state.clinics = Array.isArray(clinicsData) ? clinicsData : [];
        state.totalCount = state.clinics.length;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = clinicSlice.actions;
export default clinicSlice.reducer;