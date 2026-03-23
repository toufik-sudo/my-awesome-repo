import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import type { NotificationsStackParamList } from '@/navigation/types';

type NotificationDetailRouteProp = RouteProp<
  NotificationsStackParamList,
  'NotificationDetail'
>;

type NotificationDetailNavigationProp = NativeStackNavigationProp<
  NotificationsStackParamList,
  'NotificationDetail'
>;

interface NotificationDetail {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  category?: string;
  data?: Record<string, any>;
}

export const NotificationDetailScreen: React.FC = () => {
  const route = useRoute<NotificationDetailRouteProp>();
  const navigation = useNavigation<NotificationDetailNavigationProp>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { id } = route.params;

  const [notification, setNotification] = useState<NotificationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotificationDetail();
  }, [id]);

  const loadNotificationDetail = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await notificationApi.getById(id);
      // setNotification(response.data);
      
      // Mock data for now
      setTimeout(() => {
        setNotification({
          id,
          title: 'New Message',
          body: 'You have received a new message from John Doe. Check it out!',
          timestamp: new Date(),
          read: false,
          category: 'message',
          data: {
            senderId: '123',
            senderName: 'John Doe',
          },
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading notification:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!notification) return;
    
    try {
      // TODO: Replace with actual API call
      // await notificationApi.markAsRead(id);
      setNotification({ ...notification, read: true });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Replace with actual API call
      // await notificationApi.delete(id);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!notification) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.foreground }]}>
          {t('notifications.notFound') || 'Notification not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.category, { color: theme.primary }]}>
            {notification.category?.toUpperCase() || 'NOTIFICATION'}
          </Text>
          {!notification.read && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]} />
          )}
        </View>
        <Text style={[styles.timestamp, { color: theme.mutedForeground }]}>
          {notification.timestamp.toLocaleString()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          {notification.title}
        </Text>
        <Text style={[styles.body, { color: theme.foreground }]}>
          {notification.body}
        </Text>

        {/* Additional Data */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <View style={[styles.dataSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.dataTitle, { color: theme.foreground }]}>
              Additional Information
            </Text>
            {Object.entries(notification.data).map(([key, value]) => (
              <View key={key} style={styles.dataRow}>
                <Text style={[styles.dataKey, { color: theme.mutedForeground }]}>
                  {key}:
                </Text>
                <Text style={[styles.dataValue, { color: theme.foreground }]}>
                  {String(value)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!notification.read && (
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleMarkAsRead}
          >
            <Text style={[styles.buttonText, { color: theme.primaryForeground }]}>
              Mark as Read
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
          onPress={handleDelete}
        >
          <Text style={[styles.buttonText, { color: theme.destructive }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timestamp: {
    fontSize: 14,
  },
  content: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  dataSection: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataKey: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 100,
  },
  dataValue: {
    fontSize: 14,
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
