// -----------------------------------------------------------------------------
// useDashboardNumber Hook
// Migrated from old_app/src/hooks/wall/useDashboardNumber.ts
// -----------------------------------------------------------------------------

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useWallSelection } from './useWallSelection';
import { isAnyKindOfAdmin, isAnyKindOfManager, isUserBeneficiary } from '@/services/security/accessServices';
import { useUserRole } from '@/hooks/user/useUserRole';
import { usersApi } from '@/api/UsersApi';
import { getUserUuid } from '@/services/UserDataServices';

export interface IDashboardPoints {
  platformPoints: number;
  programPoints: number;
  isLoading: boolean;
}

/**
 * Hook used to get and set current user points in store and state.
 */
const useDashboardNumber = () => {
  const dispatch = useDispatch();
  const { selectedProgramId, selectedPlatform } = useWallSelection();
  const userRole = useUserRole();
  
  const [points, setPoints] = useState<IDashboardPoints>({
    platformPoints: 0,
    programPoints: 0,
    isLoading: true
  });

  const isBeneficiary = isUserBeneficiary(selectedPlatform.role);
  const isAdmin = isAnyKindOfAdmin(selectedPlatform.role);
  const isManager = isAnyKindOfManager(selectedPlatform.role);

  const fetchPoints = useCallback(async () => {
    setPoints(prev => ({ ...prev, isLoading: true }));
    
    try {
      const userId = getUserUuid();
      if (userId) {
        const totalPoints = await usersApi.getBeneficiaryPoints(userId);
        setPoints({
          platformPoints: totalPoints,
          programPoints: selectedProgramId ? totalPoints : 0,
          isLoading: false
        });
      } else {
        setPoints({
          platformPoints: 0,
          programPoints: 0,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard points:', error);
      setPoints(prev => ({ ...prev, isLoading: false }));
    }
  }, [selectedPlatform.id, selectedProgramId]);

  useEffect(() => {
    if (isBeneficiary) {
      fetchPoints();
    }
  }, [isBeneficiary, fetchPoints]);

  return {
    ...points,
    isBeneficiary,
    isAdmin,
    isManager,
    selectedProgramId,
    platformId: selectedPlatform.id,
    refetchPoints: fetchPoints
  };
};

export default useDashboardNumber;
