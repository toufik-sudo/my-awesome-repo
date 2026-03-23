import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TrustBadgeProps {
  trustStars: number;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const TRUST_LABELS: Record<number, string> = {
  0: 'Not Verified',
  1: 'ID Verified',
  2: 'Address Verified',
  3: 'Deed Verified',
  5: 'Fully Verified',
};

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustStars,
  isVerified = false,
  size = 'md',
  showLabel = true,
}) => {
  const { theme } = useTheme();

  const sizes = {
    sm: { star: 10, icon: 12, text: 10, padding: 4, gap: 2 },
    md: { star: 14, icon: 16, text: 12, padding: 6, gap: 4 },
    lg: { star: 18, icon: 20, text: 14, padding: 8, gap: 6 },
  };

  const s = sizes[size];
  const label = TRUST_LABELS[trustStars] || TRUST_LABELS[0];

  const getBgColor = () => {
    if (trustStars === 0) return theme.muted;
    if (trustStars >= 5) return '#16a34a';
    if (trustStars >= 3) return '#2563eb';
    return '#f59e0b';
  };

  const getTextColor = () => {
    if (trustStars === 0) return theme.mutedForeground;
    return '#ffffff';
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBgColor(),
          paddingHorizontal: s.padding * 1.5,
          paddingVertical: s.padding,
          gap: s.gap,
        },
      ]}
    >
      {/* Shield Icon */}
      <Text style={{ fontSize: s.icon, color: getTextColor() }}>🛡️</Text>

      {/* Stars */}
      <View style={[styles.starsRow, { gap: 1 }]}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Text
            key={i}
            style={{
              fontSize: s.star,
              color: i <= trustStars ? '#fbbf24' : 'rgba(255,255,255,0.3)',
            }}
          >
            ★
          </Text>
        ))}
      </View>

      {/* Label */}
      {showLabel && (
        <Text
          style={[
            styles.label,
            { fontSize: s.text, color: getTextColor() },
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
});

export default TrustBadge;
