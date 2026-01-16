import React from 'react';
import { render } from '@testing-library/react';

import ButtonDelete from 'components/atoms/ui/ButtonDelete';

describe('Button Delete', () => {
  test('correctly renders component', () => {
    render(<ButtonDelete onclick={jest.fn()} />);
  });
});
