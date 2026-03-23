import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface ReactionsProps {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
}

export const Reactions: React.FC<ReactionsProps> = ({ reactions, onToggle }) => {
  const { theme } = useTheme();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <View style={styles.container}>
      {reactions.filter(r => r.count > 0).map(r => (
        <TouchableOpacity
          key={r.emoji}
          onPress={() => onToggle(r.emoji)}
          style={[styles.pill, {
            backgroundColor: r.userReacted ? theme.primary + '20' : theme.muted,
            borderColor: r.userReacted ? theme.primary : theme.border,
          }]}
        >
          <Text style={styles.emoji}>{r.emoji}</Text>
          <Text style={[styles.count, { color: r.userReacted ? theme.primary : theme.foreground }]}>{r.count}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => setPickerOpen(true)} style={[styles.addBtn, { backgroundColor: theme.muted, borderColor: theme.border }]}>
        <Text style={{ fontSize: 16 }}>+</Text>
      </TouchableOpacity>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setPickerOpen(false)}>
          <View style={[styles.picker, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {EMOJIS.map(emoji => (
              <TouchableOpacity key={emoji} onPress={() => { onToggle(emoji); setPickerOpen(false); }} style={styles.emojiBtn}>
                <Text style={{ fontSize: 28 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  emoji: { fontSize: 16 },
  count: { fontSize: 13, fontWeight: '500' },
  addBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  picker: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, gap: 8 },
  emojiBtn: { padding: 4 },
});
