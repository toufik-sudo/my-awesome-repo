import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, List, X, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ProductDisplayProps, Product, ProductSortOption, ActiveFilter, ProductVariant } from '@/types/product.types';
import { useBasket } from '@/contexts/BasketContext';
import { cn } from '@/lib/utils';

const ProductDisplay: React.FC<ProductDisplayProps> = ({
  products,
  config = {},
  sortOptions = [],
  filterOptions = [],
  callbacks,
  loading = false,
  error = null,
  totalCount,
  currentPage = 1,
  hasMore = false,
  wishlistedIds = [],
  comparingIds = [],
  className,
  emptyState,
  loadingState,
  errorState
}) => {
  const { t } = useTranslation();
  const { addItem, isInBasket, getItemQuantity } = useBasket();
  
  const {
    columns = { mobile: 1, tablet: 2, desktop: 3, largeDesktop: 4 },
    itemsPerPage = 12,
    lazyLoadThreshold = 8,
    showPagination = false,
    showFilters = true,
    showSort = true,
    showSearch = true,
    cardStyle = 'default',
    imageAspectRatio = 'square',
    showRating = true,
    showStock = true,
    showBadges = true,
    showQuickView = true,
    showAddToBasket = true,
    showWishlist = true,
    showCompare = false,
    animationStyle = 'fade',
    gap = 'md'
  } = config;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<ProductSortOption | null>(sortOptions[0] || null);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(lazyLoadThreshold);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtered and sorted products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply active filters
    activeFilters.forEach(filter => {
      result = result.filter(p => {
        const value = p[filter.field as keyof Product];
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'gt':
            return typeof value === 'number' && value > (filter.value as number);
          case 'lt':
            return typeof value === 'number' && value < (filter.value as number);
          case 'gte':
            return typeof value === 'number' && value >= (filter.value as number);
          case 'lte':
            return typeof value === 'number' && value <= (filter.value as number);
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(value);
          case 'contains':
            return typeof value === 'string' && value.includes(filter.value as string);
          case 'between':
            if (Array.isArray(filter.value) && filter.value.length === 2) {
              const [min, max] = filter.value as [number, number];
              return typeof value === 'number' && value >= min && value <= max;
            }
            return true;
          default:
            return value === filter.value;
        }
      });
    });

    // Apply sorting
    if (selectedSort) {
      result.sort((a, b) => {
        const aVal = a[selectedSort.field];
        const bVal = b[selectedSort.field];
        if (aVal === undefined || bVal === undefined) return 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return selectedSort.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return selectedSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return result;
  }, [products, searchQuery, activeFilters, selectedSort]);

  // Visible products (lazy loading)
  const visibleProducts = useMemo(() => {
    return processedProducts.slice(0, visibleCount);
  }, [processedProducts, visibleCount]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < processedProducts.length && !isLoadingMore) {
          setIsLoadingMore(true);
          // Simulate loading delay for smooth UX
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + lazyLoadThreshold, processedProducts.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [visibleCount, processedProducts.length, lazyLoadThreshold, isLoadingMore]);

  // Reset visible count when products change
  useEffect(() => {
    setVisibleCount(lazyLoadThreshold);
  }, [products, lazyLoadThreshold]);

  // Handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(lazyLoadThreshold);
    callbacks?.onSearchChange?.(value);
  }, [callbacks, lazyLoadThreshold]);

  const handleSortChange = useCallback((sortId: string) => {
    const sort = sortOptions.find(s => s.id === sortId);
    if (sort) {
      setSelectedSort(sort);
      callbacks?.onSortChange?.(sort);
    }
  }, [sortOptions, callbacks]);

  const handleFilterRemove = useCallback((filterId: string) => {
    setActiveFilters(prev => {
      const updated = prev.filter(f => f.filterId !== filterId);
      callbacks?.onFilterChange?.(updated);
      return updated;
    });
  }, [callbacks]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters([]);
    setSearchQuery('');
    callbacks?.onFilterChange?.([]);
  }, [callbacks]);

  const handleProductClick = useCallback((product: Product) => {
    callbacks?.onProductClick?.(product);
  }, [callbacks]);

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    callbacks?.onQuickView?.(product);
  }, [callbacks]);

  const handleAddToBasket = useCallback((product: Product, quantity: number, variant?: ProductVariant) => {
    addItem(product, quantity, variant);
    callbacks?.onAddToBasket?.(product, quantity, variant);
  }, [addItem, callbacks]);

  const handleWishlistToggle = useCallback((product: Product, isWishlisted: boolean) => {
    callbacks?.onWishlistToggle?.(product, isWishlisted);
  }, [callbacks]);

  const handleCompareToggle = useCallback((product: Product, isComparing: boolean) => {
    callbacks?.onCompareToggle?.(product, isComparing);
  }, [callbacks]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      callbacks?.onLoadMore?.();
    }
  }, [hasMore, callbacks]);

  // Gap classes
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  // Animation classes
  const animationClasses = {
    fade: 'animate-in fade-in duration-300',
    slide: 'animate-in slide-in-from-bottom-4 duration-300',
    scale: 'animate-in zoom-in-95 duration-300',
    none: ''
  };

  // Grid column classes
  const gridClasses = cn(
    'grid',
    gapClasses[gap],
    `grid-cols-${columns.mobile}`,
    `sm:grid-cols-${columns.tablet}`,
    `md:grid-cols-${columns.desktop}`,
    `lg:grid-cols-${columns.largeDesktop}`
  );

  // Render loading state
  if (loading && !products.length) {
    if (loadingState) return <>{loadingState}</>;
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className={gridClasses}>
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    if (errorState) return <>{errorState}</>;
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button
            variant="link"
            className="px-2 underline"
            onClick={() => window.location.reload()}
          >
            {t('common.retry', 'Retry')}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Render empty state
  if (!processedProducts.length) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground mb-4">
          {searchQuery || activeFilters.length
            ? t('products.noResults', 'No products match your criteria.')
            : t('products.noProducts', 'No products available.')
          }
        </p>
        {(searchQuery || activeFilters.length > 0) && (
          <Button variant="outline" onClick={handleClearFilters}>
            {t('products.clearFilters', 'Clear Filters')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('space-y-6', className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('products.searchPlaceholder', 'Search products...')}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => handleSearchChange('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Filters */}
          {showFilters && filterOptions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t('products.filters', 'Filters')}
                  {activeFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {t('products.filterBy', 'Filter by')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOptions.map(option => (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={activeFilters.some(f => f.filterId === option.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Simplified - in real app would show filter options
                        setActiveFilters(prev => [...prev, {
                          filterId: option.id,
                          field: option.field,
                          value: true,
                          operator: 'eq'
                        }]);
                      } else {
                        handleFilterRemove(option.id);
                      }
                    }}
                  >
                    {option.translationKey ? t(option.translationKey) : option.label}
                  </DropdownMenuCheckboxItem>
                ))}
                {activeFilters.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={handleClearFilters}
                    >
                      {t('products.clearAll', 'Clear all')}
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Sort */}
          {showSort && sortOptions.length > 0 && (
            <Select value={selectedSort?.id} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('products.sortBy', 'Sort by')} />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.translationKey ? t(option.translationKey) : option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9 rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t('products.activeFilters', 'Active filters')}:
          </span>
          {activeFilters.map(filter => {
            const option = filterOptions.find(o => o.id === filter.filterId);
            return (
              <Badge
                key={filter.filterId}
                variant="secondary"
                className="gap-1 cursor-pointer"
                onClick={() => handleFilterRemove(filter.filterId)}
              >
                {option?.translationKey ? t(option.translationKey) : option?.label}
                <X className="h-3 w-3" />
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={handleClearFilters}
          >
            {t('products.clearAll', 'Clear all')}
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {t('products.showing', 'Showing {{visible}} of {{total}} products', {
            visible: visibleProducts.length,
            total: totalCount ?? processedProducts.length
          })}
        </span>
      </div>

      {/* Product Grid */}
      <div
        className={cn(
          viewMode === 'grid' ? gridClasses : 'flex flex-col gap-4'
        )}
        style={{
          gridTemplateColumns: viewMode === 'grid' 
            ? `repeat(auto-fill, minmax(250px, 1fr))` 
            : undefined
        }}
      >
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            className={animationClasses[animationStyle]}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard
              product={product}
              config={{
                cardStyle,
                imageAspectRatio,
                showRating,
                showStock,
                showBadges,
                showQuickView,
                showAddToBasket,
                showWishlist,
                showCompare
              }}
              isWishlisted={wishlistedIds.includes(product.id)}
              isComparing={comparingIds.includes(product.id)}
              isInBasket={isInBasket(product.id)}
              basketQuantity={getItemQuantity(product.id)}
              callbacks={{
                onProductClick: handleProductClick,
                onQuickView: handleQuickView,
                onAddToBasket: handleAddToBasket,
                onWishlistToggle: handleWishlistToggle,
                onCompareToggle: handleCompareToggle
              }}
            />
          </div>
        ))}
      </div>

      {/* Lazy Load Trigger */}
      {visibleCount < processedProducts.length && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isLoadingMore ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Button
              variant="outline"
              onClick={() => setVisibleCount(prev => 
                Math.min(prev + lazyLoadThreshold, processedProducts.length)
              )}
            >
              {t('products.loadMore', 'Load More')}
            </Button>
          )}
        </div>
      )}

      {/* External Load More (for API pagination) */}
      {hasMore && visibleCount >= processedProducts.length && (
        <div className="flex justify-center py-8">
          <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {t('products.loadMore', 'Load More')}
          </Button>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddToBasket={handleAddToBasket}
        isInBasket={selectedProduct ? isInBasket(selectedProduct.id) : false}
        basketQuantity={selectedProduct ? getItemQuantity(selectedProduct.id) : 0}
      />
    </div>
  );
};

export default ProductDisplay;
