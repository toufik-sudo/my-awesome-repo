import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface TimePickerProps {
  value?: { hour: number; minute: number };
  onChange: (time: { hour: number; minute: number }) => void;
  label?: string;
  format24h?: boolean;
  placeholder?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({ 
  value, 
  onChange, 
  label,
  format24h = false,
  placeholder = 'Select time'
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [tempHour, setTempHour] = useState(value?.hour || 12);
  const [tempMinute, setTempMinute] = useState(value?.minute || 0);

  const hours = format24h 
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);
  
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (time: { hour: number; minute: number }) => {
    const h = format24h ? time.hour : time.hour % 12 || 12;
    const m = time.minute.toString().padStart(2, '0');
    const ampm = format24h ? '' : (time.hour >= 12 ? ' PM' : ' AM');
    return `${h}:${m}${ampm}`;
  };

  const handleConfirm = () => {
    onChange({ hour: tempHour, minute: tempMinute });
    setIsOpen(false);
  };

  return (
    <>
      <View style={styles.container}>
        {label && <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>}
        <TouchableOpacity 
          onPress={() => setIsOpen(true)}
          style={[styles.input, { backgroundColor: theme.muted, borderColor: theme.border }]}
        >
          <Text style={[styles.inputText, { color: value ? theme.foreground : theme.mutedForeground }]}>
            {value ? formatTime(value) : placeholder}
          </Text>
          <Text style={{ color: theme.mutedForeground }}>🕐</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modal, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.foreground }]}>Select Time</Text>
            
            <View style={styles.pickerRow}>
              <ScrollView style={styles.picker}>
                {hours.map(h => (
                  <TouchableOpacity 
                    key={h} 
                    onPress={() => setTempHour(h)}
                    style={[styles.pickerItem, tempHour === h && { backgroundColor: theme.primary + '20' }]}
                  >
                    <Text style={[styles.pickerText, { 
                      color: tempHour === h ? theme.primary : theme.foreground 
                    }]}>
                      {h.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.separator, { color: theme.foreground }]}>:</Text>

              <ScrollView style={styles.picker}>
                {minutes.map(m => (
                  <TouchableOpacity 
                    key={m} 
                    onPress={() => setTempMinute(m)}
                    style={[styles.pickerItem, tempMinute === m && { backgroundColor: theme.primary + '20' }]}
                  >
                    <Text style={[styles.pickerText, { 
                      color: tempMinute === m ? theme.primary : theme.foreground 
                    }]}>
                      {m.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.btn}>
                <Text style={{ color: theme.mutedForeground }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={[styles.btn, { backgroundColor: theme.primary }]}>
                <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, borderWidth: 1 },
  inputText: { fontSize: 14 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 16 },
  modal: { borderRadius: 12, padding: 16, maxWidth: 320, width: '100%' },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  pickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 200 },
  picker: { flex: 1 },
  pickerItem: { padding: 12, borderRadius: 8, alignItems: 'center' },
  pickerText: { fontSize: 16, fontWeight: '500' },
  separator: { fontSize: 24, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
});
