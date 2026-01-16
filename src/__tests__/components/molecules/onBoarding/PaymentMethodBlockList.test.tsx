import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PaymentMethodBlockList from 'components/molecules/onboarding/PaymentMethodBlockList';

describe('PaymentMethodBlockList', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PaymentMethodBlockList platformId={null} />
      </ProvidersWrapper>
    );
  });
});
