import { RadioButtonGroup } from 'components/molecules/forms/fields/RadioButtonGroup';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('RadioButtonGroup', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<RadioButtonGroup id={''} label={''} children={<div />} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
