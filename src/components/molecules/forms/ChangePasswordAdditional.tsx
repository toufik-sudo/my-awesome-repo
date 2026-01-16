import React from 'react';

import PasswordStrengthMeter from 'components/molecules/forms/fields/PasswordStrengthMeter';
import SubmitFormButton from 'components/atoms/ui/ButtonSubmitForm';

import loginStyle from 'assets/style/components/LoginModal.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsBlock.module.scss';

/**
 * Molecule component used to render change password form additional
 *
 * @param form
 * @param formLoading
 * @constructor
 */
const ChangePasswordFormAdditional = ({ form, formLoading }) => {
  const { buttonWrapper, strenghtMeterWrapper } = loginStyle;
  const {
    settingsChangePasswordButtons,
    settingsChangePasswordButtonsStrength,
    settingsChangePasswordButtonsSubmit
  } = style;
  return (
    <div className={`${buttonWrapper} ${settingsChangePasswordButtons}`}>
      <PasswordStrengthMeter
        customStyle={`${strenghtMeterWrapper} ${settingsChangePasswordButtonsStrength}`}
        form={form}
        isPasswordChange={true}
      />
      <SubmitFormButton
        isSubmitting={form.isSubmitting}
        buttonText="wall.userDeclaration.validation.accept"
        loading={formLoading}
        className={settingsChangePasswordButtonsSubmit}
      />
    </div>
  );
};

export default ChangePasswordFormAdditional;
