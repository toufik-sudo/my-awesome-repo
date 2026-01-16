import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserInvitationResultNotice from 'components/molecules/launch/userInviteList/UserInvitationResultNotice';

describe('UserInvitationResultNotice', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UserInvitationResultNotice />
      </ProvidersWrapper>
    );
  });
});
