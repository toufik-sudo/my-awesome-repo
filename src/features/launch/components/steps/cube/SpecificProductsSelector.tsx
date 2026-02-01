// -----------------------------------------------------------------------------
// SpecificProductsSelector Component
// Select between specific or all products for a goal
// -----------------------------------------------------------------------------

import React from 'react';
import { useSelector } from 'react-redux';
import { Package, Layers, Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useSpecificProducts } from '@/features/launch/hooks/cube/useSpecificProducts';
import type { RootState } from '@/store';

interface SpecificProductsSelectorProps {
  goalIndex: number;
}

export const SpecificProductsSelector: React.FC<SpecificProductsSelectorProps> = ({ goalIndex }) => {
  const {
    specificProducts,
    goalProductIds,
    availableProducts,
    validateAvailable,
    isDisabledProducts,
    isAllProductsDisabled,
    isGenericProductsDisabled,
    handleSpecificProductsSelection,
    handleProductSelection,
    handleValidation,
  } = useSpecificProducts(goalIndex);

  // Get validated state from the goal
  const { cube } = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) => ({
    cube: (state.launchReducer?.cube || {}) as { goals: Array<{ validated: { specificProducts: boolean } }> }
  }));
  const isValidated = cube?.goals?.[goalIndex]?.validated?.specificProducts || false;
  
  // Can validate when a selection is made and (if specific, at least one product selected)
  const canValidate = specificProducts !== null && 
    (specificProducts === false || goalProductIds.length > 0);

  return (
    <div className="space-y-4">
      {/* Section Header with Edit/Validate */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">Product Selection</h4>
          <p className="text-xs text-muted-foreground">
            Choose specific products or apply to all
          </p>
        </div>
        {specificProducts !== null && (
          <Button
            variant={isValidated ? 'outline' : 'default'}
            size="sm"
            onClick={handleValidation}
            disabled={!isValidated && !canValidate}
          >
            {isValidated ? (
              <>
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </>
            ) : (
              <>
                <Check className="h-3 w-3 mr-1" />
                Validate
              </>
            )}
          </Button>
        )}
      </div>

      {/* Selection Options */}
      <div className={cn(
        'grid grid-cols-2 gap-3',
        isValidated && 'opacity-60 pointer-events-none'
      )}>
        {/* Specific Products Option */}
        <button
          onClick={() => handleSpecificProductsSelection(true)}
          disabled={isAllProductsDisabled}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
            'hover:border-primary/50 hover:bg-primary/5',
            specificProducts === true && 'border-primary bg-primary/10',
            specificProducts !== true && 'border-border',
            isAllProductsDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
          )}
        >
          <Package className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm font-medium">Specific Products</span>
          <span className="text-xs text-muted-foreground mt-1">
            Select individual products
          </span>
        </button>

        {/* All Products Option */}
        <button
          onClick={() => handleSpecificProductsSelection(false)}
          disabled={isGenericProductsDisabled}
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
            'hover:border-primary/50 hover:bg-primary/5',
            specificProducts === false && 'border-primary bg-primary/10',
            specificProducts !== false && 'border-border',
            isGenericProductsDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
          )}
        >
          <Layers className="h-6 w-6 mb-2 text-primary" />
          <span className="text-sm font-medium">All Products</span>
          <span className="text-xs text-muted-foreground mt-1">
            Apply to entire catalog
          </span>
        </button>
      </div>

      {/* Product Selection Grid (when specific products selected) */}
      {specificProducts === true && availableProducts.length > 0 && (
        <div className={cn(
          'space-y-3',
          isValidated && 'opacity-60 pointer-events-none'
        )}>
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">
              Select products for this goal
            </Label>
            <Badge variant="secondary" className="text-xs">
              {goalProductIds.length} selected
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
            {availableProducts.map((product) => {
              const isSelected = goalProductIds.includes(product.id);
              const isDisabled = isDisabledProducts[product.id];

              return (
                <div
                  key={product.id}
                  onClick={() => !isDisabled && handleProductSelection(product.id)}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all',
                    'hover:bg-muted/50',
                    isSelected && 'border-primary bg-primary/5',
                    !isSelected && 'border-border',
                    isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    className="pointer-events-none"
                  />
                  <span className="text-sm truncate">{product.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Message */}
      {specificProducts === true && goalProductIds.length === 0 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          Please select at least one product to continue
        </p>
      )}
    </div>
  );
};

export default SpecificProductsSelector;
