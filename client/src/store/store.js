import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import dashboardSlice from './slices/dashboardSlice';
import appointmentSlice from './slices/appointmentSlice';
import patientSlice from './slices/patientSlice';
import doctorSlice from './slices/doctorSlice';
import clinicSlice from './slices/clinicSlice';
import serviceSlice from './slices/serviceSlice';
import encounterSlice from './slices/encounterSlice';

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});