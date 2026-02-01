// -----------------------------------------------------------------------------
// Allocation Type Selector Component
// Allows selecting allocation type (Fixed, Percentage, Brackets)
// -----------------------------------------------------------------------------

import React from 'react';
import { Target, Percent, Layers, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AllocationType } from '@/types/goals';
import { ALLOCATION_TYPE_OPTIONS } from '@/constants/goals';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';

interface AllocationTypeSelectorProps {
  selectedType: AllocationType | null;
  onSelect: (type: AllocationType) => void;
  disabled?: boolean;
  className?: string;
}

const ALLOCATION_ICONS: Record<string, React.ElementType> = {
  target: Target,
  percent: Percent,
  layers: Layers
};

export const AllocationTypeSelector: React.FC<AllocationTypeSelectorProps> = ({
  selectedType,
  onSelect,
  disabled = false,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        Type d'allocation
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <TooltipProvider>
          {ALLOCATION_TYPE_OPTIONS.map((option) => {
            const Icon = ALLOCATION_ICONS[option.icon] || Target;
            const isSelected = selectedType === option.id;
            
            return (
              <Tooltip key={option.id}>
                <TooltipTrigger asChild>
                  <Card
                    className={cn(
                      'cursor-pointer transition-all hover:border-primary/50',
                      isSelected && 'border-primary ring-2 ring-primary/20 bg-primary/5',
                      disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !disabled && onSelect(option.id)}
                  >
                    <CardContent className="p-4 flex flex-col items-center gap-2 relative">
                      {isSelected && (
                        <Check className="h-4 w-4 absolute top-2 right-2 text-primary" />
                      )}
                      <div className={cn(
                        'h-12 w-12 rounded-full flex items-center justify-center',
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={cn(
                        'text-sm font-medium text-center',
                        isSelected ? 'text-primary' : 'text-foreground'
                      )}>
                        {option.label}
                      </span>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AllocationTypeSelector;
