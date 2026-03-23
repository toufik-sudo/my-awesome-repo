import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AlertProps {
  title?: string;
  message: string;
  variant?: 'default' | 'destructive' | 'success';
}

export const Alert: React.FC<AlertProps> = ({ title, message, variant = 'default' }) => {
  const { theme } = useTheme();

  const bgColor = variant === 'destructive' ? theme.destructive + '20' : variant === 'success' ? '#22c55e20' : theme.muted;
  const borderColor = variant === 'destructive' ? theme.destructive : variant === 'success' ? '#22c55e' : theme.border;
  const textColor = variant === 'destructive' ? theme.destructive : variant === 'success' ? '#22c55e' : theme.foreground;

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
      {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
      <Text style={[styles.message, { color: theme.foreground }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 8, borderWidth: 1 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  message: { fontSize: 14 },
});
