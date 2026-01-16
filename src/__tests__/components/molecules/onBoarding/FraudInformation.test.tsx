import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FraudInformation from 'components/molecules/onboarding/FraudInformation';

describe('FraudInformation', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FraudInformation />
      </ProvidersWrapper>
    );
  });
});
