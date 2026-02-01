// -----------------------------------------------------------------------------
// useRewardsConfig Hook
// Manages rewards configuration state
// Migrated from old_app hooks
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useLaunchWizard } from './useLaunchWizard';
import {
  CUBE,
  CORRELATED_GOALS,
  FREQUENCY_TYPE
} from '@/constants/wall/launch';

const CORRELATED = 'correlated';

interface RewardsConfig {
  allocationType: 'fixed' | 'variable' | 'tiered';
  frequency: string;
  spendType: 'points' | 'currency';
  minAllocation: number;
  maxAllocation: number;
  fixedValue: number;
  rewardManagers: boolean;
  managerPercentage: number;
  validityPeriod: string;
  autoRollover: boolean;
  correlatedGoals: boolean;
}

export const useRewardsConfig = () => {
  const { updateStepData, launchData } = useLaunchWizard();
  
  const cube = launchData[CUBE] as Partial<RewardsConfig> | undefined;

  const [config, setConfig] = useState<RewardsConfig>(() => ({
    allocationType: (launchData.allocationType as RewardsConfig['allocationType']) || 'fixed',
    frequency: cube?.frequency || (launchData.frequencyAllocation as string) || FREQUENCY_TYPE.MONTHLY,
    spendType: cube?.spendType || (launchData.spendType as RewardsConfig['spendType']) || 'points',
    minAllocation: (launchData.minAllocation as number) || 0,
    maxAllocation: (launchData.maxAllocation as number) || 1000,
    fixedValue: (launchData.fixedValue as number) || 500,
    rewardManagers: cube?.rewardManagers || (launchData.rewardManagers as boolean) || false,
    managerPercentage: cube?.managerPercentage || (launchData.managerPercentage as number) || 10,
    validityPeriod: (launchData.validityPeriod as string) || '1y',
    autoRollover: (launchData.autoRollover as boolean) || false,
    correlatedGoals: (launchData[CORRELATED_GOALS] as boolean) || false,
  }));

  // Sync to store
  useEffect(() => {
    updateStepData('allocationType', config.allocationType);
    updateStepData('frequencyAllocation', config.frequency);
    updateStepData('spendType', config.spendType);
    updateStepData('minAllocation', config.minAllocation);
    updateStepData('maxAllocation', config.maxAllocation);
    updateStepData('fixedValue', config.fixedValue);
    updateStepData('rewardManagers', config.rewardManagers);
    updateStepData('managerPercentage', config.managerPercentage);
    updateStepData('validityPeriod', config.validityPeriod);
    updateStepData('autoRollover', config.autoRollover);
    updateStepData(CORRELATED_GOALS, config.correlatedGoals);

    // Update cube object
    updateStepData(CUBE, {
      ...cube,
      frequencyAllocation: config.frequency,
      spendType: config.spendType,
      rewardPeopleManagers: config.rewardManagers,
      rewardPeopleManagerAccepted: config.rewardManagers,
      [CORRELATED]: config.correlatedGoals,
      validityPoints: { value: config.validityPeriod, label: config.validityPeriod },
    });
  }, [config]);

  const updateConfig = useCallback(<K extends keyof RewardsConfig>(key: K, value: RewardsConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const setCorrelatedGoals = useCallback((correlated: boolean) => {
    setConfig(prev => ({ ...prev, correlatedGoals: correlated }));
  }, []);

  const setRewardManagers = useCallback((enabled: boolean, percentage?: number) => {
    setConfig(prev => ({ 
      ...prev, 
      rewardManagers: enabled,
      managerPercentage: percentage !== undefined ? percentage : prev.managerPercentage
    }));
  }, []);

  // Validation
  const isValid = config.allocationType !== undefined && config.frequency !== undefined;

  return {
    config,
    updateConfig,
    setCorrelatedGoals,
    setRewardManagers,
    isValid
  };
};

export default useRewardsConfig;
