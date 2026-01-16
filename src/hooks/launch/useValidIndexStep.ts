import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getActiveSteps, checkIfStepIndexIsNumber } from 'services/LaunchServices';
import { LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS, FULL_LAUNCH_AVAILABLE_STEPS } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { QUICK } from 'constants/general';

/**
 * Hook used to handle logic for indexStep validation
 */
export const useValidIndexStep = () => {
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { programJourney } = launchStore;
  const launchStep = programJourney === QUICK ? QUICK_LAUNCH_AVAILABLE_STEPS : FULL_LAUNCH_AVAILABLE_STEPS;

  const launchSteps = getActiveSteps(launchStep);
  const { step, stepIndex } = useParams();
  const isStepIndexNumber = checkIfStepIndexIsNumber(stepIndex);

  return !launchSteps.includes(step) || !isStepIndexNumber || stepIndex > LAUNCH_STEP_TYPES[step].steps.length;
};
