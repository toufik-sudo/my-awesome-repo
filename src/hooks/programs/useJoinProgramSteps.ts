import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { WALL_PROGRAM_ROUTE, WALL_ROUTE } from 'constants/routes';
import { PROGRAM_JOIN_STEPS, PROGRAM_JOIN_FIRST_STEP, PROGRAM_JOIN_STEPS_ORDER } from 'constants/programs';
import { forceActiveProgram } from 'store/actions/wallActions';
import { retrievePlatformsData } from 'services/PlatformSelectionServices';

/**
 * Hook used to manage program join journey.
 */
const useJoinProgramJourney = () => {
  const history = useHistory();
  const { state = {} } = useLocation<any>();
  const dispatch = useDispatch();
  const { programId, platformId, programName } = state;
  const [step, setStep] = useState(PROGRAM_JOIN_FIRST_STEP);

  const moveToNext = useCallback(
    async (data = {}) => {
      if (data.joined) {
        await retrievePlatformsData(dispatch, { programId, platformId });
        await dispatch(forceActiveProgram({ programId, unlockSelection: true }));
        const url = `${WALL_ROUTE}/programId=${programId}&platformId=${platformId}&programName=${programName}`;
        return history.replace(url);
      }

      const nextStep = PROGRAM_JOIN_STEPS[step + 1];
      if (!PROGRAM_JOIN_STEPS[nextStep]) {
        return history.replace(WALL_PROGRAM_ROUTE);
      }

      setStep(PROGRAM_JOIN_STEPS[nextStep]);
    },
    [history, step]
  );

  return { programId, steps: PROGRAM_JOIN_STEPS_ORDER, step, moveToNext };
};

export default useJoinProgramJourney;
