import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

import { FREEMIUM, LAUNCH_PRODUCTS_FIRST, LAUNCH_RESULTS_FIRST, LAUNCH_TO_SOCIAL_NETWORKS, LAUNCH_USER_FIRST } from 'constants/routes';
import { RESULTS, PRODUCTS, LAUNCH_CONTENTS_FIRST, LAUNCH_DESIGN_FIRST, ECARD, CONTENTS } from 'constants/wall/launch';
import { IStore } from '../../../interfaces/store/IStore';
import { CLOSED } from '../../../constants/general';
import { redirectToRoute } from 'services/LaunchServices';

/**
 * Hook used to handle all back cases
 *
 * @param personaliseProducts
 * @param stepSet
 * @param params
 */
export const useBackHandles = (stepSet, { stepIndex, step }) => {
  const history = useHistory();
  const launchStoreData = useSelector((store: IStore) => store.launchReducer);
  const { confidentiality, personaliseProducts, resultChannel, type } = launchStoreData;
  const isClosedProgram = confidentiality === CLOSED;

  const handleBackStep = () => {
    if (!personaliseProducts && step === RESULTS && parseInt(stepIndex) === 1) {
      return history.push(LAUNCH_PRODUCTS_FIRST);
    }
    if (resultChannel && !resultChannel.declarationForm && step === RESULTS && parseInt(stepIndex) === 3) {
      return history.push(LAUNCH_RESULTS_FIRST);
    }
    if (!isClosedProgram && step === PRODUCTS && parseInt(stepIndex) === 1) {
      return history.push(LAUNCH_USER_FIRST);
    }
    if (parseInt(stepIndex) > 1 && parseInt(stepIndex) < 5 && type != FREEMIUM  && step == CONTENTS) {
      return history.push(LAUNCH_CONTENTS_FIRST);
    }
    if (stepIndex == '6' && type != FREEMIUM && step == CONTENTS) {
      // redirectToRoute(LAUNCH_CONTENTS_FIRST);
      return history.push(LAUNCH_CONTENTS_FIRST);
    }
    if (launchStoreData.isModify && type == FREEMIUM && step == ECARD) {
      return history.push(LAUNCH_DESIGN_FIRST);
    }
    stepSet.setPrevStep();
  };

  return { handleBackStep };
};
