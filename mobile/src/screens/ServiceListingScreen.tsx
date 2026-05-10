import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { SearchBar, Loading, Card } from '@/components';
import { servicesApi, type TourismServiceItem } from '@/services/services.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

interface Props {
  navigation?: any;
}

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'Tour', value: 'walking_tour' },
  { label: 'Food', value: 'restaurant' },
  { label: 'Spa', value: 'spa' },
];

const localized = (v: any): string =>
  typeof v === 'string' ? v : v?.en || v?.fr || Object.values(v || {})[0] || '';

export const ServiceListingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canAddService, canViewServices } = usePermissions();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [category, setCategory] = React.useState('');

  const filters = useMemo(
    () => ({
      city: searchQuery || undefined,
      category: category || undefined,
    }),
    [searchQuery, category],
  );

  const fetcher = useCallback((p: any) => servicesApi.getAll(p), []);

  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<TourismServiceItem>({
      fetcher,
      filters,
      limit: 20,
      permKey: MOBILE_UI_PERM.SERVICE_VIEW,
    });

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}>
          <Text style={{ color: theme.mutedForeground }}>
            {t('rbac.forbidden') || 'Access denied'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && items.length === 0) {
    return <Loading message="Loading services..." />;
  }

  const renderItem = ({ item }: { item: TourismServiceItem }) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate('ServiceDetail', { serviceId: item.id })}
      activeOpacity={0.85}
    >
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>
          {localized(item.title)}
        </Text>
        <Text style={[styles.cardMeta, { color: theme.mutedForeground }]} numberOfLines={1}>
          {item.city} • {item.category.replace(/_/g, ' ')}
        </Text>
        <Text style={[styles.cardPrice, { color: theme.primary }]}>
          {item.price} {item.currency}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>Services</Text>
        {canAddService && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation?.navigate('AddService')}
          >
            <Text style={[styles.addButtonText, { color: theme.primaryForeground }]}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by city..."
        />
      </View>

      <View style={styles.filterRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.value || 'all'}
            onPress={() => setCategory(c.value)}
            style={[
              styles.filterChip,
              { backgroundColor: category === c.value ? theme.primary : theme.muted },
            ]}
          >
            <Text
              style={{
                color: category === c.value ? theme.primaryForeground : theme.foreground,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && items.length > 0 ? (
            <ActivityIndicator style={styles.loader} color={theme.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
              No services found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 28, fontWeight: '700' },
  searchContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: 8,
  },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardMeta: { fontSize: 12, marginBottom: 6 },
  cardPrice: { fontSize: 14, fontWeight: '700' },
  loader: { marginVertical: spacing.lg },
  empty: { flex: 1, paddingVertical: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
  addButton: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { fontSize: 13, fontWeight: '600' },
});

export default ServiceListingScreen;
