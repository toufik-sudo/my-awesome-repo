import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { FORGOT_PASSWORD_FIELDS } from 'constants/formDefinitions/formDeclarations';
import ForgotPasswordFormAdditional from 'components/molecules/forms/ForgotPasswordFormAdditional';

describe('ForgotPasswordFormAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={FORGOT_PASSWORD_FIELDS}>
          {props => (
            <ForgotPasswordFormAdditional form={props} formLoading setLoginRoute={jest.fn()} isOnboardingFlow={false} />
          )}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
