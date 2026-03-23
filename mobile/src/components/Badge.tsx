import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const { theme } = useTheme();

  const variantStyles: Record<BadgeVariant, { bg: string; fg: string; borderColor?: string }> = {
    default: { bg: theme.primary, fg: theme.primaryForeground },
    secondary: { bg: theme.secondary, fg: theme.secondaryForeground },
    destructive: { bg: theme.destructive, fg: theme.destructiveForeground },
    outline: { bg: 'transparent', fg: theme.foreground, borderColor: theme.border },
    success: { bg: '#22c55e', fg: '#ffffff' },
  };

  const v = variantStyles[variant];

  return (
    <View style={[styles.badge, { backgroundColor: v.bg, borderColor: v.borderColor || v.bg }]}>
      <Text style={[styles.text, { color: v.fg }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999, borderWidth: 1, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '600' },
});
