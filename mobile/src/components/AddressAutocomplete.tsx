import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface AddressSuggestion {
  id: string;
  mainText: string;
  secondaryText: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

interface AddressAutocompleteProps {
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  label?: string;
  fetchSuggestions?: (query: string) => Promise<AddressSuggestion[]>;
}

// Mock geocoding function - replace with actual API
const mockGeocode = async (query: string): Promise<AddressSuggestion[]> => {
  if (!query || query.length < 3) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock suggestions
  return [
    {
      id: '1',
      mainText: `${query} Street`,
      secondaryText: 'San Francisco, CA, USA',
      latitude: 37.78825,
      longitude: -122.4324,
    },
    {
      id: '2',
      mainText: `${query} Avenue`,
      secondaryText: 'New York, NY, USA',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      id: '3',
      mainText: `${query} Boulevard`,
      secondaryText: 'Los Angeles, CA, USA',
      latitude: 34.0522,
      longitude: -118.2437,
    },
  ];
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  placeholder = 'Search address...',
  label,
  fetchSuggestions = mockGeocode,
}) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      
      if (timerRef.current) clearTimeout(timerRef.current);
      
      if (text.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      setShowSuggestions(true);

      timerRef.current = setTimeout(async () => {
        try {
          const results = await fetchSuggestions(text);
          setSuggestions(results);
        } catch (error) {
          console.error('Geocoding error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 500);
    },
    [fetchSuggestions]
  );

  const handleSelect = (suggestion: AddressSuggestion) => {
    setQuery(suggestion.mainText);
    setShowSuggestions(false);
    onSelect(suggestion);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.foreground }]}>{label}</Text>}
      
      <View style={styles.inputContainer}>
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder={placeholder}
          placeholderTextColor={theme.mutedForeground}
          style={[styles.input, { 
            color: theme.foreground, 
            backgroundColor: theme.muted, 
            borderColor: theme.border 
          }]}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
        />
        {isLoading && (
          <ActivityIndicator 
            size="small" 
            color={theme.primary} 
            style={styles.loader}
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestions, { 
          backgroundColor: theme.card, 
          borderColor: theme.border 
        }]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.suggestionItem, { borderBottomColor: theme.border }]}
                onPress={() => handleSelect(item)}
              >
                <Text style={{ fontSize: 18, marginBottom: 2 }}>📍</Text>
                <View style={styles.suggestionText}>
                  <Text style={[styles.mainText, { color: theme.foreground }]} numberOfLines={1}>
                    {item.mainText}
                  </Text>
                  <Text style={[styles.secondaryText, { color: theme.mutedForeground }]} numberOfLines={1}>
                    {item.secondaryText}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
    position: 'relative',
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  loader: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  suggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    gap: 2,
  },
  mainText: {
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 12,
  },
});
