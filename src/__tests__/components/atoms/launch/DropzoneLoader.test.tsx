import React from 'react';
import { render } from '@testing-library/react';

import DropzoneLoader from 'components/atoms/launch/DropzoneLoader';

describe('Dropzone Loader', () => {
  test('correctly renders component', () => {
    render(<DropzoneLoader />);
  });
});
