import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import usePrevious from 'hooks/general/usePrevious';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';
import { getAccountGeneralFields, getAccountPersonalFieldsAndValues } from 'services/WallServices';
import { FORM_FIELDS } from 'constants/forms';
import { UserContext } from 'components/App';
import { IStore } from 'interfaces/store/IStore';

/**
 * Hook used to retrieve user data and return data for the form
 */
const useUpdateUserData = (isSettingForm=null) => {
  const [formLoading, setFormLoading] = useState(false);
  const { userData = {} } = useContext(UserContext);

  const avatarContext = useAvatarPictureConfigurations();
  const [linkedEmails, setAdditionalEmailList] = useState([]);
  const [fields, setFields] = useState([]);
  const [personalInformationFields, setPersonalInformationFields] = useState([]);
  const [personalInformation, setPersonalInformation] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const linkedEmailsData = useSelector((store: IStore) => store.wallReducer.linkedEmailsData);
  const [imageError, setImageError] = useState({});
  const [safeToDelete, setEmailSafeToDelete] = useState(true);
  const previousState = usePrevious({ linkedEmails });

  useEffect(() => {
    const userDataKeys = Object.keys(userData);
    if (userDataKeys.length) {
      const fieldsValues = [];
      const processedFields = getAccountGeneralFields(userDataKeys, userData);
      const userPersonalInformationData = getAccountPersonalFieldsAndValues(fieldsValues, userData, userDataKeys);
      if (userData[FORM_FIELDS.EMAIL]) {
        setUserEmail(userData[FORM_FIELDS.EMAIL]);
      }
      setPersonalInformation(fieldsValues);
      setPersonalInformationFields(userPersonalInformationData);
      const allFields = isSettingForm ? userPersonalInformationData.concat(processedFields) : processedFields;
      setFields(allFields);
      avatarContext.full.setFullAvatar(userData.originalPicturePath);
      avatarContext.cropped.setCroppedAvatar(userData.croppedPicturePath);
    }
  }, [userData]);

  useEffect(() => {
    if (!linkedEmails.length && previousState && previousState.linkedEmails.length === 0) {
      setEmailSafeToDelete(false);
    }
    setAdditionalEmailList([...linkedEmailsData]);
  }, [linkedEmailsData]);

  return {
    userData,
    linkedEmails,
    setAdditionalEmailList,
    formLoading,
    setFormLoading,
    avatarContext,
    fields,
    personalInformationFields,
    setPersonalInformationFields,
    userEmail,
    setUserEmail,
    personalInformation,
    imageError,
    setImageError,
    safeToDelete,
    setPersonalInformation
  };
};

export default useUpdateUserData;
