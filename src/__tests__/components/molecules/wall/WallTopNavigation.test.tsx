import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import WallTopNavigation from 'components/molecules/wall/WallTopNavigation';

describe('WallTopNavigation', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <WallTopNavigation />
      </ProvidersWrapper>
    );
  });
});
