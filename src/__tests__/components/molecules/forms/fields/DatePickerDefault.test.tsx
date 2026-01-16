import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import DatePickerDefault from 'components/molecules/forms/fields/DatePickerDefault';
import { GENERIC_FORM } from '__mocks__/formMocks';

describe('DatePickerDefault', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <DatePickerDefault
          field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn() }}
          form={GENERIC_FORM}
        />
      </ProvidersWrapper>
    );
  });
});
