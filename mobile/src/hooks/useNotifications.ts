import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { notificationService } from '@/services/notification.service';
import type { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Hook to initialize and manage push notifications
 */
export const useNotifications = () => {
  const navigation = useNavigation<NavigationProp>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Initialize notification service
    initializeNotifications();

    // Set up listeners
    notificationListener.current = notificationService.addNotificationReceivedListener(
      handleNotificationReceived
    );

    responseListener.current = notificationService.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Cleanup on unmount
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const initializeNotifications = async () => {
    try {
      // Request permissions
      const hasPermission = await notificationService.requestPermissions();
      if (!hasPermission) {
        console.warn('Notification permissions not granted');
        return;
      }

      // Configure Android channels
      await notificationService.configureNotificationChannels();

      // Get push token (for sending to backend)
      const token = await notificationService.getExpoPushToken();
      if (token) {
        console.log('Expo Push Token:', token);
        // TODO: Send token to backend
        // await api.updatePushToken(token);
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log('Notification received in foreground:', notification);
    
    // You can show a custom in-app notification here
    // or just let the system handle it
  };

  const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    console.log('Notification tapped:', response);

    const data = notificationService.parseNotificationData(
      response.notification.request.content.data
    );

    // Navigate based on notification data
    if (data.screen) {
      navigateToScreen(data);
    }
  };

  const navigateToScreen = (data: any) => {
    // Handle navigation based on the notification data
    switch (data.screen) {
      case 'NotificationDetail':
        if (data.id) {
          navigation.navigate('Main', {
            screen: 'NotificationsTab',
            params: {
              screen: 'NotificationDetail',
              params: { id: data.id },
            },
          });
        }
        break;

      case 'Details':
        if (data.id) {
          navigation.navigate('Main', {
            screen: 'HomeTab',
            params: {
              screen: 'Details',
              params: { id: data.id },
            },
          });
        }
        break;

      case 'Profile':
        navigation.navigate('Main', {
          screen: 'ProfileTab',
          params: {
            screen: 'Profile',
          },
        });
        break;

      default:
        // Navigate to home by default
        navigation.navigate('Main', {
          screen: 'HomeTab',
        });
    }
  };

  return {
    scheduleNotification: notificationService.scheduleLocalNotification.bind(notificationService),
    cancelNotification: notificationService.cancelNotification.bind(notificationService),
    clearBadge: notificationService.clearBadgeCount.bind(notificationService),
    setBadge: notificationService.setBadgeCount.bind(notificationService),
  };
};
