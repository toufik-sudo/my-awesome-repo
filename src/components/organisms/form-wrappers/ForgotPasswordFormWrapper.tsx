import React from 'react';

import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import ForgotPasswordFormAdditional from 'components/molecules/forms/ForgotPasswordFormAdditional';
import { FORGOT_PASSWORD_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { forgotPasswordAction } from 'store/actions/formActions';
import { useForgotPassword } from 'hooks/forms/useForgotPassword';

/**
 *  Organism component component that renders a forgot password form
 * @param isOnboardingFlow
 *
 * @constructor
 */
const ForgotPasswordFormWrapper = isOnboardingFlow => {
  const { setFormLoading, formLoading, setForgotSubmitted, history } = useForgotPassword();

  return (
    <GenericFormBuilder
      formAction={(values, props) => forgotPasswordAction(values, props, history, setForgotSubmitted, setFormLoading)}
      formDeclaration={FORGOT_PASSWORD_FIELDS}
      formSlot={form => <ForgotPasswordFormAdditional {...{ form, history, formLoading, isOnboardingFlow }} />}
    />
  );
};

export default ForgotPasswordFormWrapper;
