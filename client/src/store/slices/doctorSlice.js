import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching doctors with filters:', filters);
      const response = await api.getDoctors(filters);
      console.log('📥 API Response:', response);
      
      const doctorsData = response.data?.data || response.data || [];
      console.log('👥 Doctors Data:', doctorsData);
      
      return response.data;
    } catch (error) {
      console.error('❌ Fetch doctors error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
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
        console.log('⏳ Fetching doctors started...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        console.log('✅ Fetching doctors successful!');
        state.isLoading = false;
        const doctorsData = action.payload?.data || action.payload || [];
        console.log('📊 Processing doctors data:', doctorsData);
        state.doctors = Array.isArray(doctorsData) ? doctorsData : [];
        state.totalCount = state.doctors.length;
        console.log('📈 Total doctors loaded:', state.totalCount);
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        console.log('❌ Fetching doctors failed!');
        state.isLoading = false;
        state.error = action.payload;
        console.error('🚨 Doctors fetch error:', action.payload);
      });
  },
});

export const { setFilters, clearFilters, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;