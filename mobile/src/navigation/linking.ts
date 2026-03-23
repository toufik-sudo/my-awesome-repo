import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import type { RootStackParamList } from './types';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'huggithub://'],

  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          HomeTab: {
            screens: {
              Home: 'home',
              Details: 'details/:id',
            },
          },
          PropertiesTab: {
            screens: {
              PropertyListing: 'properties',
              PropertyDetail: 'properties/:propertyId',
              DocumentUpload: 'properties/:propertyId/documents',
            },
          },
          SearchTab: {
            screens: {
              Search: 'search',
              SearchResults: 'search/:query',
            },
          },
          NotificationsTab: {
            screens: {
              Notifications: 'notifications',
              NotificationDetail: 'notifications/:id',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Settings: 'settings',
              EditProfile: 'edit-profile',
              VerificationReview: 'verification-review',
            },
          },
        },
      },
      CreatePostModal: 'create-post',
      ImageViewerModal: 'image-viewer',
      ConfirmationModal: 'confirm',
    },
  },

  // Handle deep links from push notifications
  async getInitialURL() {
    // Check if app was opened from a notification
    const response = await Notifications.getLastNotificationResponseAsync();
    const notificationUrl = response?.notification?.request?.content?.data?.url;
    if (typeof notificationUrl === 'string') {
      return notificationUrl;
    }

    // Fallback to standard deep link
    const url = await Linking.getInitialURL();
    return url;
  },

  // Listen for incoming deep links (while app is open)
  subscribe(listener) {
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      listener(url);
    });

    // Listen for notification taps and extract deep link
    const notificationSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const url = response.notification.request.content.data?.url;
        if (typeof url === 'string') {
          listener(url);
        }
      });

    return () => {
      linkingSubscription.remove();
      notificationSubscription.remove();
    };
  },
};
