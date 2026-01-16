import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import DatePickerFrom from 'components/molecules/forms/fields/DatepickerMultiple/DatePickerFrom';
import { TAILORED_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('DatePickerFrom', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>
          {props => (
            <DatePickerFrom form={props} field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn() }} />
          )}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
