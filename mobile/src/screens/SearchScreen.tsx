import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { spacing } from '@/constants/theme.constants';

export default function SearchScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.foreground }]}>
          {t('tabs.search') || 'Search'}
        </Text>
        
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {searchQuery ? (
          <Card title="Search Results">
            <Text style={{ color: theme.foreground }}>
              Searching for: {searchQuery}
            </Text>
            <Text style={[styles.noResults, { color: theme.mutedForeground }]}>
              No results found
            </Text>
          </Card>
        ) : (
          <Card title="Popular Searches">
            <Text style={{ color: theme.foreground }}>
              Start typing to search...
            </Text>
          </Card>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  searchInput: {
    width: '100%',
  },
  noResults: {
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
});
