import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 4, color }) => {
  const { theme } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: Math.min(100, Math.max(0, progress)), duration: 300, useNativeDriver: false }).start();
  }, [progress]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, { height, backgroundColor: theme.muted, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, { width, height, backgroundColor: color || theme.primary, borderRadius: height / 2 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
  fill: {},
});
