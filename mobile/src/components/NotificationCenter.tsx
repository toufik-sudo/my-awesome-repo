import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from './Avatar';
import { notificationApi } from '@/services/notification.api';
import type { RootStackParamList } from '@/navigation/types';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  avatar?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const NotificationCenter: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

  const handlePress = useCallback((notification: NotificationItem) => {
    navigation.navigate('NotificationDetail', { id: notification.id });
  }, [navigation]);

  const handleMarkAllRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.foreground }]}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={{ color: theme.primary, fontSize: 13 }}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={notifications}
        keyExtractor={i => i.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)} style={[styles.item, {
            backgroundColor: item.read ? 'transparent' : theme.primary + '08',
            borderBottomColor: theme.border,
          }]}>
            <Avatar name={item.title} size={36} />
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, { color: theme.foreground, fontWeight: item.read ? '400' : '600' }]}>{item.title}</Text>
              <Text style={[styles.itemMsg, { color: theme.mutedForeground }]} numberOfLines={2}>{item.message}</Text>
              <Text style={[styles.itemTime, { color: theme.mutedForeground }]}>{item.createdAt}</Text>
            </View>
            {!item.read && <View style={[styles.dot, { backgroundColor: theme.primary }]} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.mutedForeground }}>No notifications</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '700' },
  item: { flexDirection: 'row', padding: 12, gap: 12, borderBottomWidth: 1, alignItems: 'flex-start' },
  itemContent: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14 },
  itemMsg: { fontSize: 13 },
  itemTime: { fontSize: 11, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  empty: { padding: 32, alignItems: 'center' },
});
