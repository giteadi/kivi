import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as apiService from '@/services/api';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await apiService.get(`/programmes?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

const initialState = {
  services: [],
  currentService: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: { search: '', category: '', status: '' }
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', category: '', status: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        const servicesData = action.payload?.data || action.payload || [];
        state.services = Array.isArray(servicesData) ? servicesData : [];
        state.totalCount = state.services.length;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = serviceSlice.actions;
export default serviceSlice.reducer;