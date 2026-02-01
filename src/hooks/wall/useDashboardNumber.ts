// -----------------------------------------------------------------------------
// useDashboardNumber Hook
// Consolidated hook for dashboard points management
// -----------------------------------------------------------------------------

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

import { useWallSelection } from './useWallSelection';
import { useUserRole } from '@/hooks/auth';
import {
  isAnyKindOfAdmin,
  isAnyKindOfManager,
  isUserBeneficiary
} from '@/services/security/accessServices';
import {
  getCurrentProgramPoints,
  getPlatformTotalPoints,
} from '@/services/wall/blocks';
import { usePrevious } from '@/hooks/general/usePrevious';
import { usersApi } from '@/api/UsersApi';
import { getUserUuid } from '@/services/UserDataServices';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IDashboardPoints {
  platformPoints: number;
  programPoints: number;
  isLoading: boolean;
}

interface DashboardNumberResult {
  points: number;
  platformPoints: number;
  programPoints: number;
  isBeneficiary: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isPointsComponentLoading: boolean;
  selectedProgramId: number | undefined;
  platformId: number | undefined;
  refetchPoints: () => Promise<void>;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Hook used to get and set current user points in store and state.
 */
const useDashboardNumber = (): DashboardNumberResult => {
  const [isPointsComponentLoading, setPointComponentLoading] = useState(false);
  const [adminPointsData, setAdminPlatformPoints] = useState<any>({});
  const [adminPoints, setAdminPoints] = useState(0);
  const [pointsState, setPointsState] = useState<IDashboardPoints>({
    platformPoints: 0,
    programPoints: 0,
    isLoading: true
  });
  
  const role = useUserRole();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const wallSelection = useWallSelection();
  const selectedProgramId = wallSelection?.selectedProgramId;
  const platformId = wallSelection?.selectedPlatform?.id;
  const beneficiaryPoints = (wallSelection as any)?.beneficiaryPoints || {
    reloadKey: 0,
    platformProgramsPointsList: [],
    selectedBeneficiaryPoints: {},
    totalPlatformsPoints: []
  };

  const {
    reloadKey = 0,
    platformProgramsPointsList = [],
    selectedBeneficiaryPoints = {},
    totalPlatformsPoints = []
  } = beneficiaryPoints;

  const prevReloadKey = usePrevious(reloadKey);
  const isBeneficiary = isUserBeneficiary(role);
  const isAdmin = isAnyKindOfAdmin(role);
  const isManager = isAnyKindOfManager(role);
  const isAdminOrManager = isAdmin || isManager;

  const fetchPoints = useCallback(async () => {
    setPointComponentLoading(true);
    setPointsState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const userId = getUserUuid();
      if (!userId) {
        setPointsState({
          platformPoints: 0,
          programPoints: 0,
          isLoading: false
        });
        return;
      }
      
      // Fetch beneficiary points from API
      const totalPoints = await usersApi.getBeneficiaryPoints(userId);
      
      setPointsState({
        platformPoints: totalPoints,
        programPoints: selectedProgramId ? totalPoints : 0,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard points:', error);
      // Only show toast for unexpected errors, not auth issues
      if ((error as any)?.response?.status !== 401) {
        toast.error(formatMessage({ 
          id: 'wall.dashboard.points.error',
          defaultMessage: 'Failed to load points'
        }));
      }
      setPointsState({
        platformPoints: 0,
        programPoints: 0,
        isLoading: false
      });
    } finally {
      setPointComponentLoading(false);
    }
  }, [platformId, selectedProgramId, formatMessage]);

  // Load admin points data
  useEffect(() => {
    if (isAdminOrManager && platformId) {
      setPointComponentLoading(true);
      const timer = setTimeout(() => {
        setPointComponentLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [platformId, isAdminOrManager]);

  // Load beneficiary points
  useEffect(() => {
    if (platformProgramsPointsList.length && prevReloadKey === reloadKey) {
      return;
    }
    if (isBeneficiary) {
      fetchPoints();
    }
  }, [reloadKey, prevReloadKey, platformProgramsPointsList.length, isBeneficiary, fetchPoints]);

  // Update admin points when program changes
  useEffect(() => {
    if (!adminPointsData.totalPoints) {
      return;
    }
    setAdminPoints(adminPointsData.totalPoints);
    if (selectedProgramId && adminPointsData.platforms) {
      setAdminPoints(getCurrentProgramPoints(adminPointsData, selectedProgramId));
    }
  }, [selectedProgramId, adminPointsData]);

  const totalPoints = isAdminOrManager
    ? adminPoints
    : getPlatformTotalPoints(totalPlatformsPoints, platformId, selectedBeneficiaryPoints);

  return {
    points: totalPoints,
    platformPoints: pointsState.platformPoints,
    programPoints: pointsState.programPoints,
    isBeneficiary,
    isAdmin,
    isManager,
    isPointsComponentLoading,
    selectedProgramId,
    platformId,
    refetchPoints: fetchPoints
  };
};

export default useDashboardNumber;
