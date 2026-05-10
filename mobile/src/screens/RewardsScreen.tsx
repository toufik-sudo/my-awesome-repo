import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { rewardsApi, type Reward } from '@/services/rewards.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

export const RewardsScreen: React.FC<{ navigation?: any }> = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canRedeemReward } = usePermissions();

  const fetcher = useCallback((p: any) => rewardsApi.getShop(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<Reward>({ fetcher, limit: 20, permKey: PERM.REWARDS_VIEW });

  const handleRedeem = useCallback(async (r: Reward) => {
    try {
      await rewardsApi.redeem(r.id);
      Alert.alert('Success', 'Reward redeemed.');
      refresh();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to redeem.');
    }
  }, [refresh]);

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading rewards..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>Rewards</Text>
      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No rewards available.</Text></View>}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>{item.name}</Text>
            {item.description ? <Text style={[styles.meta, { color: theme.mutedForeground }]} numberOfLines={2}>{item.description}</Text> : null}
            <View style={styles.row}>
              <Text style={[styles.price, { color: theme.primary }]}>{item.pointsCost} pts</Text>
              {canRedeemReward && item.status === 'active' && (
                <TouchableOpacity onPress={() => handleRedeem(item)} style={[styles.btn, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.btnText, { color: theme.primaryForeground }]}>Redeem</Text>
                </TouchableOpacity>
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
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 12, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: '700' },
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  btnText: { fontSize: 13, fontWeight: '600' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
});

export default RewardsScreen;
