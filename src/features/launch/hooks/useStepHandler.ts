// -----------------------------------------------------------------------------
// useStepHandler Hook
// Migrated from old_app/src/hooks/launch/useStepHandler.ts
// -----------------------------------------------------------------------------

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { LAUNCH_BASE } from '@/constants/routes';
import { LAUNCH_STEP_TYPES, QUICK, FREEMIUM } from '@/constants/wall/launch';
import { processLaunchSelection } from '@/services/LaunchServices';
import type { RootState } from '@/store';

export interface ILaunchStep {
  name: string;
  available: boolean;
}

/**
 * Get the next step route
 */
const getNextStep = (
  currentStepIndex: number,
  launchSteps: ILaunchStep[],
  step: string,
  stepIndex: number | string
): string => {
  const nextStep = launchSteps[currentStepIndex + 1];
  
  if (nextStep) {
    return `${LAUNCH_BASE}/${nextStep.name}/1`;
  }
  
  return `${LAUNCH_BASE}/${step}/${stepIndex}`;
};

/**
 * Hook used to handle set next/prev step
 */
export const useStepHandler = (currentStepIndex: number, launchSteps: ILaunchStep[]) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { step, stepIndex } = useParams<{ step: string; stepIndex: string }>();
  
  const launchState = useSelector((state: RootState & { launchReducer?: {
    resultChannel?: { declarationForm?: boolean };
    programJourney?: string;
    type?: string;
  }}) => state.launchReducer);

  const resultChannel = launchState?.resultChannel;
  const programJourney = launchState?.programJourney;
  const type = launchState?.type;

  const nextStepRoute = step && stepIndex 
    ? getNextStep(currentStepIndex, launchSteps, step, stepIndex) 
    : '';

  const setNextStep = useCallback((titleId: string | null = null, journey: string | null = null) => {
    if (titleId) {
      const selection = processLaunchSelection(titleId);
      // TODO: Dispatch launch action when store actions are migrated
      // dispatch(setLaunchDataStep(selection));
    }
    
    if (journey) {
      // TODO: Set journey type
      // setJourneyType(journey, dispatch);
    }
    
    navigate(nextStepRoute);
  }, [dispatch, navigate, nextStepRoute]);

  const setPrevStep = useCallback(() => {
    if (!step || !stepIndex) return;
    
    const prevStepIndex = parseInt(stepIndex, 10) - 1;
    
    if (prevStepIndex >= 1) {
      navigate(`${LAUNCH_BASE}/${step}/${prevStepIndex}`);
    } else if (currentStepIndex > 0) {
      const prevStep = launchSteps[currentStepIndex - 1];
      const prevStepType = LAUNCH_STEP_TYPES[prevStep.name as keyof typeof LAUNCH_STEP_TYPES];
      const lastStepIndex = prevStepType?.steps?.length || 1;
      navigate(`${LAUNCH_BASE}/${prevStep.name}/${lastStepIndex}`);
    }
  }, [step, stepIndex, currentStepIndex, launchSteps, navigate]);

  const setResultStep = useCallback((declinedEmailInvitation = false) => {
    if (declinedEmailInvitation && step) {
      const resultsRoute = getNextStep(currentStepIndex, launchSteps, step, 3);
      navigate(resultsRoute);
    }
  }, [currentStepIndex, launchSteps, step, navigate]);

  const setResultValidationStep = useCallback(() => {
    if (!step) return;
    
    if (resultChannel?.declarationForm) {
      navigate(nextStepRoute);
      return;
    }
    
    const resultValidationRoute = getNextStep(currentStepIndex, launchSteps, step, 2);
    navigate(resultValidationRoute);
  }, [resultChannel, nextStepRoute, currentStepIndex, launchSteps, step, navigate]);

  return {
    setNextStep,
    setPrevStep,
    setResultStep,
    setResultValidationStep,
    currentStep: step,
    currentStepIndex: stepIndex ? parseInt(stepIndex, 10) : 1,
    programJourney,
    type
  };
};

export default useStepHandler;
