/* eslint-disable quotes */
import React from 'react';
import UserEmail from 'components/molecules/forms/updateAccountInformation/UserEmail';
import InviteByEmail from 'components/molecules/wall/userInvite/InviteByEmail';
import { EMAIL } from 'constants/validation';
import AvatarWrapper from 'components/organisms/avatar/AvatarWrapper';
import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import settingsStyle from 'sass-boilerplate/stylesheets/components/wall/PersonalnformationSettings.module.scss';

/**
 * Molecule component used in addition of update personal information form
 *
 * @param userEmail
 * @param setUserEmail
 * @param userData
 * @param form
 * @param imageError
 * @param setImageError
 * @constructor
 */
const WallCreateAccount = ({ userEmail, setUserEmail, userData, form, imageError, setImageError }) => {
  return (
    <div className={eCardStyle.customTextInputUser}>
      <UserEmail
        id="userEmail"
        translationKey={'wall.user.details.label.email'}
        setUserEmail={setUserEmail}
        userEmail={userEmail}
      />
      <InviteByEmail translationKey={'wall.send.invitation.'} id={EMAIL} userEmail={userEmail} userData={userData} />
      <div className={settingsStyle.uploadImage}>
        <AvatarWrapper {...{ form, imageError, setImageError }} />
        <ImageUploadModal context={AvatarContext} imageModal="imageUploadModal" />
      </div>
    </div>
  );
};

export default WallCreateAccount;
