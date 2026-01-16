import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { CREATE_PLATFORM_MODAL } from 'constants/modal';
import { setModalState } from 'store/actions/modalActions';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { isSuperPlatform } from 'services/HyperProgramService';
import { forceActiveProgram } from 'store/actions/wallActions';
import { LAUNCH_PROGRAM_FIRST } from 'constants/wall/launch';
import { setSelectedPlatform } from 'store/actions/wallActions';

/**
 * Hook used to handle parent platform selection on platform/program create.
 */
export const useParentPlatformSelection = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [platformSelection, setPlatformSelection] = useState({
    enableOnly: null,
    selectedPlatform: null
  });

  const setEnableOnly = (hierarchicTypes, selectedPlatform = null) => {
    if (hierarchicTypes && hierarchicTypes.includes(PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM)) {
      dispatch(setModalState(true, CREATE_PLATFORM_MODAL, { hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM }));
      return;
    }

    setPlatformSelection({ enableOnly: hierarchicTypes, selectedPlatform });
  };

  const setParentPlatform = selectedPlatform => setPlatformSelection(state => ({ ...state, selectedPlatform }));

  useEffect(() => {
    const { selectedPlatform } = platformSelection;
    if (!selectedPlatform) {
      return;
    }

    if (isSuperPlatform(selectedPlatform.hierarchicType)) {
      dispatch(
        setModalState(true, CREATE_PLATFORM_MODAL, {
          hierarchicType: PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM,
          parentPlatform: selectedPlatform
        })
      );
      return;
    }

    dispatch(
      forceActiveProgram({
        forcedPlatformId: selectedPlatform.id,
        unlockSelection: true
      })
    );
    dispatch(setSelectedPlatform(selectedPlatform));

    history.push(LAUNCH_PROGRAM_FIRST);
  }, [platformSelection.selectedPlatform, dispatch]);

  return {
    ...platformSelection,
    setEnableOnly,
    setParentPlatform
  };
};
