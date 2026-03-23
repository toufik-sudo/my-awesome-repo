import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { RootNavigator } from '@/navigation';
import { linking } from '@/navigation/linking';
import { notificationService } from '@/services/notification.service';
import '@/i18n/config';

export default function App() {
  useEffect(() => {
    // Initialize notifications on app start
    const initNotifications = async () => {
      try {
        await notificationService.requestPermissions();
        await notificationService.configureNotificationChannels();
        const token = await notificationService.getExpoPushToken();
        if (token) {
          console.log('Expo Push Token:', token);
          // TODO: Send token to your backend
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initNotifications();
  }, []);

  return (
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
