import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import TailoredForm from 'components/molecules/forms/TailoredForm';
import { TAILORED_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('TailoredForm', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>{props => <TailoredForm form={props} />}</FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
