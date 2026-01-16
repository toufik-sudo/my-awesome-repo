import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import CreateAccountFormAdditional from 'components/molecules/forms/CreateAccountFormAdditional';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { CREATE_ACCOUNT_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('CreateAccountFormAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={CREATE_ACCOUNT_FIELDS}>
          {props => <CreateAccountFormAdditional form={props} />}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
