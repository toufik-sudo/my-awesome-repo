import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { useMultiStep } from 'hooks/launch/useMultiStep';
import { IStore } from 'interfaces/store/IStore';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { SOCIAL_NETWORK_TYPES, SOCIAL_NETWORKS } from 'constants/wall/launch';
import { extractSocialData, prepareSocialStoreData, validateNextStep } from 'services/LaunchServices';

const useSocialNetworkData = () => {
  const dispatch = useDispatch();
  const { socialMediaAccounts, confidentiality, type } = useSelector((store: IStore) => store.launchReducer);
  const storeData = extractSocialData(socialMediaAccounts);
  const [socialNetworks, setSocialNetworks] = useState({ ...SOCIAL_NETWORK_TYPES, ...storeData });
  const [canNextStep, setCanNextStep] = useState(true);

  const {
    stepSet: { setNextStep }
  } = useMultiStep();

  const nextStep = () => {
    const socialNetworksStore = prepareSocialStoreData(socialNetworks);
    dispatch(setLaunchDataStep({ key: SOCIAL_NETWORKS, value: { ...socialNetworksStore } }));
    setNextStep();
  };

  const setNetwork = (socialNetwork, index) => {
    const modifiedSocialNetworks = socialNetworks;
    modifiedSocialNetworks[index] = { ...socialNetworks[index], ...socialNetwork };
    setSocialNetworks({ ...modifiedSocialNetworks });
    setCanNextStep(validateNextStep(modifiedSocialNetworks));
  };

  return {
    nextStep,
    setNetwork,
    socialNetworks,
    canNextStep,
    setCanNextStep,
    confidentiality,
    type
  };
};

export default useSocialNetworkData;
