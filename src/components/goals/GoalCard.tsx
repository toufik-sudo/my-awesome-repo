// -----------------------------------------------------------------------------
// Goal Card Component
// Individual goal configuration card with product, measurement, allocation
// -----------------------------------------------------------------------------

import React from 'react';
import { Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GoalAllocation, Product, MeasurementType, AllocationType } from '@/types/goals';
import { ProductSelector } from './ProductSelector';
import { MeasurementTypeSelector } from './MeasurementTypeSelector';
import { AllocationTypeSelector } from './AllocationTypeSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface GoalCardProps {
  goal: GoalAllocation;
  goalIndex: number;
  products: Product[];
  disabledMeasurementTypes: MeasurementType[];
  onProductSelect: (productId: string) => void;
  onMeasurementSelect: (type: MeasurementType) => void;
  onAllocationSelect: (type: AllocationType) => void;
  onRemove: () => void;
  canRemove: boolean;
  isComplete: boolean;
  className?: string;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  goalIndex,
  products,
  disabledMeasurementTypes,
  onProductSelect,
  onMeasurementSelect,
  onAllocationSelect,
  onRemove,
  canRemove,
  isComplete,
  className
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
  
  const selectedProduct = products.find(p => p.id === goal.productId);
  const goalNumber = goalIndex + 1;

  // Get label for measurement type
  const getMeasurementLabel = (type: MeasurementType | null) => {
    const labels: Record<MeasurementType, string> = {
      actions: 'Actions',
      revenue: 'Chiffre d\'affaire',
      volume: 'Volume'
    };
    return type ? labels[type] : '';
  };

  // Get label for allocation type
  const getAllocationLabel = (type: AllocationType | null) => {
    const labels: Record<AllocationType, string> = {
      fixed: 'Points fixes',
      percentage: 'Pourcentage',
      brackets: 'Paliers'
    };
    return type ? labels[type] : '';
  };

  return (
    <Card className={cn(
      'transition-all',
      isComplete && 'border-green-500/50',
      className
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">
                Objectif {goalNumber}
              </CardTitle>
              {isComplete && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  Complet
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {canRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          {/* Summary when collapsed */}
          {!isOpen && isComplete && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{selectedProduct?.name}</Badge>
              <Badge variant="outline">{getMeasurementLabel(goal.measurementType)}</Badge>
              <Badge variant="outline">{getAllocationLabel(goal.allocationType)}</Badge>
            </div>
          )}
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-4">
            {/* Step 1: Product Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </span>
                Sélectionnez un produit
              </div>
              <ProductSelector
                products={products}
                selectedProductId={goal.productId}
                onSelect={onProductSelect}
              />
            </div>

            {/* Step 2: Measurement Type (visible after product selected) */}
            {goal.productId && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      2
                    </span>
                    Sélectionnez le type de mesure
                  </div>
                  <MeasurementTypeSelector
                    selectedType={goal.measurementType}
                    disabledTypes={disabledMeasurementTypes}
                    onSelect={onMeasurementSelect}
                  />
                </div>
              </>
            )}

            {/* Step 3: Allocation Type (visible after measurement selected) */}
            {goal.measurementType && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      3
                    </span>
                    Sélectionnez le type d'allocation
                  </div>
                  <AllocationTypeSelector
                    selectedType={goal.allocationType}
                    onSelect={onAllocationSelect}
                  />
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default GoalCard;
