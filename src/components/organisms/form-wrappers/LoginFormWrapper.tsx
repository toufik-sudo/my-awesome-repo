import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import GenericFormBuilder from 'components/organisms/form-wrappers/GenericFormBuilder';
import LoginFormAdditional from 'components/molecules/forms/LoginFormAdditional';
import { LOGIN_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import { loginSubmitAction } from 'store/actions/formActions';

/**
 * Organism component that renders a login form
 *
 * @constructor
 */
const LoginFormWrapper = ({ isOnboardingFlow, isCustomWall = null, customUrl= null }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [formLoading, setFormLoading] = useState(false);
  

  return (
    <GenericFormBuilder
      formAction={(values, props) =>
        loginSubmitAction(values, props, history, setFormLoading, dispatch, isOnboardingFlow, isCustomWall, customUrl)
      }
      formDeclaration={LOGIN_FORM_FIELDS}
      formSlot={form => <LoginFormAdditional {...{ form, formLoading, history, isOnboardingFlow }} />}
    />
  );
};

export default LoginFormWrapper;
