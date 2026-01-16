import { useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

import UsersApi from 'api/UsersApi';
import { UserContext } from 'components/App';
import { getUserProgramFields } from 'services/UsersServices';
import { prepareAccountDataFields, transferValuesToSocialMedia } from 'services/WallServices';
import { isNotFound, isForbidden } from 'utils/api';
import { useLogoutUser } from 'hooks/user/useLogoutUser';
import { handleApiFormValidation } from 'utils/validationUtils';

const userApi = new UsersApi();
/**
 * Hook used to manage user data on program join.
 * @param programDetails
 * @param onNext
 */
const useJoinProgramPersonalData = ({ registerFormFields }, onNext) => {
  const { formatMessage } = useIntl();
  const { logoutUser } = useLogoutUser();
  const { userData, refreshUserData } = useContext(UserContext);
  const [formDataChanged, setFormDataChanged] = useState(false);

  const formFields = useMemo(() => {
    const programFormFields = getUserProgramFields(registerFormFields);

    return prepareAccountDataFields(userData, Object.keys(userData), programFormFields);
  }, [registerFormFields, userData]);

  const saveData = useCallback(
    async (formValues, props) => {
      const values = { ...formValues };
      transferValuesToSocialMedia(values);

      try {
        await userApi.updateUserDetails(userData.uuid, values);
        refreshUserData();
        onNext();
      } catch ({ response }) {
        if (isNotFound(response) || isForbidden(response)) {
          return logoutUser();
        }
        handleApiFormValidation(props, values, response);

        toast(formatMessage({ id: 'program.join.personalData.failedUpdate' }));
      }
    },
    [userData.uuid, refreshUserData, logoutUser, formatMessage, onNext]
  );

  useEffect(() => {
    setFormDataChanged(false);
  }, [formFields]);

  return { formFields, setFormDataChanged, moveToNextStep: formDataChanged ? saveData : onNext };
};

export default useJoinProgramPersonalData;
