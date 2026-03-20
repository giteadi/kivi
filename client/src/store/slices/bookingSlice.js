import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for booking
export const fetchAvailableTherapists = createAsyncThunk(
  'booking/fetchAvailableTherapists',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('🔍 Booking slice: Fetching available therapists with filters:', filters);
      const response = await api.getAvailableTherapists(filters);
      console.log('✅ Booking slice: Therapists fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Booking slice: Failed to fetch therapists:', error);
      return rejectWithValue(error.message || 'Failed to fetch available therapists');
    }
  }
);

export const fetchTherapistAvailability = createAsyncThunk(
  'booking/fetchTherapistAvailability',
  async ({ therapistId, date }, { rejectWithValue }) => {
    try {
      console.log('🔍 Booking slice: Fetching therapist availability:', { therapistId, date });
      const response = await api.getTherapistAvailability(therapistId, date);
      console.log('✅ Booking slice: Availability fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Booking slice: Failed to fetch availability:', error);
      return rejectWithValue(error.message || 'Failed to fetch therapist availability');
    }
  }
);

export const fetchAvailableTimeSlots = createAsyncThunk(
  'booking/fetchAvailableTimeSlots',
  async ({ therapistId, date }, { rejectWithValue }) => {
    try {
      console.log('🔍 Booking slice: Fetching time slots:', { therapistId, date });
      const response = await api.getAvailableTimeSlots(therapistId, date);
      console.log('✅ Booking slice: Time slots fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Booking slice: Failed to fetch time slots:', error);
      return rejectWithValue(error.message || 'Failed to fetch available time slots');
    }
  }
);

export const bookSession = createAsyncThunk(
  'booking/bookSession',
  async (bookingData, { rejectWithValue }) => {
    try {
      console.log('🔍 Booking slice: Booking session:', bookingData);
      const response = await api.bookSession(bookingData);
      console.log('✅ Booking slice: Session booked successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Booking slice: Failed to book session:', error);
      return rejectWithValue(error.message || 'Failed to book session');
    }
  }
);

export const fetchBookingCalendar = createAsyncThunk(
  'booking/fetchBookingCalendar',
  async ({ therapistId, month, year }, { rejectWithValue }) => {
    try {
      const filters = { month, year };
      const response = await api.getBookingCalendar(therapistId, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch booking calendar');
    }
  }
);

// Initial state
const initialState = {
  // Booking modal state
  isBookingModalOpen: false,
  currentStep: 1,
  selectedPlan: null,
  selectedDate: '',
  selectedTherapist: null,
  selectedTime: '',
  bookingNotes: '',
  
  // Consolidated booking data
  bookingData: {
    therapistId: undefined,
    date: '',
    time: '',
    notes: '',
    planId: undefined
  },
  
  // Data
  availableTherapists: [],
  availableTimeSlots: [],
  therapistAvailability: [],
  bookingCalendar: [],
  
  // Loading states
  loading: {
    therapists: false,
    timeSlots: false,
    availability: false,
    booking: false,
    calendar: false
  },
  
  // Error states
  errors: {
    therapists: null,
    timeSlots: null,
    availability: null,
    booking: null,
    calendar: null
  },
  
  // Booking result
  bookingResult: null,
  bookingSuccess: false
};

// Booking slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Modal controls
    openBookingModal: (state, action) => {
      state.isBookingModalOpen = true;
      state.selectedPlan = action.payload?.plan || null;
      state.bookingData.planId = action.payload?.plan?.id || undefined;
      state.currentStep = 1;
      state.bookingSuccess = false;
      state.bookingResult = null;
      console.log('📖 Booking slice: Opening booking modal with plan:', action.payload?.plan);
    },
    
    closeBookingModal: (state) => {
      state.isBookingModalOpen = false;
      state.currentStep = 1;
      state.selectedPlan = null;
      state.selectedDate = '';
      state.selectedTherapist = null;
      state.selectedTime = '';
      state.bookingNotes = '';
      state.bookingData = {
        therapistId: undefined,
        date: '',
        time: '',
        notes: '',
        planId: undefined
      };
      state.availableTherapists = [];
      state.availableTimeSlots = [];
      state.bookingResult = null;
      state.bookingSuccess = false;
      // Clear errors
      state.errors = {
        therapists: null,
        timeSlots: null,
        availability: null,
        booking: null,
        calendar: null
      };
      console.log('📖 Booking slice: Closing booking modal and resetting state');
    },
    
    // Step navigation
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
      console.log('📖 Booking slice: Setting current step to:', action.payload);
    },
    
    nextStep: (state) => {
      if (state.currentStep < 4) {
        state.currentStep += 1;
        console.log('📖 Booking slice: Moving to next step:', state.currentStep);
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
        console.log('📖 Booking slice: Moving to previous step:', state.currentStep);
      }
    },
    
    // Selection actions
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
      state.bookingData = { ...state.bookingData, date: action.payload };
      // Reset dependent selections but preserve therapist if it was already selected
      // Only reset therapist if it was manually selected (not pre-selected from plan)
      if (state.selectedTherapist && !state.selectedTherapist.isPreSelected) {
        state.selectedTherapist = null;
      }
      state.selectedTime = '';
      state.availableTherapists = [];
      state.availableTimeSlots = [];
      console.log('📖 Booking slice: Date selected:', action.payload);
      console.log('📖 Booking slice: Preserved therapist:', state.selectedTherapist);
    },
    
    setSelectedTherapist: (state, action) => {
      state.selectedTherapist = action.payload;
      state.bookingData = { ...state.bookingData, therapistId: action.payload?.id || '' };
      // Reset dependent selections
      state.selectedTime = '';
      state.availableTimeSlots = [];
      console.log('📖 Booking slice: Therapist selected:', action.payload);
    },
    
    setSelectedTime: (state, action) => {
      state.selectedTime = action.payload;
      state.bookingData = { ...state.bookingData, time: action.payload };
      console.log('📖 Booking slice: Time selected:', action.payload);
    },
    
    setBookingNotes: (state, action) => {
      state.bookingNotes = action.payload;
      state.bookingData = { ...state.bookingData, notes: action.payload };
    },
    
    // Error handling
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.errors[errorType]) {
        state.errors[errorType] = null;
      } else if (!errorType) {
        // Clear all errors
        state.errors = {
          therapists: null,
          timeSlots: null,
          availability: null,
          booking: null,
          calendar: null
        };
      }
    },
    
    // Reset booking result
    resetBookingResult: (state) => {
      state.bookingResult = null;
      state.bookingSuccess = false;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch available therapists
      .addCase(fetchAvailableTherapists.pending, (state) => {
        state.loading.therapists = true;
        state.errors.therapists = null;
      })
      .addCase(fetchAvailableTherapists.fulfilled, (state, action) => {
        state.loading.therapists = false;
        const therapistsData = action.payload?.data || action.payload || [];
        state.availableTherapists = Array.isArray(therapistsData) ? therapistsData : [];
        state.errors.therapists = null;
      })
      .addCase(fetchAvailableTherapists.rejected, (state, action) => {
        state.loading.therapists = false;
        state.errors.therapists = action.payload;
      })
      
      // Fetch therapist availability
      .addCase(fetchTherapistAvailability.pending, (state) => {
        state.loading.availability = true;
        state.errors.availability = null;
      })
      .addCase(fetchTherapistAvailability.fulfilled, (state, action) => {
        state.loading.availability = false;
        const availabilityData = action.payload?.data || action.payload || {};
        state.therapistAvailability = availabilityData;
        state.errors.availability = null;
      })
      .addCase(fetchTherapistAvailability.rejected, (state, action) => {
        state.loading.availability = false;
        state.errors.availability = action.payload;
      })
      
      // Fetch available time slots
      .addCase(fetchAvailableTimeSlots.pending, (state) => {
        state.loading.timeSlots = true;
        state.errors.timeSlots = null;
      })
      .addCase(fetchAvailableTimeSlots.fulfilled, (state, action) => {
        state.loading.timeSlots = false;
        const slotsData = action.payload?.data || action.payload || [];
        state.availableTimeSlots = Array.isArray(slotsData) ? slotsData : [];
        state.errors.timeSlots = null;
        console.log('✅ Redux: Time slots stored in state:', state.availableTimeSlots);
        console.log('📊 Redux: Available time slots count:', state.availableTimeSlots.length);
      })
      .addCase(fetchAvailableTimeSlots.rejected, (state, action) => {
        state.loading.timeSlots = false;
        state.errors.timeSlots = action.payload;
      })
      
      // Book session
      .addCase(bookSession.pending, (state) => {
        state.loading.booking = true;
        state.errors.booking = null;
      })
      .addCase(bookSession.fulfilled, (state, action) => {
        state.loading.booking = false;
        state.bookingResult = action.payload;
        state.bookingSuccess = true;
        state.errors.booking = null;
      })
      .addCase(bookSession.rejected, (state, action) => {
        state.loading.booking = false;
        state.errors.booking = action.payload;
        state.bookingSuccess = false;
      })
      
      // Fetch booking calendar
      .addCase(fetchBookingCalendar.pending, (state) => {
        state.loading.calendar = true;
        state.errors.calendar = null;
      })
      .addCase(fetchBookingCalendar.fulfilled, (state, action) => {
        state.loading.calendar = false;
        state.bookingCalendar = action.payload;
        state.errors.calendar = null;
      })
      .addCase(fetchBookingCalendar.rejected, (state, action) => {
        state.loading.calendar = false;
        state.errors.calendar = action.payload;
      });
  },
});

export const {
  openBookingModal,
  closeBookingModal,
  setCurrentStep,
  nextStep,
  previousStep,
  setSelectedDate,
  setSelectedTherapist,
  setSelectedTime,
  setBookingNotes,
  clearError,
  resetBookingResult
} = bookingSlice.actions;

export default bookingSlice.reducer;
