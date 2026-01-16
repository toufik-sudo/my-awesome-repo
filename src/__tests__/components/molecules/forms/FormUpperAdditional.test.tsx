import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import FormUpperAdditional from 'components/molecules/forms/FormUpperAdditional';

describe('FormUpperAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <FormUpperAdditional closeModal={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
