import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ButtonDeleteWithMessage from 'components/atoms/ui/DeleteButtonWithMessage';

describe('ButtonDeleteWithMessage', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ButtonDeleteWithMessage onclick={jest.fn()} msgId="form.delete.account" />
      </ProvidersWrapper>
    );
  });
});
