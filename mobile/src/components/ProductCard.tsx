import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from './Badge';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  currency?: string;
  discount?: number;
  rating?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const formatPrice = (price: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onAddToCart }) => {
  const { theme } = useTheme();
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <TouchableOpacity onPress={() => onPress?.(product)} activeOpacity={0.8} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      {product.image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {product.discount && <View style={styles.discountBadge}><Badge label={`-${product.discount}%`} variant="destructive" /></View>}
        </View>
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.foreground }]} numberOfLines={2}>{product.name}</Text>
        {product.rating && <Text style={{ color: theme.mutedForeground, fontSize: 12 }}>{'⭐'.repeat(Math.round(product.rating))} {product.rating}</Text>}
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.primary }]}>{formatPrice(discountedPrice, product.currency)}</Text>
          {product.discount && <Text style={[styles.oldPrice, { color: theme.mutedForeground }]}>{formatPrice(product.price, product.currency)}</Text>}
        </View>
        {onAddToCart && (
          <TouchableOpacity onPress={() => onAddToCart(product)} style={[styles.cartBtn, { backgroundColor: theme.primary }]}>
            <Text style={{ color: theme.primaryForeground, fontWeight: '600', fontSize: 13 }}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 160, resizeMode: 'cover' },
  discountBadge: { position: 'absolute', top: 8, right: 8 },
  info: { padding: 12, gap: 4 },
  name: { fontSize: 14, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  price: { fontSize: 16, fontWeight: '700' },
  oldPrice: { fontSize: 13, textDecorationLine: 'line-through' },
  cartBtn: { marginTop: 8, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
});
