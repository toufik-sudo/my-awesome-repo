import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card';
import { spacing } from '@/constants/theme.constants';
import { notificationApi } from '@/services/notification.api';
import type { RootStackParamList } from '@/navigation/types';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const handleNotificationPress = useCallback((notification: Notification) => {
    navigation.navigate('NotificationDetail', { id: notification.id });
  }, [navigation]);

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          {t('tabs.notifications') || 'Notifications'}
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
                {t('notifications.empty') || 'No notifications'}
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity 
                key={notification.id} 
                activeOpacity={0.7}
                onPress={() => handleNotificationPress(notification)}
              >
                <Card 
                  style={[
                    styles.notificationCard,
                    !notification.read && { 
                      borderLeftWidth: 3, 
                      borderLeftColor: theme.primary,
                      backgroundColor: theme.primary + '08'
                    }
                  ]}
                >
                  <View style={styles.notificationContent}>
                    <Text style={[
                      styles.notificationTitle, 
                      { color: theme.foreground },
                      !notification.read && { fontWeight: '600' }
                    ]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.notificationMessage, { color: theme.mutedForeground }]}>
                      {notification.message}
                    </Text>
                    <Text style={[styles.notificationTime, { color: theme.mutedForeground }]}>
                      {getRelativeTime(notification.createdAt)}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  notificationCard: {
    marginBottom: spacing.md,
  },
  notificationContent: {
    gap: spacing.xs,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  notificationMessage: {
    fontSize: 14,
  },
  notificationTime: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
  emptyState: {
    padding: spacing.xl * 2,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
