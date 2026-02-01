// -----------------------------------------------------------------------------
// Product Selector Component
// Allows selecting configured products or general product for goals
// -----------------------------------------------------------------------------

import React from 'react';
import { Package, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/goals';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string | null;
  onSelect: (productId: string) => void;
  disabled?: boolean;
  className?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  onSelect,
  disabled = false,
  className
}) => {
  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Package className="h-4 w-4 text-primary" />
        Produit
      </label>
      
      <Select
        value={selectedProductId || undefined}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un produit">
            {selectedProduct && (
              <div className="flex items-center gap-2">
                {selectedProduct.isGeneral ? (
                  <Badge variant="secondary" className="text-xs">Général</Badge>
                ) : null}
                <span>{selectedProduct.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              <div className="flex items-center gap-2">
                {product.isGeneral ? (
                  <Badge variant="secondary" className="text-xs">Général</Badge>
                ) : product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="h-6 w-6 rounded object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center">
                    <Package className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                <span>{product.name}</span>
                {selectedProductId === product.id && (
                  <Check className="h-4 w-4 ml-auto text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSelector;
