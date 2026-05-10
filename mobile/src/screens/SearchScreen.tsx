import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { SearchBar, Card } from '@/components';
import { propertiesApi } from '@/services/properties.api';
import { servicesApi } from '@/services/services.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';
import { MOBILE_UI_PERM } from '@/utils/rbac/mobile-permission-keys';

const TABS: Array<{ key: 'properties' | 'services'; label: string }> = [
  { key: 'properties', label: 'Properties' },
  { key: 'services', label: 'Services' },
];

export default function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canViewProperties, canViewServices } = usePermissions();

  const [tab, setTab] = useState<'properties' | 'services'>('properties');
  const [query, setQuery] = useState('');

  const propsFetcher = useCallback((p: any) => propertiesApi.getAll(p), []);
  const servicesFetcher = useCallback((p: any) => servicesApi.getAll(p), []);

  const filters = useMemo(() => ({ search: query, city: query }), [query]);

  const properties = usePaginatedList<any>({
    fetcher: propsFetcher,
    filters,
    limit: 20,
    permKey: MOBILE_UI_PERM.PROPERTY_VIEW,
    enabled: tab === 'properties' && canViewProperties,
  });

  const services = usePaginatedList<any>({
    fetcher: servicesFetcher,
    filters,
    limit: 20,
    permKey: MOBILE_UI_PERM.SERVICE_VIEW,
    enabled: tab === 'services' && canViewServices,
  });

  const active = tab === 'properties' ? properties : services;

  const renderProperty = ({ item }: any) => (
    <TouchableOpacity activeOpacity={0.85} onPress={() => navigation?.navigate('PropertiesTab', { screen: 'PropertyDetail', params: { propertyId: item.id } })}>
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.city}, {item.wilaya}</Text>
        <Text style={[styles.price, { color: theme.primary }]}>{item.pricePerNight} {item.currency}/night</Text>
      </Card>
    </TouchableOpacity>
  );

  const renderService = ({ item }: any) => {
    const title = typeof item.title === 'string' ? item.title : item.title?.en || item.title?.fr;
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation?.navigate('MoreTab', { screen: 'Services' })}>
        <Card style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.city} • {item.category?.replace('_', ' ')}</Text>
          <Text style={[styles.price, { color: theme.primary }]}>{item.price} {item.currency}</Text>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>{t('tabs.search') || 'Search'}</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by city or keyword…" />
        <View style={styles.tabs}>
          {TABS.map((tt) => (
            <TouchableOpacity key={tt.key} onPress={() => setTab(tt.key)}
              style={[styles.tab, { backgroundColor: tab === tt.key ? theme.primary : theme.muted }]}>
              <Text style={{ color: tab === tt.key ? theme.primaryForeground : theme.foreground, fontWeight: '600', fontSize: 13 }}>{tt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {active.forbidden ? (
          <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
        ) : (
          <FlatList
            data={active.items}
            keyExtractor={(it: any, idx) => `${it.id || idx}`}
            renderItem={tab === 'properties' ? renderProperty : renderService}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={active.refreshing} onRefresh={active.refresh} tintColor={theme.primary} />}
            onEndReached={active.loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={active.hasMore && active.items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
            ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{active.loading ? 'Searching…' : 'No results.'}</Text></View>}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.md },
  tabs: { flexDirection: 'row', gap: 8, marginVertical: spacing.md },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  list: { paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.sm, borderRadius: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 12, marginBottom: 4 },
  price: { fontSize: 14, fontWeight: '700' },
  empty: { paddingVertical: spacing.xxl, alignItems: 'center' },
});
