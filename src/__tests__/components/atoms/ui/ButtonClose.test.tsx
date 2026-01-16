import React from 'react';
import { render } from '@testing-library/react';

import ButtonClose from 'components/atoms/ui/ButtonClose';

describe('Button Close', () => {
  test('correctly renders component', () => {
    render(<ButtonClose closeModal={jest.fn()} isAlt />);
  });
});
