import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FrequencyPlanBlockDetails from 'components/molecules/onboarding/FrequencyPlanBlockDetails';

describe('FrequencyPlanBlockDetails', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FrequencyPlanBlockDetails plan="" />
      </ProvidersWrapper>
    );
  });

  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FrequencyPlanBlockDetails
          plan={{ id: 4, frequencyType: 4, pricePerMonth: 65, paymentValue: 65, discount: 0, currency: 1 }}
        />
      </ProvidersWrapper>
    );
  });
});
