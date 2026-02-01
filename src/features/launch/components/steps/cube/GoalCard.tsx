// -----------------------------------------------------------------------------
// GoalCard Component
// Individual goal configuration card with step-by-step flow:
// 1. Product Selection (if products configured) → Validate
// 2. Measurement Type → Validate  
// 3. Allocation Type + Fill Form → Validate
// -----------------------------------------------------------------------------

import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SpecificProductsSelector } from './SpecificProductsSelector';
import { MeasurementTypeSelector } from './MeasurementTypeSelector';
import { AllocationTypeSelector } from './AllocationTypeSelector';
import { useSpecificProducts } from '@/features/launch/hooks/cube/useSpecificProducts';
import { useMeasurementType } from '@/features/launch/hooks/cube/useMeasurementType';
import { useAllocationType } from '@/features/launch/hooks/cube/useAllocationType';

interface GoalCardProps {
  goalIndex: number;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goalIndex }) => {
  const specificProducts = useSpecificProducts(goalIndex);
  const measurementType = useMeasurementType(goalIndex);
  const allocationType = useAllocationType(goalIndex);

  // Step 1: Show product selection if products were configured
  const showProductSelection = specificProducts.personaliseProducts && specificProducts.availableProducts.length > 0;
  
  // Check if product selection is validated (or not needed)
  const isProductStepValidated = !showProductSelection || 
    (specificProducts.specificProducts !== null && 
     (specificProducts.specificProducts === false || specificProducts.goalProductIds.length > 0));
  
  // Step 2: Show measurement type when product selection is done
  // If products configured: show after selection is made (validated or not)
  // If no products: show directly
  const showMeasurementType = showProductSelection 
    ? isProductStepValidated
    : true;

  // Step 3: Show allocation type when measurement type is selected and validated
  const showAllocationType = measurementType.measurementTypeValidated && allocationType.cubeFormsAvailable;

  return (
    <div className="space-y-6">
      {/* Step 1: Specific Products Selection */}
      {showProductSelection && (
        <>
          <SpecificProductsSelector goalIndex={goalIndex} />
          {(specificProducts.specificProducts !== null) && <Separator />}
        </>
      )}

      {/* Step 2: Measurement Type Selection */}
      {showMeasurementType && measurementType.isMeasurementTypeVisible && (
        <>
          <MeasurementTypeSelector goalIndex={goalIndex} />
          {measurementType.measurementType && <Separator />}
        </>
      )}

      {/* Step 3: Allocation Type & Forms */}
      {showAllocationType && (
        <AllocationTypeSelector goalIndex={goalIndex} />
      )}

      {/* Empty State - No products and no type yet */}
      {!showProductSelection && !measurementType.measurementType && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Select a measurement type to start configuring this goal
        </div>
      )}
    </div>
  );
};

export default GoalCard;
