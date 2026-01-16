import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { useActiveStep } from './useActiveStep';
import { useStepHandler } from './useStepHandler';
import { getActiveSteps, getAvailableStatus } from 'services/LaunchServices';
import { IStore } from 'interfaces/store/IStore';
import {
  QUICK_LAUNCH_AVAILABLE_STEPS,
  FULL_LAUNCH_AVAILABLE_STEPS,
  FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS,
  FREEMIUM,
  CHALLENGE,
  FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS,
  FREEMIUM_MODIFY_LAUNCH_AVAILABLE_STEPS,
  CHALLENGE_QUICK_LAUNCH_AVAILABLE_STEPS,
  CHALLENGE_MODIFY_LAUNCH_AVAILABLE_STEPS,
  CHALLENGE_FULL_LAUNCH_AVAILABLE_STEPS

} from 'constants/wall/launch';
import { QUICK } from 'constants/general';
import { useBackHandles } from 'hooks/launch/steps/useBackHandles';


/**
 * Hook used to handle all logic for multi step wizard
 */
export const useMultiStep = () => {
  const launchStoreData = useSelector((store: IStore) => store.launchReducer);
  const params: any = useParams();
  const { stepIndex } = params;
  const { programJourney, type } = launchStoreData;
  const quickProgramJourney = programJourney === QUICK;

  let launchStep = quickProgramJourney ? QUICK_LAUNCH_AVAILABLE_STEPS : FULL_LAUNCH_AVAILABLE_STEPS;
  if (type === FREEMIUM) {
    if (launchStoreData.isModify) {
      launchStep = quickProgramJourney ? FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS : FREEMIUM_MODIFY_LAUNCH_AVAILABLE_STEPS;
    } else {
      launchStep = quickProgramJourney ? FREEMIUM_QUICK_LAUNCH_AVAILABLE_STEPS : FREEMIUM_FULL_LAUNCH_AVAILABLE_STEPS;
    }}
  if (type === CHALLENGE) {
    if (launchStoreData.isModify) {
      launchStep = quickProgramJourney ? CHALLENGE_QUICK_LAUNCH_AVAILABLE_STEPS : CHALLENGE_MODIFY_LAUNCH_AVAILABLE_STEPS;
    } else {
      launchStep = quickProgramJourney ? CHALLENGE_QUICK_LAUNCH_AVAILABLE_STEPS : CHALLENGE_FULL_LAUNCH_AVAILABLE_STEPS;
    }}
 

  const launchSteps = getActiveSteps(launchStep);
  const currentStepIndex = useActiveStep(launchSteps, launchStoreData.isModify);
  const stepSet = useStepHandler(currentStepIndex, launchSteps);
  const stepAvailable = getAvailableStatus(currentStepIndex, launchSteps, stepIndex);
  const { handleBackStep } = useBackHandles(stepSet, params);
  // console.log({
  //   launchSteps: launchSteps,
  //   currentStepIndex: currentStepIndex,
  //   stepSet: stepSet,
  //   stepAvailable: stepAvailable
  // });

  return { stepSet, stepAvailable, handleBackStep };
};
