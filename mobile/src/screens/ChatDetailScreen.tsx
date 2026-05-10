import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { chatApi, type ChatMessage } from '@/services/chat.api';
import { spacing } from '@/constants/theme.constants';

export const ChatDetailScreen: React.FC<{ route?: any }> = ({ route }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canReplyChat, permissionsLoaded } = usePermissions();
  const bookingId: string = route?.params?.bookingId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const load = useCallback(async () => {
    if (!bookingId || !canReplyChat) return;
    try {
      setLoading(true);
      const res = await chatApi.getMessages(bookingId, 1, 100);
      const msgs: ChatMessage[] = Array.isArray(res?.messages) ? res.messages : Array.isArray(res?.data) ? res.data : [];
      setMessages(msgs);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [bookingId, canReplyChat]);

  useEffect(() => { load(); }, [load]);

  const send = useCallback(async () => {
    if (!content.trim() || sending) return;
    try {
      setSending(true);
      const msg = await chatApi.sendMessage(bookingId, content.trim());
      setMessages((prev) => [...prev, msg as ChatMessage]);
      setContent('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Send failed.');
    } finally {
      setSending(false);
    }
  }, [bookingId, content, sending]);

  if (permissionsLoaded && !canReplyChat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><Text style={{ color: theme.mutedForeground }}>{t('rbac.forbidden') || 'Access denied'}</Text></View>
      </SafeAreaView>
    );
  }
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: spacing.md }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isHost = item.senderRole === 'host';
            return (
              <View style={[styles.bubble, { backgroundColor: isHost ? theme.primary : theme.card, alignSelf: isHost ? 'flex-end' : 'flex-start' }]}>
                <Text style={{ color: isHost ? theme.primaryForeground : theme.foreground }}>{item.content}</Text>
                {item.filtered && <Text style={[styles.flag, { color: isHost ? theme.primaryForeground : theme.mutedForeground }]}>⚠ filtered</Text>}
              </View>
            );
          }}
          ListEmptyComponent={<View style={styles.center}><Text style={{ color: theme.mutedForeground }}>No messages yet.</Text></View>}
        />
        <View style={[styles.inputBar, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Type a message…"
            placeholderTextColor={theme.mutedForeground}
            style={[styles.input, { color: theme.foreground, backgroundColor: theme.background }]}
            multiline
          />
          <TouchableOpacity disabled={sending || !content.trim()} onPress={send} style={[styles.sendBtn, { backgroundColor: theme.primary, opacity: !content.trim() ? 0.5 : 1 }]}>
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
  bubble: { maxWidth: '80%', padding: 10, borderRadius: 12, marginBottom: 8 },
  flag: { fontSize: 10, marginTop: 4 },
  inputBar: { flexDirection: 'row', padding: spacing.sm, borderTopWidth: 1, gap: 8, alignItems: 'flex-end' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, maxHeight: 100, fontSize: 14 },
  sendBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
});

export default ChatDetailScreen;
