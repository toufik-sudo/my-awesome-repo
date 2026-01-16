import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';

describe('Top Navigation Element', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <SpringAnimation settings={{}} className="">
          <div />
        </SpringAnimation>
      </ProvidersWrapper>
    );
  });
});
