// -----------------------------------------------------------------------------
// MeasurementTypeSelector Component
// Select measurement type (quantity, volume, action) for a goal
// -----------------------------------------------------------------------------

import React from 'react';
import { Hash, TrendingUp, Zap, Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMeasurementType } from '@/features/launch/hooks/cube/useMeasurementType';
import { MEASUREMENT_TYPES } from '@/constants/wall/launch';

interface MeasurementTypeSelectorProps {
  goalIndex: number;
}

const MEASUREMENT_TYPE_CONFIG = {
  QUANTITY: {
    icon: Hash,
    label: 'Quantity',
    description: 'Based on units sold',
    value: MEASUREMENT_TYPES.QUANTITY,
  },
  VOLUME: {
    icon: TrendingUp,
    label: 'Revenue',
    description: 'Based on sales value',
    value: MEASUREMENT_TYPES.VOLUME,
  },
  ACTION: {
    icon: Zap,
    label: 'Action',
    description: 'Based on specific actions',
    value: 3, // Special action type
  },
};

export const MeasurementTypeSelector: React.FC<MeasurementTypeSelectorProps> = ({ goalIndex }) => {
  const {
    programType,
    measurementType,
    measurementName,
    measurementTypeValidated,
    currentMeasurementTypes,
    isDisabledMeasurementTypes,
    handleMeasurementTypeSelection,
    handleValidation,
  } = useMeasurementType(goalIndex);

  const isValidated = measurementTypeValidated;

  return (
    <div className="space-y-4">
      {/* Section Header with Edit/Validate */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">Measurement Type</h4>
          <p className="text-xs text-muted-foreground">
            How will you measure performance for this goal?
          </p>
        </div>
        {measurementType !== null && (
          <Button
            variant={isValidated ? 'outline' : 'default'}
            size="sm"
            onClick={handleValidation}
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

      {/* Measurement Type Options */}
      <div className={cn(
        'grid grid-cols-3 gap-3',
        isValidated && 'opacity-60 pointer-events-none'
      )}>
        {currentMeasurementTypes.map((typeKey) => {
          const config = MEASUREMENT_TYPE_CONFIG[typeKey as keyof typeof MEASUREMENT_TYPE_CONFIG];
          if (!config) return null;

          const Icon = config.icon;
          const isSelected = measurementName === typeKey.toLowerCase() ||
            (measurementType === config.value && !measurementName);
          const isDisabled = isDisabledMeasurementTypes[typeKey];

          return (
            <button
              key={typeKey}
              onClick={() => handleMeasurementTypeSelection(config.value)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all',
                'hover:border-primary/50 hover:bg-primary/5',
                isSelected && 'border-primary bg-primary/10',
                !isSelected && 'border-border',
                isDisabled && 'opacity-50 cursor-not-allowed hover:border-border hover:bg-transparent'
              )}
            >
              <Icon className={cn(
                'h-6 w-6 mb-2',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className={cn(
                'text-sm font-medium',
                isSelected && 'text-primary'
              )}>
                {config.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1 text-center">
                {config.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Type Info */}
      {measurementType !== null && measurementName && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
          Rewards will be calculated based on <strong>{measurementName}</strong> metrics
        </div>
      )}
    </div>
  );
};

export default MeasurementTypeSelector;
