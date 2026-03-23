import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search...', debounceMs = 300 }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback((text: string) => {
    setQuery(text);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onSearch(text), debounceMs);
  }, [onSearch, debounceMs]);

  const handleClear = () => { setQuery(''); onSearch(''); };

  return (
    <View style={[styles.container, { backgroundColor: theme.muted, borderColor: theme.border }]}>
      <TextInput
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, { color: theme.foreground }]}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query)}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <View style={[styles.clearIcon, { backgroundColor: theme.mutedForeground }]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, borderWidth: 1, paddingHorizontal: 12 },
  input: { flex: 1, paddingVertical: 10, fontSize: 15 },
  clearBtn: { padding: 4 },
  clearIcon: { width: 18, height: 18, borderRadius: 9, opacity: 0.5 },
});
