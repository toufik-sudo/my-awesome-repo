import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Minus, Plus, Trash2, ShoppingCart, Tag, AlertCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBasket } from '@/contexts/BasketContext';
import { BasketConfig, BasketCallbacks } from '@/types/product.types';
import { cn } from '@/lib/utils';

interface BasketProps {
  config?: BasketConfig;
  callbacks?: BasketCallbacks;
  trigger?: React.ReactNode;
  className?: string;
}

const Basket: React.FC<BasketProps> = ({
  config: userConfig,
  callbacks,
  trigger,
  className
}) => {
  const { t } = useTranslation();
  const { 
    state, 
    config: contextConfig, 
    updateQuantity, 
    removeItem, 
    clearBasket, 
    applyDiscount,
    closeBasket,
    toggleBasket
  } = useBasket();

  const config = { ...contextConfig, ...userConfig };
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;
    
    setIsApplyingDiscount(true);
    setDiscountError(null);
    
    try {
      const result = await applyDiscount(discountCode);
      if (!result.success) {
        setDiscountError(result.error || t('basket.invalidDiscount', 'Invalid discount code'));
      } else {
        setDiscountCode('');
      }
    } catch (err) {
      setDiscountError(t('basket.discountError', 'Failed to apply discount'));
    } finally {
      setIsApplyingDiscount(false);
    }
  }, [discountCode, applyDiscount, t]);

  const handleCheckout = useCallback(() => {
    callbacks?.onCheckout?.(state);
  }, [callbacks, state]);

  const handleClearBasket = useCallback(() => {
    clearBasket();
    setShowClearConfirm(false);
  }, [clearBasket]);

  const BasketContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="px-4 py-4 border-b">
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          {t('basket.title', 'Shopping Basket')}
          {state.itemCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {state.itemCount}
            </Badge>
          )}
        </SheetTitle>
      </SheetHeader>

      {/* Error Display */}
      {state.error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {state.items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="font-medium text-foreground mb-2">
            {t('basket.empty', 'Your basket is empty')}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('basket.emptyDescription', 'Add some products to get started!')}
          </p>
          <Button variant="outline" onClick={closeBasket}>
            {t('basket.continueShopping', 'Continue Shopping')}
          </Button>
        </div>
      ) : (
        <>
          {/* Items List */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-4 space-y-4">
              {state.items.map((item) => {
                const price = item.selectedVariant?.price ?? item.price;
                return (
                  <div
                    key={`${item.id}-${item.selectedVariant?.id || 'default'}`}
                    className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    {/* Image */}
                    {config.showItemImages && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
                        <img
                          src={item.selectedVariant?.image || item.thumbnail || item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <h4 className="font-medium text-sm truncate">
                              {item.name}
                            </h4>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.name}</p>
                            {item.shortDescription && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {item.shortDescription}
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {item.selectedVariant && (
                        <p className="text-xs text-muted-foreground">
                          {item.selectedVariant.name}: {item.selectedVariant.value}
                        </p>
                      )}

                      <p className="text-sm font-medium mt-1">
                        {formatPrice(price, item.currency)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        {config.allowQuantityChange ? (
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= (config.minQuantityPerItem || 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= (config.maxQuantityPerItem || 99)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {t('basket.qty', 'Qty')}: {item.quantity}
                          </span>
                        )}

                        {config.allowRemove && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t('basket.remove', 'Remove item')}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <span className="font-medium text-sm">
                        {formatPrice(price * item.quantity, item.currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Discount Code */}
          {config.showDiscount && (
            <div className="px-4 py-3 border-t">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('basket.discountPlaceholder', 'Discount code')}
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleApplyDiscount}
                  disabled={!discountCode.trim() || isApplyingDiscount}
                >
                  {isApplyingDiscount ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t('basket.apply', 'Apply')
                  )}
                </Button>
              </div>
              {discountError && (
                <p className="text-xs text-destructive mt-1">{discountError}</p>
              )}
              {state.discount > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {t('basket.discountApplied', 'Discount applied: -{{amount}}', {
                    amount: formatPrice(state.discount)
                  })}
                </p>
              )}
            </div>
          )}

          {/* Summary */}
          <div className="px-4 py-4 border-t space-y-2">
            {config.showSubtotal && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('basket.subtotal', 'Subtotal')}
                </span>
                <span>{formatPrice(state.subtotal)}</span>
              </div>
            )}

            {config.showShipping && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('basket.shipping', 'Shipping')}
                </span>
                <span>
                  {state.shipping === 0 ? (
                    <span className="text-green-600">
                      {t('basket.free', 'Free')}
                    </span>
                  ) : (
                    formatPrice(state.shipping)
                  )}
                </span>
              </div>
            )}

            {config.showTax && state.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('basket.tax', 'Tax')}
                </span>
                <span>{formatPrice(state.tax)}</span>
              </div>
            )}

            {state.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t('basket.discount', 'Discount')}</span>
                <span>-{formatPrice(state.discount)}</span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between font-bold text-lg">
              <span>{t('basket.total', 'Total')}</span>
              <span>{formatPrice(state.total)}</span>
            </div>

            {/* Free Shipping Progress */}
            {config.freeShippingThreshold && state.subtotal < config.freeShippingThreshold && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground text-center">
                  {t('basket.freeShippingProgress', 'Add {{amount}} more for free shipping!', {
                    amount: formatPrice(config.freeShippingThreshold - state.subtotal)
                  })}
                </p>
                <div className="mt-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(100, (state.subtotal / config.freeShippingThreshold) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <SheetFooter className="px-4 py-4 border-t gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowClearConfirm(true)}
            >
              {t('basket.clear', 'Clear Basket')}
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleCheckout}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {t('basket.checkout', 'Checkout')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </SheetFooter>
        </>
      )}

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t('basket.clearConfirmTitle', 'Clear Basket?')}
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            {t('basket.clearConfirmMessage', 'Are you sure you want to remove all items from your basket? This action cannot be undone.')}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearConfirm(false)}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button variant="destructive" onClick={handleClearBasket}>
              {t('basket.clearConfirm', 'Yes, Clear Basket')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Render based on style
  if (config.style === 'modal') {
    return (
      <>
        {trigger && (
          <div onClick={toggleBasket} className="cursor-pointer">
            {trigger}
          </div>
        )}
        <Dialog open={state.isOpen} onOpenChange={closeBasket}>
          <DialogContent className="max-w-lg max-h-[90vh] p-0">
            <BasketContent />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Default: Sheet/Drawer style
  return (
    <Sheet open={state.isOpen} onOpenChange={closeBasket}>
      {trigger && (
        <SheetTrigger asChild onClick={toggleBasket}>
          {trigger}
        </SheetTrigger>
      )}
      <SheetContent
        side={config.position || 'right'}
        className={cn('w-full sm:max-w-lg p-0', className)}
      >
        <BasketContent />
      </SheetContent>
    </Sheet>
  );
};

export default Basket;
