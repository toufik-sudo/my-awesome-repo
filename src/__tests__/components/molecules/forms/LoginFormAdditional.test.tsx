import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import LoginFormAdditional from 'components/molecules/forms/LoginFormAdditional';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { FORGOT_PASSWORD_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('LoginFormAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={FORGOT_PASSWORD_FIELDS}>
          {props => <LoginFormAdditional form={props} formLoading setLoginRoute={jest.fn()} isOnboardingFlow={false} />}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
