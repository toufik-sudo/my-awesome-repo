import RadioTextInputField from 'components/molecules/forms/fields/RadioTextInputField';
import { FORM_FIELDS } from 'constants/forms';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { mockIntl } from '__mocks__/intlMocks';

describe('RadioTextInputField', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <RadioTextInputField
      field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn(), style: { isInline: '' } }}
      form={{
        values: { [FORM_FIELDS.FULL_NAME]: '' },
        errors: {},
        touched: {},
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        setFieldValue: jest.fn()
      }}
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(2);
  });
});
