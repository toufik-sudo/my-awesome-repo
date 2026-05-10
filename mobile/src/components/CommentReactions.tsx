import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { socialApi, type ReactionSummary } from '@/services/social.api';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '😮'];

interface CommentReactionsProps {
  commentId: string;
  /** Gated by MOBILE_UI_PERM.REACTION_TOGGLE in the parent. */
  canToggle: boolean;
}

/**
 * Per-comment reaction strip. Lazy-loads the summary on mount and
 * delegates toggling to socialApi.toggleReaction (RBAC-gated by parent).
 */
export const CommentReactions: React.FC<CommentReactionsProps> = ({ commentId, canToggle }) => {
  const { theme } = useTheme();
  const [reactions, setReactions] = useState<ReactionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchReactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await socialApi.getReactions('comment', commentId);
      setReactions(data || []);
    } catch {
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [commentId]);

  useEffect(() => { fetchReactions(); }, [fetchReactions]);

  const toggle = async (type: string) => {
    if (!canToggle || busy) return;
    // Optimistic update
    setBusy(type);
    setReactions((prev) => {
      const existing = prev.find((r) => r.type === type);
      if (existing) {
        return prev.map((r) =>
          r.type === type
            ? { ...r, userReacted: !r.userReacted, count: r.count + (r.userReacted ? -1 : 1) }
            : r,
        );
      }
      return [...prev, { type, count: 1, userReacted: true }];
    });
    try {
      await socialApi.toggleReaction({ targetType: 'comment', targetId: commentId, type });
      fetchReactions();
    } catch {
      // Revert on failure
      fetchReactions();
    } finally {
      setBusy(null);
    }
  };

  const visible = QUICK_REACTIONS.map((type) => {
    const found = reactions.find((r) => r.type === type);
    return found || { type, count: 0, userReacted: false };
  });

  return (
    <View style={styles.row}>
      {visible.map((r) => {
        const active = r.userReacted;
        const disabled = !canToggle || busy === r.type;
        return (
          <TouchableOpacity
            key={r.type}
            disabled={disabled}
            onPress={() => toggle(r.type)}
            style={[
              styles.pill,
              {
                backgroundColor: active ? theme.primary + '22' : theme.muted,
                borderColor: active ? theme.primary : theme.border,
                opacity: !canToggle ? 0.6 : 1,
              },
            ]}
          >
            <Text style={styles.emoji}>{r.type}</Text>
            {r.count > 0 && (
              <Text style={[styles.count, { color: active ? theme.primary : theme.foreground }]}>{r.count}</Text>
            )}
          </TouchableOpacity>
        );
      })}
      {loading && <ActivityIndicator size="small" color={theme.mutedForeground} style={{ marginLeft: 4 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 14, borderWidth: 1 },
  emoji: { fontSize: 14 },
  count: { fontSize: 12, fontWeight: '600' },
});

export default CommentReactions;
