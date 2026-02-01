// -----------------------------------------------------------------------------
// usePointsConfig Hook
// Manages points configuration state for cube
// -----------------------------------------------------------------------------

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import { CUBE, FREQUENCY_TYPE } from '@/constants/wall/launch';
import type { Cube } from '@/services/CubeServices';

interface UsePointsConfigReturn {
  frequencyAllocation: string;
  spendType: string;
  validityPoints: { value: string; label: string };
  rewardManagers: boolean;
  managerPercentage: number;
  autoRollover: boolean;
  setFrequencyAllocation: (value: string) => void;
  setSpendType: (value: string) => void;
  setValidityPoints: (value: { value: string; label: string }) => void;
  setRewardManagers: (enabled: boolean, percentage?: number) => void;
  setAutoRollover: (enabled: boolean) => void;
}

export const usePointsConfig = (): UsePointsConfigReturn => {
  const dispatch = useDispatch();

  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  const cube = launchData.cube as Cube | undefined;

  const frequencyAllocation = cube?.frequencyAllocation || FREQUENCY_TYPE.MONTHLY;
  const spendType = cube?.spendType || 'points';
  const validityPoints = cube?.validityPoints || { value: '1y', label: '1 Year' };
  const rewardManagers = cube?.rewardPeopleManagerAccepted || false;
  const managerPercentage = cube?.rewardPeopleManagers || 10;
  const autoRollover = (launchData.autoRollover as boolean) || false;

  const updateCube = useCallback(
    (updates: Partial<Cube>) => {
      dispatch(setLaunchDataStep({
        key: CUBE,
        value: { ...cube, ...updates },
      }));
    },
    [cube, dispatch]
  );

  const setFrequencyAllocation = useCallback(
    (value: string) => {
      updateCube({ frequencyAllocation: value });
    },
    [updateCube]
  );

  const setSpendType = useCallback(
    (value: string) => {
      updateCube({ spendType: value });
    },
    [updateCube]
  );

  const setValidityPoints = useCallback(
    (value: { value: string; label: string }) => {
      updateCube({ validityPoints: value });
    },
    [updateCube]
  );

  const setRewardManagers = useCallback(
    (enabled: boolean, percentage?: number) => {
      updateCube({
        rewardPeopleManagerAccepted: enabled,
        rewardPeopleManagers: percentage !== undefined ? percentage : managerPercentage,
      });
    },
    [updateCube, managerPercentage]
  );

  const setAutoRollover = useCallback(
    (enabled: boolean) => {
      dispatch(setLaunchDataStep({ key: 'autoRollover', value: enabled }));
    },
    [dispatch]
  );

  return {
    frequencyAllocation,
    spendType,
    validityPoints,
    rewardManagers,
    managerPercentage,
    autoRollover,
    setFrequencyAllocation,
    setSpendType,
    setValidityPoints,
    setRewardManagers,
    setAutoRollover,
  };
};

export default usePointsConfig;
