import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBasket } from '@/contexts/BasketContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface BasketButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showCount?: boolean;
  showTotal?: boolean;
  className?: string;
}

const BasketButton: React.FC<BasketButtonProps> = ({
  variant = 'ghost',
  size = 'icon',
  showCount = true,
  showTotal = false,
  className
}) => {
  const { t } = useTranslation();
  const { state, openBasket } = useBasket();

  const formatPrice = (price: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn('relative', className)}
            onClick={openBasket}
          >
            <ShoppingCart className="h-5 w-5" />
            
            {showCount && state.itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
              >
                {state.itemCount > 99 ? '99+' : state.itemCount}
              </Badge>
            )}

            {showTotal && state.total > 0 && (
              <span className="ml-2 text-sm font-medium">
                {formatPrice(state.total)}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {state.itemCount === 0
              ? t('basket.empty', 'Your basket is empty')
              : t('basket.itemsInBasket', '{{count}} items in basket', {
                  count: state.itemCount
                })
            }
          </p>
          {state.total > 0 && (
            <p className="text-xs text-muted-foreground">
              {t('basket.total', 'Total')}: {formatPrice(state.total)}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BasketButton;
