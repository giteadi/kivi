import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for templates
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getTemplates();
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch templates');
      }
      
      return response;
    } catch (error) {
      console.error('❌ Error fetching templates:', error);
      return rejectWithValue(error.message || 'Failed to fetch templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'templates/fetchTemplateById',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await api.getTemplate(templateId);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch template');
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch template');
    }
  }
);

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    templates: [],
    loading: false,
    error: null,
    selectedTemplate: null,
    lastFetched: null
  },
  reducers: {
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        console.log('🎯 fetchTemplates.fulfilled triggered in templateSlice!');
        state.loading = false;
        // Transform database data to match frontend format
        if (action.payload?.data) {
          console.log('🎯 Raw templates count:', action.payload.data.length);
          const transformedTemplates = action.payload.data.map(template => ({
            id: template.id, // Use database id directly
            type: template.type, // Keep type as separate field
            name: template.name,
            description: template.description,
            category: template.category,
            icon: template.icon,
            // Include additional data for calculations
            templateData: template.template_data,
            formulaConfig: template.formula_config,
            scoringRules: template.scoring_rules,
            ageRange: template.age_range,
            languages: template.languages
          }));
          console.log('🎯 Transformed templates count:', transformedTemplates.length);
          state.templates = transformedTemplates;
          state.lastFetched = new Date().toISOString();
          console.log('🎯 Final state.templates length:', state.templates.length);
        }
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch template by ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          // Transform single template data
          const template = action.payload.data;
          state.selectedTemplate = {
            id: template.type || template.id, // Use type field, fallback to id
            name: template.name,
            description: template.description,
            category: template.category,
            icon: template.icon,
            templateData: template.template_data,
            formulaConfig: template.formula_config,
            scoringRules: template.scoring_rules,
            ageRange: template.age_range,
            languages: template.languages
          };
        }
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const selectTemplates = (state) => state?.templates?.templates || [];
export const selectTemplatesLoading = (state) => state?.templates?.loading || false;
export const selectTemplatesError = (state) => state?.templates?.error || null;
export const selectSelectedTemplate = (state) => state?.templates?.selectedTemplate || null;

export default templateSlice;
