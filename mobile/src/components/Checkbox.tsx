import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onChange(!checked)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={[styles.box, {
        backgroundColor: checked ? theme.primary : 'transparent',
        borderColor: checked ? theme.primary : theme.border,
        opacity: disabled ? 0.5 : 1,
      }]}>
        {checked && <Text style={[styles.check, { color: theme.primaryForeground }]}>✓</Text>}
      </View>
      {label && <Text style={[styles.label, { color: theme.foreground, opacity: disabled ? 0.5 : 1 }]}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  check: { fontSize: 14, fontWeight: '700' },
  label: { fontSize: 14 },
});
