import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import RadioButtonInputField from 'components/molecules/forms/fields/RadioButtonInputField';
import store from 'store';
import IntlProvider from 'containers/ConnectedIntlProvider';
import { GENERIC_FORM } from '__mocks__/formMocks';

describe('Reseller Exclusive Group', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <IntlProvider>
        <RadioButtonInputField
          field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn(), options: [] }}
          form={GENERIC_FORM}
        />
      </IntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
