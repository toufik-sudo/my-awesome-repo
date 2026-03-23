import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const statusColors: Record<string, string> = {
  online: '#22c55e',
  offline: '#94a3b8',
  away: '#f59e0b',
  busy: '#ef4444',
};

export const Avatar: React.FC<AvatarProps> = ({ uri, name = '', size = 40, status }) => {
  const { theme } = useTheme();
  const borderRadius = size / 2;
  const fontSize = size * 0.4;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius }]}>
      {uri ? (
        <Image source={{ uri }} style={[styles.image, { width: size, height: size, borderRadius }]} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius, backgroundColor: theme.primary }]}>
          <Text style={[styles.initials, { fontSize, color: theme.primaryForeground }]}>{getInitials(name)}</Text>
        </View>
      )}
      {status && (
        <View style={[styles.status, {
          backgroundColor: statusColors[status],
          borderColor: theme.background,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: size * 0.15,
          right: 0,
          bottom: 0,
        }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  image: { resizeMode: 'cover' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
  initials: { fontWeight: '600' },
  status: { position: 'absolute', borderWidth: 2 },
});
