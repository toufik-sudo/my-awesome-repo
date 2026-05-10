import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { bookingsApi, type BookingItem } from '@/services/bookings.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', accepted: '#3B82F6', confirmed: '#10B981',
  cancelled: '#6B7280', rejected: '#EF4444', completed: '#10B981',
};

export const BookingsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM } = usePermissions();

  const fetcher = useCallback((p: any) => bookingsApi.getMine(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<BookingItem>({ fetcher, limit: 20, permKey: PERM.BOOKINGS_TAB });

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading bookings..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>My Bookings</Text>
      <FlatList
        data={items}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No bookings yet.</Text></View>}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation?.navigate('BookingDetail', { id: item.id })}>
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.row}>
                <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>
                  {item.property?.title || `Booking ${item.id.slice(0, 8)}`}
                </Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || theme.muted }]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
              <Text style={[styles.meta, { color: theme.mutedForeground }]}>
                {item.checkInDate?.slice(0, 10)} → {item.checkOutDate?.slice(0, 10)} • {item.numberOfGuests} guest(s)
              </Text>
              <Text style={[styles.price, { color: theme.primary }]}>{item.totalPrice} {item.currency}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', padding: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  meta: { fontSize: 12, marginBottom: 6 },
  price: { fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
});

export default BookingsScreen;
