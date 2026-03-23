import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/hooks/useRTL';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { isRTL, rtlStyles } = useRTL();

  // Check if user has admin/manager role
  const isAdmin = user?.roles?.some((r: string) =>
    ['hyper_admin', 'hyper_manager', 'super_admin', 'super_manager', 'admin'].includes(r)
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, isRTL && rtlStyles.container]}>
        <Text style={[styles.title, { color: theme.foreground }, isRTL && rtlStyles.text]}>
          {t('tabs.profile')}
        </Text>
        <Card title={t('profile.information', 'Profile Information')}>
          <Text style={[styles.label, { color: theme.mutedForeground }, isRTL && rtlStyles.text]}>
            {t('profile.email', 'Email')}:
          </Text>
          <Text style={[styles.value, { color: theme.foreground }, isRTL && rtlStyles.text]}>
            {user?.email || 'N/A'}
          </Text>
          <Text style={[styles.label, { color: theme.mutedForeground }, isRTL && rtlStyles.text]}>
            {t('profile.name', 'Name')}:
          </Text>
          <Text style={[styles.value, { color: theme.foreground }, isRTL && rtlStyles.text]}>
            {user?.name || 'N/A'}
          </Text>
        </Card>

        {isAdmin && (
          <Button
            onPress={() => router.push('/verification-review')}
            variant="outline"
            style={styles.adminButton}
          >
            🛡️ {t('admin.verificationReview', 'Verification Review')}
          </Button>
        )}

        <Button onPress={handleLogout} variant="destructive" style={styles.logoutButton}>
          {t('auth.logout')}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 16,
  },
  adminButton: {
    marginTop: spacing.lg,
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});
