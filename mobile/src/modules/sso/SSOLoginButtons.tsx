/**
 * Mobile SSO Login Buttons — mirrors the web SSOLoginButtons.
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/Button';
import { spacing } from '@/constants/theme.constants';
import { useSSO } from './useSSO';
import type { SSOModuleInput, SSOProviderName } from './sso.types';

interface SSOLoginButtonsProps {
  ssoInput?: SSOModuleInput;
}

const PROVIDER_META: Record<SSOProviderName, { icon: string; label: string }> = {
  google: { icon: '🔍', label: 'Google' },
  microsoft: { icon: '🪟', label: 'Microsoft' },
  apple: { icon: '🍎', label: 'Apple' },
  facebook: { icon: '📘', label: 'Facebook' },
  github: { icon: '🐙', label: 'GitHub' },
  instagram: { icon: '📷', label: 'Instagram' },
  tiktok: { icon: '🎵', label: 'TikTok' },
};

export const SSOLoginButtons: React.FC<SSOLoginButtonsProps> = ({ ssoInput }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isEnabled, providers, login, isLoading } = useSSO(ssoInput);

  if (!isEnabled || providers.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Text style={[styles.dividerLabel, { color: theme.mutedForeground }]}>
          {t('auth.socialLogin')}
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
      </View>

      <View style={styles.grid}>
        {providers.map(provider => {
          const meta = PROVIDER_META[provider];
          if (!meta) return null;
          return (
            <View key={provider} style={styles.cell}>
              <Button
                variant="outline"
                onPress={() => login(provider)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={theme.foreground} />
                ) : (
                  <Text style={{ color: theme.foreground }}>
                    {meta.icon}  {meta.label}
                  </Text>
                )}
              </Button>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: spacing.lg },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  divider: { flex: 1, height: 1 },
  dividerLabel: { fontSize: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  cell: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
});

export default SSOLoginButtons;
