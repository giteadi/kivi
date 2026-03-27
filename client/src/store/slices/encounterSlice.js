import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchEncounters = createAsyncThunk(
  'encounters/fetchEncounters',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      return await api.request(`/encounters?${queryParams}`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch encounters');
    }
  }
);

const initialState = {
  encounters: [],
  currentEncounter: null,
  isLoading: false,
  error: null,
  totalCount: 0,
  filters: { search: '', status: '', doctorId: '' }
};

const encounterSlice = createSlice({
  name: 'encounters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: '', status: '', doctorId: '' };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEncounters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEncounters.fulfilled, (state, action) => {
        state.isLoading = false;
        const encountersData = action.payload?.data || action.payload || [];
        state.encounters = Array.isArray(encountersData) ? encountersData : [];
        state.totalCount = state.encounters.length;
      })
      .addCase(fetchEncounters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = encounterSlice.actions;
export default encounterSlice.reducer;