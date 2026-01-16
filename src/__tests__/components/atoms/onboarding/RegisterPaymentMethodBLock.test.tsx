import React from 'react';
import { render } from '@testing-library/react';

import RegisterPaymentMethodBlock from 'components/atoms/onboarding/RegisterPaymentMethodBlock';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { emptyFn } from 'utils/general';

describe('Register payment method block', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <RegisterPaymentMethodBlock index="1" textId="test" onClick={emptyFn} />
      </ProvidersWrapper>
    );
  });
});
