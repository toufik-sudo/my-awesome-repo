import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { Product, ProductVariant, BasketItem, BasketState, BasketConfig, BasketCallbacks } from '@/types/product.types';

interface BasketContextType {
  state: BasketState;
  config: BasketConfig;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearBasket: () => void;
  getItemQuantity: (productId: string) => number;
  isInBasket: (productId: string) => boolean;
  openBasket: () => void;
  closeBasket: () => void;
  toggleBasket: () => void;
  applyDiscount: (code: string) => Promise<{ success: boolean; discount?: number; error?: string }>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

const defaultConfig: BasketConfig = {
  maxQuantityPerItem: 99,
  minQuantityPerItem: 1,
  showItemImages: true,
  showItemDetails: true,
  allowQuantityChange: true,
  allowRemove: true,
  showSubtotal: true,
  showTax: true,
  showShipping: true,
  showDiscount: true,
  taxRate: 0.2,
  freeShippingThreshold: 50,
  shippingCost: 5.99,
  position: 'right',
  style: 'drawer'
};

const STORAGE_KEY = 'basket_items';

interface BasketProviderProps {
  children: React.ReactNode;
  config?: BasketConfig;
  callbacks?: BasketCallbacks;
  persistToStorage?: boolean;
}

export const BasketProvider: React.FC<BasketProviderProps> = ({
  children,
  config: userConfig,
  callbacks,
  persistToStorage = true
}) => {
  const config = useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);

  const [items, setItems] = useState<BasketItem[]>(() => {
    if (persistToStorage) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Persist to storage
  useEffect(() => {
    if (persistToStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Failed to persist basket:', err);
      }
    }
  }, [items, persistToStorage]);

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.selectedVariant?.price ?? item.price;
      return sum + price * item.quantity;
    }, 0);

    const tax = config.showTax ? subtotal * (config.taxRate || 0) : 0;
    
    const shipping = config.showShipping
      ? subtotal >= (config.freeShippingThreshold || 0) || items.length === 0
        ? 0
        : config.shippingCost || 0
      : 0;

    const total = subtotal + tax + shipping - discount;
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, tax, shipping, total, itemCount };
  }, [items, discount, config]);

  const state: BasketState = useMemo(() => ({
    items,
    ...calculations,
    discount,
    isOpen,
    isLoading,
    error
  }), [items, calculations, discount, isOpen, isLoading, error]);

  const addItem = useCallback((product: Product, quantity = 1, variant?: ProductVariant) => {
    try {
      setItems(prev => {
        const existingIndex = prev.findIndex(
          item => item.id === product.id && 
            (!variant || item.selectedVariant?.id === variant.id)
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          const newQty = Math.min(
            updated[existingIndex].quantity + quantity,
            config.maxQuantityPerItem || 99
          );
          updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
          return updated;
        }

        const newItem: BasketItem = {
          ...product,
          quantity: Math.min(quantity, config.maxQuantityPerItem || 99),
          selectedVariant: variant,
          addedAt: new Date().toISOString()
        };
        return [...prev, newItem];
      });
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add item');
      setError(error.message);
      callbacks?.onError?.(error, 'addItem');
    }
  }, [config.maxQuantityPerItem, callbacks]);

  const removeItem = useCallback((productId: string) => {
    try {
      setItems(prev => prev.filter(item => item.id !== productId));
      callbacks?.onItemRemove?.(productId);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove item');
      setError(error.message);
      callbacks?.onError?.(error, 'removeItem');
    }
  }, [callbacks]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    try {
      const clampedQty = Math.max(
        config.minQuantityPerItem || 1,
        Math.min(quantity, config.maxQuantityPerItem || 99)
      );

      if (clampedQty <= 0) {
        removeItem(productId);
        return;
      }

      setItems(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity: clampedQty } : item
      ));
      callbacks?.onItemQuantityChange?.(productId, clampedQty);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update quantity');
      setError(error.message);
      callbacks?.onError?.(error, 'updateQuantity');
    }
  }, [config.minQuantityPerItem, config.maxQuantityPerItem, removeItem, callbacks]);

  const clearBasket = useCallback(() => {
    try {
      setItems([]);
      setDiscount(0);
      callbacks?.onClearBasket?.();
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to clear basket');
      setError(error.message);
      callbacks?.onError?.(error, 'clearBasket');
    }
  }, [callbacks]);

  const getItemQuantity = useCallback((productId: string) => {
    return items.find(item => item.id === productId)?.quantity || 0;
  }, [items]);

  const isInBasket = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  const openBasket = useCallback(() => {
    setIsOpen(true);
    callbacks?.onOpen?.();
  }, [callbacks]);

  const closeBasket = useCallback(() => {
    setIsOpen(false);
    callbacks?.onClose?.();
  }, [callbacks]);

  const toggleBasket = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      if (newState) {
        callbacks?.onOpen?.();
      } else {
        callbacks?.onClose?.();
      }
      return newState;
    });
  }, [callbacks]);

  const applyDiscount = useCallback(async (code: string) => {
    if (callbacks?.onApplyDiscount) {
      setIsLoading(true);
      try {
        const result = await callbacks.onApplyDiscount(code);
        if (result.success && result.discount) {
          setDiscount(result.discount);
        }
        setError(result.error || null);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to apply discount');
        setError(error.message);
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    }
    return { success: false, error: 'Discount not supported' };
  }, [callbacks]);

  const value: BasketContextType = {
    state,
    config,
    addItem,
    removeItem,
    updateQuantity,
    clearBasket,
    getItemQuantity,
    isInBasket,
    openBasket,
    closeBasket,
    toggleBasket,
    applyDiscount,
    setError,
    setLoading: setIsLoading
  };

  return (
    <BasketContext.Provider value={value}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};

export default BasketContext;
