import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ServicesImageSwitch from 'components/molecules/landing/ServicesImageSwitch';

describe('ServicesImageSwitch', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ServicesImageSwitch />
      </ProvidersWrapper>
    );
  });
});
