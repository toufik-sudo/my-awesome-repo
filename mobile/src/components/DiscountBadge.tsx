import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface DiscountBadgeProps {
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  size?: 'sm' | 'md';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  weeklyDiscount,
  monthlyDiscount,
  size = 'sm',
}) => {
  const { theme } = useTheme();

  if (!weeklyDiscount && !monthlyDiscount) return null;

  const sizes = {
    sm: { text: 10, padding: 4, gap: 4 },
    md: { text: 12, padding: 6, gap: 6 },
  };

  const s = sizes[size];

  return (
    <View style={[styles.container, { gap: s.gap }]}>
      {weeklyDiscount && weeklyDiscount > 0 && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: '#16a34a',
              paddingHorizontal: s.padding * 1.5,
              paddingVertical: s.padding,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: s.text }]}>
            -{weeklyDiscount}% week
          </Text>
        </View>
      )}
      {monthlyDiscount && monthlyDiscount > 0 && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: '#2563eb',
              paddingHorizontal: s.padding * 1.5,
              paddingVertical: s.padding,
            },
          ]}
        >
          <Text style={[styles.text, { fontSize: s.text }]}>
            -{monthlyDiscount}% month
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    borderRadius: 4,
  },
  text: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default DiscountBadge;
