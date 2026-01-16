import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ContactFormAdditional from 'components/molecules/forms/ContactFormAdditional';

describe('ContactFormAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ContactFormAdditional />
      </ProvidersWrapper>
    );
  });
});
