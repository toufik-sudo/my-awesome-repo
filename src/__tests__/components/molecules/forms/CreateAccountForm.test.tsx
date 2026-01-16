import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import CreateAccountForm from 'components/molecules/forms/CreateAccountForm';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { CREATE_ACCOUNT_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('CreateAccountForm', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={CREATE_ACCOUNT_FIELDS}>
          {props => <CreateAccountForm form={props} formLoading={true} />}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
