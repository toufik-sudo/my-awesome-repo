import { mockIntl } from '__mocks__/intlMocks';
import ResellerFormWrapper from 'components/organisms/form-wrappers/ResellerFormWrapper';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('ResellerFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <ResellerFormWrapper intl={mockIntl()} key={1} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
