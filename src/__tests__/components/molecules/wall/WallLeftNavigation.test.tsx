import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import WallLeftNavigation from 'components/molecules/wall/WallLeftNavigation';

describe('WallLeftNavigation', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <WallLeftNavigation />
      </ProvidersWrapper>
    );
  });
});
