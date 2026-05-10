import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Card } from '@/components';
import { spacing } from '@/constants/theme.constants';

interface Item {
  icon: string;
  label: string;
  route: string;
  show: boolean;
}

export const MoreMenuScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { MOBILE_UI_PERM: PERM, canUI, canViewBookings, canViewRewards, canReplyChat, canViewServices } = usePermissions();

  const items: Item[] = [
    { icon: '🛎️', label: 'Bookings', route: 'Bookings', show: canViewBookings },
    { icon: '🧳', label: 'Services', route: 'Services', show: canViewServices },
    { icon: '🎁', label: 'Rewards', route: 'Rewards', show: canViewRewards },
    { icon: '💬', label: 'Messages', route: 'Chat', show: canReplyChat },
    { icon: '💳', label: 'Payments', route: 'Payments', show: canUI(PERM.PAYMENTS_VIEW) },
    { icon: '🤝', label: 'Referrals', route: 'Referrals', show: canUI(PERM.REFERRALS_VIEW) },
    { icon: '🛟', label: 'Support', route: 'Support', show: canUI(PERM.SUPPORT_VIEW) },
    { icon: '🏦', label: 'Payout accounts', route: 'PayoutAccounts', show: canUI(PERM.PAYOUT_ACCOUNTS_VIEW) },
    { icon: '👋', label: 'Onboarding', route: 'Onboarding', show: canUI(PERM.ONBOARDING_VIEW) },
  ];

  const visible = items.filter((i) => i.show);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={[styles.title, { color: theme.foreground }]}>More</Text>
        {visible.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ color: theme.mutedForeground }}>No additional sections available for your role.</Text>
          </View>
        )}
        {visible.map((it) => (
          <TouchableOpacity key={it.route} activeOpacity={0.85} onPress={() => navigation?.navigate(it.route)}>
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={styles.icon}>{it.icon}</Text>
              <Text style={[styles.label, { color: theme.foreground }]}>{it.label}</Text>
              <Text style={[styles.chev, { color: theme.mutedForeground }]}>›</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.lg },
  card: { padding: spacing.md, marginBottom: spacing.sm, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 22, marginRight: spacing.md },
  label: { fontSize: 16, fontWeight: '600', flex: 1 },
  chev: { fontSize: 24, fontWeight: '300' },
  empty: { padding: spacing.xxl, alignItems: 'center' },
});

export default MoreMenuScreen;
