import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface BasketItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  currency?: string;
}

interface BasketProps {
  items: BasketItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onClear: () => void;
}

const formatPrice = (price: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);

export const Basket: React.FC<BasketProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onClear }) => {
  const { theme } = useTheme();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const confirmClear = () => Alert.alert('Clear Basket', 'Remove all items?', [
    { text: 'Cancel' },
    { text: 'Clear', style: 'destructive', onPress: onClear },
  ]);

  const renderItem = ({ item }: { item: BasketItem }) => (
    <View style={[styles.item, { backgroundColor: theme.muted, borderColor: theme.border }]}>
      {item.image && <Image source={{ uri: item.image }} style={styles.itemImage} />}
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.foreground }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.itemPrice, { color: theme.primary }]}>{formatPrice(item.price, item.currency)}</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} style={[styles.qtyBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.foreground }}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: theme.foreground }]}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)} style={[styles.qtyBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.foreground }}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={{ marginLeft: 'auto' }}>
            <Text style={{ color: theme.destructive, fontSize: 13 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.background }]}>
        <Text style={{ fontSize: 48 }}>🛒</Text>
        <Text style={[styles.emptyText, { color: theme.mutedForeground }]}>Your basket is empty</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList data={items} keyExtractor={i => i.id} renderItem={renderItem} contentContainerStyle={{ padding: 16, gap: 12 }} />
      <View style={[styles.footer, { borderTopColor: theme.border, backgroundColor: theme.card }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.mutedForeground }]}>{itemCount} items</Text>
          <Text style={[styles.totalValue, { color: theme.foreground }]}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.footerBtns}>
          <TouchableOpacity onPress={confirmClear} style={[styles.clearBtn, { borderColor: theme.border }]}>
            <Text style={{ color: theme.foreground }}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCheckout} style={[styles.checkoutBtn, { backgroundColor: theme.primary }]}>
            <Text style={{ color: theme.primaryForeground, fontWeight: '600' }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { flexDirection: 'row', padding: 12, borderRadius: 8, borderWidth: 1, gap: 12 },
  itemImage: { width: 64, height: 64, borderRadius: 8 },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemPrice: { fontSize: 14, fontWeight: '500' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '500', width: 24, textAlign: 'center' },
  footer: { padding: 16, borderTopWidth: 1, gap: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 18, fontWeight: '700' },
  footerBtns: { flexDirection: 'row', gap: 12 },
  clearBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  checkoutBtn: { flex: 2, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 16 },
});
