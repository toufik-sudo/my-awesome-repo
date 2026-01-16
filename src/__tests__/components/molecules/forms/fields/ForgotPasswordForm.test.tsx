import { mockIntl } from '__mocks__/intlMocks';
import ForgotPasswordFormWrapper from 'components/organisms/form-wrappers/ForgotPasswordFormWrapper';
import ConnectedIntlProvider from 'containers/ConnectedIntlProvider';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

describe('ForgotPasswordFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <Provider store={store}>
      <ConnectedIntlProvider>
        <ForgotPasswordFormWrapper
          intl={mockIntl()}
          setLoginRoute={jest.fn()}
          closeModal={jest.fn()}
          isOnboardingFlow={false}
        />
      </ConnectedIntlProvider>
    </Provider>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(1);
  });
});
