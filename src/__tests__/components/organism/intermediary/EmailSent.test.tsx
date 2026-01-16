import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import EmailSent from 'components/organisms/intermediary/EmailSent';
import { EMAIL_SENT } from 'constants/routes';

describe('EmailSent', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <EmailSent type={EMAIL_SENT} />
      </ProvidersWrapper>
    );

    fireEvent.click(screen.getByText('please try again.'));
  });
});
