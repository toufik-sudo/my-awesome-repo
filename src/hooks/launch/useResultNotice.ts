import { useState } from 'react';

/**
 * Hook used to handle result notice to switch between file results and file email notice
 *
 * @param proceedUserList
 * @param uploadResponse
 * @param setNextStep
 */
export const useResultNotice = (proceedUserList, uploadResponse, setNextStep) => {
  const [isLastStep, setIsLastStep] = useState(false);

  const proceedAction = () => {
    if (isLastStep) return proceedUserList(uploadResponse.data, setNextStep);
    setIsLastStep(true);
  };

  return { proceedAction, isLastStep };
};
