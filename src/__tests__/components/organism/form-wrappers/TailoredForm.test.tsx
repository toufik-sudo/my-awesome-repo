import { mockIntl } from '__mocks__/intlMocks';
import TailoredFormWrapper from 'components/organisms/form-wrappers/TailoredFormWrapper';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('TailoredFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <TailoredFormWrapper intl={mockIntl()} key={1} />
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
