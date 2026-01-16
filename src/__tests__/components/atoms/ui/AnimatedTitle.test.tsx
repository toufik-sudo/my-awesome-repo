import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import AnimatedTitle from 'components/atoms/ui/AnimatedTitle';
import { LANDING_TITLE } from 'constants/landing';

describe('Animated Title', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <AnimatedTitle contentArray={LANDING_TITLE} />
      </ProvidersWrapper>
    );
  });
});
