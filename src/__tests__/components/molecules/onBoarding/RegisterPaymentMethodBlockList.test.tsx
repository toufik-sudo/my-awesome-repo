import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import RegisterPaymentMethodBlockList from 'components/molecules/onboarding/RegisterPaymentMethodBlockList';

describe('RegisterPaymentMethodBlockList', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <RegisterPaymentMethodBlockList />
      </ProvidersWrapper>
    );
  });
});
