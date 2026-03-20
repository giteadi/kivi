import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const url = queryParams.toString() ? `/sessions?${queryParams}` : '/sessions';
      const response = await api.request(url);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sessions');
    }
  }
);

export const fetchSession = createAsyncThunk(
  'sessions/fetchSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.request(`/sessions/${sessionId}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch session');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch session');
    }
  }
);

export const createSession = createAsyncThunk(
  'sessions/createSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await api.request('/sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      
      if (response.success) {
        return { id: response.data.id, ...sessionData };
      } else {
        return rejectWithValue(response.message || 'Failed to create session');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create session');
    }
  }
);

export const updateSession = createAsyncThunk(
  'sessions/updateSession',
  async ({ id, sessionData }, { rejectWithValue }) => {
    try {
      const response = await api.request(`/sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData)
      });
      
      if (response.success) {
        return { id, ...sessionData };
      } else {
        return rejectWithValue(response.message || 'Failed to update session');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update session');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'sessions/deleteSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.request(`/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        return sessionId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete session');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete session');
    }
  }
);

export const fetchAvailableTimeSlots = createAsyncThunk(
  'sessions/fetchAvailableTimeSlots',
  async ({ therapistId, date, duration = 30 }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        therapistId,
        date,
        duration: duration.toString()
      });
      
      const response = await api.request(`/sessions/available?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch available time slots');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch available time slots');
    }
  }
);

export const fetchUpcomingSessions = createAsyncThunk(
  'sessions/fetchUpcomingSessions',
  async ({ limit = 5, ...filters } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({ limit: limit.toString() });
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const response = await api.request(`/sessions/upcoming?${queryParams}`);
      
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch upcoming sessions');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch upcoming sessions');
    }
  }
);

// Initial state
const initialState = {
  sessions: [],
  currentSession: null,
  availableTimeSlots: [],
  upcomingSessions: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  }
};

// Slice
const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    },
    clearAvailableTimeSlots: (state) => {
      state.availableTimeSlots = [];
    },
    updateSessionStatus: (state, action) => {
      const { id, status } = action.payload;
      const session = state.sessions.find(s => s.id === id);
      if (session) {
        session.status = status;
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sessions
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        const sessionsData = action.payload?.data || action.payload || [];
        state.sessions = Array.isArray(sessionsData) ? sessionsData : [];
        state.error = null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Session
      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentSession = null;
      })
      
      // Create Session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.unshift(action.payload);
        state.error = null;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Session
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        const { id, ...updatedData } = action.payload;
        const index = state.sessions.findIndex(session => session.id === id);
        if (index !== -1) {
          state.sessions[index] = { ...state.sessions[index], ...updatedData };
        }
        if (state.currentSession && state.currentSession.id === id) {
          state.currentSession = { ...state.currentSession, ...updatedData };
        }
        state.error = null;
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Session
      .addCase(deleteSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = state.sessions.filter(session => session.id !== action.payload);
        if (state.currentSession && state.currentSession.id === action.payload) {
          state.currentSession = null;
        }
        state.error = null;
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Available Time Slots
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTimeSlots = action.payload;
        state.error = null;
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.availableTimeSlots = [];
      })
      
      // Fetch Upcoming Sessions
      .addCase(fetchUpcomingSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpcomingSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingSessions = action.payload;
        state.error = null;
      })
      .addCase(fetchUpcomingSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.upcomingSessions = [];
      });
  }
});

// Actions
export const {
  clearError,
  clearCurrentSession,
  clearAvailableTimeSlots,
  updateSessionStatus,
  setPagination
} = sessionSlice.actions;

// Selectors
export const selectSessions = (state) => state.sessions.sessions;
export const selectCurrentSession = (state) => state.sessions.currentSession;
export const selectAvailableTimeSlots = (state) => state.sessions.availableTimeSlots;
export const selectUpcomingSessions = (state) => state.sessions.upcomingSessions;
export const selectSessionsLoading = (state) => state.sessions.loading;
export const selectSessionsError = (state) => state.sessions.error;
export const selectSessionsPagination = (state) => state.sessions.pagination;

// Helper selectors
export const selectSessionsByStatus = (state, status) => 
  state.sessions.sessions.filter(session => session.status === status);

export const selectSessionsByTherapist = (state, therapistId) => 
  state.sessions.sessions.filter(session => session.therapist_id == therapistId);

export const selectSessionsByStudent = (state, studentId) => 
  state.sessions.sessions.filter(session => session.student_id == studentId);

export const selectSessionsByDate = (state, date) => 
  state.sessions.sessions.filter(session => 
    new Date(session.session_date).toDateString() === new Date(date).toDateString()
  );

export const selectTodaysSessions = (state) => {
  const today = new Date().toDateString();
  return state.sessions.sessions.filter(session => 
    new Date(session.session_date).toDateString() === today
  );
};

export const selectUpcomingSessionsCount = (state) => {
  const now = new Date();
  return state.sessions.sessions.filter(session => 
    new Date(`${session.session_date} ${session.session_time}`) > now &&
    ['scheduled', 'confirmed', 'awaiting_confirmation'].includes(session.status)
  ).length;
};

export const selectCompletedSessionsCount = (state) => {
  return state.sessions.sessions.filter(session => 
    session.status === 'completed'
  ).length;
};

export const selectCancelledSessionsCount = (state) => {
  return state.sessions.sessions.filter(session => 
    session.status === 'cancelled'
  ).length;
};

// Reducer
export default sessionSlice.reducer;
