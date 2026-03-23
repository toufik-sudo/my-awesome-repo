import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart, Heart, Share2, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ProductModalProps, ProductVariant } from '@/types/product.types';
import { cn } from '@/lib/utils';

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToBasket,
  isInBasket = false,
  basketQuantity = 0
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = useMemo(() => {
    return selectedVariant?.price ?? product?.price ?? 0;
  }, [selectedVariant, product]);

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product?.originalPrice && product.originalPrice > currentPrice) {
      return Math.round((1 - currentPrice / product.originalPrice) * 100);
    }
    return 0;
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToBasket = () => {
    if (product && onAddToBasket) {
      onAddToBasket(product, quantity, selectedVariant);
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: window.location.href
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  if (!product) return null;

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const variantStock = selectedVariant?.stock ?? product.stock;
  const isVariantOutOfStock = variantStock !== undefined && variantStock <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-muted">
            {/* Main Image */}
            <div className="relative aspect-square">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="absolute inset-0 h-full w-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}

              {/* Badges */}
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
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={cn(
                      'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                      currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                    )}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 md:right-2 md:top-2"
              onClick={() => onClose()}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Category & SKU */}
            <div className="flex items-center gap-2 mb-2">
              {product.category && (
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              {product.sku && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    SKU: {product.sku}
                  </span>
                </>
              )}
            </div>

            {/* Product Name */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < Math.floor(product.rating!) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-muted text-muted'
                      )}
                    />
                  ))}
                </div>
                {product.reviewCount !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount} {t('products.reviews', 'reviews')})
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(currentPrice, product.currency)}
              </span>
              {product.originalPrice && product.originalPrice > currentPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-muted-foreground mb-4">
                {product.shortDescription}
              </p>
            )}

            <Separator className="my-4" />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">
                  {t('products.selectVariant', 'Select Option')}
                </Label>
                <RadioGroup
                  value={selectedVariant?.id || ''}
                  onValueChange={(value) => {
                    const variant = product.variants?.find(v => v.id === value);
                    setSelectedVariant(variant);
                  }}
                  className="flex flex-wrap gap-2"
                >
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="flex items-center">
                      <RadioGroupItem
                        value={variant.id}
                        id={variant.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={variant.id}
                        className={cn(
                          'flex items-center justify-center px-3 py-2 text-sm border rounded-md cursor-pointer transition-colors',
                          'peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10',
                          variant.stock === 0 && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {variant.value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-4">
              <Label className="text-sm font-medium">
                {t('products.quantity', 'Quantity')}
              </Label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(prev => prev + 1)}
                  disabled={variantStock !== undefined && quantity >= variantStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {variantStock !== undefined && variantStock > 0 && variantStock <= 10 && (
                <span className="text-sm text-orange-600">
                  {t('products.onlyLeft', 'Only {{count}} left', { count: variantStock })}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {(isOutOfStock || isVariantOutOfStock) && (
              <Badge variant="outline" className="w-fit mb-4 bg-red-50 text-red-700 border-red-200">
                {t('products.outOfStock', 'Out of Stock')}
              </Badge>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
              <Button
                className="flex-1 gap-2"
                size="lg"
                disabled={isOutOfStock || isVariantOutOfStock}
                onClick={handleAddToBasket}
              >
                {isInBasket ? (
                  <>
                    <Check className="h-5 w-5" />
                    {t('products.inBasket', 'In Basket')} ({basketQuantity})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {t('products.addToBasket', 'Add to Basket')}
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className={cn(isWishlisted && 'text-red-500')}
                onClick={() => setIsWishlisted(prev => !prev)}
              >
                <Heart className={cn('h-5 w-5', isWishlisted && 'fill-red-500')} />
              </Button>
              
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Tabs for Description & Attributes */}
            <Tabs defaultValue="description" className="flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">
                  {t('products.description', 'Description')}
                </TabsTrigger>
                <TabsTrigger value="details">
                  {t('products.details', 'Details')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description || t('products.noDescription', 'No description available.')}
                </p>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                {product.attributes && product.attributes.length > 0 ? (
                  <dl className="space-y-2">
                    {product.attributes.map((attr, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <dt className="text-muted-foreground">{attr.name}</dt>
                        <dd className="font-medium">{attr.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t('products.noDetails', 'No details available.')}
                  </p>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4">
                    <span className="text-sm text-muted-foreground">
                      {t('products.tags', 'Tags')}:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
