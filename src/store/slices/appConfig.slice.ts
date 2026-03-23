import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/api.constants';

interface NotificationState {
  unreadCount: number;
}

interface AppConfigState {
  language: string;
  theme: string;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  notifications: NotificationState;
}

const initialState: AppConfigState = {
  language: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'default',
  darkMode: localStorage.getItem('app-dark-mode') === 'true',
  sidebarCollapsed: false,
  notifications: {
    unreadCount: 0,
  },
};

export const appConfigSlice = createSlice({
  name: 'appConfig',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, action.payload);
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
      localStorage.setItem(STORAGE_KEYS.THEME, action.payload);
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      localStorage.setItem('app-dark-mode', String(action.payload));
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setUnreadNotificationCount: (state, action: PayloadAction<number>) => {
      state.notifications.unreadCount = action.payload;
    },
  },
});

export const {
  setLanguage,
  setTheme,
  setDarkMode,
  toggleSidebar,
  setSidebarCollapsed,
  setUnreadNotificationCount,
} = appConfigSlice.actions;

// Selectors
export const selectLanguage = (state: { appConfig: AppConfigState }) => state.appConfig.language;
export const selectTheme = (state: { appConfig: AppConfigState }) => state.appConfig.theme;
export const selectDarkMode = (state: { appConfig: AppConfigState }) => state.appConfig.darkMode;
export const selectSidebarCollapsed = (state: { appConfig: AppConfigState }) => state.appConfig.sidebarCollapsed;
export const selectUnreadNotificationCount = (state: { appConfig: AppConfigState }) =>
  state.appConfig.notifications.unreadCount;
