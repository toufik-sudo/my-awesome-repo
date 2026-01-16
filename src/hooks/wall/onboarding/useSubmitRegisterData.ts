import { useIntl } from 'react-intl';

import AccountApi from 'api/AccountApi';
import { ACCOUNT_TYPE } from 'constants/api';
import { setUUIDCookie, clearUserData } from 'services/UserDataServices';
import { submitRegisterLoginStep } from 'store/actions/onboardingActions';
import {
  getValuesWithImages,
  updateAccountInformation,
  handleLoginBeneficiaryOnboarding
} from 'store/actions/formActions';
import { goToErrorPage } from 'services/OnboardingServices';
import { WALL_PROGRAM_ROUTE, WALL_ROUTE } from 'constants/routes';
import { REGISTER_DATA_COOKIE } from 'constants/general';
import { removeLocalStorage } from 'services/StorageServies';

const accountApi = new AccountApi();

/**
 *  Hook used to handle all logic for submit register forms
 * @param history
 * @param dispatch
 * @param registerData
 * @param setFormLoading
 * @param setPageWithError
 */
export const useSubmitRegisterData = (history, dispatch, registerData, setFormLoading, setPageWithError) => {
  const { formatMessage } = useIntl();
  const { email, firstName, lastName, title, fullAvatar, croppedAvatar, avatarConfig } = registerData;

  const submitBeneficiaryRegister = async (props, values) => {
    const { createAccountPassword, passwordConfirmation } = values;
    console.log("values");
    console.log(values);

    console.log("registerData");
    console.log(registerData);
    const data: any = {
      email,
      firstName,
      lastName,
      title,
      password: createAccountPassword,
      passwordConfirmation,
      type: ACCOUNT_TYPE.BENEFICIARY,
      step: null,
      programIdInvite: values.programId,
      platformIdInvite: values.platformId
    };
    setFormLoading(true);

    try {
      clearUserData();
      const response = await accountApi.createAccount(data);
      if (response) {
        setUUIDCookie(response.uuid);
      }
      await submitRegisterLoginStep(email, createAccountPassword, formatMessage);
      await handleLoginBeneficiaryOnboarding();
      const valuesWithImages = await getValuesWithImages(fullAvatar, croppedAvatar, avatarConfig, props, data);
      await updateAccountInformation(valuesWithImages, props, setFormLoading);
      removeLocalStorage(REGISTER_DATA_COOKIE);
      window.location = (WALL_PROGRAM_ROUTE as unknown) as Location;
    } catch (err) {
      goToErrorPage(setPageWithError, dispatch, err.response && err.response.data, history, formatMessage);
    } finally {
      setFormLoading(false);
    }
  };

  return { submitBeneficiaryRegister };
};
