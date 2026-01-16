import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import usePrevious from 'hooks/general/usePrevious';
import { setOnboardingRegisterData } from 'store/actions/onboardingActions';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';
import { getCompletedSteps } from 'services/OnboardingServices';
import { ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE, ONBOARDING_GENERIC_ROUTE } from 'constants/routes';
import { REGISTER_PAGE_STEPS } from 'constants/onboarding/general';
import { IStore } from 'interfaces/store/IStore';
import { useSubmitRegisterData } from 'hooks/wall/onboarding/useSubmitRegisterData';
import { ONBOARDING_BENEFICIARY_COOKIE, REGISTER_DATA_COOKIE } from 'constants/general';
import { getLocalStorage, removeLocalStorage, setLocalStorage } from 'services/StorageServies';
import { PROGRAMS_ENDPOINT } from 'constants/api';

/**
 * Hook used to handle all logic for multi step wizard
 */
export const useOnboardingRegisterData = () => {
  const avatarContext = useAvatarPictureConfigurations();
  const { registerData } = useSelector((store: IStore) => store.onboardingReducer);
  const [isLoading, setFormLoading] = useState(false);
  const [pageWithError, setPageWithError] = useState(null);
  const history = useHistory();
  const dispatch = useDispatch();
  let { step } = useParams();
  const registerDataCookie = getLocalStorage(REGISTER_DATA_COOKIE) || registerData;
  const prevState = usePrevious({ registerDataCookie });
  const onboardingBeneficiaryCookie = getLocalStorage(ONBOARDING_BENEFICIARY_COOKIE);

  const { submitBeneficiaryRegister } = useSubmitRegisterData(
    history,
    dispatch,
    registerDataCookie,
    setFormLoading,
    setPageWithError
  );

  if (!step) {
    step = REGISTER_PAGE_STEPS.TITLE.toString();
  }

  const parsedStep = step ? parseInt(step) : REGISTER_PAGE_STEPS.TITLE;
  const onBack = () => {
    if (parsedStep === REGISTER_PAGE_STEPS.TITLE || !step) {
      let redirectTo = ONBOARDING_GENERIC_ROUTE;

      if (onboardingBeneficiaryCookie) {
        const { programType, programId, customUrl } = onboardingBeneficiaryCookie;
        redirectTo = `${PROGRAMS_ENDPOINT}/${programType}/${programId}/${customUrl}`;
      }

      return history.push(redirectTo);
    }

    history.push(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${parseInt(step) - 1}`);
  };

  const onStepForward = (props, values) => {
    if (isLoading) {
      return;
    }
    const canSubmitUserData =
      parsedStep === REGISTER_PAGE_STEPS.PASSWORD &&
      getCompletedSteps(registerDataCookie).step === REGISTER_PAGE_STEPS.PASSWORD;
    if (canSubmitUserData) {
      setFormLoading(true);
      return submitBeneficiaryRegister(props, values);
    }
    return history.push(`${ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE}${parsedStep + 1}`);
  };

  const onSubmit = (props, values, croppedAvatar = null, fullAvatar = null, avatarConfig = null) => {
    if (parsedStep === REGISTER_PAGE_STEPS.AVATAR && croppedAvatar) {
      values.croppedAvatar = croppedAvatar;
      values.fullAvatar = fullAvatar;
      values.avatarConfig = avatarConfig;
    }
    if (onboardingBeneficiaryCookie) {
      const { programId, platformId } = onboardingBeneficiaryCookie;
      values.programId = programId;
      values.platformId = platformId;
    }
    setLocalStorage(REGISTER_DATA_COOKIE, { ...registerDataCookie, ...values });
    onStepForward(props, values);
  };

  useEffect(() => {
    if (!history.location.pathname.includes(ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE)) {
      removeLocalStorage(REGISTER_DATA_COOKIE);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    if (prevState && JSON.stringify(registerDataCookie) !== JSON.stringify(prevState.registerDataCookie)) {
      dispatch(setOnboardingRegisterData({ registerData: registerDataCookie }));
    }
  }, [registerDataCookie]);

  return {
    step: parsedStep,
    onBack,
    onSubmit,
    registerData: registerDataCookie,
    isLoading,
    avatarContext,
    setPageWithError,
    pageWithError
  };
};
