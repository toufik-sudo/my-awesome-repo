import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from './Avatar';

export interface RankingEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  previousRank?: number;
}

interface RankingProps {
  entries: RankingEntry[];
  currentUserId?: string;
  title?: string;
}

const medals = ['🥇', '🥈', '🥉'];

const TrendIndicator: React.FC<{ rank: number; previous?: number; theme: any }> = ({ rank, previous, theme }) => {
  if (previous === undefined) return null;
  const diff = previous - rank;
  if (diff === 0) return <Text style={{ color: theme.mutedForeground }}>—</Text>;
  return <Text style={{ color: diff > 0 ? '#22c55e' : theme.destructive, fontWeight: '600', fontSize: 12 }}>{diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`}</Text>;
};

export const Ranking: React.FC<RankingProps> = ({ entries, currentUserId, title }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {title && <Text style={[styles.title, { color: theme.foreground }]}>{title}</Text>}
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.row, {
            backgroundColor: item.id === currentUserId ? theme.primary + '15' : 'transparent',
            borderColor: item.id === currentUserId ? theme.primary : theme.border,
          }]}>
            <View style={styles.rankCol}>
              <Text style={{ fontSize: 16 }}>{item.rank <= 3 ? medals[item.rank - 1] : `#${item.rank}`}</Text>
            </View>
            <Avatar uri={item.avatar} name={item.name} size={32} />
            <Text style={[styles.name, { color: theme.foreground }]} numberOfLines={1}>{item.name}</Text>
            <TrendIndicator rank={item.rank} previous={item.previousRank} theme={theme} />
            <Text style={[styles.score, { color: theme.primary }]}>{item.score.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, borderBottomWidth: 1 },
  rankCol: { width: 32, alignItems: 'center' },
  name: { flex: 1, fontSize: 14, fontWeight: '500' },
  score: { fontSize: 14, fontWeight: '700' },
});
