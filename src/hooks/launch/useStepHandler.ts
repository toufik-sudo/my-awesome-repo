import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { LAUNCH_BASE } from 'constants/routes';
import { FREEMIUM, LAUNCH_STEP_TYPES, QUICK } from 'constants/wall/launch';
import { processLaunchSelection } from 'services/LaunchServices';
import { setJourneyType, setLaunchDataStep } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to handle set next/prev step
 *
 * @param currentStepIndex
 * @param launchSteps
 */
export const useStepHandler = (currentStepIndex, launchSteps) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { step, stepIndex } = useParams();
  const { resultChannel, programJourney, type } = useSelector((store: IStore) => store.launchReducer);

  if (step && stepIndex) {
    const nextStepRoute = getNextStep(currentStepIndex, launchSteps, step, stepIndex);
    const resultsRoute = getNextStep(currentStepIndex, launchSteps, step, 3);
    const resultValidationRoute = getNextStep(currentStepIndex, launchSteps, step, 2);
    const resultChannels = resultChannel;
    const setResultValidationStep = () => {
      if (resultChannels.declarationForm) {
        return history.push(nextStepRoute);
      }

      history.push(resultValidationRoute);
    };

    const setResultStep = (declinedEmailInvitation = false) => {
      if (declinedEmailInvitation) {
        history.push(resultsRoute);

        return;
      }
    };

    const setNextStep = (titleId = null, journey = null) => {
      if (titleId) dispatch(setLaunchDataStep(processLaunchSelection(titleId)));
      setJourneyType(journey, dispatch);

      history.push(nextStepRoute);
    };
    const setPrevStep = () => {
      if ((programJourney && programJourney === QUICK) || type === FREEMIUM) {
        return history.goBack();
      }

      return history.push(getPreviousStep(currentStepIndex, launchSteps, step, stepIndex));
    };
    const setLastStep = () => history.push(getPreviousStep(currentStepIndex, launchSteps, step, -1));

    return { setNextStep, setPrevStep, setResultStep, setResultValidationStep, setLastStep, resultsRoute };
  }

  return {};
};

/**
 * Method retrieves link to next step
 *
 * @param currentStepIndex
 * @param launchSteps
 * @param step
 * @param stepIndex
 */
const getNextStep = (currentStepIndex, launchSteps, step, stepIndex) => {
  const getNextStep = currentStepIndex + 1;
  const stepIndexNumber = parseInt(stepIndex);
  let nextStepIndex = stepIndexNumber + 1;

  const programStep = LAUNCH_STEP_TYPES[step].steps.length;
  let parentStep = launchSteps[currentStepIndex];
  if (stepIndexNumber === programStep) {
    parentStep = launchSteps[getNextStep];
    nextStepIndex = 1;
  }

  return `${LAUNCH_BASE}/${parentStep}/${nextStepIndex}`;
};

/**
 * Method retrieves link to previous step
 *
 * @param currentStepIndex
 * @param launchSteps
 * @param step
 * @param stepIndex
 */
const getPreviousStep = (currentStepIndex, launchSteps, step, stepIndex) => {
  const getPrevStep = currentStepIndex - 1;
  const stepIndexNumber = parseInt(stepIndex);
  let myStep = step;
  let prevStepIndex = stepIndexNumber - 1;
  if (stepIndexNumber === 1) {
    prevStepIndex = LAUNCH_STEP_TYPES[launchSteps[getPrevStep]].steps.length;
    myStep = launchSteps[getPrevStep];
  }

  return `${LAUNCH_BASE}/${myStep}/${prevStepIndex}`;
};
