import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, Loading } from '@/components';
import { chatApi, type ChatConversationSummary } from '@/services/chat.api';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { spacing } from '@/constants/theme.constants';

export const ChatScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM } = usePermissions();

  const fetcher = useCallback((p: any) => chatApi.getConversations(p), []);
  const { items, loading, refreshing, refresh, loadMore, hasMore, forbidden } =
    usePaginatedList<ChatConversationSummary>({ fetcher, limit: 20, permKey: PERM.CHAT_REPLY });

  if (forbidden) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading && items.length === 0) return <Loading message="Loading conversations..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.foreground }]}>Messages</Text>
      <FlatList
        data={items}
        keyExtractor={(c) => c.bookingId}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.primary} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={hasMore && items.length > 0 ? <ActivityIndicator style={{ margin: spacing.lg }} color={theme.primary} /> : null}
        ListEmptyComponent={<View style={styles.empty}><Text style={{ color: theme.mutedForeground }}>No conversations.</Text></View>}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation?.navigate('ChatDetail', { bookingId: item.bookingId })}>
            <Card style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.row}>
                <Text style={[styles.cardTitle, { color: theme.foreground }]} numberOfLines={1}>{item.participant?.name || 'Conversation'}</Text>
                {item.unreadCount > 0 && (
                  <View style={[styles.unread, { backgroundColor: theme.primary }]}><Text style={styles.unreadText}>{item.unreadCount}</Text></View>
                )}
              </View>
              {item.lastMessage ? (
                <Text style={[styles.preview, { color: theme.mutedForeground }]} numberOfLines={1}>{item.lastMessage.content}</Text>
              ) : null}
            </Card>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontWeight: '700', padding: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { padding: spacing.md, marginBottom: spacing.md, borderRadius: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  preview: { fontSize: 13 },
  unread: { minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  empty: { flex: 1, padding: spacing.xxl, alignItems: 'center', justifyContent: 'center' },
});

export default ChatScreen;
