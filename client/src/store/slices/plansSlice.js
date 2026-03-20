import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for plans
export const fetchPlans = createAsyncThunk(
  'plans/fetchPlans',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.getPlans();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch plans');
    }
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchPlanById',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await api.getPlan(planId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch plan');
    }
  }
);

export const fetchPlansWithAvailability = createAsyncThunk(
  'plans/fetchPlansWithAvailability',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.getPlansWithAvailability(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch plans with availability');
    }
  }
);

// Initial state
const initialState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
  filters: {
    type: '',
    min_price: '',
    max_price: ''
  }
};

// Plans slice
const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        min_price: '',
        max_price: ''
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPlan: (state, action) => {
      state.currentPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        const plansData = action.payload?.data || action.payload || [];
        state.plans = Array.isArray(plansData) ? plansData : [];
        state.error = null;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch plan by ID
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch plans with availability
      .addCase(fetchPlansWithAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlansWithAvailability.fulfilled, (state, action) => {
        state.loading = false;
        const plansData = action.payload?.data || action.payload || [];
        state.plans = Array.isArray(plansData) ? plansData : [];
        state.error = null;
      })
      .addCase(fetchPlansWithAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, setCurrentPlan } = plansSlice.actions;
export default plansSlice.reducer;
