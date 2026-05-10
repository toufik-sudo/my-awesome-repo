import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { referralsApi, type Referral } from '@/services/referrals.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

export const ReferralsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM } = usePermissions();
  const [code, setCode] = useState<string | null>(null);

  const fetcher = useCallback((p: any) => referralsApi.getMine(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<Referral>({ fetcher, limit: 20, permKey: PERM.REFERRALS_VIEW });

  useEffect(() => {
    if (forbidden) return;
    referralsApi.getMyCode().then((r) => setCode(r.code)).catch(() => {});
  }, [forbidden]);

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading referrals..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>Referrals</Text>
      {code && (
        <Card style={[styles.codeCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.codeLabel, { color: theme.mutedForeground }]}>Your code</Text>
          <Text style={[styles.code, { color: theme.primary }]}>{code}</Text>
        </Card>
      )}
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No referrals yet.</Text></View>}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.foreground }]}>{item.inviteeContact || item.code}</Text>
            <View style={styles.row}>
              <Text style={[styles.meta, { color: theme.mutedForeground }]}>{item.status}</Text>
              {typeof item.pointsEarned === 'number' && (
                <Text style={[styles.points, { color: theme.primary }]}>+{item.pointsEarned} pts</Text>
              )}
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', padding: spacing.lg },
  codeCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md, padding: spacing.md, borderRadius: 12, alignItems: 'center' },
  codeLabel: { fontSize: 12 },
  code: { fontSize: 24, fontWeight: '700', letterSpacing: 2, marginTop: 4 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  cardTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meta: { fontSize: 12, textTransform: 'capitalize' },
  points: { fontSize: 14, fontWeight: '700' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
});

export default ReferralsScreen;
