import ButtonSwitch from 'components/atoms/ui/ButtonSwitch';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('ButtonSwitch', () => {
  const baseProps = {
    setIsChecked: jest.fn(),
    isChecked: false
  };

  const wrapper = shallow(<ButtonSwitch {...baseProps} />);

  test('renders without crashing and has default class', () => {
    const button = wrapper.find('button');

    expect(button).toHaveLength(1);
    button.simulate('click');

    expect(baseProps.setIsChecked).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.hasClass('Switch')).toBeTruthy();
    expect(wrapper.hasClass('SliderChecked')).toBeFalsy();
  });
});
