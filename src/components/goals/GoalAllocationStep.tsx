// -----------------------------------------------------------------------------
// Goal Allocation Step Component
// Main component for configuring 1-3 goals with products, measurements, allocations
// -----------------------------------------------------------------------------

import React from 'react';
import { Plus, Target, AlertCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Product, MeasurementType, AllocationType } from '@/types/goals';
import { useGoalAllocation } from '@/hooks/goals/useGoalAllocation';
import { MAX_GOALS, MIN_GOALS } from '@/constants/goals';
import { GoalCard } from './GoalCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface GoalAllocationStepProps {
  configuredProducts?: Product[];
  onComplete?: (goals: ReturnType<typeof useGoalAllocation>['goals']) => void;
  onBack?: () => void;
  className?: string;
}

export const GoalAllocationStep: React.FC<GoalAllocationStepProps> = ({
  configuredProducts = [],
  onComplete,
  onBack,
  className
}) => {
  const {
    goals,
    products,
    addGoal,
    removeGoal,
    updateGoal,
    getDisabledMeasurementTypes,
    canAddGoal,
    canRemoveGoal,
    isGoalComplete,
    areAllGoalsComplete
  } = useGoalAllocation({ configuredProducts });

  // Calculate progress
  const completedGoals = goals.filter((_, i) => isGoalComplete(i)).length;
  const progressPercent = (completedGoals / goals.length) * 100;

  // Handle product selection for a goal
  const handleProductSelect = (index: number) => (productId: string) => {
    updateGoal(index, { productId });
  };

  // Handle measurement type selection for a goal
  const handleMeasurementSelect = (index: number) => (type: MeasurementType) => {
    updateGoal(index, { measurementType: type });
  };

  // Handle allocation type selection for a goal
  const handleAllocationSelect = (index: number) => (type: AllocationType) => {
    updateGoal(index, { 
      allocationType: type,
      validated: {
        product: true,
        measurementType: true,
        allocationType: true
      }
    });
  };

  // Handle remove goal
  const handleRemoveGoal = (index: number) => () => {
    removeGoal(index);
  };

  // Handle submit
  const handleSubmit = () => {
    if (areAllGoalsComplete) {
      onComplete?.(goals);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Configuration des objectifs
            </h2>
            <p className="text-sm text-muted-foreground">
              Créez entre {MIN_GOALS} et {MAX_GOALS} objectifs pour votre programme
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progression: {completedGoals}/{goals.length} objectif{goals.length > 1 ? 's' : ''} complété{completedGoals > 1 ? 's' : ''}
          </span>
          <span className="font-medium text-primary">{Math.round(progressPercent)}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Contrainte de sélection</AlertTitle>
        <AlertDescription>
          Un même produit ne peut avoir qu'un seul type de mesure par objectif. 
          Les combinaisons déjà utilisées seront grisées dans les autres objectifs.
        </AlertDescription>
      </Alert>

      {/* Goals List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {goals.map((goal, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <GoalCard
                goal={goal}
                goalIndex={index}
                products={products}
                disabledMeasurementTypes={getDisabledMeasurementTypes(index, goal.productId)}
                onProductSelect={handleProductSelect(index)}
                onMeasurementSelect={handleMeasurementSelect(index)}
                onAllocationSelect={handleAllocationSelect(index)}
                onRemove={handleRemoveGoal(index)}
                canRemove={canRemoveGoal}
                isComplete={isGoalComplete(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Goal Button */}
      {canAddGoal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            onClick={addGoal}
            className="w-full border-dashed border-2 h-14"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un objectif ({goals.length}/{MAX_GOALS})
          </Button>
        </motion.div>
      )}

      {/* Goal limit reached message */}
      {goals.length >= MAX_GOALS && (
        <p className="text-sm text-muted-foreground text-center">
          Nombre maximum d'objectifs atteint ({MAX_GOALS})
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!areAllGoalsComplete}
          className="ml-auto"
        >
          Continuer
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default GoalAllocationStep;
