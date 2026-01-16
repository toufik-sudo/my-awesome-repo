import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ErrorLineAddition from 'components/atoms/ui/ErrorLineAddition';

describe('Error Line Addition', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ErrorLineAddition code="1" />
      </ProvidersWrapper>
    );
  });
});
