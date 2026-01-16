import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SendInvitationsLabel from 'components/molecules/launch/userInviteInfo/SendInvitationsLabel';

describe('SendInvitationsLabel', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <SendInvitationsLabel />
      </ProvidersWrapper>
    );
  });
});
