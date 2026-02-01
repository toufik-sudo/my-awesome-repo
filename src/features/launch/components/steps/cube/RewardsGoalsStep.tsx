// -----------------------------------------------------------------------------
// RewardsGoalsStep Component
// Main step component for Rewards & Goals configuration
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Settings, Award } from 'lucide-react';
import { GoalsList } from './GoalsList';
import { FrequencySelector } from './FrequencySelector';
import { SpendTypeSelector } from './SpendTypeSelector';
import { ValidityPointsSelector } from './ValidityPointsSelector';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { useGoals } from '@/features/launch/hooks/cube/useGoals';
import { usePointsConfig } from '@/features/launch/hooks/cube/usePointsConfig';

interface RewardsGoalsStepProps {
  className?: string;
}

export const RewardsGoalsStep: React.FC<RewardsGoalsStepProps> = ({ className }) => {
  const { currentSubstep } = useLaunchWizard();
  const { isAllGoalsValidated, totalGoals } = useGoals();
  const {
    frequencyAllocation,
    spendType,
    validityPoints,
    autoRollover,
    setFrequencyAllocation,
    setSpendType,
    setValidityPoints,
    setAutoRollover,
  } = usePointsConfig();

  // Determine which substep to show
  // Substep 1: Goals configuration
  // Substep 2: Points configuration (frequency, spend type, validity)
  // Substep 3: Summary/Preview

  return (
    <div className={className}>
      {currentSubstep === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <FormattedMessage 
                id="launch.rewards.title" 
                defaultMessage="Define Your Program Goals" 
              />
            </h2>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="launch.rewards.description" 
                defaultMessage="Create goals to reward participants based on their performance. Each goal can have different measurement types and allocation methods." 
              />
            </p>
          </div>

          <GoalsList />
        </div>
      )}

      {currentSubstep === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Settings className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <FormattedMessage 
                id="launch.rewards.pointsConfig.title" 
                defaultMessage="Points Configuration" 
              />
            </h2>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="launch.rewards.pointsConfig.description" 
                defaultMessage="Configure how points are allocated and when they can be spent." 
              />
            </p>
          </div>

          <div className="grid gap-6 max-w-3xl mx-auto">
            <FrequencySelector 
              value={frequencyAllocation}
              onChange={setFrequencyAllocation}
            />
            <SpendTypeSelector 
              value={spendType}
              onChange={setSpendType}
            />
            <ValidityPointsSelector 
              value={validityPoints}
              onChange={setValidityPoints}
              autoRollover={autoRollover}
              onRolloverChange={setAutoRollover}
            />
          </div>
        </div>
      )}

      {currentSubstep === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Award className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              <FormattedMessage 
                id="launch.rewards.summary.title" 
                defaultMessage="Rewards Summary" 
              />
            </h2>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="launch.rewards.summary.description" 
                defaultMessage="Review your rewards configuration before proceeding." 
              />
            </p>
          </div>

          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <FormattedMessage id="launch.rewards.goalsOverview" defaultMessage="Goals Overview" />
              </CardTitle>
              <CardDescription>
                <FormattedMessage 
                  id="launch.rewards.totalGoals" 
                  defaultMessage="{count} goal(s) configured"
                  values={{ count: totalGoals }}
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Summary content */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`ml-2 font-medium ${isAllGoalsValidated ? 'text-green-600' : 'text-amber-600'}`}>
                      {isAllGoalsValidated ? 'All goals validated' : 'Configuration incomplete'}
                    </span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Goals:</span>
                    <span className="ml-2 font-medium">{totalGoals} / 3</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="ml-2 font-medium capitalize">{frequencyAllocation}</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Reward Type:</span>
                    <span className="ml-2 font-medium capitalize">{spendType}</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                    <span className="text-muted-foreground">Validity:</span>
                    <span className="ml-2 font-medium">{validityPoints.label}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RewardsGoalsStep;
