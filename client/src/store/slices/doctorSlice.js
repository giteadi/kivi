import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '@/services/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await apiService.get(`/therapists?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch doctors');
    }
  }
);

const initialState = {
  doctors: [],
  currentDoctor: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: { search: '', specialty: '', status: '' }
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', specialty: '', status: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        const doctorsData = action.payload?.data || action.payload || [];
        state.doctors = Array.isArray(doctorsData) ? doctorsData : [];
        state.totalCount = state.doctors.length;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;