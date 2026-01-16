import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

/**
 * Method gets the current index of the active step
 *
 * @param launchSteps
 */
export const useActiveStep = (launchSteps, isModify?: boolean) => {
  const { step } = useParams();
  const [currentStepIndex, setCurrentStep] = useState(0);

  useEffect(() => {
    let index = launchSteps.indexOf(step);
    if (isModify && index == -1) {
      index = 0;
    }
    setCurrentStep(index);
  }, [step, launchSteps]);

  return currentStepIndex;
};
