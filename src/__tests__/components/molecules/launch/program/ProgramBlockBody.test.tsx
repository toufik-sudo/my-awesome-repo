import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ProgramBlockBody from 'components/molecules/launch/program/ProgramBlockBody';

describe('ProgramBlockBody', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ProgramBlockBody textId="test" titleId="test" />
      </ProvidersWrapper>
    );
  });
});
