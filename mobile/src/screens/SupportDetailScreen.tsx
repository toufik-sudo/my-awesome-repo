import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { supportApi, type SupportThread, type SupportMessage } from '@/services/support.api';
import { spacing } from '@/constants/theme.constants';

const STATUS_COLORS: Record<string, string> = {
  open: '#3B82F6', in_progress: '#F59E0B', resolved: '#10B981', closed: '#6B7280',
};

export const SupportDetailScreen: React.FC<{ route?: any }> = ({ route }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { MOBILE_UI_PERM: PERM, canUI, permissionsLoaded } = usePermissions();
  const id: string = route?.params?.id;

  const canView = canUI(PERM.SUPPORT_VIEW);
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const load = useCallback(async () => {
    if (!id || !canView) return;
    try {
      setLoading(true);
      const [th, msgs] = await Promise.all([
        supportApi.getThread(id),
        supportApi.getMessages(id, { page: 1, limit: 100 }),
      ]);
      setThread(th);
      setMessages(msgs.data);
      supportApi.markRead(id).catch(() => {});
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load thread.');
    } finally {
      setLoading(false);
    }
  }, [id, canView]);

  useEffect(() => { load(); }, [load]);

  const send = useCallback(async () => {
    if (!content.trim() || sending) return;
    try {
      setSending(true);
      const msg = await supportApi.sendMessage(id, content.trim());
      setMessages((prev) => [...prev, msg as SupportMessage]);
      setContent('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Send failed.');
    } finally {
      setSending(false);
    }
  }, [id, content, sending]);

  if (permissionsLoaded && !canView) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading || !thread) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      </SafeAreaView>
    );
  }

  const closed = thread.status === 'closed';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.foreground }]} numberOfLines={1}>{thread.subject}</Text>
          <View style={styles.headerRow}>
            <View style={[styles.badge, { backgroundColor: STATUS_COLORS[thread.status] || theme.muted }]}>
              <Text style={styles.badgeText}>{thread.status.replace('_', ' ')}</Text>
            </View>
            <Text style={[styles.cat, { color: theme.mutedForeground }]}>{thread.category}</Text>
          </View>
        </View>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.md }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isAdmin = item.senderRole === 'admin' || item.senderRole === 'hyper_admin' || item.senderRole === 'hyper_manager';
            return (
              <View style={[styles.bubble, { backgroundColor: isAdmin ? theme.card : theme.primary, alignSelf: isAdmin ? 'flex-start' : 'flex-end' }]}>
                <Text style={{ color: isAdmin ? theme.foreground : theme.primaryForeground }}>{item.content}</Text>
                {item.isSystemMessage && <Text style={[styles.sys, { color: theme.mutedForeground }]}>system</Text>}
              </View>
            );
          }}
          ListEmptyComponent={<View style={styles.center}><Text style={{ color: theme.mutedForeground }}>No messages.</Text></View>}
        />
        <View style={[styles.inputBar, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
          <TextInput
            value={content}
            onChangeText={setContent}
            editable={!closed}
            placeholder={closed ? 'Thread closed' : 'Type a reply…'}
            placeholderTextColor={theme.mutedForeground}
            style={[styles.input, { color: theme.foreground, backgroundColor: theme.background }]}
            multiline
          />
          <TouchableOpacity disabled={sending || !content.trim() || closed} onPress={send} style={[styles.sendBtn, { backgroundColor: theme.primary, opacity: (!content.trim() || closed) ? 0.5 : 1 }]}>
            <Text style={{ color: theme.primaryForeground, fontWeight: '700' }}>{sending ? '…' : 'Send'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  header: { padding: spacing.md, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  cat: { fontSize: 12, textTransform: 'capitalize' },
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 12, marginBottom: 8 },
  sys: { fontSize: 10, marginTop: 4 },
  inputBar: { flexDirection: 'row', padding: spacing.sm, borderTopWidth: 1, gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, maxHeight: 100, fontSize: 14 },
  sendBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
});

export default SupportDetailScreen;
