import { configureStore } from '@reduxjs/toolkit';
import assetsReducer from './slices/assetsSlice';

export const store = configureStore({
  reducer: {
    assets: assetsReducer,
  },
});

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 