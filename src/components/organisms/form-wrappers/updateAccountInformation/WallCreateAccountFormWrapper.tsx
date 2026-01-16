/* eslint-disable quotes */
import React from 'react';
import { useHistory } from 'react-router';
import PersonalInformationForm from 'components/organisms/form-wrappers/updateAccountInformation/PersonalInformationsForm';
import UpdateAccountForm from 'components/organisms/form-wrappers/updateAccountInformation/UpdateAccountForm';
import useUpdateUserData from 'hooks/wall/useUpdateUserData';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';

/**
 * Organism component used to render wall update account form
 * @constructor
 */
const WallCreateAccountFormWrapper = ({isSettingForm = null}) => {
  const history = useHistory();
  const {
    linkedEmails,
    formLoading,
    setFormLoading,
    avatarContext,
    fields,
    userData,
    personalInformationFields,
    userEmail,
    setUserEmail,
    personalInformation,
    imageError,
    setImageError,
    safeToDelete,
    setPersonalInformation
  } = useUpdateUserData(isSettingForm);

  const {
    full: { fullAvatar },
    cropped: { croppedAvatar },
    config: { avatarConfig }
  } = avatarContext;

  if (!fields.length) {
    return null;
  }

  return (
    <AvatarContext.Provider value={avatarContext}>
      <div className={`${styles.wrapper} ${styles.wrapperFull} ${settingsStyle.settingPersonalInformations}`}>
        {!isSettingForm && <PersonalInformationForm
            {...{
              personalInformationFields,
              userData,
              userEmail,
              setUserEmail,
              imageError,
              setImageError,
              setPersonalInformation
            }}
        />}
        <UpdateAccountForm
          {...{
            fullAvatar,
            croppedAvatar,
            avatarConfig,
            linkedEmails,
            userEmail,
            personalInformation,
            setFormLoading,
            fields,
            history,
            formLoading,
            setImageError,
            userData,
            safeToDelete,
            imageError,
            isSettingForm
          }}
        />
      </div>
    </AvatarContext.Provider>
  );
};

export default WallCreateAccountFormWrapper;
