import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { TrustBadge } from './TrustBadge';
import { DiscountBadge } from './DiscountBadge';
import type { Property } from '@/types/property.types';

interface PropertyCardProps {
  property: Property;
  onPress?: (property: Property) => void;
  variant?: 'grid' | 'list';
  isFavorite?: boolean;
  onToggleFavorite?: (propertyId: string) => void;
}

const formatPrice = (price: number, currency = 'DZD') => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onPress,
  variant = 'grid',
  isFavorite = false,
  onToggleFavorite,
}) => {
  const { theme } = useTheme();
  const imageUrl = property.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400';

  const FavoriteButton = () => (
    <TouchableOpacity
      onPress={(e) => {
        e.stopPropagation?.();
        onToggleFavorite?.(property.id);
      }}
      style={styles.favoriteButton}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <View style={[styles.favoriteBg, { backgroundColor: theme.card + 'CC' }]}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={18}
          color={isFavorite ? theme.destructive : theme.foreground}
        />
      </View>
    </TouchableOpacity>
  );

  if (variant === 'list') {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(property)}
        activeOpacity={0.8}
        style={[styles.listCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <View style={styles.listImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.listImage} />
          <FavoriteButton />
        </View>
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: theme.foreground }]} numberOfLines={1}>
              {property.title}
            </Text>
            <TrustBadge trustStars={property.trustStars} size="sm" showLabel={false} />
          </View>
          <Text style={[styles.location, { color: theme.mutedForeground }]} numberOfLines={1}>
            📍 {property.city}, {property.wilaya}
          </Text>
          <View style={styles.listFooter}>
            <Text style={[styles.price, { color: theme.primary }]}>
              {formatPrice(property.pricePerNight, property.currency)}
              <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>/night</Text>
            </Text>
            <DiscountBadge
              weeklyDiscount={property.weeklyDiscount}
              monthlyDiscount={property.monthlyDiscount}
            />
          </View>
          <View style={styles.stats}>
            <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>
              👥 {property.maxGuests} • 🛏️ {property.bedrooms} • ⭐ {property.averageRating || 'New'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant
  return (
    <TouchableOpacity
      onPress={() => onPress?.(property)}
      activeOpacity={0.8}
      style={[styles.gridCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.gridImage} />
        {/* Trust Badge Overlay */}
        <View style={styles.trustOverlay}>
          <TrustBadge trustStars={property.trustStars} size="sm" showLabel={false} />
        </View>
        {/* Favorite Button */}
        <FavoriteButton />
        {/* Discount Badges */}
        {(property.weeklyDiscount || property.monthlyDiscount) && (
          <View style={styles.discountOverlay}>
            <DiscountBadge
              weeklyDiscount={property.weeklyDiscount}
              monthlyDiscount={property.monthlyDiscount}
            />
          </View>
        )}
      </View>
      <View style={styles.gridContent}>
        <Text style={[styles.gridTitle, { color: theme.foreground }]} numberOfLines={2}>
          {property.title}
        </Text>
        <Text style={[styles.location, { color: theme.mutedForeground }]} numberOfLines={1}>
          📍 {property.city}, {property.wilaya}
        </Text>
        <View style={styles.gridFooter}>
          <Text style={[styles.price, { color: theme.primary }]}>
            {formatPrice(property.pricePerNight, property.currency)}
            <Text style={{ color: theme.mutedForeground, fontSize: 11 }}>/night</Text>
          </Text>
          {property.averageRating > 0 && (
            <Text style={{ color: theme.foreground, fontSize: 12, fontWeight: '600' }}>
              ⭐ {property.averageRating.toFixed(1)}
            </Text>
          )}
        </View>
        <Text style={{ color: theme.mutedForeground, fontSize: 11, marginTop: 4 }}>
          👥 {property.maxGuests} guests • 🛏️ {property.bedrooms} beds
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const gridCardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  // Grid variant
  gridCard: {
    width: gridCardWidth,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  trustOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  discountOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  gridContent: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  // List variant
  listCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  listImageContainer: {
    position: 'relative',
  },
  listImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  listTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Shared
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  stats: {
    marginTop: 4,
  },

  // Favorite button
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  favoriteBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PropertyCard;
