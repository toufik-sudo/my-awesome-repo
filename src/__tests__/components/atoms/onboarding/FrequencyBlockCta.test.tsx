import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FrequencyBlockCta from 'components/atoms/onboarding/FrequencyBlockCta';

describe('Frequency Block Cta', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FrequencyBlockCta frequencyId={1} />
      </ProvidersWrapper>
    );
  });
});
