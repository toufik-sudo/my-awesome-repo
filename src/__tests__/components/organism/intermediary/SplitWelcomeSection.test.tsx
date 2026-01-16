import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SplitWelcomeSection from 'components/organisms/intermediary/SplitWelcomeSection';
import { LAUNCH } from 'services/wall/navigation';

describe('SplitWelcomeSection', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <SplitWelcomeSection type={LAUNCH} />
      </ProvidersWrapper>
    );
  });
});
