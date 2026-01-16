import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserListMainTitle from 'components/molecules/launch/userInviteList/UserListMainTitle';

describe('UserListMainTitle', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UserListMainTitle />
      </ProvidersWrapper>
    );
  });
});
