import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { authSlice } from './slices/auth.slice';
import { mediaCacheSlice } from './slices/mediaCache.slice';
import { appConfigSlice } from './slices/appConfig.slice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    mediaCache: mediaCacheSlice.reducer,
    appConfig: appConfigSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in media cache (Blob URLs)
        ignoredPaths: ['mediaCache.cache'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
