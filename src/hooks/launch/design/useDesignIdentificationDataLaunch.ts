import { useDispatch } from 'react-redux';
import { useMultiStep } from '../useMultiStep';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';

/**
 * Hook used to handle design identification logic
 */
export const useDesignIdentificationDataLaunch = () => {
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const designIdentificationCoverConfig = useAvatarPictureConfigurations();

  return { setNextStep, dispatch, designIdentificationCoverConfig };
};
