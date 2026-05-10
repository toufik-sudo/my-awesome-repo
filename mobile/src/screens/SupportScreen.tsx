import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { supportApi, type SupportThread } from '@/services/support.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

const STATUS_COLORS: Record<string, string> = {
  open: '#3B82F6', in_progress: '#F59E0B', resolved: '#10B981', closed: '#6B7280',
};

export const SupportScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI } = usePermissions();

  const fetcher = useCallback((p: any) => supportApi.getMyThreads(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<SupportThread>({ fetcher, limit: 20, permKey: PERM.SUPPORT_VIEW });

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading threads..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>Support</Text>
        {canUI(PERM.SUPPORT_CREATE) && (
          <TouchableOpacity onPress={() => navigation?.navigate('SupportNew')} style={[styles.addBtn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.addText, { color: theme.primaryForeground }]}>+ New</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={items}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No support threads.</Text></View>}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation?.navigate('SupportDetail', { id: item.id })}>
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.row}>
                <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>{item.subject}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] || theme.muted }]}>
                  <Text style={styles.badgeText}>{item.status.replace('_', ' ')}</Text>
                </View>
              </View>
              <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.category}</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  title: { fontSize: 28, fontWeight: '700' },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  meta: { fontSize: 12, textTransform: 'capitalize' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
});

export default SupportScreen;
