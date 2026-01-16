import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormikWrapper from 'components/stories/utility/FormikWrapper';
import DatePickerMultiple from 'components/molecules/forms/fields/DatepickerMultiple/DatePickerMultiple';
import { TAILORED_FORM_FIELDS } from 'constants/formDefinitions/formDeclarations';

describe('DatePickerMultiple', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormikWrapper formDeclaration={TAILORED_FORM_FIELDS}>
          {props => (
            <DatePickerMultiple form={props} field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn() }} />
          )}
        </FormikWrapper>
      </ProvidersWrapper>
    );
  });
});
