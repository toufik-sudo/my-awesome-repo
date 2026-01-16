import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FrequencyPlanBlock from 'components/molecules/onboarding/FrequencyPlanBlock';

describe('FrequencyPlanBlock', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FrequencyPlanBlock plan="" />
      </ProvidersWrapper>
    );
  });
});
