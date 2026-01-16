import React from 'react';
import { render } from '@testing-library/react';

import ButtonDownload from 'components/atoms/ui/ButtonDownload';
import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';

describe('ButtonDownload', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ButtonDownload type=".csv" />
      </ProvidersWrapper>
    );
  });
});
