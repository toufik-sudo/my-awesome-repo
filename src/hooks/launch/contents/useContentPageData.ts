import { useDispatch } from 'react-redux';
import { useMultiStep } from '../useMultiStep';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';
import { useParams } from 'react-router-dom';

/**
 * Hook used to handle contents logic
 */
export const useContentPageData = (stepIndex?) => {
  const dispatch = useDispatch();
  const {
    stepSet: { setNextStep }
  } = useMultiStep();
  const contentCoverConfig = useAvatarPictureConfigurations(stepIndex);

  return { setNextStep, dispatch, contentCoverConfig };
};
