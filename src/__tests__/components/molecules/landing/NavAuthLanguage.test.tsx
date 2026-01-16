import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import NavAuthLanguage from 'components/molecules/landing/NavAuthLanguage';

describe('NavAuthLanguage', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <NavAuthLanguage openModal={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
