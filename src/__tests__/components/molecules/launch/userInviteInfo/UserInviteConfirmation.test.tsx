import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import UserInviteConfirmation from 'components/molecules/launch/userInviteInfo/UserInviteConfirmation';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('UserInviteConfirmation', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <ProvidersWrapper>
      <UserInviteConfirmation />
    </ProvidersWrapper>
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
