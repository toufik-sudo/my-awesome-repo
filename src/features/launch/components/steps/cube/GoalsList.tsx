// -----------------------------------------------------------------------------
// GoalsList Component
// Main goals management component for Rewards & Goals step
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Target, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useGoals } from '@/features/launch/hooks/cube/useGoals';
import { GoalCard } from './GoalCard';
import { cn } from '@/lib/utils';

interface GoalsListProps {
  className?: string;
}

export const GoalsList: React.FC<GoalsListProps> = ({ className }) => {
  const {
    goals,
    selectedGoalIndex,
    canAddGoal,
    totalGoals,
    maxGoals,
    isAllGoalsValidated,
    addGoal,
    removeGoal,
    selectGoal,
    isGoalComplete,
    getGoalProgress,
  } = useGoals();

  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const handleAddGoal = async () => {
    setIsAddingGoal(true);
    try {
      await addGoal();
    } finally {
      setIsAddingGoal(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with goal count */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Program Goals</h3>
          <p className="text-sm text-muted-foreground">
            Configure up to {maxGoals} goals for your program
          </p>
        </div>
        <Badge variant={isAllGoalsValidated ? 'default' : 'secondary'}>
          {totalGoals} / {maxGoals} Goals
        </Badge>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const isSelected = selectedGoalIndex === index;
          const isComplete = isGoalComplete(index);
          const progress = getGoalProgress(index);

          return (
            <Collapsible
              key={index}
              open={isSelected}
              onOpenChange={() => selectGoal(index)}
            >
              <Card className={cn(
                'transition-all duration-200',
                isSelected && 'ring-2 ring-primary',
                isComplete && 'border-green-500/50'
              )}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                          isComplete
                            ? 'bg-green-500 text-white'
                            : 'bg-primary/10 text-primary'
                        )}>
                          {isComplete ? <Check className="h-4 w-4" /> : index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            Goal {index + 1}
                            {goal.measurementName && (
                              <span className="ml-2 text-muted-foreground font-normal">
                                - {goal.measurementName}
                              </span>
                            )}
                          </CardTitle>
                          {!isComplete && progress > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={progress} className="h-1 w-20" />
                              <span className="text-xs text-muted-foreground">{progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isComplete && (
                          <Badge variant="outline" className="text-green-600 border-green-500/50">
                            Complete
                          </Badge>
                        )}
                        {isSelected ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <GoalCard goalIndex={index} />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          {totalGoals > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeGoal}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove Last Goal
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Show status when goal not complete */}
          {!isAllGoalsValidated && totalGoals < maxGoals && (
            <span className="text-xs text-muted-foreground">
              Complete current goal to add another
            </span>
          )}
          
          {/* Add Goal Button - only enabled when last goal is validated */}
          {totalGoals < maxGoals && (
            <Button
              onClick={handleAddGoal}
              disabled={isAddingGoal || !canAddGoal}
              size="sm"
              variant={canAddGoal ? 'default' : 'outline'}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isAddingGoal ? 'Adding...' : `Add Goal (${totalGoals}/${maxGoals})`}
            </Button>
          )}
        </div>
      </div>

      {/* Validation Status */}
      {isAllGoalsValidated && (
        <div className="rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-4">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="h-5 w-5" />
            <span className="font-medium">All goals are configured!</span>
          </div>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
            {totalGoals < maxGoals 
              ? `You can proceed to the next step or add more goals (max ${maxGoals}).`
              : 'Maximum goals reached. You can proceed to the next step.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalsList;
