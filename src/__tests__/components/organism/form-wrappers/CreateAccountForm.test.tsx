import { mockIntl } from '__mocks__/intlMocks';
import TailoredFormWrapper from 'components/organisms/form-wrappers/TailoredFormWrapper';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';
import { BrowserRouter } from 'react-router-dom';
import CreateAccountFormWrapper from 'components/organisms/form-wrappers/CreateAccountFormWrapper';

describe('TailoredFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <BrowserRouter>
        <CreateAccountFormWrapper intl={mockIntl()} history={history} />
      </BrowserRouter>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
