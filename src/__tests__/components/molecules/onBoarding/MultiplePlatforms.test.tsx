import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import MultiplePlatforms from 'components/molecules/onboarding/MultiplePlatforms';

describe('MultiplePlatforms', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <MultiplePlatforms />
      </ProvidersWrapper>
    );
  });
});
