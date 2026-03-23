import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Loading } from '@/components';
import { api } from '@/lib/axios';
import { spacing } from '@/constants/theme.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DashboardData {
  stats: {
    totalProperties: number;
    publishedProperties: number;
    avgTrustStars: number;
    totalBookings: number;
    pendingBookings: number;
    confirmedBookings: number;
    completedBookings: number;
    totalSpent: number;
    totalRevenue: number;
    pendingRequests: number;
    favoritesCount: number;
  };
  verificationStats: { total: number; approved: number; pending: number; rejected: number };
  revenueByMonth: { month: string; revenue: number; bookings: number }[];
  recentBookings: {
    id: string;
    propertyTitle: string;
    propertyImage: string;
    location: string;
    status: string;
    totalPrice: number;
  }[];
  properties: {
    id: string;
    title: string;
    image: string;
    location: string;
    price: number;
    rating: number;
    trustStars: number;
    status: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  completed: '#6366f1',
  cancelled: '#ef4444',
};

interface DashboardScreenProps {
  navigation?: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await api.get<DashboardData>('/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Dashboard fetch failed:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <Loading fullScreen visible text={t('dashboard.title')} />;
  }

  if (!data) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.mutedForeground }]}>{t('dashboard.error')}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={fetchDashboard}
          >
            <Text style={[styles.retryText, { color: theme.primaryForeground }]}>{t('dashboard.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statCards = [
    { title: t('dashboard.stats.properties'), value: data.stats.totalProperties, color: theme.primary },
    { title: t('dashboard.stats.totalRevenue'), value: `${data.stats.totalRevenue.toLocaleString()} DA`, color: theme.accent },
    { title: t('dashboard.stats.bookings'), value: data.stats.totalBookings, color: theme.secondary },
    { title: t('dashboard.stats.favorites'), value: data.stats.favoritesCount, color: theme.destructive },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.foreground }]}>{t('dashboard.title')}</Text>
          <Text style={[styles.subtitle, { color: theme.mutedForeground }]}>{t('dashboard.subtitle')}</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.statValue, { color: theme.foreground }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.mutedForeground }]}>{stat.title}</Text>
              <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation?.navigate('PropertiesTab')}
            >
              <Text style={[styles.actionText, { color: theme.primaryForeground }]}>🔍 {t('dashboard.actions.browseProperties')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
              onPress={() => navigation?.navigate('NotificationsTab')}
            >
              <Text style={[styles.actionText, { color: theme.foreground }]}>🔔 {t('tabs.notifications')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
              onPress={() => navigation?.navigate('ProfileTab')}
            >
              <Text style={[styles.actionText, { color: theme.foreground }]}>⚙️ {t('dashboard.actions.settings')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Revenue Chart (simplified bar) */}
        {data.revenueByMonth.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>{t('dashboard.charts.revenueTitle')}</Text>
            <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.barChart}>
                {data.revenueByMonth.map((m, i) => {
                  const maxRev = Math.max(...data.revenueByMonth.map(r => r.revenue), 1);
                  const height = (m.revenue / maxRev) * 100;
                  return (
                    <View key={i} style={styles.barContainer}>
                      <View style={[styles.bar, { height: Math.max(height, 4), backgroundColor: theme.primary }]} />
                      <Text style={[styles.barLabel, { color: theme.mutedForeground }]}>{m.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* Verification Status */}
        {data.verificationStats.total > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>{t('dashboard.verification.title')}</Text>
            <View style={[styles.verificationCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.verRow}>
                <Text style={{ color: theme.mutedForeground }}>{t('dashboard.verification.approved')}</Text>
                <View style={[styles.verBadge, { backgroundColor: '#d1fae5' }]}>
                  <Text style={{ color: '#059669', fontWeight: '600' }}>{data.verificationStats.approved}</Text>
                </View>
              </View>
              <View style={styles.verRow}>
                <Text style={{ color: theme.mutedForeground }}>{t('dashboard.verification.pending')}</Text>
                <View style={[styles.verBadge, { backgroundColor: '#fef3c7' }]}>
                  <Text style={{ color: '#d97706', fontWeight: '600' }}>{data.verificationStats.pending}</Text>
                </View>
              </View>
              {data.verificationStats.rejected > 0 && (
                <View style={styles.verRow}>
                  <Text style={{ color: theme.mutedForeground }}>{t('dashboard.verification.rejected')}</Text>
                  <View style={[styles.verBadge, { backgroundColor: '#fecaca' }]}>
                    <Text style={{ color: '#dc2626', fontWeight: '600' }}>{data.verificationStats.rejected}</Text>
                  </View>
                </View>
              )}
              {/* Progress bar */}
              <View style={[styles.progressBg, { backgroundColor: theme.muted }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.primary,
                      width: `${(data.verificationStats.approved / Math.max(data.verificationStats.total, 1)) * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}

        {/* My Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.foreground }]}>{t('dashboard.myProperties')}</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('PropertiesTab')}>
              <Text style={[styles.viewAll, { color: theme.primary }]}>{t('dashboard.viewAll')} →</Text>
            </TouchableOpacity>
          </View>
          {data.properties.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={{ fontSize: 32 }}>🏠</Text>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>{t('dashboard.noProperties')}</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: spacing.md }}>
              {data.properties.map(property => (
                <TouchableOpacity
                  key={property.id}
                  style={[styles.propertyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                  onPress={() => navigation?.navigate('PropertiesTab', {
                    screen: 'PropertyDetail',
                    params: { propertyId: property.id },
                  })}
                >
                  <Image source={{ uri: property.image }} style={styles.propertyImage} />
                  <View style={styles.propertyInfo}>
                    <Text style={[styles.propertyTitle, { color: theme.foreground }]} numberOfLines={1}>
                      {property.title}
                    </Text>
                    <Text style={[styles.propertyLocation, { color: theme.mutedForeground }]} numberOfLines={1}>
                      📍 {property.location}
                    </Text>
                    <View style={styles.propertyFooter}>
                      <Text style={[styles.propertyPrice, { color: theme.primary }]}>
                        {property.price.toLocaleString()} DA
                      </Text>
                      <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>
                        ⭐ {property.rating}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Recent Bookings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.foreground }]}>{t('dashboard.recentBookings')}</Text>
          {data.recentBookings.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={{ fontSize: 32 }}>📅</Text>
              <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>{t('dashboard.noBookings')}</Text>
            </View>
          ) : (
            data.recentBookings.map(booking => (
              <View
                key={booking.id}
                style={[styles.bookingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <Image source={{ uri: booking.propertyImage }} style={styles.bookingImage} />
                <View style={styles.bookingInfo}>
                  <Text style={[styles.bookingTitle, { color: theme.foreground }]} numberOfLines={1}>
                    {booking.propertyTitle}
                  </Text>
                  <Text style={[styles.bookingLocation, { color: theme.mutedForeground }]} numberOfLines={1}>
                    {booking.location}
                  </Text>
                </View>
                <View style={styles.bookingRight}>
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[booking.status] || theme.muted }]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                  </View>
                  <Text style={[styles.bookingPrice, { color: theme.foreground }]}>
                    {Number(booking.totalPrice).toLocaleString()} DA
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.sm, gap: spacing.sm },
  statCard: {
    width: (SCREEN_WIDTH - spacing.sm * 3) / 2 - spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: spacing.sm / 2,
  },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  statIndicator: { width: 32, height: 3, borderRadius: 2, marginTop: 8 },
  section: { marginTop: spacing.lg, paddingHorizontal: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: spacing.sm },
  viewAll: { fontSize: 14, fontWeight: '500' },
  actionsRow: { gap: spacing.sm, paddingHorizontal: spacing.md },
  actionButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 10 },
  actionText: { fontSize: 13, fontWeight: '600' },
  chartCard: { borderRadius: 12, borderWidth: 1, padding: spacing.md },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 120 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { width: 20, borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, marginTop: 4 },
  verificationCard: { borderRadius: 12, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  verRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  progressBg: { height: 6, borderRadius: 3, marginTop: spacing.xs },
  progressFill: { height: 6, borderRadius: 3 },
  propertyCard: {
    width: 200,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: spacing.sm,
    overflow: 'hidden',
  },
  propertyImage: { width: '100%', height: 120 },
  propertyInfo: { padding: spacing.sm },
  propertyTitle: { fontSize: 14, fontWeight: '600' },
  propertyLocation: { fontSize: 12, marginTop: 2 },
  propertyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  propertyPrice: { fontSize: 14, fontWeight: '700' },
  emptyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  bookingImage: { width: 48, height: 48, borderRadius: 8 },
  bookingInfo: { flex: 1 },
  bookingTitle: { fontSize: 14, fontWeight: '500' },
  bookingLocation: { fontSize: 12, marginTop: 2 },
  bookingRight: { alignItems: 'flex-end' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  bookingPrice: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  errorText: { fontSize: 16, marginBottom: spacing.md },
  retryButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 },
  retryText: { fontWeight: '600' },
});

export default DashboardScreen;
