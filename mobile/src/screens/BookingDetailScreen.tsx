import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card } from '@/components';
import { bookingsApi, type BookingItem } from '@/services/bookings.api';
import { spacing } from '@/constants/theme.constants';

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B', accepted: '#3B82F6', confirmed: '#10B981',
  cancelled: '#6B7280', rejected: '#EF4444', completed: '#10B981',
};

export const BookingDetailScreen: React.FC<{ route?: any; navigation?: any }> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canViewBookings, canAcceptBooking, canRejectBooking, permissionsLoaded } = usePermissions();
  const id: string = route?.params?.id;
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    if (!id || !canViewBookings) return;
    try {
      setLoading(true);
      const data = await bookingsApi.getById(id);
      setBooking(data as BookingItem);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load booking.');
    } finally {
      setLoading(false);
    }
  }, [id, canViewBookings]);

  useEffect(() => { load(); }, [load]);

  const act = useCallback(async (action: 'accept' | 'reject') => {
    try {
      setActing(true);
      if (action === 'accept') await bookingsApi.accept(id);
      else await bookingsApi.reject(id);
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Action failed.');
    } finally {
      setActing(false);
    }
  }, [id, load]);

  if (permissionsLoaded && !canViewBookings) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading || !booking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Card style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.foreground }]}>{booking.property?.title || `Booking ${booking.id.slice(0, 8)}`}</Text>
          <View style={[styles.badge, { backgroundColor: STATUS_COLORS[booking.status] || theme.muted }]}>
            <Text style={styles.badgeText}>{booking.status}</Text>
          </View>
          <Text style={[styles.row, { color: theme.foreground }]}>📅 {booking.checkInDate?.slice(0, 10)} → {booking.checkOutDate?.slice(0, 10)}</Text>
          <Text style={[styles.row, { color: theme.foreground }]}>👥 {booking.numberOfGuests} guest(s)</Text>
          <Text style={[styles.row, { color: theme.foreground }]}>💳 {booking.paymentStatus}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>{booking.totalPrice} {booking.currency}</Text>
        </Card>

        {booking.status === 'pending' && (canAcceptBooking || canRejectBooking) && (
          <View style={styles.actions}>
            {canAcceptBooking && (
              <TouchableOpacity disabled={acting} onPress={() => act('accept')} style={[styles.btn, { backgroundColor: '#10B981' }]}>
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>
            )}
            {canRejectBooking && (
              <TouchableOpacity disabled={acting} onPress={() => act('reject')} style={[styles.btn, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity onPress={() => navigation?.navigate('ChatDetail', { bookingId: booking.id })} style={[styles.linkBtn, { backgroundColor: theme.muted }]}>
          <Text style={{ color: theme.foreground, fontWeight: '600' }}>💬 Open conversation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  row: { fontSize: 14, marginBottom: 6 },
  price: { fontSize: 22, fontWeight: '700', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  linkBtn: { padding: 14, borderRadius: 8, alignItems: 'center' },
});

export default BookingDetailScreen;
