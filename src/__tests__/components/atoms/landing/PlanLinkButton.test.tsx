import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import PlanLinkButton from 'components/atoms/landing/PlanLinkButton';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import { ACCESS, FREEMIUM } from 'constants/routes';

describe('Plan Link Button', () => {
  test('renders href with right url (freemium)', () => {
    const { container } = render(
      <ProvidersWrapper>
        <PlanLinkButton content={{ name: FREEMIUM, id: 1 }} />
      </ProvidersWrapper>
    );
  });

  test('renders href with right url (premium)', () => {
    const { container } = render(
      <ProvidersWrapper>
        <PlanLinkButton content={{ name: ACCESS, id: 1 }} />
      </ProvidersWrapper>
    );
  });
});
