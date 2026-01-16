import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import UserListAcceptedType from 'components/molecules/launch/userInviteList/UserListAcceptedType';

describe('UserListAcceptedType', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <UserListAcceptedType />
      </ProvidersWrapper>
    );
  });
});
