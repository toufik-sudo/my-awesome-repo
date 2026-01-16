import DynamicDatePickerDefault from 'components/molecules/forms/fields/DynamicDatePickerDefault';
import { FORM_FIELDS } from 'constants/forms';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('DynamicDatePickerDefault', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <DynamicDatePickerDefault
      label={''}
      id={''}
      field={{ label: 'test', name: '', onBlur: jest.fn(), onChange: jest.fn() }}
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
    expect(wrapper.children().length).toBe(3);
  });
});
