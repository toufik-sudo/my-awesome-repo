import { mockIntl } from '__mocks__/intlMocks';
import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import { FORM_FIELDS, INPUT_TYPE } from 'constants/forms';
import { BASE_INPUT_CONSTRAINT_GROUP } from 'constants/validation';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('CustomFormField', () => {
  test('renders correct type', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <CustomFormField
        intl={mockIntl()}
        field={{ label: FORM_FIELDS.COMPANY_NAME, type: INPUT_TYPE.TEXT, constraints: BASE_INPUT_CONSTRAINT_GROUP }}
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
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(0);
  });

  test('renders correctly when hidden is on a field type', () => {
    const wrapper: ShallowWrapper<{}> = shallow(
      <CustomFormField
        intl={mockIntl()}
        field={{ label: FORM_FIELDS.COMPANY_NAME, type: INPUT_TYPE.TEXT, constraints: BASE_INPUT_CONSTRAINT_GROUP }}
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
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(0);
  });
});
