// -----------------------------------------------------------------------------
// Measurement Type Selector Component
// Allows selecting measurement type (Actions, Revenue, Volume)
// With disabled options for used product/measurement combinations
// -----------------------------------------------------------------------------

import React from 'react';
import { Activity, DollarSign, BarChart3, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MeasurementType } from '@/types/goals';
import { MEASUREMENT_TYPE_OPTIONS } from '@/constants/goals';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MeasurementTypeSelectorProps {
  selectedType: MeasurementType | null;
  disabledTypes: MeasurementType[];
  onSelect: (type: MeasurementType) => void;
  disabled?: boolean;
  className?: string;
}

const MEASUREMENT_ICONS: Record<MeasurementType, React.ElementType> = {
  actions: Activity,
  revenue: DollarSign,
  volume: BarChart3
};

export const MeasurementTypeSelector: React.FC<MeasurementTypeSelectorProps> = ({
  selectedType,
  disabledTypes,
  onSelect,
  disabled = false,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Type de mesure
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TooltipProvider>
          {MEASUREMENT_TYPE_OPTIONS.map((option) => {
            const Icon = MEASUREMENT_ICONS[option.id];
            const isSelected = selectedType === option.id;
            const isDisabled = disabled || disabledTypes.includes(option.id);
            
            return (
              <Tooltip key={option.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'h-auto py-4 px-4 flex flex-col items-center gap-2 relative',
                      isSelected && 'ring-2 ring-primary ring-offset-2',
                      isDisabled && !isSelected && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={isDisabled && !isSelected}
                    onClick={() => !isDisabled && onSelect(option.id)}
                  >
                    {isDisabled && !isSelected && (
                      <Lock className="h-3 w-3 absolute top-2 right-2 text-muted-foreground" />
                    )}
                    {isSelected && (
                      <Check className="h-3 w-3 absolute top-2 right-2 text-primary-foreground" />
                    )}
                    <Icon className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-primary-foreground' : 'text-primary'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-primary-foreground' : 'text-foreground'
                    )}>
                      {option.label}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDisabled && !isSelected ? (
                    <p>Déjà utilisé avec ce produit dans un autre objectif</p>
                  ) : (
                    <p>{option.description}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MeasurementTypeSelector;
