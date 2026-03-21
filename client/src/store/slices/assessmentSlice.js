import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for assessments
export const fetchAssessments = createAsyncThunk(
  'assessments/fetchAssessments',
  async (examineeId, { rejectWithValue }) => {
    try {
      const response = await api.request(`/students/${examineeId}/assessments`);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assessments'
      );
    }
  }
);

export const createAssessment = createAsyncThunk(
  'assessments/createAssessment',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await api.request('/students/assessments', {
        method: 'POST',
        body: JSON.stringify(assessmentData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create assessment'
      );
    }
  }
);

export const deleteAssessment = createAsyncThunk(
  'assessments/deleteAssessment',
  async (assessmentId, { rejectWithValue }) => {
    try {
      await api.request(`/students/assessments/${assessmentId}`, {
        method: 'DELETE',
      });
      return assessmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete assessment'
      );
    }
  }
);

export const generateAssessmentReport = createAsyncThunk(
  'assessments/generateReport',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await api.request('/reports/generate-assessment-report', {
        method: 'POST',
        body: JSON.stringify(assessmentData),
      });
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to generate report'
      );
    }
  }
);

// Initial state
const initialState = {
  assessments: [],
  isLoading: false,
  error: null,
  selectedAssessments: []
};

// Assessment slice
const assessmentSlice = createSlice({
  name: 'assessments',
  initialState,
  reducers: {
    toggleAssessmentSelection: (state, action) => {
      const assessmentId = action.payload;
      const index = state.selectedAssessments.indexOf(assessmentId);
      
      if (index > -1) {
        state.selectedAssessments.splice(index, 1);
      } else {
        state.selectedAssessments.push(assessmentId);
      }
    },
    clearSelection: (state) => {
      state.selectedAssessments = [];
    },
    selectAllAssessments: (state) => {
      state.selectedAssessments = state.assessments.map(assessment => assessment.id);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Assessments
      .addCase(fetchAssessments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments = action.payload.data || [];
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Assessment
      .addCase(createAssessment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments.unshift(action.payload.data);
      })
      .addCase(createAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Assessment
      .addCase(deleteAssessment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assessments = state.assessments.filter(
          assessment => assessment.id !== action.payload
        );
        state.selectedAssessments = state.selectedAssessments.filter(
          id => id !== action.payload
        );
      })
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate Report
      .addCase(generateAssessmentReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateAssessmentReport.fulfilled, (state) => {
        state.isLoading = false;
        state.selectedAssessments = [];
      })
      .addCase(generateAssessmentReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  toggleAssessmentSelection, 
  clearSelection, 
  selectAllAssessments, 
  clearError 
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
