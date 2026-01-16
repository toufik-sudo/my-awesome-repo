import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import WelcomeNavigationBottom from 'components/molecules/intermediary/WelcomeNavigationBottom';

describe('WelcomeNavigationBottom', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <WelcomeNavigationBottom id="1" type="" />
      </ProvidersWrapper>
    );
  });
});
