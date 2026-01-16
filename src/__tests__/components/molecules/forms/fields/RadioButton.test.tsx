import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';

import { RadioButton } from 'components/molecules/forms/fields/RadioButton';

describe('RadioButton', () => {
  const wrapper: ShallowWrapper<{}> = shallow(
    <RadioButton
      removeFocus={''}
      label={''}
      id={''}
      field={{ value: '', name: '', onBlur: jest.fn(), onChange: jest.fn() }}
    />
  );

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.children().length).toBe(2);
  });
});
