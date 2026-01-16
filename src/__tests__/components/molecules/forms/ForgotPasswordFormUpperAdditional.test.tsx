import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ForgotPasswordFormUpperAdditional from 'components/molecules/forms/ForgotPasswordFormUpperAdditional';

describe('ForgotPasswordFormUpperAdditional', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ForgotPasswordFormUpperAdditional closeModal={jest.fn()} />
      </ProvidersWrapper>
    );
  });
});
