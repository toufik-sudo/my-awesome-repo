// -----------------------------------------------------------------------------
// Full Cube Page
// Migrated from old_app/src/components/pages/FullCubePage.tsx
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Target, Check, X, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Goal {
  id: number;
  name: string;
  target: string;
  validated: boolean;
}

const FullCubePage: React.FC = () => {
  const { formatMessage } = useIntl();
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, name: 'Sales Target', target: '1000', validated: true },
    { id: 2, name: 'Customer Satisfaction', target: '95%', validated: false },
  ]);

  const addGoal = () => {
    const newGoal: Goal = {
      id: goals.length + 1,
      name: `Goal ${goals.length + 1}`,
      target: '',
      validated: false,
    };
    setGoals([...goals, newGoal]);
    setSelectedGoal(goals.length);
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    if (selectedGoal >= goals.length - 1) {
      setSelectedGoal(Math.max(0, selectedGoal - 1));
    }
  };

  const updateGoal = (id: number, field: keyof Goal, value: string | boolean) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          {formatMessage({ id: 'launchProgram.title', defaultMessage: 'Launch Program' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'launchProgram.cube.subtitle', defaultMessage: 'Configure your reward cube' })}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Goal Selection List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              {formatMessage({ id: 'cube.defineGoal', defaultMessage: 'Define Goals' })}
            </CardTitle>
            <CardDescription>
              {formatMessage({ id: 'cube.selectGoal', defaultMessage: 'Select a goal to configure' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {goals.map((goal, index) => (
              <div
                key={goal.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedGoal === index 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setSelectedGoal(index)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{goal.name}</span>
                  {goal.validated && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      {formatMessage({ id: 'common.validated', defaultMessage: 'Validated' })}
                    </Badge>
                  )}
                </div>
                {goals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGoal(goal.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={addGoal}
            >
              <Plus className="h-4 w-4 mr-2" />
              {formatMessage({ id: 'cube.addGoal', defaultMessage: 'Add Goal' })}
            </Button>
          </CardContent>
        </Card>

        {/* Goal Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {goals[selectedGoal]?.name || formatMessage({ id: 'cube.goalConfiguration', defaultMessage: 'Goal Configuration' })}
            </CardTitle>
            <CardDescription>
              {formatMessage({ id: 'cube.configureGoal', defaultMessage: 'Configure the selected goal parameters' })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals[selectedGoal] && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="goal-name">
                    {formatMessage({ id: 'cube.goalName', defaultMessage: 'Goal Name' })}
                  </Label>
                  <Input
                    id="goal-name"
                    value={goals[selectedGoal].name}
                    onChange={(e) => updateGoal(goals[selectedGoal].id, 'name', e.target.value)}
                    placeholder={formatMessage({ id: 'cube.goalNamePlaceholder', defaultMessage: 'Enter goal name' })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-target">
                    {formatMessage({ id: 'cube.goalTarget', defaultMessage: 'Target Value' })}
                  </Label>
                  <Input
                    id="goal-target"
                    value={goals[selectedGoal].target}
                    onChange={(e) => updateGoal(goals[selectedGoal].id, 'target', e.target.value)}
                    placeholder={formatMessage({ id: 'cube.goalTargetPlaceholder', defaultMessage: 'Enter target value' })}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => updateGoal(goals[selectedGoal].id, 'validated', true)}
                    disabled={!goals[selectedGoal].name || !goals[selectedGoal].target}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {formatMessage({ id: 'cube.validateGoal', defaultMessage: 'Validate Goal' })}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FullCubePage;
