import TailoredAndResellerSection from 'components/organisms/landing/TailorAndResellerSection';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

describe('TailoredAndResellerSection', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<TailoredAndResellerSection openResellerModal={jest.fn} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
