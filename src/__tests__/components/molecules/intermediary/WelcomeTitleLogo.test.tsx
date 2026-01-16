import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import WelcomeTitleLogo from 'components/molecules/intermediary/WelcomeTitleLogo';

describe('WelcomeTitleLogo', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <WelcomeTitleLogo type="" />
      </ProvidersWrapper>
    );
  });
});
