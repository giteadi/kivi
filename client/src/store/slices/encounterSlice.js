import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';

export const fetchEncounters = createAsyncThunk(
  'encounters/fetchEncounters',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/encounters?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch encounters');
    }
  }
);

export const fetchTemplates = createAsyncThunk(
  'encounters/fetchTemplates',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/templates?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

const initialState = {
  encounters: [],
  templates: [],
  currentEncounter: null,
  currentTemplate: null,
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
        state.encounters = action.payload;
        state.totalCount = action.payload.length;
      })
      .addCase(fetchEncounters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = encounterSlice.actions;
export default encounterSlice.reducer;