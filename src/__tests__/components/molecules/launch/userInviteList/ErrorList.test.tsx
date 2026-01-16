import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ErrorList from 'components/molecules/launch/userInviteList/ErrorList';

describe('ErrorList', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ErrorList invalidRecords={[]} />
      </ProvidersWrapper>
    );
  });

  test('correctly renders component with error', () => {
    render(
      <ProvidersWrapper>
        <ErrorList invalidEmails={[{ email: 'test@test.com', errors: { code: 1000 }, index: 1 }]} />
      </ProvidersWrapper>
    );
  });
});
