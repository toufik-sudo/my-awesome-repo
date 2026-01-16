import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import TailoredResellerCustomBlock from 'components/molecules/landing/TailoredResellerCustomBlock';

describe('TailoredResellerCustomBlock', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <TailoredResellerCustomBlock onClick={jest.fn()} type="" />
      </ProvidersWrapper>
    );
  });
});
