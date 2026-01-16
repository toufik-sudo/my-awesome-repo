import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PricingSetupCell from 'components/atoms/landing/PricingSetupCell';

describe('Pricing Setup Cell', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PricingSetupCell columnIndex="1" outputContent="" />
      </ProvidersWrapper>
    );
  });
});
