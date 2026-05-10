import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card';
import { spacing } from '@/constants/theme.constants';
import { notificationApi, type NotificationItem } from '@/services/notification.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';
import type { RootStackParamList } from '@/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp>();

  const fetcher = useCallback(
    (params: { page: number; limit: number }) => notificationApi.getAllPaginated(params),
    [],
  );

  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<NotificationItem>({
      fetcher,
      limit: 20,
      permKey: MOBILE_UI_PERM.NOTIFICATIONS_VIEW,
    });

  const handleNotificationPress = useCallback(
    (notification: NotificationItem) => {
      navigation.navigate('NotificationDetail', { id: notification.id });
    },
    [navigation],
  );

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

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <TouchableOpacity activeOpacity={0.7} onPress={() => handleNotificationPress(item)}>
        <Card
          style={[
            styles.notificationCard,
            !item.read && {
              borderLeftWidth: 3,
              borderLeftColor: theme.primary,
              backgroundColor: theme.primary + '08',
            },
          ]}
        >
          <View style={styles.notificationContent}>
            <Text
              style={[
                styles.notificationTitle,
                { color: theme.foreground },
                !item.read && { fontWeight: '600' },
              ]}
            >
              {item.title}
            </Text>
            <Text style={[styles.notificationMessage, { color: theme.mutedForeground }]}>{item.message}</Text>
            <Text style={[styles.notificationTime, { color: theme.mutedForeground }]}>
              {getRelativeTime(item.createdAt)}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    ),
    [theme, handleNotificationPress],
  );

  const ListFooter = useMemo(() => {
    if (!hasMore && items.length > 0) return null;
    if (loading || refreshing || hasMore) {
      return (
        <View style={{ paddingVertical: spacing.lg }}>
          <ActivityIndicator color={theme.primary} />
        </View>
      );
    }
    return null;
  }, [hasMore, loading, refreshing, items.length, theme.primary]);

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.content, styles.centerContent]}>
          <Text style={{ color: theme.mutedForeground }}>
            {t('rbac.forbidden') || 'Access denied'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && items.length === 0) {
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

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />
          }
          ListFooterComponent={ListFooter}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>
                {t('notifications.empty') || 'No notifications'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.lg },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', marginBottom: spacing.lg },
  notificationCard: { marginBottom: spacing.md },
  notificationContent: { gap: spacing.xs },
  notificationTitle: { fontSize: 16, fontWeight: '500' },
  notificationMessage: { fontSize: 14 },
  notificationTime: { fontSize: 12, marginTop: spacing.xs },
  emptyState: { padding: spacing.xl * 2, alignItems: 'center' },
  emptyText: { fontSize: 14 },
});
