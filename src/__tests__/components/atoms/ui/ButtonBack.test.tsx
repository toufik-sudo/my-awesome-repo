import React from 'react';
import { render } from '@testing-library/react';

import ButtonBack from 'components/atoms/ui/ButtonBack';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('Button Back', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ButtonBack onClick={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
