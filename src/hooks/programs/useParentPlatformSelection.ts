// -----------------------------------------------------------------------------
// useParentPlatformSelection Hook
// Migrated from old_app/src/hooks/programs/useParentPlatformSelection.ts
// Handles parent platform selection for program/platform creation flows
// -----------------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks/store/useAppDispatch';
import { PLATFORM_HIERARCHIC_TYPE } from '@/constants/platforms';
import { openModal } from '@/store/actions/modalActions';
import { setSelectedPlatform, forceActiveProgram } from '@/features/wall/store/wallReducer';
import { LAUNCH_PROGRAM_FIRST } from '@/constants/routes';
import { IPlatform, ISelectedPlatform } from '@/features/wall/types';
import { isSuperPlatform as checkSuperPlatform, isHyperPlatform as checkHyperPlatform } from '@/services/HyperProgramService';

interface PlatformSelection {
  enableOnly: PLATFORM_HIERARCHIC_TYPE[] | null;
  selectedPlatform: IPlatform | null;
}

/**
 * Hook used to handle parent platform selection on platform/program create.
 * 
 * Logic:
 * - When creating a program: admin/super admin/hyper admin must select a platform first
 * - When creating a platform: super/hyper admin must select a super platform as parent
 * - Hyper admins can create super platforms directly and invite super admins
 */
export const useParentPlatformSelection = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [platformSelection, setPlatformSelection] = useState<PlatformSelection>({
    enableOnly: null,
    selectedPlatform: null
  });

  /**
   * Set which hierarchic types are enabled for selection
   * If HYPER_PLATFORM is in the list, directly open create super platform modal
   */
  const setEnableOnly = useCallback((
    hierarchicTypes: PLATFORM_HIERARCHIC_TYPE[] | null, 
    selectedPlatform: IPlatform | null = null
  ) => {
    // If selecting hyper platform, directly open create super platform modal
    if (hierarchicTypes && hierarchicTypes.includes(PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM)) {
      dispatch(openModal('createPlatformModal', { 
        hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM 
      }));
      return;
    }

    setPlatformSelection({ enableOnly: hierarchicTypes, selectedPlatform });
  }, [dispatch]);

  /**
   * Set the selected parent platform
   */
  const setParentPlatform = useCallback((selectedPlatform: IPlatform | null) => {
    setPlatformSelection(state => ({ ...state, selectedPlatform }));
  }, []);

  /**
   * Reset the selection state
   */
  const resetSelection = useCallback(() => {
    setPlatformSelection({ enableOnly: null, selectedPlatform: null });
  }, []);

  /**
   * Effect to handle platform selection
   * - Super platform selected: open create sub-platform modal
   * - Sub/Independent platform selected: navigate to launch program
   */
  useEffect(() => {
    const { selectedPlatform } = platformSelection;
    if (!selectedPlatform) {
      return;
    }

    // If super platform is selected, open create sub-platform modal
    if (checkSuperPlatform(selectedPlatform.hierarchicType)) {
      dispatch(openModal('createPlatformModal', {
        hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM,
        parentPlatform: selectedPlatform
      }));
      return;
    }

    // Otherwise, proceed to create program
    dispatch(forceActiveProgram({
      forcedPlatformId: selectedPlatform.id,
      unlockSelection: true
    }));
    
    const selected: ISelectedPlatform = {
      index: null,
      name: selectedPlatform.name,
      id: selectedPlatform.id,
      role: selectedPlatform.role,
      status: selectedPlatform.status,
      hierarchicType: selectedPlatform.hierarchicType
    };
    dispatch(setSelectedPlatform(selected));

    navigate(LAUNCH_PROGRAM_FIRST);
  }, [platformSelection.selectedPlatform, dispatch, navigate]);

  return {
    ...platformSelection,
    setEnableOnly,
    setParentPlatform,
    resetSelection,
    isSuperPlatform: checkSuperPlatform,
    isHyperPlatform: checkHyperPlatform
  };
};

export default useParentPlatformSelection;
