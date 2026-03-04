import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';

export const fetchClinics = createAsyncThunk(
  'clinics/fetchClinics',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/clinics?${queryParams}`);
      return response.data.data;
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
        state.clinics = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = clinicSlice.actions;
export default clinicSlice.reducer;