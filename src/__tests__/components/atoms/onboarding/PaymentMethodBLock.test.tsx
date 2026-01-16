import React from 'react';
import { render } from '@testing-library/react';

import PaymentMethodBlock from 'components/atoms/onboarding/PaymentMethodBlock';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('Payment method block', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <PaymentMethodBlock index="1" textId="test" />
      </ProvidersWrapper>
    );
  });
});
