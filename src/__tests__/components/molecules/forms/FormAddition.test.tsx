import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import { GENERIC_FORM } from '__mocks__/formMocks';
import { mockIntl } from '__mocks__/intlMocks';
import PersonalInformationFormAdditional from 'components/molecules/forms/PersonalInformationFormAdditional';
import store from 'store';

describe('PersonalInformationFormAdditional', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <PersonalInformationFormAdditional intl={mockIntl()} form={GENERIC_FORM} formLoading={false} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children()).toHaveLength(1);
  });
});
