import React from 'react';
import { render } from '@testing-library/react';

import ProvidersWrapper from 'components/stories/utility/ProvidersWrapper';
import ErrorListTitle from 'components/atoms/launch/ErrorListTitle';
import ProgressBarItem from 'components/atoms/launch/ProgressBarItem';

describe('Progress Bar Item', () => {
  test('correctly renders component', () => {
    render(
      <ProvidersWrapper>
        <ProgressBarItem
          index="0"
          stepKey="0"
          steps={[{ name: 'users', steps: { component: <div /> }, available: true }]}
        />
      </ProvidersWrapper>
    );
  });
});
