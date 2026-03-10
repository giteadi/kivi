import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import appointmentSlice from './slices/appointmentSlice';
import patientSlice from './slices/patientSlice';
import doctorSlice from './slices/doctorSlice';
import clinicSlice from './slices/clinicSlice';
import serviceSlice from './slices/serviceSlice';
import encounterSlice from './slices/encounterSlice';
import plansSlice from './slices/plansSlice';
import bookingSlice from './slices/bookingSlice';
import sessionSlice from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    appointments: appointmentSlice,
    patients: patientSlice,
    doctors: doctorSlice,
    clinics: clinicSlice,
    services: serviceSlice,
    encounters: encounterSlice,
    plans: plansSlice,
    booking: bookingSlice,
    sessions: sessionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});