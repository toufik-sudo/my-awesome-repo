import { mockIntl } from '__mocks__/intlMocks';
import LoginFormWrapper from 'components/organisms/form-wrappers/LoginFormWrapper';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

describe('LoginFormWrapper', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <BrowserRouter>
      <LoginFormWrapper intl={mockIntl()} closeLoginModal={jest.fn()} isOnboardingFlow={false} />
    </BrowserRouter>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
