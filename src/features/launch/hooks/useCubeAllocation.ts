// -----------------------------------------------------------------------------
// useCubeAllocation Hook
// Manages cube/goal allocation state and logic
// Migrated from old_app hooks
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLaunchWizard } from './useLaunchWizard';
import {
  SIMPLE,
  BRACKET,
  GROWTH,
  RANKING,
  AVAILABLE,
  DISABLED,
  MAXIMUM_GOALS_NUMBER,
  BASE_GOAL_VALUE,
  BASE_BRACKET_VALUE,
  MEASUREMENT_TYPES,
  FREQUENCY_TYPE,
  CUBE
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
  growth?: {
    baselineValue: string;
    growthPercentage: string;
    pointsPerPercent: string;
    baselinePeriod: string;
  };
  ranking?: {
    positions: Array<{ position: number; points: string }>;
    maxWinners: string;
  };
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

export const useCubeAllocation = () => {
  const { updateStepData, launchData } = useLaunchWizard();

  const [config, setConfig] = useState<CubeConfig>(() => {
    const existingCube = launchData[CUBE] as Partial<CubeConfig> | undefined;
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

  // Sync to store
  useEffect(() => {
    updateStepData(CUBE, config);
  }, [config]);

  // Goal management
  const addGoal = useCallback(() => {
    if (config.goals.length >= MAXIMUM_GOALS_NUMBER) return;
    const newGoal = createEmptyGoal();
    setConfig(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
    return newGoal.id;
  }, [config.goals.length]);

  const removeGoal = useCallback((goalId: string) => {
    if (config.goals.length <= 1) return;
    setConfig(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
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
      min: '',
      max: '',
      value: '',
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

  // Config updates
  const updateConfig = useCallback(<K extends keyof CubeConfig>(key: K, value: CubeConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  // Validation
  const isGoalValid = useCallback((goal: Goal): boolean => {
    if (!goal.measurementType || !goal.allocationCategory) return false;
    
    if (goal.allocationCategory === SIMPLE) {
      return !!goal.main.value;
    }
    
    if (goal.allocationCategory === BRACKET) {
      return goal.brackets.length > 0 && goal.brackets.every(b => 
        b.status === DISABLED || (b.min && b.max && b.value)
      );
    }
    
    if (goal.allocationCategory === GROWTH) {
      return !!(goal.growth?.baselineValue && goal.growth?.pointsPerPercent);
    }
    
    if (goal.allocationCategory === RANKING) {
      return (goal.ranking?.positions?.length || 0) > 0;
    }
    
    return true;
  }, []);

  const allGoalsValid = config.goals.every(isGoalValid);
  const canAddMoreGoals = config.goals.length < MAXIMUM_GOALS_NUMBER && allGoalsValid;

  return {
    config,
    goals: config.goals,
    addGoal,
    removeGoal,
    updateGoal,
    addBracket,
    updateBracket,
    removeBracket,
    updateConfig,
    isGoalValid,
    allGoalsValid,
    canAddMoreGoals,
    maxGoals: MAXIMUM_GOALS_NUMBER
  };
};

export default useCubeAllocation;
