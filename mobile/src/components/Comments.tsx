import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert as RNAlert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Avatar } from './Avatar';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  onAdd: (content: string, parentId?: string) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
  placeholder?: string;
}

const CommentItem: React.FC<{
  comment: Comment;
  theme: any;
  depth: number;
  onReply: (id: string) => void;
  onDelete?: (id: string) => void;
  currentUserId?: string;
}> = ({ comment, theme, depth, onReply, onDelete, currentUserId }) => (
  <View style={[styles.commentItem, { marginLeft: depth * 16, borderLeftColor: depth > 0 ? theme.border : 'transparent', borderLeftWidth: depth > 0 ? 2 : 0 }]}>
    <View style={styles.commentHeader}>
      <Avatar uri={comment.userAvatar} name={comment.userName} size={28} />
      <Text style={[styles.userName, { color: theme.foreground }]}>{comment.userName}</Text>
      <Text style={[styles.time, { color: theme.mutedForeground }]}>{comment.createdAt}</Text>
    </View>
    <Text style={[styles.content, { color: theme.foreground }]}>{comment.content}</Text>
    <View style={styles.actions}>
      <TouchableOpacity onPress={() => onReply(comment.id)}>
        <Text style={[styles.actionText, { color: theme.primary }]}>Reply</Text>
      </TouchableOpacity>
      {currentUserId === comment.userId && onDelete && (
        <TouchableOpacity onPress={() => RNAlert.alert('Delete', 'Delete this comment?', [
          { text: 'Cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => onDelete(comment.id) },
        ])}>
          <Text style={[styles.actionText, { color: theme.destructive }]}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
    {comment.replies?.map(reply => (
      <CommentItem key={reply.id} comment={reply} theme={theme} depth={depth + 1} onReply={onReply} onDelete={onDelete} currentUserId={currentUserId} />
    ))}
  </View>
);

export const Comments: React.FC<CommentsProps> = ({ comments, onAdd, onDelete, currentUserId, placeholder = 'Add a comment...' }) => {
  const { theme } = useTheme();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | undefined>();

  const handleSend = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), replyTo);
    setText('');
    setReplyTo(undefined);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={comments.filter(c => !c.parentId)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CommentItem comment={item} theme={theme} depth={0} onReply={setReplyTo} onDelete={onDelete} currentUserId={currentUserId} />
        )}
      />
      {replyTo && (
        <View style={[styles.replyBanner, { backgroundColor: theme.muted }]}>
          <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>Replying to comment</Text>
          <TouchableOpacity onPress={() => setReplyTo(undefined)}>
            <Text style={{ color: theme.primary, fontSize: 12 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={[styles.inputRow, { borderTopColor: theme.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={theme.mutedForeground}
          style={[styles.input, { color: theme.foreground, backgroundColor: theme.muted, borderColor: theme.border }]}
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  commentItem: { padding: 12, gap: 4 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { fontWeight: '600', fontSize: 14 },
  time: { fontSize: 12 },
  content: { fontSize: 14, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 16, marginTop: 4 },
  actionText: { fontSize: 12, fontWeight: '500' },
  replyBanner: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  sendBtn: { borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
});
