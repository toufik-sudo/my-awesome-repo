// -----------------------------------------------------------------------------
// ProductsGrid Component
// Grid display of products with selection controls
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckSquare, Square, Package } from 'lucide-react';
import { ProductCard, ProductData } from './ProductCard';

interface ProductsGridProps {
  products: ProductData[];
  selectedIds: string[];
  onToggle: (productId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  products,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
  isLoading = false,
  emptyMessage
}) => {
  const allSelected = products.length > 0 && products.every(p => selectedIds.includes(p.id));
  const someSelected = selectedIds.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>{emptyMessage || <FormattedMessage id="launch.products.noProducts" defaultMessage="No products available" />}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <FormattedMessage 
            id="launch.products.selected" 
            defaultMessage="{count} selected"
            values={{ count: selectedIds.length }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="gap-2"
          >
            {allSelected ? (
              <>
                <Square className="h-4 w-4" />
                <FormattedMessage id="common.deselectAll" defaultMessage="Deselect All" />
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                <FormattedMessage id="common.selectAll" defaultMessage="Select All" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Products grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedIds.includes(product.id)}
              onToggle={() => onToggle(product.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsGrid;
