import React from 'react';
import { render } from '@testing-library/react';

import PasswordResetFormAdditional from 'components/molecules/forms/PasswordResetFormAdditional';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { PASSWORD_RESET_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('PasswordResetFormAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={PASSWORD_RESET_FORM_FIELDS}>
          {props => <PasswordResetFormAdditional form={props} formLoading />}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
