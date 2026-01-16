import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import { RESELLER_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';
import ResellerForm from 'components/molecules/forms/ResellerForm';

describe('ResellerForm', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={RESELLER_FORM_FIELDS}>{props => <ResellerForm form={props} />}</FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
