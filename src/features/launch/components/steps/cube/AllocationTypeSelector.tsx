// -----------------------------------------------------------------------------
// AllocationTypeSelector Component
// Select allocation type and configure allocation forms
// -----------------------------------------------------------------------------

import React from 'react';
import { Calculator, BarChart3, TrendingUp, Trophy, Check, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAllocationType } from '@/features/launch/hooks/cube/useAllocationType';
import { SimpleAllocationForm } from './SimpleAllocationForm';
import { BracketAllocationForm } from './BracketAllocationForm';
import { GrowthAllocationForm } from './GrowthAllocationForm';
import { RankingAllocationForm } from './RankingAllocationForm';
import { SIMPLE, BRACKET, GROWTH, RANKING } from '@/constants/wall/launch';

interface AllocationTypeSelectorProps {
  goalIndex: number;
}

const ALLOCATION_TYPE_CONFIG = {
  [SIMPLE]: {
    icon: Calculator,
    label: 'Simple',
    description: 'Fixed reward per unit',
  },
  [BRACKET]: {
    icon: BarChart3,
    label: 'Bracket',
    description: 'Tiered rewards by range',
  },
  [GROWTH]: {
    icon: TrendingUp,
    label: 'Growth',
    description: 'Progressive rewards',
  },
  [RANKING]: {
    icon: Trophy,
    label: 'Ranking',
    description: 'Competition-based rewards',
  },
};

export const AllocationTypeSelector: React.FC<AllocationTypeSelectorProps> = ({ goalIndex }) => {
  const {
    activeTypeForm,
    allocationValidated,
    allocationValue,
    acceptedTypes,
    currentGoal,
    programType,
    measurementType,
    measurementName,
    handleTypeFormSelection,
    handleAllocationValidation,
    handleSimpleAllocationChange,
    handleBracketChange,
  } = useAllocationType(goalIndex);

  const isValidated = allocationValidated;

  // Check if form has valid values for validation
  const canValidate = activeTypeForm !== null && (
    (activeTypeForm === SIMPLE && allocationValue.value !== '') ||
    (activeTypeForm === BRACKET && currentGoal.brackets?.length > 0) ||
    (activeTypeForm === GROWTH) ||
    (activeTypeForm === RANKING)
  );

  return (
    <div className="space-y-4">
      {/* Section Header with Edit/Validate */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">Allocation Type</h4>
          <p className="text-xs text-muted-foreground">
            Choose how rewards will be calculated and distributed
          </p>
        </div>
        {activeTypeForm !== null && (
          <Button
            variant={isValidated ? 'outline' : 'default'}
            size="sm"
            onClick={handleAllocationValidation}
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

      {/* No Available Types Message */}
      {acceptedTypes.length === 0 && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md p-3">
          No compatible allocation types available for this goal configuration.
        </div>
      )}

      {/* Allocation Type Tabs */}
      {acceptedTypes.length > 0 && (
        <div className={cn(isValidated && 'opacity-60 pointer-events-none')}>
          <Tabs
            value={activeTypeForm || undefined}
            onValueChange={(value) => handleTypeFormSelection(value)}
          >
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${acceptedTypes.length}, 1fr)` }}>
              {acceptedTypes.map((type) => {
                const config = ALLOCATION_TYPE_CONFIG[type];
                if (!config) return null;

                const Icon = config.icon;

                return (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Simple Allocation Form */}
            {acceptedTypes.includes(SIMPLE) && (
              <TabsContent value={SIMPLE} className="mt-4">
                <SimpleAllocationForm
                  goalIndex={goalIndex}
                  measurementType={measurementType}
                  measurementName={measurementName}
                  programType={programType}
                  value={allocationValue}
                  onChange={handleSimpleAllocationChange}
                  disabled={isValidated}
                />
              </TabsContent>
            )}

            {/* Bracket Allocation Form */}
            {acceptedTypes.includes(BRACKET) && (
              <TabsContent value={BRACKET} className="mt-4">
                <BracketAllocationForm
                  goalIndex={goalIndex}
                  measurementType={measurementType}
                  measurementName={measurementName}
                  programType={programType}
                  brackets={currentGoal.brackets || []}
                  onChange={handleBracketChange}
                  disabled={isValidated}
                />
              </TabsContent>
            )}

            {/* Growth Allocation Form */}
            {acceptedTypes.includes(GROWTH) && (
              <TabsContent value={GROWTH} className="mt-4">
                <GrowthAllocationForm
                  goalIndex={goalIndex}
                  measurementType={measurementType}
                  measurementName={measurementName}
                  programType={programType}
                  value={allocationValue}
                  onChange={handleSimpleAllocationChange}
                  disabled={isValidated}
                />
              </TabsContent>
            )}

            {/* Ranking Allocation Form */}
            {acceptedTypes.includes(RANKING) && (
              <TabsContent value={RANKING} className="mt-4">
                <RankingAllocationForm
                  goalIndex={goalIndex}
                  measurementType={measurementType}
                  measurementName={measurementName}
                  programType={programType}
                  brackets={currentGoal.brackets || []}
                  onChange={handleBracketChange}
                  disabled={isValidated}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}

      {/* Type Info */}
      {activeTypeForm && ALLOCATION_TYPE_CONFIG[activeTypeForm] && (
        <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
          <strong>{ALLOCATION_TYPE_CONFIG[activeTypeForm].label}:</strong>{' '}
          {ALLOCATION_TYPE_CONFIG[activeTypeForm].description}
        </div>
      )}
    </div>
  );
};

export default AllocationTypeSelector;
