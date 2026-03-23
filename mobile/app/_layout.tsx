import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { loadSavedTheme } from '@/contexts/ThemeContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { View, ActivityIndicator } from 'react-native';
import '@/i18n/config';
import { loadSavedLanguage } from '@/i18n/config';

type ThemeMode = 'light' | 'dark' | 'system';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [savedTheme, setSavedTheme] = useState<ThemeMode>('system');

  useEffect(() => {
    Promise.all([
      loadSavedLanguage(),
      loadSavedTheme().then((mode) => {
        if (mode) setSavedTheme(mode);
      }),
    ]).finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider initialMode={savedTheme}>
      <LoadingProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="property/[id]" options={{ headerShown: true, title: 'Property Details' }} />
            <Stack.Screen name="verification-review" options={{ headerShown: true, title: 'Verification Review' }} />
            <Stack.Screen name="index" />
          </Stack>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
