import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar } from './Calendar';

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ 
  value, 
  onChange, 
  label,
  minDate,
  maxDate,
  placeholder = 'Select date'
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSelect = (date: Date) => {
    onChange(date);
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
            {value ? formatDate(value) : placeholder}
          </Text>
          <Text style={{ color: theme.mutedForeground }}>📅</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modal, { backgroundColor: theme.background }]}>
            <Calendar 
              selectedDate={value} 
              onSelectDate={handleSelect}
              minDate={minDate}
              maxDate={maxDate}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  inputText: {
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modal: {
    borderRadius: 12,
    padding: 8,
    maxWidth: 400,
    width: '100%',
  },
});
