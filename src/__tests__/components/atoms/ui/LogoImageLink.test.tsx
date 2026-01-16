import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import LogoImageLink from 'components/atoms/ui/LogoImageLink';

describe('Logo Image Link', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <LogoImageLink className="" />
      </ProvidersWrapper>
    );
  });
});
