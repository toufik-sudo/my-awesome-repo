import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import EmailConfirmed from 'components/organisms/intermediary/EmailConfirmed';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { LAUNCH } from 'services/wall/navigation';

describe('EmailConfirmed', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <EmailConfirmed type={LAUNCH} />
      </ProvidersWrapper>
    );

    fireEvent.click(screen.getByText("Let's go"));
  });
});
