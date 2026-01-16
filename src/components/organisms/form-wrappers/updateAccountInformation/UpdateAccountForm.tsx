/* eslint-disable quotes */
import React from 'react';
import { useLocation } from 'react-router-dom';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import WallCreateAccountSubmit from 'components/molecules/forms/updateAccountInformation/WallCreateAccountSubmit';
import { useInitialAccountChecks } from 'hooks/user/useInitialAccountChecks';
import { submitUpdatePersonalInformation } from 'store/actions/formActions';
import AvatarWrapper from 'components/organisms/avatar/AvatarWrapper';
import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';

/**
 * Organism component used to render wall update personal information form
 * @param fullAvatar
 * @param croppedAvatar
 * @param avatarConfig
 * @param linkedEmails
 * @param userEmail
 * @param personalInformation
 * @param setFormLoading
 * @param fields
 * @param history
 * @param formLoading
 * @param setImageError
 * @param userData
 * @param safeToDelete
 * @param imageError
 * @constructor
 */
const UpdateAccountForm = ({
  fullAvatar,
  croppedAvatar,
  avatarConfig,
  linkedEmails,
  userEmail,
  personalInformation,
  setFormLoading,
  fields,
  history,
  setImageError,
  userData,
  safeToDelete,
  imageError,
  isSettingForm = false
}) => {
  const { state } = useLocation();
  const { initialErrors, initialTouched } = useInitialAccountChecks(state);

  return (
    <GenericFormBuilder
      initialErrors={initialErrors}
      initialTouched={initialTouched}
      formAction={(values, props) => {
        submitUpdatePersonalInformation(
          { fullAvatar, croppedAvatar, avatarConfig },
          { values: { ...values }, linkedEmails, email: userEmail, personalInformation },
          props,
          setFormLoading,
          setImageError,
          userData,
          safeToDelete,
          isSettingForm
        );
      }}
      formDeclaration={fields}
      formSlot={form => (
        <>
          {isSettingForm  && 
            <div className={settingsStyle.uploadImage}>
              <AvatarWrapper {...{ form, imageError, setImageError }} />
              <ImageUploadModal context={AvatarContext} imageModal="imageUploadModal" />
            </div>
          }

          <WallCreateAccountSubmit
            {...{
              form,
              history,
              imageError
            }}
          />
        </>
      )}
      disableSubmit={true}
    />
  );
};

export default UpdateAccountForm;
