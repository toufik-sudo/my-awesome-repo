import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { colors } from '@/constants/theme.constants';

type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'app-theme-mode';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  theme: typeof colors.light;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  isDark: false,
  theme: colors.light,
  setMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Load the persisted theme mode from SecureStore.
 * Call once on app startup before rendering.
 */
export async function loadSavedTheme(): Promise<ThemeMode | null> {
  try {
    const saved = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // Storage unavailable — use system default
  }
  return null;
}

export const ThemeProvider: React.FC<{ children: ReactNode; initialMode?: ThemeMode }> = ({
  children,
  initialMode,
}) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(initialMode ?? 'system');

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, newMode);
    } catch {
      // Storage unavailable — change still applied in memory
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, isDark, theme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
