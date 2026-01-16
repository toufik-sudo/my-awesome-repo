import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import NavScrollElement from 'components/atoms/ui/NavScrollElement';

describe('NavScrollElement', () => {
  const wrapper: ShallowWrapper<{}> = shallow(<NavScrollElement title={''} />);

  test('renders without crashing', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
