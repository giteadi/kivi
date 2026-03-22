import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examineeApi } from '../../services/examineeApi';

// Async thunks for examinees
export const fetchExaminees = createAsyncThunk(
  'examinees/fetchExaminees',
  async (_, { rejectWithValue }) => {
    try {
      const response = await examineeApi.getExaminees();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch examinees'
      );
    }
  }
);

export const createExaminee = createAsyncThunk(
  'examinees/createExaminee',
  async (examineeData, { rejectWithValue }) => {
    try {
      const response = await examineeApi.createExaminee(examineeData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create examinee'
      );
    }
  }
);

export const createAssessmentWithScores = createAsyncThunk(
  'examinees/createAssessmentWithScores',
  async (assessmentData, { rejectWithValue }) => {
    try {
      const response = await examineeApi.createAssessmentWithScores(assessmentData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create assessment'
      );
    }
  }
);

// Initial state
const initialState = {
  examinees: [],
  selectedExaminee: null,
  isLoading: false,
  error: null,
  isCreatingExaminee: false,
  isCreatingAssessment: false,
};

// Examinee slice
const examineeSlice = createSlice({
  name: 'examinees',
  initialState,
  reducers: {
    setSelectedExaminee: (state, action) => {
      state.selectedExaminee = action.payload;
    },
    clearSelectedExaminee: (state) => {
      state.selectedExaminee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch examinees
    builder
      .addCase(fetchExaminees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExaminees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.examinees = action.payload;
      })
      .addCase(fetchExaminees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create examinee
    builder
      .addCase(createExaminee.pending, (state) => {
        state.isCreatingExaminee = true;
        state.error = null;
      })
      .addCase(createExaminee.fulfilled, (state, action) => {
        state.isCreatingExaminee = false;
        // Optionally add the new examinee to the list
        // state.examinees.push(action.payload);
      })
      .addCase(createExaminee.rejected, (state, action) => {
        state.isCreatingExaminee = false;
        state.error = action.payload;
      });

    // Create assessment with scores
    builder
      .addCase(createAssessmentWithScores.pending, (state) => {
        state.isCreatingAssessment = true;
        state.error = null;
      })
      .addCase(createAssessmentWithScores.fulfilled, (state, action) => {
        state.isCreatingAssessment = false;
      })
      .addCase(createAssessmentWithScores.rejected, (state, action) => {
        state.isCreatingAssessment = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedExaminee, clearSelectedExaminee, clearError } = examineeSlice.actions;

export default examineeSlice.reducer;
