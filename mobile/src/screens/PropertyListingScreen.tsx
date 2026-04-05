import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import { PropertyCard, SearchBar, Loading } from '@/components';
import { propertiesApi } from '@/services/properties.api';
import { useFavorites } from '@/hooks/useFavorites';
import type { Property, PropertyFilters } from '@/types/property.types';
import { spacing } from '@/constants/theme.constants';

interface PropertyListingScreenProps {
  navigation?: any;
}

const TRUST_FILTERS = [
  { label: 'All', value: 0 },
  { label: '1+ ★', value: 1 },
  { label: '3+ ★', value: 3 },
  { label: '5 ★', value: 5 },
];

export const PropertyListingScreen: React.FC<PropertyListingScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { canCreateProperty } = usePermissions();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minTrustStars, setMinTrustStars] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProperties = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      const filters: PropertyFilters = {
        page: currentPage,
        limit: 20,
        city: searchQuery || undefined,
        minTrustStars: minTrustStars > 0 ? minTrustStars : undefined,
      };

      const response = await propertiesApi.getAll(filters);

      if (reset) {
        setProperties(response.data);
        setPage(2);
      } else {
        setProperties((prev) => [...prev, ...response.data]);
        setPage((p) => p + 1);
      }
      setHasMore(response.page < response.totalPages);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, searchQuery, minTrustStars]);

  React.useEffect(() => {
    fetchProperties(true);
  }, [searchQuery, minTrustStars]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProperties(true);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchProperties(false);
    }
  };

  const handlePropertyPress = (property: Property) => {
    navigation?.navigate('PropertyDetail', { propertyId: property.id });
  };

  const renderProperty = ({ item }: { item: Property }) => (
    <PropertyCard
      property={item}
      onPress={handlePropertyPress}
      variant="grid"
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  );

  if (loading && properties.length === 0) {
    return <Loading message="Loading properties..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.foreground }]}>Properties</Text>
        {canCreateProperty && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation?.navigate('AddProperty')}
          >
            <Text style={[styles.addButtonText, { color: theme.primaryForeground }]}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by city or location..."
        />
      </View>

      {/* Trust Filter */}
      <View style={styles.filterRow}>
        <Text style={[styles.filterLabel, { color: theme.mutedForeground }]}>Trust Level:</Text>
        {TRUST_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            onPress={() => setMinTrustStars(filter.value)}
            style={[
              styles.filterChip,
              {
                backgroundColor: minTrustStars === filter.value ? theme.primary : theme.muted,
              },
            ]}
          >
            <Text
              style={{
                color: minTrustStars === filter.value ? theme.primaryForeground : theme.foreground,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Property Grid */}
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore && properties.length > 0 ? (
            <ActivityIndicator style={styles.loader} color={theme.primary} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.mutedForeground, textAlign: 'center' }}>
              No properties found. Try adjusting your filters.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.lg,
  },
  empty: {
    flex: 1,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default PropertyListingScreen;
