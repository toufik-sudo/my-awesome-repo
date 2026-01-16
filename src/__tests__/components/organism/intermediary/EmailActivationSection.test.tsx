import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import EmailActivationSection from 'components/organisms/intermediary/EmailActivationSection';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { LAUNCH } from 'services/wall/navigation';
import { CLOUD_REWARDS_LOGO_ALT } from 'constants/general';

describe('EmailActivationSection', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <EmailActivationSection type={LAUNCH} />
      </ProvidersWrapper>
    );

    fireEvent.click(screen.getByAltText(CLOUD_REWARDS_LOGO_ALT).closest('img'));
  });
});
