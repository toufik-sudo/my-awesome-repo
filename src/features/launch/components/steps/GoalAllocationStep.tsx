// -----------------------------------------------------------------------------
// GoalAllocationStep Component (Cube)
// Advanced goal allocation configuration with correlated goals
// -----------------------------------------------------------------------------

import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Target,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Layers,
  Award,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLaunchWizard } from '../../hooks/useLaunchWizard';
import {
  SIMPLE,
  BRACKET,
  GROWTH,
  RANKING,
  VOLUME,
  UNITS,
  AVAILABLE,
  DISABLED,
  MAXIMUM_GOALS_NUMBER,
  BASE_GOAL_VALUE,
  BASE_BRACKET_VALUE,
  MEASUREMENT_TYPES,
  FREQUENCY_TYPE,
  CUBE_SECTIONS
} from '@/constants/wall/launch';

// Types
interface GoalBracket {
  min: string;
  max: string;
  value: string;
  status: typeof AVAILABLE | typeof DISABLED;
  errors: { min: string; max: string; equals: string };
}

interface Goal {
  id: string;
  measurementType: number | null;
  measurementName: string | null;
  allocationType: string | null;
  allocationCategory: string | null;
  specificProducts: boolean;
  productIds: string[];
  main: { min: string; max: string; value: string };
  brackets: GoalBracket[];
  validated: {
    measurementType: boolean;
    allocationType: boolean;
    main: boolean;
  };
}

interface CubeConfig {
  goals: Goal[];
  correlatedGoals: boolean;
  frequencyAllocation: string;
  spendType: string;
  rewardPeopleManagers: boolean;
  managerPercentage: number;
  validityPoints: { value: string; label: string };
}

const MEASUREMENT_TYPE_OPTIONS = [
  { value: MEASUREMENT_TYPES.QUANTITY, label: 'Quantity', description: 'Number of items sold/actions' },
  { value: MEASUREMENT_TYPES.VOLUME, label: 'Revenue/Volume', description: 'Total monetary value' },
  { value: MEASUREMENT_TYPES.ACTION, label: 'Actions', description: 'Specific actions completed' },
];

const ALLOCATION_CATEGORY_OPTIONS = [
  { 
    value: SIMPLE, 
    label: 'Simple', 
    description: 'Fixed points per unit',
    icon: Target 
  },
  { 
    value: BRACKET, 
    label: 'Bracket', 
    description: 'Tiered reward levels',
    icon: Layers 
  },
  { 
    value: GROWTH, 
    label: 'Growth', 
    description: 'Growth-based rewards',
    icon: TrendingUp 
  },
  { 
    value: RANKING, 
    label: 'Ranking', 
    description: 'Competition-based',
    icon: Award 
  },
];

const FREQUENCY_OPTIONS = [
  { value: FREQUENCY_TYPE.INSTANTANEOUSLY, label: 'Instantaneously' },
  { value: FREQUENCY_TYPE.WEEKLY, label: 'Weekly' },
  { value: FREQUENCY_TYPE.MONTHLY, label: 'Monthly' },
  { value: FREQUENCY_TYPE.QUARTER, label: 'Quarterly' },
];

const createEmptyGoal = (): Goal => ({
  id: `goal-${Date.now()}`,
  measurementType: null,
  measurementName: null,
  allocationType: null,
  allocationCategory: null,
  specificProducts: false,
  productIds: [],
  main: { min: '', max: '', value: '' },
  brackets: [],
  validated: {
    measurementType: false,
    allocationType: false,
    main: false
  }
});

const GoalAllocationStep: React.FC = () => {
  const { formatMessage } = useIntl();
  const { updateStepData, goToNextStep, goToPrevStep, launchData } = useLaunchWizard();
  const [firstGoalStep, setFirstGoalStep] = useState(true);
  
  const [config, setConfig] = useState<CubeConfig>(() => {
    const existingCube = launchData.cube as Partial<CubeConfig> | undefined;
    return {
      goals: existingCube?.goals || [createEmptyGoal()],
      correlatedGoals: existingCube?.correlatedGoals || false,
      frequencyAllocation: existingCube?.frequencyAllocation || FREQUENCY_TYPE.MONTHLY,
      spendType: existingCube?.spendType || 'points',
      rewardPeopleManagers: existingCube?.rewardPeopleManagers || false,
      managerPercentage: existingCube?.managerPercentage || 10,
      validityPoints: existingCube?.validityPoints || { value: '1y', label: '1 Year' },
    };
  });
  
  const [expandedGoals, setExpandedGoals] = useState<string[]>([config.goals[0]?.id || '']);
  
  // Goal management
  const addGoal = useCallback(() => {
    if (config.goals.length >= MAXIMUM_GOALS_NUMBER) return;
    
    const newGoal = createEmptyGoal();
    setConfig(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    setExpandedGoals(prev => [...prev, newGoal.id]);
  }, [config.goals.length]);
  
  const removeGoal = useCallback((goalId: string) => {
    if (config.goals.length <= 1) return;
    
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
    setExpandedGoals(prev => prev.filter(id => id !== goalId));
  }, [config.goals.length]);
  
  const updateGoal = useCallback((goalId: string, updates: Partial<Goal>) => {
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.map(g => 
        g.id === goalId ? { ...g, ...updates } : g
      )
    }));
  }, []);
  
  // Bracket management
  const addBracket = useCallback((goalId: string) => {
    const newBracket: GoalBracket = {
      ...BASE_BRACKET_VALUE,
      status: AVAILABLE,
      errors: { min: '', max: '', equals: '' }
    };
    
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.map(g => 
        g.id === goalId 
          ? { ...g, brackets: [...g.brackets, newBracket] }
          : g
      )
    }));
  }, []);
  
  const updateBracket = useCallback((goalId: string, bracketIndex: number, updates: Partial<GoalBracket>) => {
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.map(g => 
        g.id === goalId 
          ? { 
              ...g, 
              brackets: g.brackets.map((b, i) => 
                i === bracketIndex ? { ...b, ...updates } : b
              )
            }
          : g
      )
    }));
  }, []);
  
  const removeBracket = useCallback((goalId: string, bracketIndex: number) => {
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.map(g => 
        g.id === goalId 
          ? { ...g, brackets: g.brackets.filter((_, i) => i !== bracketIndex) }
          : g
      )
    }));
  }, []);
  
  // Validation
  const isGoalValid = (goal: Goal): boolean => {
    if (!goal.measurementType || !goal.allocationCategory) return false;
    
    if (goal.allocationCategory === SIMPLE) {
      return !!goal.main.value;
    }
    
    if (goal.allocationCategory === BRACKET) {
      return goal.brackets.length > 0 && goal.brackets.every(b => 
        b.status === DISABLED || (b.min && b.max && b.value)
      );
    }
    
    return true;
  };
  
  const allGoalsValid = config.goals.every(isGoalValid);
  const canAddMoreGoals = config.goals.length < MAXIMUM_GOALS_NUMBER && allGoalsValid;
  
  const handleContinue = () => {
    updateStepData('cube', config);
    goToNextStep();
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          <FormattedMessage 
            id="launch.step.cube.title" 
            defaultMessage="Goal Allocation" 
          />
        </h2>
        <p className="text-muted-foreground">
          <FormattedMessage 
            id="launch.step.cube.description" 
            defaultMessage="Configure how rewards are allocated based on performance goals" 
          />
        </p>
      </div>
      
      {/* Correlated Goals Toggle */}
      {config.goals.length > 1 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">
                  <FormattedMessage id="launch.cube.correlatedGoals" defaultMessage="Correlated Goals" />
                </Label>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage 
                    id="launch.cube.correlatedGoalsDesc" 
                    defaultMessage="Link goals together so rewards are calculated based on combined performance" 
                  />
                </p>
              </div>
              <Switch
                checked={config.correlatedGoals}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, correlatedGoals: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Goals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <FormattedMessage id="launch.cube.goals" defaultMessage="Goals" />
            <Badge variant="secondary">{config.goals.length}/{MAXIMUM_GOALS_NUMBER}</Badge>
          </h3>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addGoal}
            disabled={!canAddMoreGoals}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <FormattedMessage id="launch.cube.addGoal" defaultMessage="Add Goal" />
          </Button>
        </div>
        
        <Accordion 
          type="multiple" 
          value={expandedGoals}
          onValueChange={setExpandedGoals}
          className="space-y-4"
        >
          {config.goals.map((goal, goalIndex) => (
            <AccordionItem 
              key={goal.id} 
              value={goal.id}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium",
                    isGoalValid(goal) 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {isGoalValid(goal) ? <Check className="h-4 w-4" /> : goalIndex + 1}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      Goal {goalIndex + 1}
                      {goal.measurementType && (
                        <span className="font-normal text-muted-foreground ml-2">
                          - {MEASUREMENT_TYPE_OPTIONS.find(o => o.value === goal.measurementType)?.label}
                        </span>
                      )}
                    </div>
                    {goal.allocationCategory && (
                      <div className="text-sm text-muted-foreground">
                        {ALLOCATION_CATEGORY_OPTIONS.find(o => o.value === goal.allocationCategory)?.label} allocation
                      </div>
                    )}
                  </div>
                </div>
                
                {config.goals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGoal(goal.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </AccordionTrigger>
              
                {/* Measurement Type */}
              <AccordionContent className="px-4 pb-4 space-y-6">
                <div className="space-y-3">
                  <Label className="text-base">
                    <FormattedMessage id="launch.cube.measurementType" defaultMessage="What are you measuring?" />
                  </Label>
                  <RadioGroup
                    value={goal.measurementType?.toString() || ''}
                    onValueChange={(value) => updateGoal(goal.id, { 
                      measurementType: parseInt(value),
                      validated: { ...goal.validated, measurementType: true }
                    })}
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    {MEASUREMENT_TYPE_OPTIONS.map(option => (
                      <Label
                        key={option.value}
                        className={cn(
                          'flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all',
                          goal.measurementType === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={option.value.toString()} className="sr-only" />
                        <span className="font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                
                {/* Allocation Category */}
                <div className="space-y-3">
                  <Label className="text-base">
                    <FormattedMessage id="launch.cube.allocationType" defaultMessage="How should rewards be calculated?" />
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ALLOCATION_CATEGORY_OPTIONS.map(option => {
                      const Icon = option.icon;
                      return (
                        <div
                          key={option.value}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all text-center',
                            goal.allocationCategory === option.value 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted hover:border-primary/50'
                          )}
                          onClick={() => updateGoal(goal.id, { 
                            allocationCategory: option.value,
                            brackets: option.value === BRACKET ? [{ ...BASE_BRACKET_VALUE, status: AVAILABLE, errors: { min: '', max: '', equals: '' } }] : []
                          })}
                        >
                          <Icon className="h-6 w-6 text-primary" />
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Simple Allocation */}
                {goal.allocationCategory === SIMPLE && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        <FormattedMessage id="launch.cube.simpleAllocation" defaultMessage="Simple Allocation" />
                      </CardTitle>
                      <CardDescription>
                        <FormattedMessage id="launch.cube.simpleAllocationDesc" defaultMessage="Set points earned per unit" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Points per unit</Label>
                        <Input
                          type="number"
                          value={goal.main.value}
                          onChange={(e) => updateGoal(goal.id, { 
                            main: { ...goal.main, value: e.target.value }
                          })}
                          placeholder="e.g., 100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum (optional)</Label>
                        <Input
                          type="number"
                          value={goal.main.min}
                          onChange={(e) => updateGoal(goal.id, { 
                            main: { ...goal.main, min: e.target.value }
                          })}
                          placeholder="Min threshold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum (optional)</Label>
                        <Input
                          type="number"
                          value={goal.main.max}
                          onChange={(e) => updateGoal(goal.id, { 
                            main: { ...goal.main, max: e.target.value }
                          })}
                          placeholder="Max cap"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Bracket Allocation */}
                {goal.allocationCategory === BRACKET && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <FormattedMessage id="launch.cube.bracketAllocation" defaultMessage="Bracket Allocation" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addBracket(goal.id)}
                          className="gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add Tier
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        <FormattedMessage id="launch.cube.bracketAllocationDesc" defaultMessage="Define reward tiers based on performance ranges" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {goal.brackets.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No tiers defined. Add a tier to get started.</p>
                        </div>
                      ) : (
                        goal.brackets.map((bracket, bracketIndex) => (
                          <div 
                            key={bracketIndex}
                            className="grid grid-cols-[1fr,1fr,1fr,auto] gap-3 items-end p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="space-y-1">
                              <Label className="text-xs">From</Label>
                              <Input
                                type="number"
                                value={bracket.min}
                                onChange={(e) => updateBracket(goal.id, bracketIndex, { min: e.target.value })}
                                placeholder="Min"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">To</Label>
                              <Input
                                type="number"
                                value={bracket.max}
                                onChange={(e) => updateBracket(goal.id, bracketIndex, { max: e.target.value })}
                                placeholder="Max"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Points</Label>
                              <Input
                                type="number"
                                value={bracket.value}
                                onChange={(e) => updateBracket(goal.id, bracketIndex, { value: e.target.value })}
                                placeholder="Reward"
                                className="h-9"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => removeBracket(goal.id, bracketIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Growth Allocation */}
                {goal.allocationCategory === GROWTH && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        <FormattedMessage id="launch.cube.growthAllocation" defaultMessage="Growth-Based Allocation" />
                      </CardTitle>
                      <CardDescription>
                        <FormattedMessage id="launch.cube.growthAllocationDesc" defaultMessage="Reward based on improvement over baseline" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Baseline Value</Label>
                        <Input
                          type="number"
                          value={goal.main.min}
                          onChange={(e) => updateGoal(goal.id, { 
                            main: { ...goal.main, min: e.target.value }
                          })}
                          placeholder="Previous period value"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Points per % Growth</Label>
                        <Input
                          type="number"
                          value={goal.main.value}
                          onChange={(e) => updateGoal(goal.id, { 
                            main: { ...goal.main, value: e.target.value }
                          })}
                          placeholder="e.g., 50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Ranking Allocation */}
                {goal.allocationCategory === RANKING && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        <FormattedMessage id="launch.cube.rankingAllocation" defaultMessage="Ranking-Based Allocation" />
                      </CardTitle>
                      <CardDescription>
                        <FormattedMessage id="launch.cube.rankingAllocationDesc" defaultMessage="Reward based on competitive ranking" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-[auto,1fr,1fr] gap-3 items-center text-sm font-medium text-muted-foreground">
                          <span>Rank</span>
                          <span>Position</span>
                          <span>Points</span>
                        </div>
                        {[1, 2, 3].map((rank) => (
                          <div key={rank} className="grid grid-cols-[auto,1fr,1fr] gap-3 items-center">
                            <Badge variant={rank === 1 ? "default" : "secondary"} className="w-8 justify-center">
                              #{rank}
                            </Badge>
                            <span className="text-sm">
                              {rank === 1 ? '1st Place' : rank === 2 ? '2nd Place' : '3rd Place'}
                            </span>
                            <Input
                              type="number"
                              placeholder={`${(4 - rank) * 1000}`}
                              className="h-9"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Specific Products Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label>
                      <FormattedMessage id="launch.cube.specificProducts" defaultMessage="Limit to Specific Products" />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      <FormattedMessage id="launch.cube.specificProductsDesc" defaultMessage="Only count sales/actions for selected products" />
                    </p>
                  </div>
                  <Switch
                    checked={goal.specificProducts}
                    onCheckedChange={(checked) => updateGoal(goal.id, { specificProducts: checked })}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      {/* Frequency Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            <FormattedMessage id="launch.cube.frequency" defaultMessage="Allocation Frequency" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={config.frequencyAllocation}
            onValueChange={(value) => setConfig(prev => ({ ...prev, frequencyAllocation: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* Validation Summary */}
      {!allGoalsValid && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">
            <FormattedMessage 
              id="launch.cube.incompleteGoals" 
              defaultMessage="Please complete all goal configurations before continuing" 
            />
          </span>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={goToPrevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <FormattedMessage id="common.back" defaultMessage="Back" />
        </Button>
        
        <Button 
          onClick={handleContinue} 
          disabled={!allGoalsValid}
          className="gap-2"
        >
          <FormattedMessage id="common.continue" defaultMessage="Continue" />
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export { GoalAllocationStep };
export default GoalAllocationStep;
