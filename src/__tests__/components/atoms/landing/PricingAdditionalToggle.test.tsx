import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import PricingAdditionalToggle from 'components/atoms/landing/PricingAdditionalToggle';

describe('Pricing Additional Toggle', () => {
  test('correctly renders toggle button', () => {
    const { container } = render(
      <ProvidersWrapper>
        <PricingAdditionalToggle toggleAdditionalPricing={jest.fn()} additionalVisible />
      </ProvidersWrapper>
    );
    expect(container.querySelector('button').innerHTML).toContain('Hide');
  });

  test('correctly renders toggle button (not toggled)', () => {
    const { container } = render(
      <ProvidersWrapper>
        <PricingAdditionalToggle toggleAdditionalPricing={jest.fn()} additionalVisible={false} />
      </ProvidersWrapper>
    );
    expect(container.querySelector('button').innerHTML).not.toContain('Hide');
  });

  test('toggles correctly the view', () => {
    const { container } = render(
      <ProvidersWrapper>
        <PricingAdditionalToggle toggleAdditionalPricing={jest.fn()} additionalVisible />
      </ProvidersWrapper>
    );

    fireEvent.click(container.querySelector('button'));
    expect(container.querySelector('button').innerHTML).toContain('Hide');
  });
});
