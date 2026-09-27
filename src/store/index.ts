import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import profileSetupReducer from './slices/profileSetupSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    profileSetup: profileSetupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
