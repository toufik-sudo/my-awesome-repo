// -----------------------------------------------------------------------------
// ProductCard Component
// Individual product display card with selection
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductData {
  id: string;
  name: string;
  description?: string;
  image?: string;
  points?: number;
  category?: string;
  price?: number;
}

interface ProductCardProps {
  product: ProductData;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onToggle,
  disabled = false
}) => {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        isSelected && 'border-primary bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => !disabled && onToggle()}
    >
      <CardHeader className="flex flex-row items-center gap-3 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Package className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-sm truncate">{product.name}</CardTitle>
          <CardDescription className="text-xs truncate">
            {product.points && (
              <Badge variant="secondary" className="mr-1">
                {product.points.toLocaleString()} pts
              </Badge>
            )}
            {product.category && (
              <span className="text-muted-foreground">{product.category}</span>
            )}
          </CardDescription>
          {product.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {product.description}
            </p>
          )}
        </div>
        {isSelected && (
          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Check className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default ProductCard;
