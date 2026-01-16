import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import PasswordResetFormAdditional from 'components/molecules/forms/PasswordResetFormAdditional';
import { LOADER_TYPE } from 'constants/general';
import { PASSWORD_RESET } from 'constants/routes';
import { resetPasswordAction } from 'store/actions/formActions';
import { PASSWORD_RESET_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { useResetPassword } from 'hooks/forms/useResetPassword';

/**
 * Organism component that renders password reset
 *
 * @constructor
 */
const PasswordResetFormWrapper = () => {
  const { setFormLoading, formLoading, setForgotSubmitted, authState, isValid, token, history } = useResetPassword();

  if (authState === PASSWORD_RESET && !isValid) return <Loading type={LOADER_TYPE.FULL} />;

  return (
    <GenericFormBuilder
      formAction={(values, props) =>
        resetPasswordAction({ ...values, token }, props, history, setForgotSubmitted, setFormLoading)
      }
      formDeclaration={PASSWORD_RESET_FORM_FIELDS}
      formSlot={form => <PasswordResetFormAdditional {...{ form, formLoading }} />}
    />
  );
};

export default PasswordResetFormWrapper;
