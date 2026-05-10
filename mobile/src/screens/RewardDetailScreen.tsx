import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card } from '@/components';
import { rewardsApi, type Reward } from '@/services/rewards.api';
import { spacing } from '@/constants/theme.constants';

export const RewardDetailScreen: React.FC<{ route?: any; navigation?: any }> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canViewRewards, canRedeemReward, permissionsLoaded } = usePermissions();
  const id: string = route?.params?.id;
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  const load = useCallback(async () => {
    if (!id || !canViewRewards) return;
    try {
      setLoading(true);
      const r = await rewardsApi.getById(id);
      setReward(r);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load reward.');
    } finally {
      setLoading(false);
    }
  }, [id, canViewRewards]);

  useEffect(() => { load(); }, [load]);

  const redeem = useCallback(async () => {
    try {
      setRedeeming(true);
      await rewardsApi.redeem(id);
      Alert.alert('Success', 'Reward redeemed.', [{ text: 'OK', onPress: () => navigation?.goBack() }]);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to redeem.');
    } finally {
      setRedeeming(false);
    }
  }, [id, navigation]);

  if (permissionsLoaded && !canViewRewards) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading || !reward) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {reward.imageUrl ? <Image source={{ uri: reward.imageUrl }} style={styles.img} /> : null}
        <Card style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.foreground }]}>{reward.name}</Text>
          {reward.description ? <Text style={[styles.desc, { color: theme.mutedForeground }]}>{reward.description}</Text> : null}
          <Text style={[styles.points, { color: theme.primary }]}>{reward.pointsCost} pts</Text>
          <Text style={[styles.meta, { color: theme.mutedForeground }]}>Type: {reward.type} • Status: {reward.status}</Text>
        </Card>
        {canRedeemReward && reward.status === 'active' && (
          <TouchableOpacity disabled={redeeming} onPress={redeem} style={[styles.btn, { backgroundColor: theme.primary }]}>
            <Text style={[styles.btnText, { color: theme.primaryForeground }]}>{redeeming ? 'Redeeming…' : 'Redeem now'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: 180, borderRadius: 12, marginBottom: spacing.md },
  card: { padding: spacing.lg, borderRadius: 12, marginBottom: spacing.lg },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 14, marginBottom: 12 },
  points: { fontSize: 26, fontWeight: '700', marginBottom: 8 },
  meta: { fontSize: 12, textTransform: 'capitalize' },
  btn: { padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});

export default RewardDetailScreen;
