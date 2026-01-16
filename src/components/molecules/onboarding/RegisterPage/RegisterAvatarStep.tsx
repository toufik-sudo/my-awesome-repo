import React, { useContext } from 'react';

import RegisterResponseErrorBlock from 'components/atoms/onboarding/RegisterResponseErrorBlock';
import RegisterSubmitButtons from 'components/molecules/onboarding/RegisterPage/RegisterSubmitButtons';
import RegisterPageNameBlock from 'components/atoms/onboarding/RegisterPageNameBlock';
import RegisterFormImageWrapper from 'components/molecules/onboarding/RegisterPage/RegisterFormImageWrapper';
import useUpdateUserData from 'hooks/wall/useUpdateUserData';
import { REGISTER_PAGES } from 'constants/onboarding/general';
import { AvatarContext } from 'components/pages/PersonalInformationPage';
import { RegisterFormContext } from 'components/molecules/onboarding/RegisterPage/MultiStepRegisterWrapper';

import style from 'assets/style/common/Labels.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Molecule component used to render register avatar step
 * @constructor
 */
const RegisterAvatarStep = () => {
  const { block, center } = style;
  const { onBack, pageWithError, onSubmit, avatarContext, registerData, step, isLoading } = useContext(
    RegisterFormContext
  );
  const { imageError, setImageError } = useUpdateUserData();

  const {
    cropped: { croppedAvatar },
    config: { avatarConfig },
    full: { fullAvatar }
  } = avatarContext;

  return (
    <AvatarContext.Provider value={avatarContext}>
      <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
        <div className={`${block} ${center} `}>
          <RegisterPageNameBlock blockTitle={REGISTER_PAGES.CROPPED_AVATAR} />
          <RegisterFormImageWrapper {...{ form: null, imageError, setImageError, croppedAvatar }} />
          {pageWithError && step === pageWithError.step && <RegisterResponseErrorBlock error={pageWithError.error} />}
          <RegisterSubmitButtons
            {...{
              onBack,
              isLoading: isLoading,
              isSubmitting: false,
              disableForward: !(croppedAvatar || fullAvatar),
              onSubmitAvatar: () =>
                !croppedAvatar
                  ? setImageError({ requiredImage: 'form.validation.image.required' })
                  : onSubmit(
                      { props: { setErrors: setImageError } },
                      { values: registerData },
                      croppedAvatar,
                      fullAvatar,
                      avatarConfig
                    )
            }}
          />
        </div>
      </SpringAnimation>
    </AvatarContext.Provider>
  );
};

export default RegisterAvatarStep;
