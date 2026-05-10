import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing } from '@/constants/theme.constants';

/**
 * Skeleton placeholder for a single comment row (matches PropertyDetail comments).
 */
export const CommentSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.commentItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Skeleton width={120} height={12} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="80%" height={12} style={{ marginBottom: 8 }} />
      <Skeleton width={70} height={10} />
    </View>
  );
};

/**
 * Vertically-stacked CommentSkeletons. Used for first-load and "Load more" states.
 */
export const CommentSkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </View>
);

/**
 * Skeleton placeholder for a payout account card.
 */
export const PayoutAccountSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.row}>
        <Skeleton width={180} height={14} />
        <Skeleton width={10} height={10} borderRadius={5} />
      </View>
      <Skeleton width={120} height={11} style={{ marginTop: 8 }} />
      <Skeleton width="60%" height={13} style={{ marginTop: 6 }} />
      <View style={styles.actionRow}>
        <Skeleton width="48%" height={32} borderRadius={8} />
        <Skeleton width="48%" height={32} borderRadius={8} />
      </View>
    </View>
  );
};

export const PayoutAccountSkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <View>
    {Array.from({ length: count }).map((_, i) => (
      <PayoutAccountSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  commentItem: {
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
});
