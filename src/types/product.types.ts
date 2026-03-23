import { ReactNode } from 'react';

// Base product interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  images: string[];
  thumbnail?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  stock?: number;
  sku?: string;
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  badge?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
  image?: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
  icon?: string;
}

// Basket item extends product with quantity
export interface BasketItem extends Product {
  quantity: number;
  selectedVariant?: ProductVariant;
  addedAt: string;
}

// Product display configuration
export interface ProductDisplayConfig {
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    largeDesktop?: number;
  };
  itemsPerPage?: number;
  lazyLoadThreshold?: number;
  showPagination?: boolean;
  showFilters?: boolean;
  showSort?: boolean;
  showSearch?: boolean;
  cardStyle?: 'default' | 'compact' | 'detailed' | 'minimal' | 'overlay';
  imageAspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  showRating?: boolean;
  showStock?: boolean;
  showBadges?: boolean;
  showQuickView?: boolean;
  showAddToBasket?: boolean;
  showWishlist?: boolean;
  showCompare?: boolean;
  animationStyle?: 'fade' | 'slide' | 'scale' | 'none';
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

// Sort options
export interface ProductSortOption {
  id: string;
  label: string;
  translationKey?: string;
  field: keyof Product;
  direction: 'asc' | 'desc';
}

// Filter options
export interface ProductFilterOption {
  id: string;
  type: 'range' | 'select' | 'multiselect' | 'checkbox' | 'rating';
  field: keyof Product | string;
  label: string;
  translationKey?: string;
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
  step?: number;
}

// Active filter value
export interface ActiveFilter {
  filterId: string;
  field: string;
  value: unknown;
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains' | 'between';
}

// Basket configuration
export interface BasketConfig {
  maxQuantityPerItem?: number;
  minQuantityPerItem?: number;
  showItemImages?: boolean;
  showItemDetails?: boolean;
  allowQuantityChange?: boolean;
  allowRemove?: boolean;
  showSubtotal?: boolean;
  showTax?: boolean;
  showShipping?: boolean;
  showDiscount?: boolean;
  taxRate?: number;
  freeShippingThreshold?: number;
  shippingCost?: number;
  position?: 'right' | 'left';
  style?: 'drawer' | 'dropdown' | 'page' | 'modal';
}

// Basket state
export interface BasketState {
  items: BasketItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// Event callbacks
export interface ProductDisplayCallbacks {
  onProductClick?: (product: Product) => void;
  onAddToBasket?: (product: Product, quantity: number, variant?: ProductVariant) => void;
  onRemoveFromBasket?: (productId: string) => void;
  onWishlistToggle?: (product: Product, isWishlisted: boolean) => void;
  onCompareToggle?: (product: Product, isComparing: boolean) => void;
  onQuickView?: (product: Product) => void;
  onFilterChange?: (filters: ActiveFilter[]) => void;
  onSortChange?: (sort: ProductSortOption) => void;
  onSearchChange?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
  onError?: (error: Error, context: string) => void;
}

export interface BasketCallbacks {
  onItemQuantityChange?: (productId: string, quantity: number) => void;
  onItemRemove?: (productId: string) => void;
  onClearBasket?: () => void;
  onCheckout?: (basket: BasketState) => void;
  onApplyDiscount?: (code: string) => Promise<{ success: boolean; discount?: number; error?: string }>;
  onClose?: () => void;
  onOpen?: () => void;
  onError?: (error: Error, context: string) => void;
}

// Props for components
export interface ProductDisplayProps {
  products: Product[];
  config?: ProductDisplayConfig;
  sortOptions?: ProductSortOption[];
  filterOptions?: ProductFilterOption[];
  callbacks?: ProductDisplayCallbacks;
  loading?: boolean;
  error?: string | null;
  totalCount?: number;
  currentPage?: number;
  hasMore?: boolean;
  wishlistedIds?: string[];
  comparingIds?: string[];
  className?: string;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  errorState?: ReactNode;
}

export interface ProductCardProps {
  product: Product;
  config?: ProductDisplayConfig;
  isWishlisted?: boolean;
  isComparing?: boolean;
  isInBasket?: boolean;
  basketQuantity?: number;
  callbacks?: ProductDisplayCallbacks;
  className?: string;
}

export interface BasketProps {
  state: BasketState;
  config?: BasketConfig;
  callbacks?: BasketCallbacks;
  className?: string;
}

export interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBasket?: (product: Product, quantity: number, variant?: ProductVariant) => void;
  isInBasket?: boolean;
  basketQuantity?: number;
}
