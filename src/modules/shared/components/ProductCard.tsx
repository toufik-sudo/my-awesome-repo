import React, { useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Eye, GitCompare, ShoppingCart, Star, Plus, Minus, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProductCardProps } from '@/types/product.types';
import { cn } from '@/lib/utils';

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  config = {},
  isWishlisted = false,
  isComparing = false,
  isInBasket = false,
  basketQuantity = 0,
  callbacks,
  className
}) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const {
    cardStyle = 'default',
    imageAspectRatio = 'square',
    showRating = true,
    showStock = true,
    showBadges = true,
    showQuickView = true,
    showAddToBasket = true,
    showWishlist = true,
    showCompare = false
  } = config;

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round((1 - product.price / product.originalPrice) * 100);
    }
    return 0;
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: 'aspect-auto'
  };

  const cardStyleClasses = {
    default: 'bg-card hover:shadow-lg transition-shadow',
    compact: 'bg-card',
    detailed: 'bg-card hover:shadow-xl transition-all',
    minimal: 'bg-transparent border-0 shadow-none',
    overlay: 'bg-card overflow-hidden group'
  };

  const handleAddToBasket = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacks?.onAddToBasket?.(product, quantity);
    setQuantity(1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacks?.onWishlistToggle?.(product, !isWishlisted);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacks?.onCompareToggle?.(product, !isComparing);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    callbacks?.onQuickView?.(product);
  };

  const handleProductClick = () => {
    callbacks?.onProductClick?.(product);
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'relative cursor-pointer overflow-hidden',
          cardStyleClasses[cardStyle],
          isOutOfStock && 'opacity-75',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleProductClick}
      >
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-muted', aspectRatioClasses[imageAspectRatio])}>
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
              <span className="text-sm">{t('products.noImage', 'No Image')}</span>
            </div>
          ) : (
            <img
              src={product.thumbnail || product.images[0]}
              alt={product.name}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-transform duration-300',
                isHovered && 'scale-105',
                !imageLoaded && 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}

          {/* Badges */}
          {showBadges && (
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {t('products.new', 'New')}
                </Badge>
              )}
              {product.isOnSale && getDiscountPercentage() > 0 && (
                <Badge variant="destructive">
                  -{getDiscountPercentage()}%
                </Badge>
              )}
              {product.badge && (
                <Badge variant="secondary">{product.badge}</Badge>
              )}
              {isOutOfStock && (
                <Badge variant="outline" className="bg-background/80">
                  {t('products.outOfStock', 'Out of Stock')}
                </Badge>
              )}
              {isLowStock && !isOutOfStock && showStock && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  {t('products.lowStock', 'Only {{count}} left', { count: product.stock })}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons Overlay */}
          <div 
            className={cn(
              'absolute right-2 top-2 flex flex-col gap-2 transition-opacity duration-200',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            {showWishlist && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={handleWishlistToggle}
                  >
                    <Heart 
                      className={cn('h-4 w-4', isWishlisted && 'fill-red-500 text-red-500')} 
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isWishlisted 
                    ? t('products.removeFromWishlist', 'Remove from Wishlist')
                    : t('products.addToWishlist', 'Add to Wishlist')
                  }
                </TooltipContent>
              </Tooltip>
            )}

            {showQuickView && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={handleQuickView}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('products.quickView', 'Quick View')}
                </TooltipContent>
              </Tooltip>
            )}

            {showCompare && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className={cn(
                      'h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm',
                      isComparing && 'bg-primary text-primary-foreground'
                    )}
                    onClick={handleCompareToggle}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isComparing 
                    ? t('products.removeFromCompare', 'Remove from Compare')
                    : t('products.addToCompare', 'Add to Compare')
                  }
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          {/* Category */}
          {product.category && (
            <p className="mb-1 text-xs text-muted-foreground uppercase tracking-wide">
              {product.category}
            </p>
          )}

          {/* Product Name */}
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-medium text-foreground line-clamp-2 mb-2">
                {product.name}
              </h3>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="font-medium">{product.name}</p>
              {product.shortDescription && (
                <p className="text-sm text-muted-foreground mt-1">{product.shortDescription}</p>
              )}
            </TooltipContent>
          </Tooltip>

          {/* Rating */}
          {showRating && product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(product.rating!) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'fill-muted text-muted'
                    )}
                  />
                ))}
              </div>
              {product.reviewCount !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* Add to Basket */}
          {showAddToBasket && !isOutOfStock && (
            <div className="flex items-center gap-2">
              {isInBasket ? (
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      callbacks?.onAddToBasket?.(product, -1);
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="flex-1 text-center font-medium">
                    {basketQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      callbacks?.onAddToBasket?.(product, 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  className="w-full gap-2"
                  onClick={handleAddToBasket}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t('products.addToBasket', 'Add to Basket')}
                </Button>
              )}
            </div>
          )}

          {isOutOfStock && showAddToBasket && (
            <Button variant="outline" className="w-full" disabled>
              {t('products.outOfStock', 'Out of Stock')}
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
