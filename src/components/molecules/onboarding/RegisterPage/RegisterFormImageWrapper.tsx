import React from 'react';

import AvatarWrapper from 'components/organisms/avatar/AvatarWrapper';
import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import { AvatarContext } from 'components/pages/PersonalInformationPage';

import styles from 'assets/style/components/CreateAccountLogin.module.scss';
import style from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';

/**
 * Component used to render register image wrapper
 * @param form
 * @param imageError
 * @param setImageError
 * @param croppedAvatar
 * @constructor
 */
const RegisterFormImageWrapper = ({ form, imageError, setImageError = null, croppedAvatar }) => {
  return (
    <div className={`${styles.registerFormDelete} ${style.onBoarding}`}>
      <AvatarWrapper {...{ form, imageError, setImageError, croppedAvatar }} />
      <ImageUploadModal context={AvatarContext} imageModal="imageUploadModal" />
    </div>
  );
};

export default RegisterFormImageWrapper;
